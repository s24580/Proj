import express from "express";
import data from "../data.json" assert { type: "json" };

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Dealership:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - location
 *       properties:
 *         id:
 *           type: string
 *           description: Identyfikator salonu.
 *         name:
 *           type: string
 *           description: Nazwa salonu.
 *         location:
 *           type: string
 *           description: Lokalizacja salonu.
 *       example:
 *         id: "1"
 *         name: "Chevrolet Center"
 *         location: "Warszawa"
 */

/**
 * @swagger
 * tags:
 *   name: Dealerships
 *   description: API do zarządzania salonami
 */

/**
 * @swagger
 * /dealerships:
 *   get:
 *     summary: Pobierz listę wszystkich salonów
 *     tags: [Dealerships]
 *     responses:
 *       200:
 *         description: Lista salonów
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dealerships:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Dealership'
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
    dealerships: data.dealerships,
    links: [{ rel: "self", method: "GET", href: "/dealerships" }],
  });
});

/**
 * @swagger
 * /dealerships:
 *   post:
 *     summary: Dodaj nowy salon
 *     tags: [Dealerships]
 *     requestBody:
 *       description: Obiekt zawierający dane nowego salonu
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Dealership'
 *     responses:
 *       201:
 *         description: Salon został utworzony pomyślnie
 *       400:
 *         description: Brak wymaganych pól
 */
router.post("/", (req, res) => {
  const newDealership = req.body;

  // Walidacja podstawowa
  if (!newDealership.id || !newDealership.name || !newDealership.location) {
    return res
      .status(400)
      .json({ message: "Bad Request: Missing required fields." });
  }

  data.dealerships.push(newDealership);
  res.status(201).json({
    message: "Dealership created successfully",
    links: [{ rel: "self", method: "POST", href: "/dealerships" }],
  });
});

/**
 * @swagger
 * /dealerships/{dealershipId}:
 *   get:
 *     summary: Pobierz dane konkretnego salonu
 *     tags: [Dealerships]
 *     parameters:
 *       - in: path
 *         name: dealershipId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identyfikator salonu
 *     responses:
 *       200:
 *         description: Dane salonu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dealership:
 *                   $ref: '#/components/schemas/Dealership'
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
 *         description: Salon nie znaleziony
 */
router.get("/:dealershipId", (req, res) => {
  const dealershipId = req.params.dealershipId;
  const dealership = data.dealerships.find((d) => d.id === dealershipId);

  if (!dealership) {
    return res.status(404).json({ message: "Dealership not found" });
  }

  res.status(200).json({
    dealership,
    links: [
      { rel: "self", method: "GET", href: `/dealerships/${dealershipId}` },
      { rel: "cars", method: "GET", href: `/dealerships/${dealershipId}/cars` },
    ],
  });
});

/**
 * @swagger
 * /dealerships/{dealershipId}:
 *   put:
 *     summary: Zaktualizuj dane salonu
 *     tags: [Dealerships]
 *     parameters:
 *       - in: path
 *         name: dealershipId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identyfikator salonu do aktualizacji
 *     requestBody:
 *       description: Obiekt zawierający dane do aktualizacji salonu
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *             example:
 *               name: "Chevrolet Super Center"
 *               location: "Kraków"
 *     responses:
 *       200:
 *         description: Salon został zaktualizowany
 *       404:
 *         description: Salon nie znaleziony
 *       422:
 *         description: Nieprawidłowe dane salonu
 */
router.put("/:dealershipId", (req, res) => {
  const dealershipId = req.params.dealershipId;
  const dealershipIndex = data.dealerships.findIndex(
    (d) => d.id === dealershipId
  );

  if (dealershipIndex === -1) {
    return res.status(404).json({ message: "Dealership not found" });
  }

  const updatedDealership = req.body;
  if (!updatedDealership.name || !updatedDealership.location) {
    return res
      .status(422)
      .json({ message: "Unprocessable Entity: Invalid dealership data" });
  }

  data.dealerships[dealershipIndex] = {
    ...data.dealerships[dealershipIndex],
    ...updatedDealership,
  };
  res.status(200).json({
    message: "Dealership updated successfully",
    links: [
      {
        rel: "self",
        method: "PUT",
        href: `/dealerships/${dealershipId}`,
      },
    ],
  });
});

/**
 * @swagger
 * /dealerships/{dealershipId}:
 *   delete:
 *     summary: Usuń salon
 *     tags: [Dealerships]
 *     parameters:
 *       - in: path
 *         name: dealershipId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identyfikator salonu do usunięcia
 *     responses:
 *       204:
 *         description: Salon został usunięty
 *       404:
 *         description: Salon nie znaleziony
 */
router.delete("/:dealershipId", (req, res) => {
  const dealershipId = req.params.dealershipId;
  const dealershipIndex = data.dealerships.findIndex(
    (d) => d.id === dealershipId
  );

  if (dealershipIndex === -1) {
    return res.status(404).json({ message: "Dealership not found" });
  }

  data.dealerships.splice(dealershipIndex, 1);
  res.status(204).send();
});

// Obsługa błędów
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

export default router;
