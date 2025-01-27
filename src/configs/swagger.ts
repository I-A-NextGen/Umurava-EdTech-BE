import { url } from "inspector";
import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ed-Tech API Documentation",
      version: "1.0.0",
      description: "Ed-Tech API Documentation",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: "Development server",
      },
      {
        url: process.env.API_URL,
        description: "Staging server",
      },
    ],
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
  apis: ["src/docs/v1/*.yaml"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export default swaggerDocs;
