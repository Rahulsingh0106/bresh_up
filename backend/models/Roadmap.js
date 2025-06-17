// models/Roadmap.js

const mongoose = require('mongoose');

const NodeSchema = new mongoose.Schema({
    id: { type: String, required: true },
    type: { type: String, required: true }, // e.g., "title", "topic", "subtopic"
    position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true }
    },
    data: {
        label: { type: String, required: true },
        style: { type: Object, default: {} }, // stores font, color, bg etc.
        // You can add additional fields if needed
    }
});

const EdgeSchema = new mongoose.Schema({
    id: { type: String, required: true },
    source: { type: String, required: true },
    target: { type: String, required: true },
    type: { type: String }, // Optional: default, step, smoothstep etc.
});

const RoadmapSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nodes: [NodeSchema],
    edges: [EdgeSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Roadmap', RoadmapSchema);
