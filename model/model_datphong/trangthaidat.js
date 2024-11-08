// model_datphong/trangthaidat.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const trangThaiDatSchema = new Schema(
  {
    tenTrangThai: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TrangThaiDat", trangThaiDatSchema);
