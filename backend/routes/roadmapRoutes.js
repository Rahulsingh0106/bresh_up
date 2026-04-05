// routes/roadmap.js
const express = require("express");
const router = express.Router();
const Roadmap = require("../models/Roadmap");
const RoadmapProgress = require("../models/RoadmapProgress");
const authMiddleware = require("../middleware/Auth");

// POST /api/roadmap
router.post("/saveRoadmap", async (req, res) => {
    try {
        const { title, nodes, edges, createdBy } = req.body;
        const cleanTitle = title.trim().toLowerCase().replace(/\s+/g, '-');
        const randomPart = Math.random().toString(36).substring(2, 8);
        const slug = cleanTitle + "-" + randomPart
        const newRoadmap = new Roadmap({
            title,
            slug,
            nodes,
            edges,
            createdBy, // Optional
        });

        const saved = await newRoadmap.save();
        res.status(201).json({ message: "Roadmap saved!", data: saved });
    } catch (error) {
        console.error("Error saving roadmap:", error);
        res.status(500).json({ error: "Failed to save roadmap" });
    }
});

router.post("/getRoadmaps", async (req, res) => {
    try {
        const { user_id } = req.body;
        const roadmaps = await Roadmap.find({ createdBy: user_id })
        res.status(200).json({ data: roadmaps, message: "Data fetched sucessfully." })
    } catch (error) {
        res.status(500).json({ "message": "Something went wrong! Please try later again." })
    }
})

router.get("/getRoadmapBySlug/:slug", async (req, res) => {
    try {
        const { slug } = req.params;
        const roadmap = await Roadmap.findOne({ slug });

        if (!roadmap) return res.status(404).json({ message: "Roadmap not found" });

        res.status(200).json({ data: roadmap });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// POST /api/roadmap/progress/toggle
router.post("/progress/toggle", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { roadmapSlug, topicId } = req.body;

        let progress = await RoadmapProgress.findOne({ userId, roadmapSlug });
        if (!progress) {
            progress = new RoadmapProgress({ userId, roadmapSlug, completedTopics: [] });
        }

        const index = progress.completedTopics.indexOf(topicId);
        if (index > -1) {
            progress.completedTopics.splice(index, 1); // remove if checked
        } else {
            progress.completedTopics.push(topicId); // add if unchecked
        }

        await progress.save();
        res.status(200).json({ data: progress });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to toggle topic progress" });
    }
});

// GET /api/roadmap/progress/:slug
router.get("/progress/:slug", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { slug } = req.params;
        const progress = await RoadmapProgress.findOne({ userId, roadmapSlug: slug });
        res.status(200).json({ data: progress || { completedTopics: [] } });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch progress" });
    }
});

// GET /api/roadmap/progress (all for user)
router.get("/progress", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const progress = await RoadmapProgress.find({ userId });
        res.status(200).json({ data: progress });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch progress array" });
    }
});

module.exports = router;
