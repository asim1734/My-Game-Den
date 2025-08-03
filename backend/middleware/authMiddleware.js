const { decode } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) {
        return res
            .status(401)
            .json({ message: "No token, Authorization failed" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
        req.user = decoded.user;
        next();
    } catch (e) {
        res.status(401).json({ message: "Token is not valid." });
    }
};
