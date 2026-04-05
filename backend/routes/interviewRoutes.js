const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/Auth');
const InterviewSession = require('../models/InterviewSession');
const User = require('../models/User');
const { generateScoreReport } = require('../utils/geminiHelper');

router.post('/feedback', authMiddleware, async (req, res) => {
    try {
        const { conversation, setupData } = req.body;
        const userId = req.user.id;

        // Generate report from transcript
        const scoreReport = await generateScoreReport(conversation || []);

        // Save session if setupData is provided
        if (setupData) {
            const session = new InterviewSession({
                userId,
                role: setupData.role || 'Unknown',
                level: setupData.level || 'Unknown',
                duration: setupData.duration || 0,
                transcript: conversation,
                scoreReport: scoreReport
            });
            await session.save();

            // Update user streak / last active here if needed
            await User.findByIdAndUpdate(userId, { 
                lastActive: new Date(),
                $inc: { streak: 1 } // Naive streak logic for now
            });
        }

        res.status(200).json(scoreReport);
    } catch (error) {
        console.error("Interview feedback error:", error);
        res.status(500).json({ error: "Failed to generate report" });
    }
});

router.get('/history', authMiddleware, async (req, res) => {
    try {
        const sessions = await InterviewSession.find({ userId: req.user.id }).sort({ startedAt: -1 });
        res.status(200).json({ data: sessions });
    } catch (error) {
        console.error("Fetch history error:", error);
        res.status(500).json({ error: "Failed to fetch history" });
    }
});

module.exports = router;
