// routes/pushRoutes.js
const express = require("express");
const router = express.Router();
const { buscarLocaisProximos } = require("../services/locationService");

router.post("/", async (req, res) => {
  const { message, title, latitude, longitude, radius } = req.body;

  if (!message || !title || !latitude || !longitude || !radius) {
    return res.status(400).json({
      message: "Insira todos os valores!",
    });
  }

  try {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const rad = parseFloat(radius);

    const usuariosEncontrados = await buscarLocaisProximos(lat, lng, rad, title, message);

    if (usuariosEncontrados.length > 0) {
      res.json({ success: true, usuarios: usuariosEncontrados });
    } else {
      res.json({
        success: true,
        message: "Nenhum usuário encontrado dentro do raio",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao processar a solicitação.");
  }
});

module.exports = router;
