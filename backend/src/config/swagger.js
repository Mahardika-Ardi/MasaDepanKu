import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MasaDepanKu",
      version: "2.12.7",
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
  apis: ["src/**/*.routes.js"],
};

const specs = swaggerJsdoc(options);

export default specs;
