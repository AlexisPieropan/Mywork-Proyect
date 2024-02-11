import { getUsuarioLogueadoService } from "../services/usuario.services.js";

export const getUsuarioLogueado = async (req, res) => {
  const { statusCode, ...responseData } = await getUsuarioLogueadoService(
    req.userId
  );
  res.status(statusCode).json(responseData);
};
