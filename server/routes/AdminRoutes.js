import { Router } from "express";
import { addRoute, uploadStops } from "../controller/adminController.js";

export const AdminRouter = Router();

AdminRouter.post("/addRoute",addRoute);
AdminRouter.post("/uploadStops",uploadStops);

