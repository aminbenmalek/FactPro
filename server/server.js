const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors(process.env.FRONTEND_URL || "http://localhost:3000"));
app.use(express.json());
app.use(morgan("dev"));
// Connexion MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connecté"))
  .catch((err) => console.error("❌ Erreur de connexion:", err));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/factures", require("./routes/invoiceRoutes"));
app.use("/api/centres", require("./routes/centreRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Serveur lancé sur le port ${PORT}`),
);
