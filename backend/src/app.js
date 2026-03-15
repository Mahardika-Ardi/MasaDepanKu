import express from "express";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./config/swagger.config.js";
import errorHandler from "./middlewares/error-handler.middleware.js";
import RoutesLoader from "./bootstrap/route.bootstrap.js";

export function CreateApp() {
  const app = express();

  app.use(express.json());
  app.use("/api-documentation", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

  app.get("/", (req, res) => res.send("Hello World!"));
  app.use(errorHandler);

  RoutesLoader(app);

  return app;
}
