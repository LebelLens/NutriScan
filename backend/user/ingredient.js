const express = require("express");
const router = express.Router();
const Scan = require("../models/scan");
const ensureAuthenticated = require("../middleware/auth");

// GET ingredient details by name
router.get("/:name", ensureAuthenticated, async (req, res) => {
  try {
    const ingredientName = req.params.name.toLowerCase();

    // Find scans containing this ingredient
    const scans = await Scan.find({
      "ingredients.name": { $regex: new RegExp(`^${ingredientName}$`, "i") }
    });

    if (!scans.length) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    // Extract ingredient details
    const ingredientDetails = scans
      .flatMap(scan => scan.ingredients)
      .find(i => i.name.toLowerCase() === ingredientName);

    res.json({
      name: ingredientDetails.name,
      description: ingredientDetails.description,
      risks: ingredientDetails.risks,
      alternatives: ingredientDetails.alternatives
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
