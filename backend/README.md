# MyWork - Backend

Bakend hecho con NodeJS con el framework de express y el orm de sequelize consumiendo una base de datos en mysql para el proyecto de MyWorks

## Tecnologias usadas

**Server:** Node, Express, Sequelize, MySQL

## Variables de entornos

Para ejecutar este proyecto, deberá agregar las siguientes variables de entorno a su archivo `.env` en la raiz del proyecto en la carpeta backend. O copiar el archivo `.env.example` y renombrarlo como `.env`

`DB_URI`

`DB_USER`

`DB_PASS`

`DB_NAME`

`DB_HOST`

`DB_PORT`

`DB_DIALECT`

`SSL`

`LOG_LEVEL`

`NODE_ENV`

`JWT_SECRET`

`APP`

`API_PORT`

`API_HOST`

`API_PROTOCOL`

`HOST_FRONT`

`HOST_FRONT_EMAIL`

`HOST_MAIL`

`PORT_MAIL`

`NAME_MAIL`

`USER_MAIL`

`PASS_MAIL`

`SECURE_CON_MAIL`

`TZ`

`PAGE_SIZE`

`MAX_PASS_FAILURES`

`SALT_PASSWORD`

### Pre-requisitos 📋

Para poder ejecutar bien este proyecto se necesita tener instalado la version de node LTS

```
Node v20.10.0. Se descarga en: https://nodejs.org/en
```

## Ejecutar localmente el servidor

Clonar el proyecto

```bash
  git clone https://github.com/AlexisPieropan/Mywork-Proyect.git
```

Ir al directorio del proyecto general

```bash
  cd MyWork-Proyect
```

Dentro directorio del proyecto general ir a la carpeta backend

```bash
  cd backend
```

Instalar dependencias

```bash
  npm install
```

Copiar el archivo `.env.example` en `.env` para que el proyecto funcione

```bash
  cp .env.example .env
```

**_Tanto en linux como en Windows los comandos son iguales_**

Luego rellenar todos los campos del `.env` para que el proyecto funcione.

Iniciar el servidor

```bash
  npm run dev
```

Ir al navegador/postman/frontend y pegar la siguiente ruta

```bash
  http://localhost:8080/
```

**_El puerto se setea en el archivo `.env` si no por defecto es el 8080_**

## Mapa de la aplicación

Así se encuentra organizado el proyecto en cuestión.

```
📁 backend/
├───📁 app/
│   ├───📁 config/
│   │   └───📄 database.config.js
│   ├───📁 controllers/
│   │   ├───📄 auth.controller.js
│   │   ├───📄 home.controller.js
│   │   └───📄 usuario.controller.js
│   ├───📁 helpers/
│   │   ├───📄 generatePasswordFake.helpers.js
│   │   ├───📄 generateTokens.helpers.js
│   │   └───📄 validate.helpers.js
│   ├───📁 mails/
│   |   ├───📁 pages/
│   │   │  ├───📄 account_data.html
│   │   │  ├───📄 confirm_na.html
│   │   │  ├───📄 confirm.html
│   │   │  ├───📄 forgot.html
│   │   │  ├───📄 new_password.html
│   │   |  └───📄 password_ok.html
│   │   └───📄 config.mails.js
│   ├───📁 middlewares/
│   │   ├───📄 register.middleware.js
│   │   └───📄 verifyUser.middleware.js
│   ├───📁 models/
│   │   ├───📄 contratos.model.js
│   │   ├───📄 profesional.model.js
│   │   ├───📄 relaciones.model.js
│   │   ├───📄 resenias.model.js
│   │   ├───📄 rol.model.js
│   │   ├───📄 servicios.model.js
│   │   ├───📄 tarifa.model.js
│   │   └───📄 usuario.model.js
│   ├───📁 providers/
│   │   ├───📄 rol.provider.js
│   │   ├───📄 shared.provider.js
│   │   └───📄 usuario.provider.js
│   ├───📁 routes/
│   │   ├───📄 auth.routes.js
│   │   ├───📄 index.routes.js
│   │   └───📄 usuario.routes.js
│   ├───📁 services/
│   │   ├───📄 auth.services.js
│   │   └───📄 usuario.services.js
│   ├───📁 utils/
│   │   ├───📄 accountData.js
│   │   ├───📄 blacklist.email.js
│   │   ├───📄 createSlug.js
│   │   ├───📄 formatData.js
│   │   ├───📄 validateEnv.js
│   │   └───📄 winston.logger.js
│   ├───📁 validations/
│   │    └───📄 auth.validations.js
│   └───📄 app.js
├───📄 .env.example
├───📄 .gitignore
├───📄 package.json
├───📄 README.md
└───📄 server.js
```

## Quien desarrollo esta api

- [@FabrizioFerroni](https://www.github.com/FabrizioFerroni)
