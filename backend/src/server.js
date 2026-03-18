import chalk from "chalk";
import { CreateApp } from "./app.js";
import { connectionDatabase } from "./config/prisma.config.js";

async function StartServer() {
  try {
    await connectionDatabase();
    const app = CreateApp();

    app.listen(process.env.PORT || 3000, () => {
      console.log(
        "\nServer Running at",
        chalk.blueBright(`http://localhost:${process.env.PORT || 3000}/`),
      );
      console.log(
        "Backend Documentation",
        chalk.blueBright(
          `http://localhost:${process.env.PORT || 3000}/api-documentation`,
        ),
      );
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

StartServer();
