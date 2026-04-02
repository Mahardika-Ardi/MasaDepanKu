import express from "express";
import cors from "cors";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./config/swagger.config.js";
import errorHandler from "./middlewares/error_handler.middleware.js";
import RoutesLoader from "./bootstrap/route.bootstrap.js";

export function CreateApp() {
  const app = express();

  const allowedOrigins = [process.env.FRONTEND_URL].filter(Boolean);

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) {
          return callback(null, true);
        }

        const isAllowedOrigin = allowedOrigins.includes(origin);
        const isLocalhostDev = /^http:\/\/localhost:\d+$/.test(origin);

        if (isAllowedOrigin || isLocalhostDev) {
          return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
      },
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
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
