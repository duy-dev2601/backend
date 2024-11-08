const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  console.log("Verifying token...");
  const token = req.headers["authorization"];
  if (!token) {
    console.log("No token provided.");
    return res.status(403).send("Không có token, truy cập bị từ chối.");
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Token is not valid:", err);
      return res.status(401).send("Token không hợp lệ.");
    }
    req.userId = decoded.id;
    req.role = decoded.role;
    console.log("Token verified successfully.");
    next();
  });
};

module.exports = verifyToken;
