import { config } from "dotenv";
import { sendMail } from "../mails/config.mails.js";
config();

const { HOST_FRONT_EMAIL } = process.env;

const front = HOST_FRONT_EMAIL;

export const account_data = (user, subject) => {
  let link = `${front}/iniciarsesion`;
  let bodyMail = {
    name: user.nombre,
    lastname: user.apellido,
    email: user.email,
    link: link,
    year: new Date().getFullYear(),
  };

  sendMail(user.email, subject, "account_data", bodyMail);
};
