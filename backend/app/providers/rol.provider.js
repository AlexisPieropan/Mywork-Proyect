import Rol from "../models/rol.model.js";

export const getRolKV = async (key, value) => {
  const rol = await Rol.findOne({ where: { [key]: value } });

  return rol ? rol : "No existe el rol buscado";
};

export const createRole = async (role) => {
  const rol = await Rol.create(role);

  if (rol == null) {
    return {
      inserted: false,
      data: null,
    };
  }

  return {
    inserted: true,
    data: rol,
  };
};
