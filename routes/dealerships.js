import express from "express";
import data from "../data.json" assert { type: "json" };

const router = express.Router();

// Pobranie wszystkich salonów
router.get("/", (req, res) => {
  res.status(200).json({
    dealerships: data.dealerships,
    links: [{ rel: "self",method:"GET", href: "/dealerships" }],
  });
});

// Dodanie nowego salonu
router.post("/", (req, res) => {
  const newDealership = req.body;

  //walidacja podstawowa
  if (!newDealership.id || !newDealership.name || !newDealership.location) {
    return res
      .status(400)
      .json({ message: "Bad Request: Missing required fields." });
  }

  data.dealerships.push(newDealership);
  res.status(201).json({
    message: "Dealership created successfully",
    links: [{ rel: "self",method:"POST", href: "/dealerships" }],
  });
});

// Pobranie konkretnego salonu
router.get("/:dealershipId", (req, res) => {
  const dealership = data.dealerships.find(
    (d) => d.id === req.params.dealershipId
  );

  if (!dealership) {
    return res.status(404).json({ message: "Dealership not found" });
  }

  res.status(200).json({
    dealership,
    links: [
      { rel: "self",method:"GET", href: `/dealerships/${req.params.dealershipId}` },
      { rel: "cars",method:"GET", href: `/dealerships/${req.params.dealershipId}/cars` },
    ],
  });
});

// Aktualizacja salonu
router.put("/:dealershipId", (req, res) => {
  const dealershipIndex = data.dealerships.findIndex(
    (d) => d.id === req.params.dealershipId
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
    links: [{ rel: "self",method:"PUT", href: `/dealerships/${req.params.dealershipId}` }],
  });
});

// Usunięcie salonu
router.delete("/:dealershipId", (req, res) => {
  const dealershipIndex = data.dealerships.findIndex(
    (d) => d.id === req.params.dealershipId
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
