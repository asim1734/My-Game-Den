const express = require("express");
const router = express.Router();
const gameController = require("../controller/gameController");

router.get("/top-games", gameController.getTopGames);
router.get("/new-releases", gameController.getNewReleases);
router.get("/upcoming", gameController.getUpcomingGames);
router.get("/:id", gameController.getGameById);

router.post("/by-ids", gameController.getGamesByIds);

module.exports = router;
