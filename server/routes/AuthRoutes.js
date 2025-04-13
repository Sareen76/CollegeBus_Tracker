import { Router } from "express";
import { signup, signin, getRouteById, getStopsByRoute, getAllRoutes } from "../controller/controller.js";
import { signup, signin } from "../controller/controller.js";

import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { restrict } from "../middlewares/AuthMiddleware.js";
const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post("/signin", signin);
authRoutes.get("/getAllRoutes", getAllRoutes);
authRoutes.get("/getRouteById/:routeId", getRouteById);
authRoutes.get("/getStopsByRoute/:routeId", getStopsByRoute);

export default authRoutes;