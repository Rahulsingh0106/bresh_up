const express = require("express");
const multer = require("multer");
// const Resume = require("../models/Resume");
const { extractPDFText, analyzeResume, aiResponse } = require("../utils/geminiHelper");
// const { parseResume } = require("../utils/uploadResume");
const User = require("../models/User.js")
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// API to upload resume and store extracted details
router.post("/upload", upload.single("resume"), async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ error: "No file uploaded" });

        let text;
        if (file.mimetype === "application/pdf") {
            text = await extractPDFText(file.buffer);
        }
        else {
            return res.status(400).json({ error: "Unsupported file format" });
        }

        // Analyze Resume using AI
        const analysis = await analyzeResume(text);

        // Parse AI Response
        const { name, email, skills, education, experience } = JSON.parse(analysis);

        // Save to MongoDB
        // const newResume = new Resume({ name, email, skills, education, experience, extractedText: text });
        // await newResume.save();

        res.json({ message: "Resume processed successfully", data: { name, email, skills, education, experience, extractedText: text } });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: `Server error ${error}` });
    }
});

router.get("/getUserData", async (req, res) => {
    try {
        const resumes = await User.findById('67d845b1e36cd5773e8848b0');
        const response = {
            name: resumes.name,
            email: resumes.email,
            skills: resumes.skills,
            education: resumes.education,
            experience: resumes.experience,
            extractedText: resumes.extractedText
        }
        return res.status(200).json({ repsonse: JSON.stringify(response) });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: `Server error ${error}` });
    }
});

router.post("/getAiResponse", async (req, res) => {
    try {
        const response = await aiResponse(req.body.prompt, req.body.lastTwoConversation, req.body.message);
        res.status(200).json({ message: "Response fetched successfully.", response: response })
    } catch (error) {
        res.status(500).json({ error: `Server error ${error}` })
    }
})

module.exports = router;