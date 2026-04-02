import express from "express";
import UseranswerController from "./useranswer.controller.js";

const route = express.Router();

route.post("", UseranswerController.create);
route.get("", UseranswerController.findall);
route.get("", UseranswerController.findone);
route.patch("", UseranswerController.update);
route.delete("", UseranswerController.delete);

export default route;
