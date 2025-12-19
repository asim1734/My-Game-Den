const express = require("express");
const router = express.Router();
const reviewController = require("../controller/reviewController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/my-reviews", reviewController.getMyReviews);
router.get("/game/:gameId", reviewController.getUserReviewForGame);
router.post("/", reviewController.addOrUpdateReview);
router.delete("/game/:gameId", reviewController.deleteReview);
router.get("/community/:gameId", reviewController.getCommunityReviews);

module.exports = router;