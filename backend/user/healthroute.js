const express = require("express");
const router = express.Router();
const HealthData = require("../models/healthdata.js");
const ensureAuthenticated = require("../middleware/auth.js");

// Save health data (POST /api/health)
router.post("/api/health", ensureAuthenticated, async (req, res) => {
    const { age, weight, height, bloodPressure, diabetes } = req.body;
    // Validate arrays are provided
    if (!Array.isArray(healthCondition) || healthCondition.length === 0) {
        return res.status(400).json({ message: "healthCondition array is required and cannot be empty" });
    }
    if (!Array.isArray(allergy) || allergy.length === 0) {
        return res.status(400).json({ message: "allergy array is required and cannot be empty" });
    }
    try {
        const data = await HealthData.create({
            user: req.user._id, // from Passport session
            age,
            weight,
            height,
            healthCondtion,
            allergy
        });
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Get logged-in user's health data (GET /api/health)
router.get("/api/user", ensureAuthenticated, async (req, res) => {
    try {
        const data = await HealthData.find({ user: req.user._id });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
