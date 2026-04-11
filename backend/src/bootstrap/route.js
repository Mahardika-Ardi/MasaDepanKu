import fs from "fs";
import path from "path";
import { cwd } from "process";
import chalk from "chalk";
import { pathToFileURL } from "url";

async function loadRoutes(app, dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await loadRoutes(app, fullPath);
    } else if (file.endsWith(".routes.js")) {
      const s = process.hrtime.bigint();

      const routeModule = await import(pathToFileURL(fullPath).href);
      const route = routeModule.default;

      const n = process.hrtime.bigint();
      const t = Number(n - s) / 1e6;

      const folderName = path.basename(path.dirname(fullPath));

      app.use(`/${folderName}`, route);

      console.log(
        chalk.hex("#EBB400")("Loaded Routes API:"),
        chalk.hex("#51ED00")(`[ /src/${folderName}/${file} ]`),
        chalk.hex("#00D4FF")("→"),
        chalk.hex("#9EB02C")(` ${t.toFixed(2)} ms`),
      );
    }
  }
}

export default async function RoutesLoader(app) {
  const basePath = path.join(cwd(), "src");
  await loadRoutes(app, basePath);
}
