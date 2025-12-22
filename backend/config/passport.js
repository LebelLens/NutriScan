const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy=require("passport-google-oauth20").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/user.js");
console.log("GOOGLE_CLIENT_ID =", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET =", process.env.GOOGLE_CLIENT_SECRET);

module.exports = function(passport) {
    passport.use(new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if(!user) return done(null, false, { message: "No user found" });

            if (!user.password) {
              return done(null, false, { 
                success: false,
                message: "This account uses Google Login. Please use Google to sign in." 
              });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) return done(null, false, { message: "Password incorrect" });

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }));
//Google Strategy
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/users/auth/google/callback",
    },
    async(accessToken,refreshToken,profile,done)=>{
        try{
            //Check if user already exists
            let user = await User.findOne({ googleId: profile.id });
            if (!user) {
            const email = profile.emails?.[0]?.value;
            user = await User.findOne({ email });

            if (user) {
              user.googleId = profile.id;
              user.provider = "google";
              await user.save();
            } else {
              // 3. Create new user
              user = await User.create({
                googleId: profile.id,
                email,
                name: profile.displayName,
                provider: "google",
              });
            }
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
    }
  ));

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
}