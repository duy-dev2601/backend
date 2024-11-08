
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const loaiPhongSchema = new Schema(
  {
    tenLoai: { type: String, required: true },
    soLuong: { type: Number, required: true },
    tienNghi: { type: String },
    giaTien: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LoaiPhong", loaiPhongSchema);
