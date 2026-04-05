const mongoose = require('mongoose');

const RoadmapProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    roadmapSlug: { type: String, required: true },
    completedTopics: [{ type: String }] // Array of topic IDs or Labels
});

module.exports = mongoose.model('RoadmapProgress', RoadmapProgressSchema);
