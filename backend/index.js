const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const connectDB = require("./config/db");
const authroutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const profileRoutes = require("./routes/profileRoutes");
const speechToTextRoutes = require("./routes/speechToTextRoutes");
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// auth routes
app.use("/api/auth", authroutes);
app.use("/api/profile/", profileRoutes)
// resume routes
app.use("/api/resume", resumeRoutes);
app.use('/api', speechToTextRoutes);
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
