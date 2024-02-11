import Rol from "../models/rol.model.js";
import { getUserKV, getUserKVR } from "../providers/usuario.provider.js";
import { logger } from "../utils/winston.logger.js";

export const getUsuarioLogueadoService = async (userID) => {
  try {
    const usuario = await getUserKVR("id", userID, Rol, "rol", "IdRol");

    if (usuario === null) {
      return {
        statusCode: 404,
        mensaje: "No se encontro ningun usuario con el id buscado",
      };
    }

    return {
      statusCode: 200,
      data: usuario,
    };
  } catch (error) {
    console.error("No se pudo obtener el usuario buscado:", error.message);
    logger.error("No se pudo obtener el usuario buscado:", error.message);
    return {
      statusCode: 500,
      mensaje: "No se pudieron obtener el usuario buscado",
    };
  }
};
