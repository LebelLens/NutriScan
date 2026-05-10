const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy=require("passport-google-oauth20").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/user.js");

module.exports = function(passport) {
    passport.use(new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
        try {
            // Check if an user already exists
            const user = await User.findOne({ email }).populate("healthData", "allergy healthCondition");
            console.log(user);
            if(!user) return done(null, false, { message: "No user found" });

            // if user exists but has no password just show that the account is linked with google.
            if (!user.password) {
              return done(null, false, { 
                success: false,
                message: "This account uses Google Login. Please use Google to sign in." 
              });
            }

            // if password matches log in the user
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
        callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/users/auth/google/callback`,
    },
    async(accessToken,refreshToken,profile,done)=>{
        try{
            //Check if user already exists with google id
            let user = await User.findOne({ googleId: profile.id });
            // if not check if the user has an account with the email provided
            if (!user) {
            const email = profile.emails?.[0]?.value;
            user = await User.findOne({ email });

            // if the user has email login account add the google id to the account
            if (user) {
              user.googleId = profile.id;
              await user.save();
            } else {
              // Create new user
              user = await User.create({
                googleId: profile.id,
                email,
                name: profile.displayName,
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
            const user = await User.findById(id).populate("healthData", "allergy healthCondition");
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
}