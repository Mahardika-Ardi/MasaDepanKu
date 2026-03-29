import chalk from "chalk";
import fs from "fs";
import path from "path";

const name = process.argv[2];

if (!name) {
  console.log("❌ Usage: npm run make <name>");
  process.exit(1);
}

const baseName = name.toLowerCase();
const basePath = path.join("src", `${baseName}`);

const createFile = (filePath, content) => {
  if (fs.existsSync(filePath)) {
    console.log(chalk.red("Failed file is already exist!"));
    process.exit(0);
  }

  fs.writeFileSync(filePath, content);
  console.log(chalk.green("Created: "), chalk.hex("#00D4FF")(`${filePath}`));
  console.log(chalk.green("Done!"));
};

fs.mkdirSync(basePath, { recursive: true });
fs.mkdirSync(path.join(basePath, "dto"), { recursive: true });

createFile(
  path.join(basePath, "dto", `${baseName}_create.dto.js`),
  `import { z } from "zod";

export const ${capitalize(baseName)}CreateDto = z.object({
  // define schema here
});
`,
);
createFile(
  path.join(basePath, "dto", `${baseName}_update.dto.js`),
  `import { z } from "zod";

export const ${capitalize(baseName)}UpdateDto = z.object({
  // define schema here
});
`,
);

createFile(
  path.join(basePath, `${baseName}.controller.js`),
  `import { ${capitalize(baseName)}CreateDto } from "./dto/${baseName}_create.dto.js";
  import { ${capitalize(baseName)}UpdateDto } from "./dto/${baseName}_update.dto.js";
  import ${capitalize(baseName)}Service from "./${baseName}.service.js";
  
  class ${capitalize(baseName)}Controller {
    async create(req, res) {
      try {
        const validated = ${capitalize(baseName)}CreateDto.parse(req.body);
        const result = await ${capitalize(baseName)}Service.register(validated);
  
        res.status(200).json({
          Success: true,
          Message: "",
          Information: result,
          Error: null,
        });
      } catch (error) {
        res.status(500).json({
          Success: false,
          Message: "Error ->",
          Information: null,
          Error: error.code || "BAD_REQUEST",
        });
      }
    }
    async findall(req, res) {
      try {
        const result = await ${capitalize(baseName)}Service.register(req.body);
  
        res.status(200).json({
          Success: true,
          Message: "",
          Information: result,
          Error: null,
        });
      } catch (error) {
        res.status(500).json({
          Success: false,
          Message: "Error ->",
          Information: null,
          Error: error.code || "BAD_REQUEST",
        });
      }
    }
    async findone(req, res) {
      try {
        const result = await ${capitalize(baseName)}Service.register(req.body);
  
        res.status(200).json({
          Success: true,
          Message: "",
          Information: result,
          Error: null,
        });
      } catch (error) {
        res.status(500).json({
          Success: false,
          Message: "Error ->",
          Information: null,
          Error: error.code || "BAD_REQUEST",
        });
      }
    }
    async update(req, res) {
      try {
        const validated = ${capitalize(baseName)}UpdateDto.parse(req.body);
        const result = await ${capitalize(baseName)}Service.register(validated);
  
        res.status(200).json({
          Success: true,
          Message: "",
          Information: result,
          Error: null,
        });
      } catch (error) {
        res.status(500).json({
          Success: false,
          Message: "Error ->",
          Information: null,
          Error: error.code || "BAD_REQUEST",
        });
      }
    }
    async delete(req, res) {
      try {
        const result = await ${capitalize(baseName)}Service.register(req.body);
  
        res.status(200).json({
          Success: true,
          Message: "",
          Information: result,
          Error: null,
        });
      } catch (error) {
        res.status(500).json({
          Success: false,
          Message: "Error ->",
          Information: null,
          Error: error.code || "BAD_REQUEST",
        });
      }
    }
  }
  
  export default new ${capitalize(baseName)}Controller();
`,
);

createFile(
  path.join(basePath, `${baseName}.service.js`),
  `import prisma from "../config/prisma.config.js";
import prismaErrors from "../utils/prisma_errors.utils.js";

class ${capitalize(baseName)}Service {
  async create(data) {
    try {
      await prisma.users.create();
      //logic
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw error || prismaError;
    }
  }
  async findall() {
    try {
      // await prisma.users.findMany();
      //logic
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw error || prismaError;
    }
  }
  async findone(id) {
    try {
      // await prisma.users.findFirst();
      //logic
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw error || prismaError;
    }
  }
  async update(id, data) {
    try {
      // await prisma.users.update();
      //logic
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw error || prismaError;
    }
  }
  async delete(id) {
    try {
      // await prisma.users.delete();
      //logic
    } catch (error) {
      const prismaError = prismaErrors(error);
      console.log(error);
      throw error || prismaError;
    }
  }
}

export default new ${capitalize(baseName)}Service();
`,
);

createFile(
  path.join(basePath, `${baseName}.routes.js`),
  `import express from "express";
  import ${capitalize(baseName)}Controller from "./${baseName}.controller.js";
  
  const route = express.Router();
  
  route.post("", ${capitalize(baseName)}Controller.create);
  route.get("", ${capitalize(baseName)}Controller.findall);
  route.get("", ${capitalize(baseName)}Controller.findone);
  route.patch("", ${capitalize(baseName)}Controller.update);
  route.delete("", ${capitalize(baseName)}Controller.delete);
  
  export default route;
  
`,
);

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
