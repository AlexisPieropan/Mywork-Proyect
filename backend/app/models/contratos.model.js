import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

const Contratos = sequelize.define(
  "contratos",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    tableName: "contratos",
  }
);

Contratos.prototype.toJSON = function () {
  var values = Object.assign({}, this.get());

  delete values.createdAt;
  delete values.updatedAt;
  delete values.deletedAt;

  return values;
};

export default Contratos;
