const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) {
        return res.status(401).json({ message: "No token, Authorization failed" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
        req.user = decoded.user;
        next();
    } catch (e) {
        res.status(401).json({ message: "Token is not valid." });
    }
};

const optionalAuth = (req, res, next) => {
    const token = req.header("x-auth-token");

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
        req.user = decoded.user;
        next();
    } catch (err) {
        req.user = null;
        next();
    }
};

module.exports = { protect, optionalAuth };