import { Router } from "express";
import { index } from "../controllers/home.controller.js";
import authRoutes from "./auth.routes.js";
import userRoutes from "./usuario.routes.js";

const router = Router();
router.get("/", index);
router.use("/auth", authRoutes);
router.use("/api", userRoutes);

export default router;
