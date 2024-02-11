import { generateToken } from "../helpers/generateTokens.helpers.js";
import { config } from "dotenv";
import { logger } from "../utils/winston.logger.js";
import { sendMail } from "../mails/config.mails.js";
import { account_data } from "../utils/accountData.js";
import { createUser, getUserKV } from "../providers/usuario.provider.js";
import { getRolKV } from "../providers/rol.provider.js";
import { saveModel } from "../providers/shared.provider.js";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import dayjs from "dayjs";
config();

const {
  HOST_FRONT_EMAIL,
  JWT_SECRET,
  SALT_PASSWORD,
  MAX_PASS_FAILURES,
  NODE_ENV,
} = process.env;

const front = HOST_FRONT_EMAIL;
const secret = JWT_SECRET || "";
const salt = SALT_PASSWORD || 10;
const passwordFail = MAX_PASS_FAILURES || 5;
const entorno = NODE_ENV || "dev";

export const registerUserService = async (body) => {
  try {
    let { nombre, apellido, email, password, rol } = body;

    if (email !== null) email = email.toLowerCase();

    if (rol === "" || rol === null || rol === undefined) {
      rol = "cliente";
    } else {
      rol = rol;
    }

    const rolBD = await getRolKV("nombre", rol);

    const usuario = {
      nombre,
      apellido,
      email,
      token: generateToken(60),
      status: false,
      caducidadToken: new Date().setDate(new Date().getDate() + 1),
      password: bcrypt.hashSync(password, Number(salt)),
      avatar:
        "https://res.cloudinary.com/fabrizio-dev/image/upload/v1694810559/santex/usuarios/default-user.webp",
      publicId: null,
      IdRol: rolBD.id,
    };

    const result = await createUser(usuario);
    const { data, inserted } = result;
    const user = data;

    if (!inserted) {
      logger.error(`No se ha podido registrar el usuario.`);
      return {
        statusCode: 400,
        mensaje: "No se ha podido registrar el usuario.",
      };
    }

    logger.info(
      `El usuario con el email: ${user.email} ha creado un nuevo usuario.`
    );

    let bodyMail = {
      name: `${user.nombre} ${user.apellido}`,
      link: `${front}/verificar/${user.token}`,
      year: new Date().getFullYear(),
    };

    sendMail(
      user.email,
      `${user.nombre}, por favor verifique su dirección de correo electrónico`,
      "confirm",
      bodyMail
    );

    return {
      statusCode: 201,
      mensaje:
        "¡El usuario se registró exitosamente! Por favor revise su correo electrónico para verificar su cuenta.",
    };
  } catch (err) {
    console.error("Hubo un error al querer registrar un usuario: ", err);
    logger.error("Hubo un error al querer registrar un usuario: ", err);
    return {
      statusCode: 500,
      mensaje: "Hubo un error al querer registrar un usuario",
    };
  }
};

