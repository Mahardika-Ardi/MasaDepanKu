import express from "express";
  import AnalysisController from "./analysis.controller.js";
  
  const route = express.Router();
  
  route.post("", AnalysisController.create);
  route.get("", AnalysisController.findall);
  route.get("", AnalysisController.findone);
  route.patch("", AnalysisController.update);
  route.delete("", AnalysisController.delete);
  
  export default route;
  
