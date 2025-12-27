const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/user.js");

// Signup
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if(existingUser){
            if (existingUser.googleId && !existingUser.password) {
                return res.status(400).json({
                    success: false,
                    message: "Account exists via Google. Please set a password instead."
                });
            }
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        req.login(user, (err) => {
            if(err) return res.status(500).json({ message: "Login error after signup" });
            res.status(201).json({success: true, user: { id: user._id, name: user.name, email: user.email }});
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Login
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if(err) return next(err);
        if(!user) return res.status(400).json({ message: info.message });

        req.login(user, (err) => {
            if(err) return res.status(500).json({ message: "Login failed" });
            res.json({success: true, user:{ id: user._id, name: user.name, email: user.email }});
        });
    })(req, res, next);
});
//Google login
router.get('/auth/google',passport.authenticate('google', { scope: ['profile','email'] }));

//Google callback
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:3000/home',
    failureRedirect: 'http://localhost:3000/login',
  })
);

// Checks if the login is succeeded
router.get("/login/success", (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: "successful",
            user: req.user,
        });
    } else {
        res.status(401).json({
            success: false,
            message: "User not authenticated",
        });
    }
});

// Logout
router.post("/logout", (req, res) => {
    req.logout((err) => {
        if(err) return res.status(500).json({ message: "Logout error" });
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: "Could not log out" });
            }
            res.clearCookie("connect.sid"); 
            
            return res.status(200).json({ message: "Logout successful" });
        });
    });
});

// Check if logged in
router.get("/profile", (req, res) => {
    if(req.isAuthenticated()) {
        res.json({ id: req.user._id, name: req.user.name, email: req.user.email });
    } else {
        res.status(401).json({ message: "Not authenticated" });
    }
});

module.exports = router;