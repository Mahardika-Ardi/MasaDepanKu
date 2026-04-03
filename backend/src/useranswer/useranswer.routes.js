import express from "express";
import UseranswerController from "./useranswer.controller.js";
import verifyMiddleware from "../middlewares/auth.middleware.js";

const route = express.Router();

route.post("/submit", verifyMiddleware, UseranswerController.create);
route.get("/latest", verifyMiddleware, UseranswerController.findLatest);

export default route;
