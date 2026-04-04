const express = require('express');
const router = express.Router();

router.post('/feedback', (req, res) => {
    // Generate a static mock JSON report
    // In a real application, we would pass req.body.conversation to the AI to generate this JSON
    
    const mockReport = {
        overallScore: 8,
        communicationScore: 9,
        technicalScore: 7,
        problemSolvingScore: 8,
        strengths: [
            "Clear and articulate communication",
            "Strong understanding of core syntax and principles",
            "Good structured thinking process"
        ],
        improvements: [
            "Could dive deeper into system scalability nuances",
            "Consider edge cases more thoroughly",
            "Hesitated on the advanced framework question"
        ],
        topicsToRevise: [
            "Advanced Hooks optimization",
            "Load balancer configurations",
            "Database indexing strategies"
        ],
        questionFeedback: [
            {
                question: "Can you explain the difference between useMemo and useCallback in React?",
                yourAnswer: "useMemo is for caching values, and useCallback is for caching functions so they don't get recreated.",
                feedback: "Good answer. You hit the main point. To improve, mention reference equality and how it prevents unnecessary child component re-renders."
            },
            {
                question: "How would you design a URL shortener system?",
                yourAnswer: "I would use a NoSQL database and a hash function to generate the short code when a user submits a long URL.",
                feedback: "A decent high-level start. However, you missed discussing collision management for the hash, read/write ratios, and how caching (like Redis) would be crucial here."
            }
        ]
    };

    res.status(200).json(mockReport);
});

module.exports = router;
