const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.get("/lists", userController.getAllLists);
router.post("/lists", userController.createList);
router.delete("/lists/:listName", userController.deleteList);
router.put("/lists/:listName", userController.renameList);
router.post("/lists/:listName/games", userController.addGameToList);
router.delete("/lists/:listName/games/:gameId",userController.removeGameFromList);

module.exports = router;
