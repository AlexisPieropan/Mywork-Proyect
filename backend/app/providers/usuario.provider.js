import Usuario from "../models/usuario.model.js";

export const getUserKV = async (key, value) => {
  const user = await Usuario.findOne({
    where: { [key]: value },
  });

  return user;
};

export const getUserKVR = async (key, value, model, as, exclude) => {
  const user = await Usuario.findOne({
    where: { [key]: value },
    attributes: {
      exclude: exclude,
    },
    include: [
      {
        model: model,
        as: as,
      },
    ],
  });

  return user;
};

export const createUser = async (usuario) => {
  const user = await Usuario.create(usuario);

  if (user == null) {
    return {
      inserted: false,
      data: null,
    };
  }

  return {
    inserted: true,
    data: user,
  };
};
