import express from "express";
import data from "../data.json" assert { type: "json" };

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: Unikalny identyfikator usługi.
 *         name:
 *           type: string
 *           description: Nazwa usługi.
 *       example:
 *         id: "1"
 *         name: "Oil Change"
 */

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: API do zarządzania usługami
 */

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Pobierz listę wszystkich usług
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Lista usług
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 services:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Service'
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
    services: data.services,
    links: [{ rel: "self", method: "GET", href: "/services" }],
  });
});

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Dodaj nową usługę
 *     tags: [Services]
 *     requestBody:
 *       description: Obiekt zawierający dane nowej usługi
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       201:
 *         description: Usługa została utworzona pomyślnie
 *       400:
 *         description: Brak wymaganych pól
 */
router.post("/", (req, res) => {
  const newService = req.body;

  // Walidacja podstawowa
  if (!newService.id || !newService.name) {
    return res
      .status(400)
      .json({ message: "Bad Request: Missing required fields." });
  }

  data.services.push(newService);
  res.status(201).json({
    message: "Service created successfully",
    links: [{ rel: "self", method: "POST", href: "/services" }],
  });
});

/**
 * @swagger
 * /services/{serviceId}:
 *   get:
 *     summary: Pobierz dane konkretnej usługi
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unikalny identyfikator usługi
 *     responses:
 *       200:
 *         description: Dane usługi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 service:
 *                   $ref: '#/components/schemas/Service'
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
 *         description: Usługa nie znaleziona
 */
router.get("/:serviceId", (req, res) => {
  const serviceId = req.params.serviceId;
  const service = data.services.find((s) => s.id === serviceId);

  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }

  res.status(200).json({
    service,
    links: [
      { rel: "self", method: "GET", href: `/services/${serviceId}` },
      { rel: "cars", method: "GET", href: `/services/${serviceId}/cars` },
    ],
  });
});

/**
 * @swagger
 * /services/{serviceId}:
 *   put:
 *     summary: Zaktualizuj dane usługi
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unikalny identyfikator usługi do aktualizacji
 *     requestBody:
 *       description: Obiekt zawierający dane do aktualizacji usługi
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             example:
 *               name: "Brake Inspection"
 *     responses:
 *       200:
 *         description: Usługa została zaktualizowana
 *       404:
 *         description: Usługa nie znaleziona
 *       422:
 *         description: Nieprawidłowe dane usługi
 */
router.put("/:serviceId", (req, res) => {
  const serviceId = req.params.serviceId;
  const serviceIndex = data.services.findIndex((s) => s.id === serviceId);

  if (serviceIndex === -1) {
    return res.status(404).json({ message: "Service not found" });
  }

  const updatedService = req.body;
  if (!updatedService.name) {
    return res
      .status(422)
      .json({ message: "Unprocessable Entity: Invalid service data" });
  }

  data.services[serviceIndex] = {
    ...data.services[serviceIndex],
    ...updatedService,
  };
  res.status(200).json({
    message: "Service updated successfully",
    links: [{ rel: "self", method: "PUT", href: `/services/${serviceId}` }],
  });
});

/**
 * @swagger
 * /services/{serviceId}:
 *   delete:
 *     summary: Usuń usługę
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unikalny identyfikator usługi do usunięcia
 *     responses:
 *       204:
 *         description: Usługa została usunięta
 *       404:
 *         description: Usługa nie znaleziona
 */
router.delete("/:serviceId", (req, res) => {
  const serviceId = req.params.serviceId;
  const serviceIndex = data.services.findIndex((s) => s.id === serviceId);

  if (serviceIndex === -1) {
    return res.status(404).json({ message: "Service not found" });
  }

  data.services.splice(serviceIndex, 1);
  res.status(204).send();
});

// Obsługa błędów
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

export default router;
