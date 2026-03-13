import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./config/swagger.config.js";
import errorHandler from "./middlewares/error-handler.middleware.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(errorHandler);
app.use("/api-documentation", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.get("/", (req, res) => res.send("Hello World!"));
app.use("/users", userRoutes);
app.use("/auth", authRoutes);

app.listen(port, () => console.log(`App listening on port ${port}!`));
