import { DataTypes } from "sequelize";
import sequelize from "../config/database.config.js";

const Rol = sequelize.define(
  "rol",
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
  },
  {
    paranoid: false,
    timestamps: true,
    tableName: "roles",
  }
);

Rol.prototype.toJSON = function () {
  var values = Object.assign({}, this.get());

  delete values.createdAt;
  delete values.updatedAt;

  return values;
};

export default Rol;
