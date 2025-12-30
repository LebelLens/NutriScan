const express = require("express");
const router = express.Router();
const HealthData = require("../models/healthdata");
const ensureAuthenticated = require("../middleware/auth");

// POST /api/health → Save health data
router.post("/", ensureAuthenticated, async (req, res) => {
  try {
    const {
      age,
      weight,
      height,
      healthCondition,
      allergy
    } = req.body;

    if (!Array.isArray(healthCondition) || healthCondition.length === 0) {
      return res.status(400).json({ message: "healthCondition is required" });
    }

    if (!Array.isArray(allergy) || allergy.length === 0) {
      return res.status(400).json({ message: "allergy is required" });
    }

    const healthData = await HealthData.create({
      user: req.user._id,
      age,
      weight,
      height,
      healthCondition,
      allergy
    });

    res.status(201).json(healthData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/health → Get logged-in user's health data
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const data = await HealthData.find({ user: req.user._id });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
