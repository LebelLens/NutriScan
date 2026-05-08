const express = require("express");
const router = express.Router();
const Scan = require("../models/scan");
const ensureAuthenticated = require("../middleware/auth");

//Save scan result
router.post("/", ensureAuthenticated, async (req, res) => {
  try {
    const { productName, verdict, riskLevel, flaggedIngredients, positiveHighlights, summary } = req.body;

    if (!productName || !verdict || !riskLevel) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const scan = await Scan.create({
      user: req.user._id,
      productName,
      verdict,
      riskLevel,
      flaggedIngredients,
      positiveHighlights,
      summary,
    });

    res.status(201).json(scan);
  } catch (error) {
    res.status(500).json({ message: "Failed to save scan" });
  }
});


// GET ALL SCANS OF USER
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const scans = await Scan.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(scans);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch scans" });
  }
});


// GET SINGLE SCAN BY ID
router.get("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const scan = await Scan.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!scan) {
      return res.status(404).json({ message: "Scan not found" });
    }

    res.json(scan);
  } catch (error) {
    res.status(500).json({ message: "Error fetching scan" });
  }
});


// DELETE SCAN
router.delete("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const deleted = await Scan.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!deleted) {
      return res.status(404).json({ message: "Scan not found" });
    }

    res.json({ message: "Scan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});


// ADD / REMOVE FAVORITE
router.patch("/:id/favourite", ensureAuthenticated, async (req, res) => {
  try {
    const scan = await Scan.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!scan) {
      return res.status(404).json({ message: "Scan not found" });
    }

    scan.isFavourite = !scan.isFavourite;
    await scan.save();

    res.json(scan);
  } catch (error) {
    res.status(500).json({ message: "Could not update favourite" });
  }
});

module.exports = router;
