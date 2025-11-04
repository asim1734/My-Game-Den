const User = require("../models/User");
const defaultLists = ["collection", "wishlist"];

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
            { $addToSet: { "lists.$.games": gameId } } // $addToSet prevents duplicate game IDs
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

exports.createList = async (req, res) => {
    const { name } = req.body;
    const userId = req.user.id;

    if (!name || name.trim().length === 0) {
        return res.status(400).json({ msg: "List name is required." });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found." });
        }

        const listExists = user.lists.some(
            (list) => list.name.toLowerCase() === name.toLowerCase()
        );

        if (listExists) {
            return res
                .status(400)
                .json({ msg: "A list with this name already exists." });
        }

        const newList = { name: name.trim(), games: [] };
        user.lists.push(newList);
        await user.save();

        res.status(201).json(newList);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.deleteList = async (req, res) => {
    const { listName } = req.params;
    const userId = req.user.id;

    if (defaultLists.includes(listName.toLowerCase())) {
        return res.status(400).json({ msg: "Cannot delete a default list." });
    }

    try {
        const result = await User.updateOne(
            { _id: userId },
            { $pull: { lists: { name: listName } } }
        );

        if (result.modifiedCount === 0) {
            return res
                .status(404)
                .json({ msg: "List not found or already deleted." });
        }

        res.status(200).json({
            msg: `List '${listName}' deleted successfully.`,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.renameList = async (req, res) => {
    const { listName } = req.params;
    const { newName } = req.body;
    const userId = req.user.id;

    if (!newName || newName.trim().length === 0) {
        return res.status(400).json({ msg: "New list name is required." });
    }

    if (defaultLists.includes(listName.toLowerCase())) {
        return res.status(400).json({ msg: "Cannot rename a default list." });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found." });
        }

        const listExists = user.lists.some(
            (list) => list.name.toLowerCase() === newName.toLowerCase()
        );
        if (listExists) {
            return res
                .status(400)
                .json({ msg: "A list with this name already exists." });
        }

        const result = await User.updateOne(
            { _id: userId, "lists.name": listName },
            { $set: { "lists.$.name": newName.trim() } }
        );

        if (result.modifiedCount === 0) {
            return res
                .status(404)
                .json({ msg: `List '${listName}' not found.` });
        }

        res.status(200).json({ msg: `List renamed to '${newName}'.` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
