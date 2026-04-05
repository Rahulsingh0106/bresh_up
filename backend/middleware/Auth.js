const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" })
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // Normalize req.user to make properties easily accessible
        req.user = decoded.data || decoded;
        if (req.user && req.user._id) {
            req.user.id = req.user._id;
        }
        next()
    } catch (error) {
        res.status(403).json({ error: "Invalid Token" })
    }
}

module.exports = authMiddleware