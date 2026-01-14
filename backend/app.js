const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const authRouter = require("./routes/auth");
const gamesRouter = require("./routes/games");
const userRouter = require("./routes/user");
const reviewRouter = require("./routes/review");
const tierListRouter = require("./routes/tierList");

const { protect } = require("./middleware/authMiddleware");

const PORT = process.env.PORT || 3000;
const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    optionsSuccessStatus: 200
};

app.use(express.json());
app.use(cors(corsOptions)); 
app.use(morgan("dev"));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connection established!"))
    .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRouter);
app.use("/api/games", gamesRouter);
app.use("/api/tierlists", tierListRouter); 

app.use("/api/users", protect, userRouter);
app.use("/api/reviews", protect, reviewRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});