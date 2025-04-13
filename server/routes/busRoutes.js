import express from "express";
import { predictETA } from "../controller/busController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/predict-eta",verifyToken, predictETA);

export default router;
