const mongoose = require("mongoose");

const KhachhangSchema = new mongoose.Schema({
  tenkhachhang: { type: String, required: true },
  photoLink: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  role: {
    type: String,
    enum: ["user"],
    default: "user",
    required: true,
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

const KhachhangModel =
  mongoose.models.Khachhang || mongoose.model("Khachhang", KhachhangSchema);

module.exports = KhachhangModel;