export const verifyUserService = async (params) => {
  try {
    const { token } = params;

    const user = await getUserKV("token", token);

    if (user === null) {
      return {
        statusCode: 404,
        mensaje: "No se encontró ningún usuario con el token ingresado",
      };
    }

    if (user.emailVerifiedAt != null) {
      return { statusCode: 200, mensaje: "Correo electrónico ya verificado" };
    }

    if (user) {
      try {
        let fechaActual = new Date();

        if (fechaActual <= user.caducidadToken) {
          user.emailVerifiedAt = new Date();
          user.status = true;
          user.token = null;
          user.caducidadToken = null;
          let userUpdate = await saveModel(user);
          if (userUpdate) {
            account_data(
              user,
              `${user.nombre}, tu cuenta ya está verificada, estos son los detalles de tu cuenta`
            );
            return {
              statusCode: 200,
              mensaje: "¡Correo electrónico verificado exitosamente!",
            };
          } else {
            return {
              statusCode: 400,
              mensaje: "No se pudo verificar la cuenta",
            };
          }
        } else {
          let token_user = generateToken(60);
          let link = `${front}/verificar/${token_user}`;
          let bodyMail = {
            name: user.nombre,
            link: link,
            year: new Date().getFullYear(),
          };
          let hoy = new Date();
          user.token = token_user;
          user.caducidadToken = hoy.setDate(hoy.getDate() + 1);
          let userUpdate = await saveModel(user);
          if (userUpdate) {
            sendMail(
              user.email,
              "Volver a verificar la dirección de correo electrónico",
              "reconfirm",
              bodyMail
            );
            return {
              statusCode: 200,
              mensaje:
                "Se le envió un correo electrónico para confirmar su cuenta nuevamente porque su tiempo de gracia expiró.",
            };
          } else {
            return {
              statusCode: 400,
              mensaje: "No se pudo enviar para volver a verificar la cuenta",
            };
          }
        }
      } catch (error) {
        console.error("No se pudo actualizar el usuario:", error);
        return { statusCode: 500, mensaje: "No se pudo actualizar el usuario" };
      }
    }
  } catch (err) {
    console.error(
      "Hubo un error al querer verificar un usuario: ",
      err.message
    );
    logger.error("Hubo un error al querer verificar un usuario: ", err.message);
    return {
      statusCode: 500,
      mensaje: "Hubo un error al querer verificar un usuario",
    };
  }
};

export const loginUserService = async (body) => {
  try {
    let { email, password } = body;

    if (email !== null) email = email.toLowerCase();

    const user = await getUserKV("email", email);

    if (user === null) {
      return { statusCode: 404, mensaje: "Usuario no encontrado." };
    }

    if (user.failedAttempts >= passwordFail) {
      user.status = false;
      await saveModel(user);
      return {
        statusCode: 401,
        mensaje:
          "Usuario bloqueado. Ha excedido el número máximo de intentos fallidos. Por favor contacte con el administrador de la aplicación",
      };
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      user.failedAttempts = (user.failedAttempts || 0) + 1;
      await saveModel(user);
      return {
        statusCode: 400,
        mensaje:
          "Correo electrónico o contraseña inválido. Por favor intente de nuevo",
      };
    }

    user.failedAttempts = 0;
    await saveModel(user);

    if (user.emailVerifiedAt === null) {
      return {
        statusCode: 401,
        mensaje:
          "Correo electrónico no verificado, verifique su correo electrónico para activar la cuenta.",
      };
    }

    if (user.status === false) {
      return {
        statusCode: 401,
        mensaje:
          "La cuenta no está activa, comuníquese con el administrador del sistema.",
      };
    }

    const rol = await getRolKV("id", user.IdRol);

    let accessToken = Jwt.sign(
      {
        id: user.id,
        email: user.email,
        roles: rol.nombre,
      },
      secret,
      {
        expiresIn: "5m",
      }
    );

    let refreshToken = Jwt.sign(
      {
        id: user.id,
        email: user.email,
        roles: rol.nombre,
      },
      secret,
      {
        expiresIn: "1h",
      }
    );

    return {
      statusCode: 200,
      mensaje: "Has iniciado sesion con éxito",
      accessToken,
      refreshToken,
    };
  } catch (err) {
    console.error("Hubo un error al querer iniciar sesion: ", err);
    logger.error("Hubo un error al querer iniciar sesion: ", err.message);
    return {
      statusCode: 500,
      mensaje: "Hubo un error al querer iniciar sesion",
    };
  }
};

