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

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

const uri = process.env.MONGODB_URI;

mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() =>
        console.log("MongoDB database connection established successfully!")
    )
    .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRouter);
app.use("/api/games", gamesRouter);
app.use("/api/users",authMiddleware,  userRouter);
app.use("/api/reviews",authMiddleware, reviewRouter);

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
});
