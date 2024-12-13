const express = require("express");
const mongoose = require("mongoose"); // Thêm import mongoose
const Admin = require("../../model/model_admin/admin"); // Sử dụng mô hình NhanVien
const { hashSync, compare } = require("bcrypt");
const KhachhangModel = require("../../model/model_khachhang/user");
const verifyToken = require("../../middleware/token");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express.Router();
app.use(express.json());

// Thêm nhân viên
app.post("/admin/dangky", async (req, res) => {
  const { TenNhanVien, ChucVu, DiaChi, Password, Email, SoDienThoai, role } =
    req.body;

  if (!TenNhanVien || !Email) {
    return res.status(400).send({
      message: "Các trường TenNhanVien và Email là bắt buộc.",
    });
  }

  // Kiểm tra xem email đã tồn tại chưa
  const existingAdmin = await Admin.findOne({ Email });
  if (existingAdmin) {
    return res.status(400).send({ message: "Email đã được sử dụng." });
  }

  const hashedPassword = hashSync(Password, 10); // Mã hóa mật khẩu
  const nv = new Admin({
    TenNhanVien,
    ChucVu,
    DiaChi,
    Email,
    Password: hashedPassword,
    SoDienThoai,
    role: role || "staff", // Mặc định là 'staff' nếu không cung cấp
  });

  try {
    await nv.save();
    res
      .status(201)
      .send({ message: "Nhân viên được thêm thành công", Admin: nv });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Lỗi máy chủ", error: error.message });
  }
});

// Đăng nhập
app.post("/admin/dangnhap", async (req, res) => {
  const { Email, Password } = req.body;

  // Kiểm tra xem email và mật khẩu có được nhập hay không
  if (!Email || !Password) {
    return res.status(400).send({
      message: "Vui lòng nhập email và mật khẩu.",
    });
  }

  try {
    // Tìm admin theo email
    const existingAdmin = await Admin.findOne({ Email });

    // Kiểm tra xem admin có tồn tại hay không
    if (!existingAdmin) {
      return res
        .status(401)
        .send({ message: "Email hoặc mật khẩu không đúng." });
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcryptjs.compare(
      Password,
      existingAdmin.Password
    );
    if (!isPasswordValid) {
      return res
        .status(401)
        .send({ message: "Email hoặc mật khẩu không đúng." });
    }

    // Tạo token với id và role
    const token = jwt.sign(
      { id: existingAdmin._id, role: existingAdmin.role }, // Thêm role vào token
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).send({
      message: "Đăng nhập thành công.",
      token,
      admin: {
        id: existingAdmin._id,
        TenNhanVien: existingAdmin.TenNhanVien,
        Email: existingAdmin.Email,
        role: existingAdmin.role, // Đảm bảo role được đưa vào response
      },
    });
  } catch (error) {
    console.error("Lỗi máy chủ:", error);
    res.status(500).send({ message: "Lỗi máy chủ", error: error.message });
  }
});
// Route dành cho admin để lấy danh sách người dùng
app.get("/admin/user", verifyToken, async (req, res) => {
  console.log("JWT_SECRET:", process.env.JWT_SECRET);

  try {
    if (req.role !== "admin") {
      return res.status(403).json({ message: "Không có quyền truy cập." });
    }
    const userList = await KhachhangModel.find();
    return res.status(200).json(userList);
  } catch (error) {
    console.error("Lỗi trong /admin/user route:", error);
    return res
      .status(500)
      .json({ message: "Lỗi máy chủ", error: error.message });
  }
});
// Lấy danh sách nhân viên
app.get("/admin", async (req, res) => {
  try {
    const nhanVienList = await Admin.find().select("-Password"); // Không trả mật khẩu
    res.status(200).send(nhanVienList);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Lỗi máy chủ", error: error.message });
  }
});

// Lấy 1 nhân viên
app.get("/admin/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "ID không hợp lệ." });
  }

  try {
    if (req.role !== "admin") {
      return res.status(403).json({ message: "Không có quyền truy cập." });
    }

    const nv = await Admin.findById(id).select("-Password"); // Không trả mật khẩu
    if (!nv) {
      return res.status(404).send({ message: "Nhân viên không tồn tại" });
    }
    res.status(200).send(nv);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Lỗi máy chủ", error: error.message });
  }
});
// Xóa nhân viên
app.delete("/admin/:id", async (req, res) => {
  try {
    const nv = await Admin.findByIdAndDelete(req.params.id);
    if (!nv) {
      return res.status(404).send({ message: "Nhân viên không tồn tại" });
    }
    res.status(200).send({ message: "Nhân viên đã bị xóa", Admin: nv });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Lỗi máy chủ", error: error.message });
  }
});

// Sửa thông tin nhân viên
app.put("/admin/:id", async (req, res) => {
  try {
    const nv = await Admin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-Password"); // Không trả mật khẩu
    if (!nv) {
      return res.status(404).send({ message: "Nhân viên không tồn tại" });
    }
    res
      .status(200)
      .send({ message: "Thông tin nhân viên đã được cập nhật", Admin: nv });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Lỗi máy chủ", error: error.message });
  }
});

module.exports = app;

// const verifyToken = async (req, res, next) => {
//   const token = req.headers["authorization"]?.split(" ")[1];

//   if (!token) {
//     return res.status(403).send("Không có token, truy cập bị từ chối.");
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.id;
//     req.role = decoded.role; // Gán vai trò từ token

//     // Kiểm tra người dùng trong KhachhangModel
//     const user = await KhachhangModel.findById(req.userId);
//     if (!user) {
//       return res.status(403).send("Bạn không có quyền truy cập.");
//     }

//     // Kiểm tra admin nếu vai trò là admin
//     if (req.role === "admin") {
//       const adminUser = await admin.findById(req.userId);
//       if (!adminUser) {
//         return res.status(403).send("Bạn không có quyền truy cập.");
//       }
//     }

//     next(); // Tiếp tục nếu mọi thứ đều ổn
//   } catch (err) {
//     return res.status(401).send("Token không hợp lệ: " + err.message);
//   }
// };

// module.exports = verifyToken;
