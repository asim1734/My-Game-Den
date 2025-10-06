const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.get("/lists", userController.getAllLists);

router.post("/lists/:listName", userController.addGameToList);

router.delete("/lists/:listName/:gameId", userController.removeGameFromList);

module.exports = router;
