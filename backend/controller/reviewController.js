const Review = require("../models/Review");

exports.addOrUpdateReview = async (req, res) => {
    try {
        const { gameId, gameTitle, gameCover, rating, content } = req.body;
        const userId = req.user.id;

        const review = await Review.findOneAndUpdate(
            { user: userId, gameId },
            { 
                rating, 
                content, 
                gameTitle, 
                gameCover 
            },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Get a user's specific review for a game
exports.getUserReviewForGame = async (req, res) => {
    try {
        const { gameId } = req.params;
        const userId = req.user.id;

        const review = await Review.findOne({ user: userId, gameId });
        res.json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Get all reviews for the logged-in user
exports.getMyReviews = async (req, res) => {
    try {
        const userId = req.user.id;
        const reviews = await Review.find({ user: userId }).sort({ updatedAt: -1 });
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Delete a review
exports.deleteReview = async (req, res) => {
    try {
        const { gameId } = req.params;
        const userId = req.user.id;

        const review = await Review.findOneAndDelete({ user: userId, gameId });
        if (!review) return res.status(404).json({ msg: "Review not found" });

        res.json({ msg: "Review deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.getCommunityReviews = async (req, res) => {
    try {
        const { gameId } = req.params;
        const reviews = await Review.find({ gameId })
            .populate("user", "username") 
            .sort({ createdAt: -1 });
        const formattedReviews = reviews.map(review => ({
            id: review._id,
            userName: review.user ? review.user.username : "Anonymous",
            userAvatar: "", 
            rating: review.rating,
            content: review.content,
            createdAt: review.createdAt
        }));

        res.status(200).json(formattedReviews);
    } catch (error) {
        console.error("Error fetching community reviews:", error);
        res.status(500).json({ message: "Server error while fetching reviews" });
    }
};