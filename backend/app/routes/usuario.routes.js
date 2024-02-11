import { Router } from "express";
import { getUsuarioLogueado } from "../controllers/usuario.controller.js";
import { isAdmin, isLogged } from "../middlewares/verifyUser.middleware.js";

const router = Router();

router.get("/me", [isLogged], getUsuarioLogueado);

export default router;
