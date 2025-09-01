const express = require("express");
const router = express.Router();
const gameController = require("../controller/gameController");

router.get("/default", gameController.getDefaultGames);

module.exports = router;
