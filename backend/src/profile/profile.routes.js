import express from "express";
  import ProfileController from "./profile.controller.js";
  
  const route = express.Router();
  
  router.post("", ProfileController.create);
  router.get("", ProfileController.findall);
  router.get("", ProfileController.findone);
  router.patch("", ProfileController.update);
  router.delete("", ProfileController.delete);
  
  export default route;
  
