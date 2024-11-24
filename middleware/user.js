const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");
function userMiddleware(req, res, next) {
    const token = req.header.token;
    const decoded = jwt.verify(token, JWT_USER_PASSWORD);

    if(jwt.decoded) {
        req.user = decoded.id;
        next()
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
   
}
module.exports = {
    userMiddleware: userMiddleware
}