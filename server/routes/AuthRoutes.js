import { Router } from "express";
import { signup, signin } from "../controller/controller.js";

const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post("/signin", signin);

export default authRoutes;