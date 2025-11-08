const jwt = require("jsonwebtoken");
const {createAccessToken} = require('../utils/tokenUtils')
const config = require('../config.js');

module.exports = async function verifyAuth(req, res, next) {
    const authHeader = req.headers.authorization

	let token;

	if (authHeader && authHeader.startsWith("Bearer ")) {
		token = authHeader.split(" ")[1];
	}

	if (!token) {
		return res.status(401).json({ message: "Authorization token required." })
	}

    try {
		const decoded = jwt.verify(token, config.JWT_SECRET)
		next()
	}
	catch (error) {
        console.log(error)
		if (error.name !== "TokenExpiredError") {
            return res.status(401).json({ error: "Invalid token." });
        }
	}
};