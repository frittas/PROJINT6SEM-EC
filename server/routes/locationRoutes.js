// routes/locationRoutes.js
const express = require("express");
const locationService = require("../services/locationService");

const router = express.Router();

router.post("/addLocation", async (req, res) => {
  const { uid, title, latitude, longitude } = req.body;
  try {
    const result = await locationService.addLocation(
      uid,
      title,
      latitude,
      longitude
    );
    res.status(201).json({
      message: "Localização adicionada",
      locationId: result.locationId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/addGeopoint", async (req, res) => {
  const { uid, title, latitude, longitude } = req.body;
  try {
    const result = await locationService.addGeoPoint(
      uid,
      title,
      latitude,
      longitude
    );
    res
      .status(201)
      .json({ message: "GeoPoint adicionado", locationId: result.locationId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
