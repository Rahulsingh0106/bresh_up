const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require('cors');
const connectDB = require("./config/db");
const authroutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const profileRoutes = require("./routes/profileRoutes");
const speechToTextRoutes = require("./routes/speechToTextRoutes");
const roadmapRoute = require('./routes/roadmapRoutes');

dotenv.config();
const app = express();
app.use(cookieParser()); // ✅ Use cookie-parser middleware
app.use(cors({
    origin: "https://bresh-up.vercel.app",  // Frontend URL
    credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// auth routes
app.use("/api/auth", authroutes);
app.use("/api/profile/", profileRoutes)
// resume routes
app.use("/api/resume", resumeRoutes);
// roadmap routes
app.use("/api/roadmap/", roadmapRoute);
app.use('/api', speechToTextRoutes);
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`✅ Server running on port ${port}`));
