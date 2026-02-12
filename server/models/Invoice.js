const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    centreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Centre",
      required: true,
    },
    type: { type: String, enum: ["STEG", "SONEDE"], required: true },
    billingCategory: {
      type: String,
      enum: ["PROVISIONAL", "ACTUAL"],
      required: true,
    },
    periodType: {
      type: String,
      enum: ["MONTH", "RANGE", "MULTI"],
      required: true,
    },
    billingMonth: String,
    coveredMonths: [String], // Array of strings format "YYYY-MM"
    numeroFacture: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    periodStart: Date,
    periodEnd: Date,
    indexOld: Number,
    indexNew: Number,
    isPaid: { type: Boolean, default: false },
    notes: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Invoice", invoiceSchema);