export const forgotPasswordUserService = async (body) => {
  try {
    let { email } = body;

    if (email !== null) email = email.toLowerCase();

    const user = await getUserKV("email", email);

    if (user === null) {
      console.log(`No se encontro un usuario con ese email`.bgWhite.red);
      return {
        statusCode: 400,
        mensaje:
          "El email ingresado no es válido o no pertenece a ningún usuario.",
      };
    }

    let token = generateToken(60);
    let link = `${front}/recuperar-clave/${token}`;
    let bodyMail = {
      name: user.nombre,
      username: user.email,
      link: link,
      year: new Date().getFullYear(),
    };
    let horaActual = new Date();

    user.token = token;
    user.caducidadToken = horaActual.setMinutes(horaActual.getMinutes() + 60);
    let userUpdate = await saveModel(user);
    if (userUpdate) {
      sendMail(user.email, "Restablecer la contraseña", "forgot", bodyMail);
      return {
        statusCode: 200,
        mensaje:
          "Se le envió un correo electrónico para cambiar la contraseña de su cuenta...",
      };
    }
  } catch (err) {
    console.error(
      "No se pudieron enviar instrucciones por correo electrónico:",
      err.message
    );
    logger.error(
      "No se pudieron enviar instrucciones por correo electrónico:",
      err.message
    );
    return {
      statusCode: 500,
      mensaje:
        "No se pudieron enviar instrucciones por correo electrónico. Por favor contacte con el administrador del sistema.",
    };
  }
};

export const recoveryPasswordUserService = async (params, body) => {
  try {
    const { token } = params;
    const { password, confirm_password } = body;

    if (password != confirm_password) {
      return { statusCode: 404, mensaje: "Las contraseñas no coinciden 😣" };
    }

    const user = await getUserKV("token", token);

    if (user) {
      try {
        let fechaActual = new Date();

        if (fechaActual <= user.caducidadToken) {
          user.password = bcrypt.hashSync(password, Number(salt));
          user.token = null;
          user.caducidadToken = null;
          let userUpdate = await saveModel(user);
          if (userUpdate) {
            let bodyMail = {
              name: `${user.nombre} ${user.apellido}`,
              username: user.email,
              link: `${front}/iniciar-sesion`,
              year: new Date().getFullYear(),
            };
            if (entorno !== "test") {
              if (userUpdate)
                sendMail(
                  user.email,
                  `${user.nombre}, has cambiado exitosamente la contraseña de tu cuenta`,
                  "password_ok",
                  bodyMail
                );
            }
            logger.info(
              `El usuario (${user.email}) ha cambiado la contraseña de su usuario con éxito`
            );
            return {
              statusCode: 200,
              mensaje: "Contraseña cambiada con éxito",
            };
          } else {
            return {
              statusCode: 400,
              mensaje: "¡No se pudo cambiar la contraseña! 😣",
            };
          }
        } else {
          let token = generateToken(60);
          let link = `${front}/recuperar-clave/${token}`;
          let body = {
            name: user.nombre,
            username: user.email,
            link: link,
            year: new Date().getFullYear(),
          };
          let horaActual = new Date();

          user.token = token;
          user.caducidadToken = horaActual.setMinutes(
            horaActual.getMinutes() + 60
          );
          let userUpdate = await saveModel(user);
          if (userUpdate) {
            sendMail(user.email, "Restablecer la contraseña", "forgot", body);
            return {
              statusCode: 200,
              mensaje:
                "Se le envió un correo electrónico para cambiar su cuenta de contraseña..",
            };
          } else {
            return {
              statusCode: 400,
              mensaje: "No se pudo enviar para volver a olvidar la contraseña.",
            };
          }
        }
      } catch (err) {
        logger.error("No se pudo actualizar el usuario:", err.message);
        return { statusCode: 500, mensaje: "No se pudo actualizar el usuario" };
      }
    } else {
      return {
        statusCode: 400,
        mensaje:
          "El token ingresado no es válido o no pertenece a ningún usuario.",
      };
    }
  } catch (err) {
    logger.error("No se pudo verificar el token:", err.message);
    return { statusCode: 500, mensaje: "No se pudo verificar el token" };
  }
};

