import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MasaDepanKu",
      version: "1.7.3",
      description: "API Documentation for BackEnd MasaDepanKu Project",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["src/routes/*.routes.js"],
};

const specs = swaggerJsdoc(options);

export default specs;
