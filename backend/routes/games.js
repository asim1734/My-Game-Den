const express = require("express");
const router = express.Router();
const gameController = require("../controller/gameController");

router.get("/top-games", gameController.getTopGamesController);

router.get("/new-releases", gameController.getNewReleasesController);

router.get("/upcoming", gameController.getUpcomingGamesController);

module.exports = router;
