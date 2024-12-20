import express from "express";
import data from "../data.json" assert { type: "json" };

const router = express.Router();

// Pobranie wszystkich usług
router.get("/", (req, res) => {
  res.status(200).json({
    services: data.services,
    links: [{ rel: "self",method:"GET", href: "/services" }],
  });
});

// Dodanie nowej usługi
router.post("/", (req, res) => {
  const newService = req.body;

  //walidacja podstawowa
  if (!newService.id || !newService.name) {
    return res
      .status(400)
      .json({ message: "Bad Request: Missing required fields." });
  }

  data.services.push(newService);
  res.status(201).json({
    message: "Service created successfully",
    links: [{ rel: "self",method:"POST", href: "/services" }],
  });
});

// Pobranie konkretnej usługi
router.get("/:serviceId", (req, res) => {
  const service = data.services.find((s) => s.id === req.params.serviceId);

  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }

  res.status(200).json({
    service,
    links: [
      { rel: "self",method:"GET", href: `/services/${req.params.serviceId}` },
      { rel: "cars",method:"GET", href: `/services/${req.params.serviceId}/cars` },
    ],
  });
});

// Aktualizacja usługi
router.put("/:serviceId", (req, res) => {
  const serviceIndex = data.services.findIndex(
    (s) => s.id === req.params.serviceId
  );

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
    links: [{ rel: "self",method:"PUT", href: `/services/${req.params.serviceId}` }],
  });
});

// Usunięcie usługi
router.delete("/:serviceId", (req, res) => {
  const serviceIndex = data.services.findIndex(
    (s) => s.id === req.params.serviceId
  );

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
