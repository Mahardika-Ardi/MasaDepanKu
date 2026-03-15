import { CreateApp } from "./app.js";
import { connectionDatabase } from "./config/prisma.config.js";

async function StartServer() {
  try {
    await connectionDatabase();
    const app = CreateApp();

    app.listen(process.env.PORT || 3000, () => {
      console.log(
        `Server Running at http://localhost:${process.env.PORT || 3000}`,
      );
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

StartServer();
