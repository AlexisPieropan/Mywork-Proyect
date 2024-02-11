import { getRolKV } from "../providers/rol.provider.js";
import { getUserKV } from "../providers/usuario.provider.js";
import blacklist from "../utils/blacklist.email.js";
import { logger } from "../utils/winston.logger.js";
import EmailValidation from "emailvalid";

export function checkValidEmail(req, res, next) {
  const { email } = req.body;

  const ev = new EmailValidation({
    allowFreemail: true,
    allowDisposable: false,
    blacklist,
  });

  const result = ev.check(email);

  if (!result.valid) {
    logger.error(
      "El email con el que se quiere registrar esta en una lista negra."
    );
    return res.status(400).json({
      mensaje: "No es un email válido o no está permitido",
    });
  }

  next();
}

export async function checkDuplicateEmail(req, res, next) {
  const { email } = req.body;

  const user = await getUserKV("email", email);

  if (user) {
    res.status(400).send({
      mensaje: "Upps... ¡El correo electrónico ya está en uso!",
    });
    logger.error(`Upps... El correo electrónico (${email}) ya está en uso`);
    return;
  }

  next();
}

export async function checkRolesExisted(req, res, next) {
  try {
    let { rol } = req.body;
    if (rol === undefined) {
      next();
      return;
    } else {
      rol = rol.toLowerCase();
    }

    const rolEsperado = await getRolKV("nombre", rol);

    if (rolEsperado == "No existe el rol buscado") {
      return res.status(400).send({
        mensaje: `Upps...! El rol buscado ${rol} no existe`,
      });
    }
    next();
  } catch (error) {
    console.log(`Entro al catch del rol: ${error.message}`);
    logger.error("No se pudieron verificar los roles: ", error);
    res.status(500).send({
      mensaje: "No se pudieron verificar los roles",
    });
  }
}
