const mongoose = require("mongoose");

const hinhThucThanhToanSchema = new mongoose.Schema({
  TenHinhThuc: { type: String, required: true },
});

const HinhThucThanhToan = mongoose.model(
  "HinhThucThanhToan",
  hinhThucThanhToanSchema
);

module.exports = HinhThucThanhToan;
