// routes/roadmap.js
const express = require("express");
const router = express.Router();
const Roadmap = require("../models/Roadmap");

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
module.exports = router;
