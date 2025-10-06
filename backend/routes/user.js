const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const gameController = require("../controller/gameController");

router.post("/collection", userController.addToCollection);
router.get("/collection", userController.getCollection);

router.delete("/collection/:gameId", userController.removeFromCollection);

module.exports = router;
