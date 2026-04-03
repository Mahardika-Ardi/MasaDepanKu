import express from "express";
import AnalysisController from "./analysis.controller.js";
import verifyMiddleware from "../middlewares/auth.middleware.js";

const route = express.Router();

route.post("/run", verifyMiddleware, AnalysisController.create);
route.get("/latest", verifyMiddleware, AnalysisController.findLatest);

export default route;
