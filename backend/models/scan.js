const mongoose=require("mongoose");
//Subschema
const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    risks: {
        type: [String]   // multiple risks so array
    },
    alternatives: {
        type: [String]   // safer alternatives 
    }
}, { _id: false }); // prevents separate _id for each ingredient

// Main Scan schema
const scanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    verdict: {
        type: String, // e.g., "Safe", "Moderate", "Unsafe"
        required: true
    },
    riskLevel: {
        type: String, // e.g., "Low", "Medium", "High"
        required: true
    },
    flaggedIngredients: {
        type: [ingredientSchema],
        default: []
    },
    positiveHighlights: {
        type: [ingredientSchema],
        default: []
    }, 
    isFavourite: {
        type: Boolean,
        default: false
    },
    summary: {
        type: String, 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Scan", scanSchema);