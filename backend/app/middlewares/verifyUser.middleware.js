import Jwt from "jsonwebtoken";
import dayjs from "dayjs";
import { getUserKV } from "../providers/usuario.provider.js";

const { JWT_SECRET } = process.env;

const secret = JWT_SECRET || "";

export function isLogged(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization)
    return res.status(403).send({ mensaje: `No has enviado un token` });

  let token = authorization.replace(/['"]+/g, "");

  let seg = token.split(".");

  if (seg.length != 3) {
    return res.status(403).send({ mensaje: "Token no valido" });
  } else {
    try {
      const payload = Jwt.decode(token, secret);
      if (payload.exp <= dayjs().unix()) {
        return res.status(403).send({ mensaje: "Token expirado" });
      }
    } catch (error) {
      return res.status(403).send({ mensaje: "Token no valido" });
    }
  }

  Jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        mensaje: "No autorizado!",
      });
    }
    req.userId = decoded.id;
    req.email = decoded.email;
    isVerifiedOrActived(req, res, next);
  });
}

async function isVerifiedOrActived(req, res, next) {
  const user = await getUserKV("id", req.userId);

  if (!user)
    return res.status(404).send({ mensaje: "No se encontró ningún usuario" });

  if (user.emailVerifiedAt === null) {
    return res.status(401).send({
      mensaje:
        "No has verificado tu cuenta. Por favor verifique su cuenta, verifique si tiene el correo electrónico en su casilla",
    });
  }

  if (!user.status) {
    return res.status(401).send({
      mensaje:
        "La cuenta no está activa, comuníquese con el administrador del sistema.",
    });
  }

  next();
}

export async function isAdmin(req, res, next) {
  const user = await getUserKV("id", req.userId);

  const rolUser = await user.getRol();

  const data = rolUser.dataValues;

  if (data.nombre === "admin") {
    next();
    return;
  }

  res.status(403).send({
    mensaje: "¡Requiere rol de administrador!",
  });
  return;
}

export async function isProfesional(req, res, next) {
  const user = await getUserKV("id", req.userId);

  const rolUser = await user.getRol();

  const data = rolUser.dataValues;

  if (data.nombre === "profesional") {
    next();
    return;
  }

  res.status(403).send({
    mensaje: "¡Requiere rol de profesional!",
  });
  return;
}

export async function isCliente(req, res, next) {
  const user = await getUserKV("id", req.userId);

  const rolUser = await user.getRol();

  const data = rolUser.dataValues;

  if (data.nombre === "cliente") {
    next();
    return;
  }

  res.status(403).send({
    mensaje: "¡Requiere rol de cliente!",
  });
  return;
}
