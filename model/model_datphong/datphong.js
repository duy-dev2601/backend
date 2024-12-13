const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const datPhongSchema = new Schema(
  {
    id_khachhang: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Khachhang", // Kiểm tra tên model này
      required: true,
    },
    id_nhanvien: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", // Đổi từ "NhanVien" thành "Admin"
      required: true,
    },
    NgayDat: { type: Date, required: true },
    NgayDen: { type: Date, required: true },
    NgayDi: { type: Date, required: true },
    YeuCau_DacBiet: { type: String, required: true },
    SoNguoiLon: { type: Number, required: true },
    SoTreEm: { type: Number, required: true },
    HinhThucDatPhong: {
      type: String,
      enum: ["Trực Tiếp", "Qua Điện Thoại", "Đặt qua trang web"],
      required: true,
    },
    TrangThaiDatPhong: {
      type: String,
      enum: ["Đã Đặt", "Đang Chờ", "Đã Hủy"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DatPhong", datPhongSchema);
