import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

const Tarifa = sequelize.define(
  "tarifa",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    precio: {
      type: DataTypes.DECIMAL(16, 2),
      allowNull: false,
    },
    duracion: {
      type: DataTypes.INTEGER(),
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
    tableName: "tarifas",
  }
);

Tarifa.prototype.toJSON = function () {
  var values = Object.assign({}, this.get());

  delete values.createdAt;
  delete values.updatedAt;
  delete values.deletedAt;

  return values;
};

export default Tarifa;
