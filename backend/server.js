import sequelize from "./app/config/database.config.js";
import app from "./app/app.js";
import colors from "colors";
import { logger } from "./app/utils/winston.logger.js";
import Rol from "./app/models/rol.model.js";
import Usuario from "./app/models/usuario.model.js";
import bcrypt from "bcryptjs";
import { createRole, getRolKV } from "./app/providers/rol.provider.js";
import { createUser, getUserKV } from "./app/providers/usuario.provider.js";

const createRoleIfNotExists = async (roleName) => {
  const role = await getRolKV("nombre", roleName);

  if (role === "No existe el rol buscado") {
    // El rol no existe, se crea automáticamente
    const { data, inserted } = await createRole({ nombre: roleName });
    if (inserted) {
      console.log(`El rol '${data.nombre}' se ha creado correctamente.`);
      logger.info(`El rol '${data.nombre}' se ha creado correctamente`);
    } else {
      console.log(`No se pudo crear el rol ${roleName}`);
      logger.info(`No se pudo crear el rol ${roleName}`);
    }
  } else {
    console.log(`El rol '${roleName}' ya existe.`);
    logger.info(`El rol '${roleName}' ya existe.`);
  }
};

let userCreated = false;
const syncAndCreateUser = async () => {
  try {
    const userRegister = await getUserKV("email", "admin@myworks.com");

    if (userRegister) {
      userCreated = true;
    }

    // Verifica si el usuario ya fue creado previamente
    if (!userCreated) {
      const rol = await getRolKV("nombre", "admin");

      const objUser = {
        nombre: "Admin",
        apellido: "MyWorks",
        email: "admin@myworks.com",
        password: bcrypt.hashSync("Test1234#", 10),
        avatar:
          "https://res.cloudinary.com/fabrizio-dev/image/upload/v1694810559/santex/usuarios/default-user.webp",
        emailVerifiedAt: new Date(),
        status: 1,
        ciudad: "Córdoba",
        telefono: "540351152345678",
        IdRol: rol.id,
      };

      const result = await createUser(objUser);
      const { data, inserted } = result;
      const user = data;

      if (inserted) {
        logger.info(
          `Se genero el usuario admin por defecto en la bd. Su id es: ${user.id}`
        );
        console.log(
          `Se genero el usuario admin por defecto en la bd. \r\nSu id es: ${user.id}`
        );
        userCreated = true;
      } else {
        logger.info(
          `No se pudo generar el usuario admin por defecto en la bd.`
        );
        console.log(
          `No se pudo generar el usuario admin por defecto en la bd.`
        );
        userCreated = false;
      }
    }
  } catch (error) {
    console.error("Error al sincronizar y crear el usuario:", error);
  }
};

sequelize
  .sync({ force: false })
  .then(() => {
    console.log(
      `La conexión a la base de datos se ha establecido con éxito`.bgGreen.white
    );
    logger.info("La conexión a la base de datos se ha establecido con éxito");

    createRoleIfNotExists("admin");
    createRoleIfNotExists("cliente");
    createRoleIfNotExists("profesional");

    syncAndCreateUser();

    app.listen(app.get("port"), () => {
      console.log(
        `El servidor se ejecuta en el puerto: ${app.get(
          "port"
        )} sin problemas. En el entorno de: ${app.get("env")}`.green
      );
      logger.debug(
        `El servidor se ejecuta en el puerto: ${app.get(
          "port"
        )} sin problemas. En el entorno de: ${app.get("env")}`
      );
    });
  })
  .catch((error) => {
    console.log(error);
    logger.error(error);
  });