export const refreshTokenUserService = async (body) => {
  const { refreshToken } = body;
  const decoded = Jwt.verify(refreshToken, secret);
  const userId = decoded.id;

  if (refreshToken === null) {
    return { statusCode: 400, mensaje: "El token no puede estar en blanco." };
  }

  try {
    const user = await getUserKV("id", userId);

    if (user === null) {
      return { statusCode: 404, mensaje: "Usuario no encontrado" };
    }

    const rol = await getRolKV("id", user.IdRol);

    let accessToken = Jwt.sign(
      {
        id: user.id,
        email: user.email,
        rol: rol.nombre,
      },
      secret,
      { expiresIn: "5m" }
    );

    let refreshToken = Jwt.sign(
      {
        id: user.id,
        email: user.email,
        roles: rol.nombre,
      },
      secret,
      {
        expiresIn: "1h",
      }
    );

    return {
      statusCode: 200,
      mensaje: "Se generó un nuevo token",
      accessToken,
      refreshToken,
    };
  } catch (err) {
    console.error("No se pudo renovar el token:", err.mesagge);
    logger.error("No se pudo renovar el token:", err.mesagge);
    return { statusCode: 500, mensaje: "No se pudo renovar el token" };
  }
};

export const reactiveUserService = async (body) => {
  try {
    let { email } = body;

    if (email !== null) email = email.toLowerCase();

    const user = await getUserKV("email", email);

    if (user.emailVerifiedAt !== null) {
      const dia = dayjs(user.emailVerifiedAt).format("DD/MM/YYYY");
      const hora = dayjs(user.emailVerifiedAt).format("HH:mm");
      return {
        statusCode: 200,
        mensaje: `Tu cuenta fue verificada el dia ${dia} a las ${hora} hs.`,
      };
    }

    let token_user = generateToken(60);
    let link = `${front}/verificar/${token_user}`;
    let fullName = `${user.nombre} ${user.apellido}`;
    let bodyMail = {
      name: fullName,
      link: link,
    };
    let hoy = new Date();
    user.token = token_user;
    user.caducidadToken = hoy.setDate(hoy.getDate() + 1);
    let userUpdate = await saveModel(user);
    if (userUpdate) {
      sendMail(
        user.email,
        "Volver a verificar la dirección de correo electrónico",
        "confirm",
        bodyMail
      );
      logger.info(
        `El usuario (${user.email} pidio re un link para volver a activar su cuenta)`
      );
      return {
        statusCode: 200,
        mensaje:
          "Se le envió un correo electrónico para confirmar su cuenta nuevamente porque su tiempo de gracia expiró.",
      };
    } else {
      return {
        statusCode: 400,
        mensaje:
          "No se pudo enviar para volver a verificar la dirección de correo electrónico",
      };
    }
  } catch (err) {
    console.error("No se pudo verificar el token:", err.message);
    logger.error(`No se pudo volver a activar el usuario: ${err.meesage}`);
    return {
      statusCode: 500,
      mensaje: "No se pudo volver a activar el usuario",
    };
  }
};

