const Centre = require("../models/Centre");

exports.getCentres = async (req, res) => {
  try {
    const centres = await Centre.find({ userId: req.params.userId });
    res.json(centres);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des centres" });
  }
};

exports.createCentre = async (req, res) => {
  try {
    console.log("Création de centre avec les données:", req.body);
    const newCentre = new Centre({
      userId: req.body.userId,
      code: req.body.code,
      name: req.body.name,
      address: req.body.address,
      description: req.body.description,
      referenceSteg: req.body.referenceSteg,
      referenceSonede: req.body.referenceSonede,
    });
    const saved = await newCentre.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "Code déjà utilisé ou données invalides" });
  }
};

exports.updateCentre = async (req, res) => {
  try {
    const updated = await Centre.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true },
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Mise à jour échouée" });
  }
};

exports.deleteCentre = async (req, res) => {
  try {
    await Centre.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: "Centre supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
};
