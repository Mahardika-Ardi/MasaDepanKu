import express from "express";
import cors from "cors";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./config/swagger.config.js";
import errorHandler from "./middlewares/error_handler.middleware.js";
import RoutesLoader from "./bootstrap/route.bootstrap.js";

export function CreateApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      methods: ["POST", "PUT", "DELETE", "GET"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );
  app.use(express.json());
  app.use("/api-documentation", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

  app.get("/", (req, res) => res.send("Hello World!"));
  RoutesLoader(app);

  app.use(errorHandler);

  return app;
}
