import Contratos from "./contratos.model.js";
import Profesional from "./profesional.model.js";
import Resenias from "./resenias.model.js";
import Rol from "./rol.model.js";
import Servicios from "./servicios.model.js";
import Tarifa from "./tarifa.model.js";
import Usuario from "./usuario.model.js";

// Relation 1:N Rol - Usuario
Rol.hasMany(Usuario, {
  foreignKey: "IdRol",
  sourceKey: "id",
});

Usuario.belongsTo(Rol, { foreignKey: "IdRol", targetId: "id", as: "rol" });

// Relacion 1:N Usuario - Profesionales
Usuario.hasMany(Profesional, {
  foreignKey: "IdUsuario",
  sourceKey: "id",
});

Profesional.belongsTo(Usuario, {
  foreignKey: "IdUsuario",
  targetId: "id",
  as: "Usuarios",
});

// Relacion 1:N Profesional - Servicios
Profesional.hasMany(Servicios, {
  foreignKey: "IdProfesional",
  sourceKey: "id",
});

Servicios.belongsTo(Profesional, {
  foreignKey: "IdProfesional",
  targetId: "id",
  as: "Profesionales",
});

// Relacion 1:N Tarifa - Servicios
Servicios.hasMany(Tarifa, {
  foreignKey: "IdServicio",
  sourceKey: "id",
});

Tarifa.belongsTo(Servicios, {
  foreignKey: "IdServicio",
  targetId: "id",
  as: "Servicios",
});

// Relacion 1:N Servicios - Contratos
Servicios.hasMany(Contratos, {
  foreignKey: "IdServicio",
  sourceKey: "id",
});

Contratos.belongsTo(Servicios, {
  foreignKey: "IdServicio",
  targetId: "id",
  as: "Servicios",
});

// Relacion 1:N Usuario - Contratos
Usuario.hasMany(Contratos, {
  foreignKey: "IdUsuario",
  sourceKey: "id",
});

Contratos.belongsTo(Usuario, {
  foreignKey: "IdUsuario",
  targetId: "id",
  as: "Usuario",
});

// Relacion 1:N Profesional - Reseñas
Profesional.hasMany(Resenias, {
  foreignKey: "IdProfesional",
  sourceKey: "id",
});

Resenias.belongsTo(Profesional, {
  foreignKey: "IdProfesional",
  targetId: "id",
  as: "Profesional",
});

// Relacion 1:N Usuario - Reseñas
Usuario.hasMany(Resenias, {
  foreignKey: "IdUsuario",
  sourceKey: "id",
});

Resenias.belongsTo(Usuario, {
  foreignKey: "IdUsuario",
  targetId: "id",
  as: "Usuario",
});
