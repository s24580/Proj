import express from "express";
import data from "../data.json" assert { type: "json" };

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Car:
 *       type: object
 *       required:
 *         - id
 *         - model
 *         - year
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the car.
 *         model:
 *           type: string
 *           description: The model of the car.
 *         year:
 *           type: integer
 *           description: The manufacturing year of the car.
 *       example:
 *         id: 1
 *         model: Camaro
 *         year: 2020
 */

/**
 * @swagger
 * tags:
 *   name: Cars
 *   description: API do zarządzania samochodami
 */

/**
 * @swagger
 * /cars:
 *   get:
 *     summary: Pobierz listę wszystkich samochodów
 *     tags: [Cars]
 *     responses:
 *       200:
 *         description: Lista samochodów
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cars:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Car'
 *                 links:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rel:
 *                         type: string
 *                       method:
 *                         type: string
 *                       href:
 *                         type: string
 */
router.get("/", (req, res) => {
  res.status(200).json({
    cars: data.cars,
    links: [{ rel: "self", method: "GET", href: "/cars" }],
  });
});

/**
 * @swagger
 * /cars:
 *   post:
 *     summary: Dodaj nowy samochód
 *     tags: [Cars]
 *     requestBody:
 *       description: Obiekt zawierający dane nowego samochodu
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       201:
 *         description: Samochód został utworzony pomyślnie
 *       400:
 *         description: Brak wymaganych pól
 */
router.post("/", (req, res) => {
  const newCar = req.body;

  // Walidacja podstawowa
  if (!newCar.id || !newCar.model || !newCar.year) {
    return res
      .status(400)
      .json({ message: "Bad Request: Missing required fields." });
  }

  // Dodajemy samochód
  data.cars.push(newCar);
  res.status(201).json({
    message: "Car created successfully",
    links: [{ rel: "self", method: "POST", href: "/cars" }],
  });
});

/**
 * @swagger
 * /cars/{carId}:
 *   get:
 *     summary: Pobierz dane konkretnego samochodu
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: carId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identyfikator samochodu
 *     responses:
 *       200:
 *         description: Dane samochodu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 car:
 *                   $ref: '#/components/schemas/Car'
 *                 links:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rel:
 *                         type: string
 *                       method:
 *                         type: string
 *                       href:
 *                         type: string
 *       404:
 *         description: Samochód nie znaleziony
 */
router.get("/:carId", (req, res) => {
  const carId = parseInt(req.params.carId, 10);
  const car = data.cars.find((car) => car.id === carId);

  if (!car) {
    return res.status(404).json({ message: "Car not found" });
  }

  res.status(200).json({
    car,
    links: [
      { rel: "self", method: "GET", href: `/cars/${carId}` },
      { rel: "features", method: "GET", href: `/cars/${carId}/features` },
    ],
  });
});

/**
 * @swagger
 * /cars/{carId}:
 *   put:
 *     summary: Zaktualizuj dane samochodu
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: carId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identyfikator samochodu do aktualizacji
 *     requestBody:
 *       description: Obiekt z danymi do aktualizacji
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               model:
 *                 type: string
 *               year:
 *                 type: integer
 *             example:
 *               model: Corvette
 *               year: 2022
 *     responses:
 *       200:
 *         description: Samochód został zaktualizowany
 *       404:
 *         description: Samochód nie znaleziony
 *       422:
 *         description: Nieprawidłowe dane samochodu
 */
router.put("/:carId", (req, res) => {
  const carId = parseInt(req.params.carId, 10);
  const carIndex = data.cars.findIndex((car) => car.id === carId);

  if (carIndex === -1) {
    return res.status(404).json({ message: "Car not found" });
  }

  // Walidacja danych do aktualizacji
  const updatedCar = req.body;
  if (!updatedCar.model || !updatedCar.year) {
    return res
      .status(422)
      .json({ message: "Unprocessable Entity: Invalid car data" });
  }

  data.cars[carIndex] = { ...data.cars[carIndex], ...updatedCar };
  res.status(200).json({
    message: "Car updated successfully",
    links: [{ rel: "self", method: "PUT", href: `/cars/${carId}` }],
  });
});

/**
 * @swagger
 * /cars/{carId}:
 *   delete:
 *     summary: Usuń samochód
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: carId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identyfikator samochodu do usunięcia
 *     responses:
 *       204:
 *         description: Samochód został usunięty
 *       404:
 *         description: Samochód nie znaleziony
 */
router.delete("/:carId", (req, res) => {
  const carId = parseInt(req.params.carId, 10);
  const carIndex = data.cars.findIndex((car) => car.id === carId);

  if (carIndex === -1) {
    return res.status(404).json({ message: "Car not found" });
  }

  data.cars.splice(carIndex, 1);
  res.status(204).send(); // 204 No Content
});

// Obsługa błędów – middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

export default router;
