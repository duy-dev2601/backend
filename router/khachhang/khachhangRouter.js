const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
const KhachhangModel = require("../../model/model_khachhang/user");
const verifyToken = require("../../middleware/token");
const upload = require("../upload");
const router = express.Router();
require("dotenv").config();

// Thêm hình ảnh
router.post("/upload", upload.single("photourl"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Hình ảnh là bắt buộc." });
  }
  res.status(200).json({ imagePath: req.file.path });
});

// Đăng ký người dùng
router.post("/user/dangky", async (req, res) => {
  try {
    const {
      tenkhachhang,
      email,
      password,
      phone,
      photourl,
      address,
      position,
      role,
    } = req.body;

    if (!["customer", "employee", "manager"].includes(role)) {
      return res.status(400).json({ message: "Role không hợp lệ." });
    }

    const existingUser = await KhachhangModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng." });
    }

    const hashPassword = await bcryptjs.hash(password, 10);

    const khachhang = new KhachhangModel({
      tenkhachhang,
      email,
      phone,
      photourl,
      password: hashPassword,
      address,
      position,
      role,
    });

    await khachhang.save();
    res.status(201).json({ message: "Đăng ký thành công", user: khachhang });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Có lỗi khi đăng ký.", error: error.message });
  }
});

// Đăng nhập
router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await KhachhangModel.findOne({ email });

    if (!user || !(await bcryptjs.compare(password, user.password))) {
      return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const userInfo = user.toObject();
    delete userInfo.password;

    res
      .status(200)
      .json({ message: "Đăng nhập thành công", user: userInfo, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// Hiện dữ liệu tất cả người dùng
router.get("/user", verifyToken, async (req, res) => {
  try {
    const users = await KhachhangModel.find({}, "-password"); // Không trả về password
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Lỗi khi lấy danh sách người dùng.",
        error: error.message,
      });
  }
});

// Hiện dữ liệu theo ID
router.get("/user/:id", verifyToken, async (req, res) => {
  try {
    const user = await KhachhangModel.findById(req.params.id, "-password");
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Lỗi khi tìm kiếm người dùng.", error: error.message });
  }
});

// Xoá dữ liệu
router.delete("/user/:id", verifyToken, async (req, res) => {
  try {
    const deletedUser = await KhachhangModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }
    res
      .status(200)
      .json({ message: `Người dùng có ID ${req.params.id} đã bị xoá.` });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Lỗi khi xoá người dùng.", error: error.message });
  }
});

// Cập nhật thông tin người dùng
router.put("/user/:id", verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword, email } = req.body;
    const user = await KhachhangModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    const isPasswordValid = await bcryptjs.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });
    }

    const hashPassword = await bcryptjs.hash(newPassword, 10);
    const updatedUser = await KhachhangModel.findByIdAndUpdate(
      req.params.id,
      { password: hashPassword, email },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Cập nhật thông tin thành công", user: updatedUser });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Có lỗi xảy ra trong quá trình cập nhật.",
        error: error.message,
      });
  }
});

// Kiểm tra email
router.post("/user/check-email", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email không được để trống." });
  }

  try {
    const user = await KhachhangModel.findOne({ email });
    res.status(200).json({ exists: !!user });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Lỗi khi kiểm tra email.", error: error.message });
  }
});

module.exports = router;
