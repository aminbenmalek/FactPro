const express = require("express");
const router = express.Router();
const {
  getCentres,
  createCentre,
  updateCentre,
  deleteCentre,
} = require("../controllers/centreController");
const auth = require("../middleware/auth");

router.get("/:userId", getCentres);
router.post("/", createCentre);
router.put("/:id", updateCentre);
router.delete("/:id", deleteCentre);

module.exports = router;
