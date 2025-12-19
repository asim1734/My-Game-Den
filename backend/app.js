const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const authRouter = require("./routes/auth");
const gamesRouter = require("./routes/games");
const userRouter = require("./routes/user");
const reviewRouter = require("./routes/review");
const authMiddleware = require("./middleware/authMiddleware");

const PORT = process.env.PORT || 3000; // Render will provide the PORT automatically 
const app = express();

// --- SECURE CORS CONFIGURATION ---
const corsOptions = {
    // FRONTEND_URL will be your Vercel URL in production 
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    optionsSuccessStatus: 200
};

app.use(express.json());
app.use(cors(corsOptions)); 
app.use(morgan("dev"));

const uri = process.env.MONGODB_URI; // Reference .env variable 

mongoose
    .connect(uri)
    .then(() => console.log("MongoDB connection established!"))
    .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRouter);
app.use("/api/games", gamesRouter);
app.use("/api/users", authMiddleware, userRouter);
app.use("/api/reviews", authMiddleware, reviewRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});