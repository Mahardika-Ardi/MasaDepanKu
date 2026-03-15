import fs from "fs";
import path from "path";
import { cwd } from "process";

export default function RoutesLoader(app) {
  const routesPath = path.join(cwd(), "./src/routes");

  fs.readdirSync(routesPath).forEach(async (file) => {
    if (file.endsWith(".routes.js")) {
      const route = await import(`../routes/${file}`);

      app.use("/api", route.default);
      console.log(`Loaded Routes API: [ ${file} ]`);
    }
  });
}
