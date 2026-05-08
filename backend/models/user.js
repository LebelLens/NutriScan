const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    googleId:{
        type: String,
    },
    password:{
        type:String,
    },
    isDoneOnboarding:{
        type: Boolean,
        default: false
    },
    healthData:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HealthData'
    },
    scannedData: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scan'
    }],
})
module.exports=mongoose.model("User",userSchema);