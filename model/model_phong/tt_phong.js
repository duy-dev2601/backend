const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TTPhongSchema = new Schema(
  {
    id_phong: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Phong",
      required: true,
    },
    id_trangthai: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TrangThai",
      required: true,
    },
    ngayBatDau: { type: Date },
    ngayKetThuc: { type: Date },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TT_phong", TTPhongSchema);
