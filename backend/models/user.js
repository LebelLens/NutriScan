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
    healthData:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HealthData'
    }
})
module.exports=mongoose.model("User",userSchema);