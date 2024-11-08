// model_khachhang.js
const mongoose = require("mongoose");

const KhachhangSchema = new mongoose.Schema({
  tenkhachhang: { type: String, required: true },
  photourl: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  position: { type: String },
  role: {
    type: String,
    enum: ["customer", "employee", "manager"],
    required: true,
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

const KhachhangModel =
  mongoose.models.Khachhang || mongoose.model("Khachhang", KhachhangSchema);

module.exports = KhachhangModel;