export const verifyNewUserService = async (params) => {
  try {
    const { token } = params;

    const user = await getUserKV("token", token);

    if (user.emailVerifiedAt !== null) {
      const dia = dayjs(user.emailVerifiedAt).format("DD/MM/YYYY");
      const hora = dayjs(user.emailVerifiedAt).format("HH:mm");
      return {
        statusCode: 200,
        mensaje: `Tu cuenta fue verificada el dia ${dia} a las ${hora} hs.`,
      };
    }

    if (user) {
      try {
        let fechaActual = new Date();

        if (fechaActual <= user.caducidadToken) {
          user.emailVerifiedAt = new Date();
          let token = generateToken(60);
          let link = `${front}/nueva-clave/${token}`;
          let bodyMail = {
            name: `${user.nombre} ${user.apellido}`,
            link: link,
            year: new Date().getFullYear(),
          };
          let horaActual = new Date();

          user.token = token;
          user.caducidadToken = horaActual.setMinutes(
            horaActual.getMinutes() + 60
          );
          user.status = false;

          let userUpdate = await saveModel(user);
          if (userUpdate) {
            if (user)
              sendMail(
                user.email,
                `${user.nombre}, por favor genera una nueva contraseña para tu cuenta`,
                "new_password",
                bodyMail
              );
            logger.info(
              `Se ha verificado la cuenta de ${user.email}, ahora tiene que crear una nueva clave`
            );
            return {
              statusCode: 200,
              mensaje: "¡Cuenta verificada exitosamente!",
            };
          } else {
            return {
              statusCode: 400,
              mensaje: "No se pudo verificar la cuenta",
            };
          }
        } else {
          let token_user = generateToken(60);
          let link = `${front}/auth/nueva-cuenta/verificar/${token_user}`;
          let body = {
            name: user.nombre,
            link: link,
          };
          let hoy = new Date();
          user.token = token_user;
          user.caducidadToken = hoy.setDate(hoy.getDate() + 1);
          let userUpdate = await saveModel(user);
          if (userUpdate) {
            sendMail(
              user.email,
              "Volver a verificar la dirección de correo electrónico",
              "confirm",
              body
            );
            return {
              statusCode: 200,
              mensaje:
                "Se le envió un correo electrónico para confirmar su cuenta nuevamente porque su tiempo de gracia expiró.",
            };
          } else {
            return {
              statusCode: 400,
              mensaje: "No se pudo enviar para volver a verificar la cuenta",
            };
          }
        }
      } catch (error) {
        console.error("No se pudo actualizar el usuario:", error);
        logger.error("No se pudo actualizar el usuario:", error);
        return { statusCode: 500, mensaje: "No se pudo actualizar el usuario" };
      }
    } else {
      return {
        statusCode: 404,
        mensaje: "No se encontró ningún usuario con el token ingresado",
      };
    }
  } catch (err) {
    console.error("No se pudo verificar el token:", err.message);
    return { statusCode: 500, mensaje: "No se pudo verificar el token" };
  }
};

export const newPasswordUserService = async (params, body) => {
  const { token } = params;
  const { password, confirm_password } = body;

  if (password != confirm_password) {
    return { statusCode: 404, mensaje: "Las contraseñas no coinciden 😣" };
  }

  try {
    const user = await getUserKV("token", token);

    if (user) {
      try {
        let fechaActual = new Date();

        if (fechaActual <= user.caducidadToken) {
          user.password = bcrypt.hashSync(password, Number(salt));
          user.token = null;
          user.caducidadToken = null;
          user.status = true;
          let userUpdate = await saveModel(user);
          if (userUpdate) {
            if (userUpdate)
              account_data(
                user,
                `${user.nombre}, estos son los datos de tu cuenta`
              );
            return {
              statusCode: 200,
              mensaje:
                "Contraseña creada exitosamente para su cuenta. Por favor revisa tu correo electrónico para iniciar sesión",
            };
          } else {
            return {
              statusCode: 400,
              mensaje: "¡No se pudo crear la contraseña! 😣",
            };
          }
        } else {
          let token = generateToken(60);
          let link = `${front}/nueva-clave/${token}`;
          let bodyMail = {
            name: user.nombre,
            username: user.email,
            link: link,
            year: new Date().getFullYear(),
          };
          let horaActual = new Date();

          user.token = token;
          user.caducidadToken = horaActual.setMinutes(
            horaActual.getMinutes() + 60
          );
          let userUpdate = await saveModel(user);
          if (userUpdate) {
            sendMail(
              user.email,
              "Restablecer la contraseña",
              "new_password",
              bodyMail
            );
            return {
              statusCode: 200,
              mensaje:
                "Se le envió un correo electrónico para crear su cuenta de contraseña..",
            };
          } else {
            return {
              statusCode: 400,
              mensaje: "No se pudo enviar para volver a crear la contraseña",
            };
          }
        }
      } catch (err) {
        console.error("No se pudo actualizar el usuario:", err.message);
        return { statusCode: 500, mensaje: "No se pudo actualizar el usuario" };
      }
    } else {
      return {
        statusCode: 400,
        mensaje:
          "El token ingresado no es válido o no pertenece a ningún usuario.",
      };
    }
  } catch (err) {
    console.error("No se pudo verificar el token:", err.message);
    return { statusCode: 500, mensaje: "No se pudo verificar el token" };
  }
};
