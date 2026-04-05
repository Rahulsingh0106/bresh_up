const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    skills: { type: JSON },
    experience: { type: JSON },
    education: { type: JSON },
    targetRole: { type: String, default: "" },
    level: { type: String, default: "" },
    avatar: { type: String, default: "" },
    streak: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model.User || mongoose.model('User', UserSchema);
