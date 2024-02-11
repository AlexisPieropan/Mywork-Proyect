import { cleanEnv, str, bool, port, host, num } from "envalid";
import { config } from "dotenv";
config();

const validate = cleanEnv(process.env, {
  APP: str(),
  API_PORT: port(),
  API_HOST: host(),
  NODE_ENV: str({ choices: ["dev", "prod", "test"] }),
  DB_URI: str(),
  DB_HOST: host(),
  DB_PORT: port(),
  DB_USER: str(),
  DB_PASS: str(),
  DB_NAME: str(),
  DB_DIALECT: str(),
  SSL: bool(),
  LOG_LEVEL: str({ choices: ["debug", "info", "error"] }),
  HOST_FRONT: str(),
  HOST_FRONT_EMAIL: str(),
  JWT_SECRET: str(),
  API_PROTOCOL: str(),
  NAME_MAIL: str(),
  USER_MAIL: str(), //email()
  PASS_MAIL: str(),
  SECURE_CON_MAIL: bool(),
  HOST_MAIL: str(),
  PORT_MAIL: port(),
  TZ: str(),
  PAGE_SIZE: num(),
  MAX_PASS_FAILURES: num(),
  SALT_PASSWORD: num(),
});

export default validate;
