const express = require("express");
const router = express.Router();
const HealthData = require("../models/healthdata.js");
const ensureAuthenticated = require("../middleware/auth.js");
const User = require("../models/user.js");

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

    const healthData = await HealthData.create({
      user: req.user._id,
      age,
      weight,
      height,
      healthCondition,
      allergy
    });

    const user=await User.findOne({_id: req.user._id})
    user.healthData=healthData._id;
    console.log(user);
    await user.save()

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

// Update health data of user
router.put("/", ensureAuthenticated, async (req, res)=>{
  try {
    const {healthCondition, allergy}=req.body;
    const data= await HealthData.findOneAndUpdate({user: req.user._id}, {healthCondition, allergy}, {new: true})
    res.json(data);
  } catch (error) {
    console.log(error)
    res.status(500).json({message: "Internal Server Error"})
  }
})
module.exports = router;
