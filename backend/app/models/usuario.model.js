import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

const Usuario = sequelize.define(
  "usuario",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
    },
    publicId: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
    },
    token: {
      type: DataTypes.STRING(60),
      allowNull: true,
      defaultValue: null,
    },
    caducidadToken: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    emailVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    ciudad: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
    telefono: {
      type: DataTypes.STRING(21),
      allowNull: true,
      defaultValue: null,
    },
    failedAttempts: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    paranoid: false,
    timestamps: true,
  }
);

Usuario.prototype.toJSON = function () {
  var values = Object.assign({}, this.get());

  delete values.password;
  delete values.failedAttempts;
  delete values.token;
  delete values.publicId;
  delete values.createdAt;
  delete values.status;
  delete values.caducidadToken;
  delete values.emailVerifiedAt;
  delete values.updatedAt;
  return values;
};

export default Usuario;
