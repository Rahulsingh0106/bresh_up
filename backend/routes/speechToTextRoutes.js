const express = require("express");
const multer = require("multer");
const { transcribeAudio } = require("../utils/speechToText");
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/transcribe", upload.single("audio"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No audio file uploaded" });
    }

    const transcription = await transcribeAudio(req.file.buffer);
    res.json({ transcription });
});

module.exports = router
