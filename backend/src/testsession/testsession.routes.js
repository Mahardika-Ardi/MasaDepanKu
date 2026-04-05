import express from "express";
import TestsessionController from "./testsession.controller.js";
import verifyMiddleware from "../middlewares/auth.middleware.js";
import ownerShipCheck from "../middlewares/ownership_check.middleware.js";

const route = express.Router();

route.get(
  "/findTestSession",
  verifyMiddleware,
  ownerShipCheck,
  TestsessionController.find,
);
route.patch(
  "/finishTest",
  verifyMiddleware,
  ownerShipCheck,
  TestsessionController.finish,
);
route.patch(
  "/cancelTest",
  verifyMiddleware,
  ownerShipCheck,
  TestsessionController.cancel,
);

export default route;
