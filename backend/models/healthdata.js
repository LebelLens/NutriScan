const mongoose = require("mongoose");

const healthDataSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    age: Number,
    weight: Number,
    height: Number,
    healthCondition:{
        type:[{type:String}],
    },
    allergy:{
        type:[{type:String}],
    }
}, { timestamps: true });

module.exports = mongoose.model("HealthData", healthDataSchema);
