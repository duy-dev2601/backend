const express = require("express");
const NhanVien = require("../../model/model_nhanvien/nhanvien");
const { hashSync } = require("bcrypt");
const app = express.Router();
app.use(express.json());
// Thêm nhân viên
app.post("/nhanvien", async (req, res) => {
  const { TenNhanVien, ChucVu, DiaChi, Password, Email, SoDienThoai, role } =
    req.body;

  if (!TenNhanVien || !Email) {
    return res.status(400).send({
      message: "Các trường TenNhanVien và Email là bắt buộc.",
    });
  }
  const nv = new NhanVien({
    TenNhanVien,
    ChucVu,
    DiaChi,
    Email,
    Password,
    SoDienThoai,
    role,
  });
  try {
    await nv.save();
    res.status(201).send(nv);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});
// Lấy danh sách nhân viên
app.get("/nhanvien", async (req, res) => {
  try {
    const nhanVienList = await NhanVien.find();
    res.status(200).send(nhanVienList);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Lỗi máy chủ", error: error.message });
  }
});
// Lấy 1 nhân viên
app.get("/nhanvien/:id", async (req, res) => {
  try {
    const nv = await NhanVien.findById(req.params.id);
    if (!nv) {
      return res.status(404).send({ message: "Nhân viên không tồn tại" });
    }
    res.status(200).send(nv);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});
// Xóa nhân viên
app.delete("/nhanvien/:id", async (req, res) => {
  try {
    const nv = await NhanVien.findByIdAndDelete(req.params.id);
    if (!nv) {
      return res.status(404).send({ message: "Nhân viên không tồn tại" });
    }
    res.status(200).send(nv);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});
// Sửa thông tin nhân viên
app.put("/nhanvien/:id", async (req, res) => {
  try {
    const nv = await NhanVien.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!nv) {
      return res.status(404).send({ message: "Nhân viên không tồn tại" });
    }
    res.status(200).send(nv);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});
module.exports = app;
