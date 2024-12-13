const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const Khachhang = require("../../model/model_khachhang/user");
const NhanVien = require("../../model/model_admin/admin");
const verifyToken = require("../../middleware/token");
const upload = require("../upload");

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
  const {
    tenkhachhang,
    email,
    password,
    phone,
    address,
    photoLink, // Nhận photoLink từ yêu cầu
  } = req.body;

  // Mặc định role là "user", không cần phải gửi role từ client
  const role = "user";

  try {
    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await Khachhang.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng." });
    }

    // Mã hóa mật khẩu
    const hashPassword = await bcryptjs.hash(password, 10);

    // Tạo người dùng mới
    const khachhang = new Khachhang({
      tenkhachhang,
      email,
      phone,
      password: hashPassword,
      address,
      role, // Role mặc định là "user"
      photoLink, // Lưu liên kết hình ảnh vào cơ sở dữ liệu
    });

    // Lưu người dùng vào cơ sở dữ liệu
    await khachhang.save();

    // Trả về phản hồi thành công
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
  const { email, password } = req.body;

  try {
    const user = await Khachhang.findOne({ email });
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

// Lấy thông tin người dùng
router.get("/user", verifyToken, async (req, res) => {
  try {
    if (req.role === "admin" || req.role === "employee") {
      const userList = await Khachhang.find();
      return res.status(200).json(userList);
    } else if (req.role === "user") {
      const user = await Khachhang.findById(req.userId);
      if (!user) {
        return res.status(404).send({ message: "Không tìm thấy người dùng." });
      }
      return res.status(200).json(user);
    } else {
      return res.status(403).send("Bạn không có quyền truy cập.");
    }
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error: error.message });
  }
});

// Hiện dữ liệu theo ID
router.get("/user/:id", verifyToken, async (req, res) => {
  try {
    if (req.role !== "admin" && req.userId !== req.params.id) {
      return res.status(403).json({ message: "Không có quyền truy cập." });
    }
    const user = await Khachhang.findById(req.params.id, "-password");
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

// Xóa người dùng
router.delete("/user/:id", verifyToken, async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Chỉ admin mới có thể xoá người dùng." });
    }

    const deletedUser = await Khachhang.findByIdAndDelete(req.params.id);
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

//123
router.put("/user/:id", verifyToken, async (req, res) => {
  try {
    if (req.role !== "admin" && req.userId !== req.params.id) {
      return res.status(403).json({ message: "Không có quyền truy cập." });
    }

    const {
      currentPassword,
      newPassword,
      email,
      tenkhachhang,
      phone,
      address,
      photoLink, // Cập nhật photoLink
    } = req.body;

    // Tìm người dùng
    const user = await Khachhang.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    // Tạo đối tượng chứa các trường cần cập nhật
    const updatedData = {};

    // Cập nhật các trường nếu có trong body
    if (email) updatedData.email = email;
    if (tenkhachhang) updatedData.tenkhachhang = tenkhachhang;
    if (phone) updatedData.phone = phone;
    if (address) updatedData.address = address;
    if (photoLink) updatedData.photoLink = photoLink; // Cập nhật photoLink nếu có

    // Nếu có mật khẩu mới, băm mật khẩu và cập nhật
    if (newPassword) {
      // Nếu có mật khẩu mới, yêu cầu xác minh mật khẩu hiện tại
      if (!currentPassword) {
        return res.status(400).json({
          message: "Mật khẩu hiện tại là bắt buộc để thay đổi mật khẩu.",
        });
      }

      // Kiểm tra mật khẩu hiện tại nếu có thay đổi mật khẩu
      const isPasswordValid = await bcryptjs.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ message: "Mật khẩu hiện tại không đúng." });
      }

      // Băm mật khẩu mới
      updatedData.password = await bcryptjs.hash(newPassword, 10);
    }

    // Cập nhật thông tin người dùng
    const updatedUser = await Khachhang.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Cập nhật thông tin thành công", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({
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
    const user = await Khachhang.findOne({ email });
    res.status(200).json({ exists: !!user });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Lỗi khi kiểm tra email.", error: error.message });
  }
});

module.exports = router;
