const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const authRouter = require("./routes/auth");
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

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
});
