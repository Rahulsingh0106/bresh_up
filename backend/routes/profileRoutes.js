const router = require("express").Router()
const authMiddleware = require('../middleware/Auth')
const User = require('../models/User')

router.get("/", authMiddleware, async function (req, res) {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ message: "Profile details fetched successfully.", data: user })
    } catch (error) {
        res.status(500).json({ error: "Server error fetching profile." })
    }
})

router.put("/", authMiddleware, async function (req, res) {
    const { name, targetRole, level } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        if (name) user.name = name;
        if (targetRole) user.targetRole = targetRole;
        if (level) user.level = level;
        
        await user.save();
        
        // Exclude password from the returned object
        const updatedUser = await User.findById(req.user.id).select('-password');
        
        res.json({ message: "Profile updated successfully.", data: updatedUser })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error updating profile." })
    }
})

module.exports = router
