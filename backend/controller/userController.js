const User = require("../models/User");

exports.getAllLists = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).lean();
        if (!user) {
            return res.status(404).json({ msg: "User not found." });
        }
        res.json(user.lists || []);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.addGameToList = async (req, res) => {
    try {
        const { listName } = req.params;
        const { gameId } = req.body;
        const userId = req.user.id;

        const result = await User.updateOne(
            { _id: userId, "lists.name": listName },
            { $addToSet: { "lists.$.games": gameId } }
        );

        if (result.matchedCount === 0) {
            return res
                .status(404)
                .json({ msg: `List '${listName}' not found for this user.` });
        }

        res.status(200).json({ msg: `Game added to ${listName}.` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.removeGameFromList = async (req, res) => {
    try {
        const { listName, gameId } = req.params;
        const userId = req.user.id;

        const result = await User.updateOne(
            { _id: userId, "lists.name": listName },
            { $pull: { "lists.$.games": gameId } }
        );

        if (result.matchedCount === 0) {
            return res
                .status(404)
                .json({ msg: `List '${listName}' not found for this user.` });
        }

        res.status(200).json({ msg: `Game removed from ${listName}.` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
