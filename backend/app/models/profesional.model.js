import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

const Profesional = sequelize.define(
  "profesional",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    habilidades: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
    experiencias: {
      type: DataTypes.TEXT(),
      allowNull: true,
      defaultValue: null,
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
    tableName: "profesionales",
  }
);

Profesional.prototype.toJSON = function () {
  var values = Object.assign({}, this.get());

  delete values.createdAt;
  delete values.updatedAt;
  delete values.deletedAt;

  return values;
};

export default Profesional;
