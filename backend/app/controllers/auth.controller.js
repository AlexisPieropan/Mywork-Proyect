import {
  forgotPasswordUserService,
  loginUserService,
  newPasswordUserService,
  reactiveUserService,
  recoveryPasswordUserService,
  refreshTokenUserService,
  registerUserService,
  verifyNewUserService,
  verifyUserService,
} from "../services/auth.services.js";

export const registerUser = async (req, res) => {
  const { statusCode, ...responseData } = await registerUserService(req.body);
  res.status(statusCode).send(responseData);
};

export async function verifyUser(req, res) {
  const { statusCode, ...responseData } = await verifyUserService(req.params);
  res.status(statusCode).send(responseData);
}

export async function loginUser(req, res) {
  const { statusCode, ...responseData } = await loginUserService(req.body);
  res.status(statusCode).send(responseData);
}

export async function forgotPasswordUser(req, res) {
  const { statusCode, ...responseData } = await forgotPasswordUserService(
    req.body
  );
  res.status(statusCode).send(responseData);
}

export async function recoveryPasswordUser(req, res) {
  const { statusCode, ...responseData } = await recoveryPasswordUserService(
    req.params,
    req.body
  );
  res.status(statusCode).send(responseData);
}

export async function refreshTokenUser(req, res) {
  const { statusCode, ...responseData } = await refreshTokenUserService(
    req.body
  );
  res.status(statusCode).json(responseData);
}

export async function reactiveUser(req, res) {
  const { statusCode, ...responseData } = await reactiveUserService(req.body);
  res.status(statusCode).json(responseData);
}

export async function verifyNewUser(req, res) {
  const { statusCode, ...responseData } = await verifyNewUserService(
    req.params
  );
  res.status(statusCode).json(responseData);
}

export async function newPasswordUser(req, res) {
  const { statusCode, ...responseData } = await newPasswordUserService(
    req.params,
    req.body
  );
  res.status(statusCode).json(responseData);
}
