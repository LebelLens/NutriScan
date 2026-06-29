require("dotenv").config({ path: __dirname + "/.env" });
const express=require("express");
const passport=require("passport");
const mongoose=require("mongoose");
const cors=require("cors");
const session=require("express-session");
const app=express();

//Trust proxy for production
app.set('trust proxy', 1);

//Middleware
app.use(cors({ 
    origin: [process.env.FRONTEND_URL, "http://localhost:3000"].filter(Boolean), 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.raw({ type: 'application/octet-stream', limit: '50mb' }));

//Session middleware
app.use(session({
    secret: process.env.JWT_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        httpOnly: true,
    },
}))

//Passport
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

//Connect to MongoDb
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected successfully"))
.catch(err=>{
    mongoose.connect(process.env.LOCAL_MONGO_URI)
    console.log("Local MongoDB connected")
});

//Auth Routes  
app.use("/api/users", require("./routes/user.js"));
// Health Routes
app.use("/api/health", require("./routes/healthroute"));
//Scan Routes 
app.use("/api/scan", require("./routes/scan.js"));
//Ingredient Routes
app.use("/api/ingredients", require("./routes/ingredient.js"));
// Ai route(OCR and analyze) 
app.use("/api/ai", require("./routes/ai.js"));

const port=process.env.PORT||5000;
app.listen(port,()=>{
   console.log("Server is listening");
})
