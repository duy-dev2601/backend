const mongoose = require("mongoose");

const nhanVienSchema = new mongoose.Schema(
  {
    TenNhanVien: { type: String, required: true },
    ChucVu: { type: String, required: true },
    DiaChi: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true, unique: true },
    SoDienThoai: { type: String, required: true },
    lichTruc: { type: String, required: true },
    role: {
      type: String,
      enum: ["staff", "admin"],
      default: "staff",
    },
  },
  {
    timestamps: true,
  }
);

const NhanVien = mongoose.model("NhanVien", nhanVienSchema);

module.exports = NhanVien;
