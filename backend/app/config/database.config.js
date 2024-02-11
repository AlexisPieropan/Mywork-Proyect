import Sequelize from "sequelize";
import { config } from "dotenv";
config();

const {
  DB_URI,
  DB_USER,
  DB_PASS,
  DB_NAME,
  DB_HOST,
  DB_PORT,
  DB_DIALECT,
  NODE_ENV,
  SSL,
} = process.env;

const uri = DB_URI || "";
const username = DB_USER || "";
const password = DB_PASS || "";
const database = DB_NAME || "";
const host = DB_HOST || "";
const port = DB_PORT || 0;
const dialect = DB_DIALECT || "";
const entorno = NODE_ENV || "dev";
const ssl = SSL || true;

let configDB = {} || "";

switch (entorno) {
  case "prod":
    configDB = uri;
    break;
  case "dev":
    configDB = {
      database: database,
      username: username,
      password: password,
      host: host,
      dialect: dialect,
      port: port,
      ssl: ssl,
      logging: false,
    };
    break;
  case "test":
    configDB = {
      dialect: "sqlite",
      storage: "./dbtest.sqlite",
      logging: false,
    };
    break;
}

const sequelize = new Sequelize(configDB);

export default sequelize;
