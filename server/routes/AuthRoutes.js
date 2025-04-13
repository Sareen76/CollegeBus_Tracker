import { Router } from "express";
<<<<<<< HEAD
import { signup, signin } from "../controller/controller.js";

=======
import { signup, signin, getRouteById, getStopsByRoute } from "../controller/controller.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { restrict } from "../middlewares/AuthMiddleware.js";
>>>>>>> 0dec10729552d52144b24b34afaf256d5669fbc1
const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post("/signin", signin);
<<<<<<< HEAD
=======
authRoutes.get("/getRouteById/:routeId", getRouteById);
authRoutes.get("/getStopsByRoute/:routeId", getStopsByRoute);
>>>>>>> 0dec10729552d52144b24b34afaf256d5669fbc1

export default authRoutes;