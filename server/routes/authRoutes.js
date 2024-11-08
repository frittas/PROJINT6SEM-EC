// routes/authRoutes.js
const express = require("express");
const authService = require("../services/authService");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await authService.registerUser(email, password);
    res.status(201).json({ message: "Usuario cadastrado!", user: result.user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await authService.loginUser(email, password);
    res.status(200).json({ message: "Login realizado", user: result.user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
