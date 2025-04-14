const router = require("express").Router()
const authMiddleware = require('../middleware/Auth')

router.get("/", authMiddleware, function (req, res) {
    console.log(req.user)
    res.json({ message: "Profile details fetched successfully.", data: req.user })
})

module.exports = router
