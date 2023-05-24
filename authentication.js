const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  // Get the token from the request header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Verify the token
  jwt.verify(token, "secret", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Set the user ID in the request object
    req.userId = decoded.id;

    next();
  });
};
module.exports = authentication;
