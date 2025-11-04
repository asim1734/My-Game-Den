const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

// --- List Management ---

// GET all lists for a user
router.get("/lists", userController.getAllLists);

// POST (create) a new empty list
router.post("/lists", userController.createList);

// DELETE a specific list
router.delete("/lists/:listName", userController.deleteList);

// PUT (rename) a specific list
router.put("/lists/:listName", userController.renameList);

// --- Game-in-List Management ---

// POST a game to a specific list
router.post("/lists/:listName/games", userController.addGameToList);

// DELETE a game from a specific list
router.delete(
    "/lists/:listName/games/:gameId",
    userController.removeGameFromList
);

module.exports = router;
