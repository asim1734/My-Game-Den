const express = require("express");
const authRouter = require("./routes/auth");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());

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
