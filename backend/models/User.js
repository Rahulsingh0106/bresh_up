const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    skills: { type: JSON },
    experience: { type: JSON },
    education: { type: JSON },
})

module.exports = mongoose.model.User || mongoose.model('User', UserSchema);
