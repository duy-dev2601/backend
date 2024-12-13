const mongoose = require("mongoose");

const hoaDonSchema = new mongoose.Schema({
  id_ct_datphong: { type: mongoose.Schema.Types.ObjectId, ref: "CT_DatPhong" },
  id_hinhthucthanhtoan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HinhThucThanhToan",
  },
  NgayLap: { type: Date, required: true },
  TongTien: { type: Number, required: true },
});

const HoaDon = mongoose.model("HoaDon", hoaDonSchema);

module.exports = HoaDon;
