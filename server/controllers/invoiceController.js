const Invoice = require("../models/Invoice");

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.params.userId }).sort({
      date: -1,
    });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.createInvoice = async (req, res) => {
  try {
    const invExist = await Invoice.find({
      userId: req.body.userId,
      numeroFacture: req.body.numeroFacture,
    });
    if (invExist.length != 0) {
      res.status(400).json({ message: "Facture de ce numero exist déja!" });
    } else {
      const newInvoice = new Invoice({
        userId: req.body.userId,
        centreId: req.body.centreId,
        amount: req.body.amount,
        date: req.body.date,
        description: req.body.description,
        type: req.body.type,
        billingCategory: req.body.billingCategory,
        periodType: req.body.periodType,
        billingMonth: req.body.billingMonth,
        coveredMonths: req.body.coveredMonths,
        numeroFacture: req.body.numeroFacture,
        periodStart: req.body.periodStart,
        periodEnd: req.body.periodEnd,
        indexOld: req.body.indexOld,
        indexNew: req.body.indexNew,
        isPaid: req.body.isPaid,
        notes: req.body.notes,
      });
      const savedInvoice = await newInvoice.save();
      res.status(201).json(savedInvoice);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const updated = await Invoice.findOneAndUpdate(
      { _id: req.params.id, userId: req.params.userId },
      req.body,
      { new: true },
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Mise à jour impossible" });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    await Invoice.findOneAndDelete({
      _id: req.params.id,
      userId: req.params.userId,
    });
    res.json({ message: "Facture supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
};
