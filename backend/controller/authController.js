const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res
            .status(400)
            .json({ message: "Please enter both username and password." });
    }
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const payload = {
            user: {
                id: user.id,
            },
        };
        jwt.sign(
            payload,
            process.env.JWT_ACCESS_TOKEN,
            { expiresIn: "3h" },
            (err, token) => {
                if (err) {
                    throw err;
                }
                res.status(200).json({ message: "Login succesful", token });
            }
        );
        console.log("USer logged in ");
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Server Error" });
    }
};
const registerUser = async (req, res) => {
    const { email, username, password } = req.body;
    if (!username || !password || !email) {
        return res.status(400).json({ message: "Please enter all the fields" });
    }
    try {
        const usernameCheck = await User.findOne({ username: username });
        if (usernameCheck) {
            return res.status(400).json({ message: "Username already Taken" });
        }
        const emailCheck = await User.findOne({ email: email });
        if (emailCheck) {
            return res.status(400).json({ message: "Email already in use" });
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const user = new User({
            username,
            email,
            passwordHash,
        });
        await user.save();
        console.log("New user registered");
        return res.status(201).json("Registration Succcesful");
    } catch (e) {
        return res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    loginUser,
    registerUser,
};
