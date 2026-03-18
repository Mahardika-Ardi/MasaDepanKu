import fs from "fs";
import path from "path";
import { cwd } from "process";
import chalk from "chalk";

export default function RoutesLoader(app) {
  const routesPath = path.join(cwd(), "./src/routes");

  fs.readdirSync(routesPath).forEach(async (file) => {
    if (file.endsWith(".routes.js")) {
      const s = process.hrtime.bigint();
      const route = await import(`../routes/${file}`);
      const n = process.hrtime.bigint();

      const t = Number(n - s) / 1e6;
      app.use("/", route.default);
      console.log(
        chalk.hex("#EBB400")(`Loaded Routes API: `),
        chalk.hex("#51ED00")(`[ ${file} ]`),
        chalk.hex("#9EB02C")(` ${t} ms`),
      );
    }
  });
}
