import express from "express";
import UseranswerController from "./useranswer.controller.js";
import verifyMiddleware from "../middlewares/auth.middleware.js";
import ownerShipCheck from "../middlewares/ownership_check.middleware.js";

const route = express.Router();

route.post(
  "/createAnswer",
  verifyMiddleware,
  ownerShipCheck,
  UseranswerController.create,
);
route.get(
  "/createAnswer",
  verifyMiddleware,
  ownerShipCheck,
  UseranswerController.findall,
);

export default route;
