const mongoose = require('mongoose');

const InterviewSessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    role: { type: String, required: true },
    level: { type: String, required: true },
    duration: { type: Number, required: true },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    transcript: { type: Array, default: [] },
    scoreReport: { type: Object, default: {} }
});

module.exports = mongoose.model('InterviewSession', InterviewSessionSchema);
