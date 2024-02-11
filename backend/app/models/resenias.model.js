import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

const Resenias = sequelize.define(
  "resenias",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    calificacion: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      defaultValue: 0,
    },
    comentario: {
      type: DataTypes.TEXT(),
      allowNull: false,
      defaultValue: 0,
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
    tableName: "resenias",
  }
);

Resenias.prototype.toJSON = function () {
  var values = Object.assign({}, this.get());

  delete values.createdAt;
  delete values.updatedAt;
  delete values.deletedAt;

  return values;
};

export default Resenias;
