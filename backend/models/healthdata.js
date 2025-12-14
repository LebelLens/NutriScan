const mongoose = require("mongoose");

const healthDataSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    age: Number,
    weight: Number,
    height: Number,
    bloodPressure: String,
    diabetes: Boolean,
}, { timestamps: true });

module.exports = mongoose.model("HealthData", healthDataSchema);
