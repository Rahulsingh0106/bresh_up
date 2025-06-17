const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User.js")
const { extractPDFText, analyzeResume } = require("../utils/geminiHelper");
const multer = require("multer");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
router.get("/getUser", async (req, res) => {
    try {
        const user = await User.find()
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: `Server error ${error}` });
    }
})

router.post("/register", upload.single("resume"), async (req, res) => {
    try {
        let text;
        const { name, email, password } = req.body;
        if (!name || !email || !password || !req.file) {
            return res.status(400).json({ error: "Please enter all fields" });
        }

        if (req.file.mimetype === "application/pdf") {
            text = await extractPDFText(req.file.buffer);
        }
        else {
            return res.status(400).json({ error: "Unsupported file format" });
        }
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // Analyze Resume using AI
        const analysis = await analyzeResume(text);

        // Parse AI Response
        const { skills, education, experience } = JSON.parse(analysis);

        // Save to MongoDB
        const newUser = new User({ name, email, password: hashedPassword, skills, education, experience, extractedText: text });
        await newUser.save();

        const user = await User.findOne({ email });
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
        res.status(500).json({ error: `Server error ${error}` });
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Please enter all fields" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User does not exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ data: user }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV,
            sameSite: "lax",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ message: "Login Successfully", data: { user_details: user, token: token } });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
})

router.post("/logout", async (req, res) => {
    await res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV,
        sameSite: "lax",
        path: "/",
    });

    res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;