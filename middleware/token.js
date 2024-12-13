const jwt = require("jsonwebtoken");
const Admin = require("../model/model_admin/admin");
const Khachhang = require("../model/model_khachhang/user");

const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).send("Không có token, truy cập bị từ chối.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.role = decoded.role;
    if (req.role === "admin" || req.role === "staff") {
      const admin = await Admin.findById(req.userId);
      if (!admin) {
        return res.status(403).send("Bạn không có quyền truy cập.");
      }
    } else {
      const user = await Khachhang.findById(req.userId);
      if (!user) {
        return res.status(403).send("Bạn không có quyền truy cập.");
      }
    }
    next();
  } catch (err) {
    return res.status(401).send("Token không hợp lệ: " + err.message);
  }
};

module.exports = verifyToken;
