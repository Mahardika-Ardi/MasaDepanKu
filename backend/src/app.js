import express from "express";
import cors from "cors";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./config/swagger.config.js";
import errorHandler from "./middlewares/error-handler.middleware.js";
import RoutesLoader from "./bootstrap/route.bootstrap.js";

export function CreateApp() {
  const app = express();

  // <------ Bellum
  app.use(cors);
  app.use(express.json());
  app.use("/api-documentation", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

  app.get("/", (req, res) => res.send("Hello World!"));
  RoutesLoader(app);

  app.use(errorHandler);

  return app;
}
