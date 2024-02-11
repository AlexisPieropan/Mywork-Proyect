import nodemailer from "nodemailer";
// import smtpTransport from "nodemailer-smtp-transport";
import fs from "fs";
import Handlebars from "handlebars";
import ejs from "ejs";
import { logger } from "../utils/winston.logger.js";
import { config } from "dotenv";
config();

const {
  HOST_MAIL,
  PORT_MAIL,
  NAME_MAIL,
  USER_MAIL,
  PASS_MAIL,
  NODE_ENV,
  SECURE_CON_MAIL,
} = process.env;

const host = HOST_MAIL;
const port = PORT_MAIL;
const name = NAME_MAIL;
const user = USER_MAIL;
const pass = PASS_MAIL;
const secure_con = SECURE_CON_MAIL;
const entorno = NODE_ENV;

export const sendMail = async function (
  email = "",
  subject = "",
  plantilla = "",
  body = {}
) {
  let readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
      if (err) {
        throw err;
        callback(err);
      } else {
        callback(null, html);
      }
    });
  };
  let transporter = {} || "";
  if (entorno === "dev") {
    transporter = nodemailer.createTransport({
      host: host,
      port: port,
      auth: {
        user: user,
        pass: pass,
      },
    });
  }

  if (entorno === "prod") {
    transporter = nodemailer.createTransport(
      smtpTransport({
        host: host,
        port: port,
        secureConnection: secure_con,
        auth: {
          user: user,
          pass: pass,
        },
        tls: {
          ciphers: "SSLv3",
        },
      })
    );
  }

  const rutaBase = process.cwd();
  console.log(rutaBase);

  readHTMLFile(
    process.cwd() + `/app/mails/pages/${plantilla}.html`,
    (err, html) => {
      let rest_html = ejs.render(html, body);

      let template = Handlebars.compile(rest_html);
      let htmlToSend = template({ op: true });

      let mailOptions = {
        from: `${name} <${user}>`,
        to: email, //email para quien va enviado
        subject: subject,
        html: htmlToSend,
      };
      // res.status(200).send({ data: true });
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(`${error}`.bgRed.white);
          logger.error(`${error}`);
          return;
        }
        console.log(`Email enviado: ${info.response}`.bgGreen.white);
        logger.info(`Email enviado: ${info.response}`);
      });
    }
  );
};
