const mongoose = require("mongoose");

const centreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    code: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    description: String,
    referenceSteg: String,
    referenceSonede: String,
  },
  { timestamps: true },
);

// Index unique composé pour éviter deux centres avec le même code pour un même utilisateur

module.exports = mongoose.model("Centre", centreSchema);
