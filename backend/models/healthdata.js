const mongoose = require("mongoose");

const healthDataSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    age: Number,
    weight: Number,
    height: Number,
    healthconditon:{
        type:[{type:String}],
        required:true,
        validate:[arr=>arr.length>0,"Atleast one health condition is required"]
    },
    allergy:{
        type:[{type:String}],
        required:true,
        validate:[arr=>arr.length>0,"Atleast one health condition is required"]
    }
}, { timestamps: true });

module.exports = mongoose.model("HealthData", healthDataSchema);
