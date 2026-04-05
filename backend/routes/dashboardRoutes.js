const router = require("express").Router();
const authMiddleware = require('../middleware/Auth');
const InterviewSession = require('../models/InterviewSession');
const RoadmapProgress = require('../models/RoadmapProgress');
const User = require('../models/User');

router.get("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Fetch user to update/get streak (simplified streak logic for now)
        const user = await User.findById(userId);
        
        // 2. Fetch Interview Sessions
        const sessions = await InterviewSession.find({ userId }).sort({ startedAt: -1 });
        
        // Calculate Total Interviews
        const totalInterviews = sessions.length;
        
        // Calculate Average Score
        let averageScore = 0;
        let totalScore = 0;
        let scoredSessionsCount = 0;
        
        // Calculate Weak Topics by aggregation
        const weakTopicsMap = {};

        sessions.forEach(session => {
            if (session.scoreReport && session.scoreReport.overallScore !== undefined) {
                totalScore += session.scoreReport.overallScore;
                scoredSessionsCount++;
                
                // Aggregate topics to revise
                if (Array.isArray(session.scoreReport.topicsToRevise)) {
                    session.scoreReport.topicsToRevise.forEach(topic => {
                        weakTopicsMap[topic] = (weakTopicsMap[topic] || 0) + 1;
                    });
                }
            }
        });

        if (scoredSessionsCount > 0) {
            averageScore = (totalScore / scoredSessionsCount).toFixed(1);
        }

        // Sort weak topics by frequency
        const weakTopics = Object.keys(weakTopicsMap)
            .map(topic => ({ topic, count: weakTopicsMap[topic] }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
            .map(item => item.topic);

        // Get 5 recent sessions
        const recentSessions = sessions.slice(0, 5).map(s => ({
            id: s._id,
            date: s.startedAt,
            role: s.role,
            level: s.level,
            score: s.scoreReport?.overallScore || '-'
        }));

        // 3. Fetch Roadmap Progress
        const roadmaps = await RoadmapProgress.find({ userId });
        let topicsMastered = 0;
        roadmaps.forEach(r => {
            if (Array.isArray(r.completedTopics)) {
                topicsMastered += r.completedTopics.length;
            }
        });

        res.json({
            stats: {
                totalInterviews,
                averageScore,
                currentStreak: user?.streak || 0,
                topicsMastered
            },
            recentSessions,
            weakTopics
        });

    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({ error: "Failed to load dashboard data." });
    }
});

module.exports = router;
