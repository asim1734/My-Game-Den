const express = require("express");
const router = express.Router();
const gameController = require("../controller/gameController");

router.get("/getDefaultGames", gameController.getDefaultGames);

module.exports = router;
