const express = require("express");
const router = express.Router();
const HealthData = require("../models/healthdata.js");
const ensureAuthenticated = require("../middleware/auth.js");

// Save health data (POST /api/health)
router.post("/api/health", ensureAuthenticated, async (req, res) => {
    const { age, weight, height, bloodPressure, diabetes } = req.body;
    try {
        const data = await HealthData.create({
            user: req.user._id, // from Passport session
            age,
            weight,
            height,
            bloodPressure,
            diabetes
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
