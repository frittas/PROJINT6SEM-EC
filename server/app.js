// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const locationRoutes = require("./routes/locationRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// Usando as rotas
app.use("/api/auth", authRoutes);
app.use("/api/locations", locationRoutes);

// Iniciar Servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando => http://localhost:${PORT}`);
});
