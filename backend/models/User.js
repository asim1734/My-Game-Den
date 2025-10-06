// models/User.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            minlength: 4,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: [/.+@.+\..+/],
        },
        passwordHash: {
            type: String,
            required: true,
            minlength: 8,
        },
        collection: {
            type: [Number],
            default: [],
        },
        wishlist: {
            type: [Number],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
