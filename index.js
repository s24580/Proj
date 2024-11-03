import express from "express";
import carsRoutes from "./routes/cars.js";
import dealershipsRoutes from "./routes/dealerships.js";
import servicesRoutes from "./routes/services.js";

const app = express();
app.use(express.json());

// Middleware do nagłówków CORS
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// routes
app.use("/cars", carsRoutes);
app.use("/dealerships", dealershipsRoutes);
app.use("/services", servicesRoutes);

// Uruchomienie serwera
app.listen(3000, () => {
  console.log("Serwer Chevrolet API działa na porcie 3000");
});
