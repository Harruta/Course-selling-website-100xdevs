const jwt = require("jsonwebtoken");


const adminMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Authorization token is required" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, "JWT_ADMIN_PASSWORD"); // Use your actual secret key
        req.userId = decoded.id; // Attach the admin ID to the request
        next();
    } catch (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};

module.exports = {
    adminMiddleware
};
