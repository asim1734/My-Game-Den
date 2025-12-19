const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        gameId: {
            type: Number, 
            required: true,
        },
        gameTitle: {
            type: String, 
            required: true,
        },
        gameCover: {
            type: String, 
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        content: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

reviewSchema.index({ user: 1, gameId: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);