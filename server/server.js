const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

// Middleware – allow frontend origin (set FRONTEND_URL on VPS e.g. https://www.factpro.benmalekprod.com)
/*const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((o) => o.trim())
  : ["http://localhost:3000"];
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(null, false);
    },
    credentials: true,
  })
);*/
app.use(cors( {origin: ["http://localhost:3000","https://www.factpro.benmalekprod.com","https://factpro.benmalekprod.com"],credentials: true}))
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
