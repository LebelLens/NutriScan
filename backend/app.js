require("dotenv").config({ path: __dirname + "/.env" });
const express=require("express");
const passport=require("passport");
const mongoose=require("mongoose");
const cors=require("cors");
const session=require("express-session");
const app=express();

//Middleware
app.use(cors({ origin: ["http://localhost:5000", "http://localhost:3000"], credentials: true }))
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Session middleware
app.use(session({
    secret: process.env.JWT_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true, 
        sameSite: 'lax',
    }
}))

//Passport
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

//Connect to MongoDb
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected successfully"))
.catch(err=>console.log(err));

//Auth Routes  
app.use("/api/users", require("./user/routes.js"));
// Health Routes
app.use("/api/health", require("./user/healthroute"));
//Scan Routes 
app.use("/api/scan", require("./user/scan.js"));
//Ingredient Routes
app.use("/api/ingredients", require("./user/ingredient.js"));

const port=process.env.PORT||5000;
app.listen(port,()=>{
   console.log("Server is listening");
})
