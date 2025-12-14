const express=require("express");
const passport=require("passport");
const mongoose=require("mongoose");
const cors=require("cors");
const session=require("express-session");
require("dotenv").config();
const app=express();
//Session middleware
app.use(session({
    secret: process.env.JWT_SECRET || "secret",
    resave: false,
    saveUninitialized: false
}))
//Middleware
app.use(cors({ origin: "http://localhost:5000", credentials: true }))
app.use("/api/health", require("./user/healthroute"));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false
}));

//Passport
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

//Connect to MongoDb
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected successfully"))
.catch(err=>console.log(err));

//Routes  
app.use("/api/users", require("./user/routes.js"));
 const port=process.env.port||5000;
 app.listen(port,()=>{
    console.log("Server is listening");
 })
