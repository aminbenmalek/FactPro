const express = require("express");
const router = express.Router();
const {
  getInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} = require("../controllers/invoiceController");
const auth = require("../middleware/auth");

// Toutes les routes sont protégées par le middleware d'authentification
router.get("/:userId", getInvoices);
router.post("/", createInvoice);
router.put("/:id/:userId", updateInvoice);
router.delete("/:id/:userId", deleteInvoice);

module.exports = router;
