import express from "express";
import carsRoutes from "./routes/cars.js";
import dealershipsRoutes from "./routes/dealerships.js";
import servicesRoutes from "./routes/services.js";
import swaggerjsdoc from "swagger-jsdoc";
import swaggerui from "swagger-ui-express";

const app = express();
app.use(express.json());

// Middleware do nagłówków CORS
app.use((req, res, next) => {
  // res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// routes
app.use("/cars", carsRoutes);
app.use("/dealerships", dealershipsRoutes);
app.use("/services", servicesRoutes);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Chevrollet API Documentation",
      version: "1.0.0",
      description: "API documentation for the chevrollet API",
      contact: {
        name: "Philip",
        url: "philip.com",
        email: "philip@gmail.com",
      }, //random information
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerjsdoc(options);
app.use("/api-docs", swaggerui.serve, swaggerui.setup(specs));

// Uruchomienie serwera
app.listen(3000, () => {
  console.log("Serwer Chevrolet API działa na porcie 3000");
});
