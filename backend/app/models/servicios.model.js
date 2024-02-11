import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

const Servicios = sequelize.define(
  "servicio",
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
    descripcion: {
      type: DataTypes.TEXT(),
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    paranoid: true,
    timestamps: true,
    tableName: "servicios",
  }
);

Servicios.prototype.toJSON = function () {
  var values = Object.assign({}, this.get());

  delete values.createdAt;
  delete values.updatedAt;
  delete values.deletedAt;

  return values;
};

export default Servicios;
