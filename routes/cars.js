import express from "express";
import data from "../data.json" assert { type: "json" };

const router = express.Router();

// Lista wszystkich samochodów
router.get("/", (req, res) => {
  res.status(200).json({
    cars: data.cars,
    links: [{ rel: "self",method:"GET" href: "/cars" }],
  });
});

// Dodanie nowego samochodu
router.post("/", (req, res) => {
  const newCar = req.body;

  // walidacja podstawowa
  if (!newCar.id || !newCar.model || !newCar.year) {
    return res
      .status(400)
      .json({ message: "Bad Request: Missing required fields." });
  }

  // Dodajemy samochód
  data.cars.push(newCar);
  res.status(201).json({
    message: "Car created successfully",
    links: [{ rel: "self",method:"POST", href: "/cars" }],
  });
});

// Pobranie konkretnego auta
router.get("/:carId", (req, res) => {
  const car = data.cars.find((car) => car.id === req.params.carId);

  if (!car) {
    return res.status(404).json({ message: "Car not found" });
  }

  res.status(200).json({
    car,
    links: [
      { rel: "self",method:"GET", href: `/cars/${req.params.carId}` },
      { rel: "features",method:"GET", href: `/cars/${req.params.carId}/features` },
    ],
  });
});

// Aktualizacja samochodu
router.put("/:carId", (req, res) => {
  const carIndex = data.cars.findIndex((car) => car.id === req.params.carId);

  if (carIndex === -1) {
    return res.status(404).json({ message: "Car not found" });
  }

  // Sprawdzenie walidacji danych
  const updatedCar = req.body;
  if (!updatedCar.model || !updatedCar.year) {
    return res
      .status(422)
      .json({ message: "Unprocessable Entity: Invalid car data" });
  }

  data.cars[carIndex] = { ...data.cars[carIndex], ...updatedCar };
  res.status(200).json({
    message: "Car updated successfully",
    links: [{ rel: "self",method:"PUT", href: `/cars/${req.params.carId}` }],
  });
});

// Usunięcie samochodu
router.delete("/:carId", (req, res) => {
  const carIndex = data.cars.findIndex((car) => car.id === req.params.carId);

  if (carIndex === -1) {
    return res.status(404).json({ message: "Car not found" });
  }

  data.cars.splice(carIndex, 1);
  res.status(204).send(); // 204 No Content
});

// Obsługa błędów
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

export default router;
