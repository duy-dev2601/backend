const mongoose = require("mongoose");

const sudungDichvuSchema = new mongoose.Schema(
  {
    id_dichvu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DichVu",
      required: true,
    },
    CT_DatPhong: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CT_DatPhong",
      required: true,
    },
    NgaySuDung: { type: String, required: true },
    SoLuong: { type: String, required: true },
    GiaTien: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SuDungDichVu", sudungDichvuSchema);
