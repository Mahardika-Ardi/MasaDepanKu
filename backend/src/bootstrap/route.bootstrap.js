import fs from "fs";
import path from "path";
import { cwd } from "process";
import chalk from "chalk";

export default function RoutesLoader(app) {
  const routesPath = path.join(cwd(), "./src/routes");

  fs.readdirSync(routesPath).forEach(async (file) => {
    if (file.endsWith(".routes.js")) {
      const route = await import(`../routes/${file}`);

      app.use("/api", route.default);
      console.log(
        chalk.hex("#EBB400")(`Loaded Routes API: `),
        chalk.hex("#51ED00")(`[ ${file} ]`),
      );
    }
  });
}
