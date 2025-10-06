const User = require("../models/User");

exports.addToCollection = async (req, res) => {
    console.log("--- 'Add to Collection' endpoint hit ---");
    console.log("User attached by auth middleware:", req.user);
    console.log("Data received in request body:", req.body);

    try {
        const { gameId } = req.body;
        const userId = req.user.id;

        if (!gameId) {
            return res.status(400).json({ msg: "Game ID is required." });
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { collection: gameId } },
            { new: true }
        );

        if (!updatedUser) {
            console.error(`!!! FAILED TO FIND USER WITH ID: ${userId} !!!`);
            return res
                .status(404)
                .json({ msg: "User not found, could not update collection." });
        }

        res.status(200).json({ msg: "Game added to collection." });
    } catch (err) {
        console.error("!!! ERROR in addToCollection:", err.message);
        res.status(500).send("Server Error");
    }
};

exports.getCollection = async (req, res) => {
    try {
        console.log("--- RUNNING FINAL FIX with .lean() ---");

        const user = await User.findById(req.user.id).lean();

        if (!user) {
            return res.status(404).json({ msg: "User not found." });
        }

        res.json(user.collection);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.removeFromCollection = async (req, res) => {
    try {
        const { gameId } = req.params;
        const userId = req.user.id;

        await User.updateOne(
            { _id: userId },
            { $pull: { collection: gameId } }
        );

        res.status(200).json({ msg: "Game removed from collection." });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
