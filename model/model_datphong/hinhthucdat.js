// model_datphong/hinhthucdat.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HinhThucDatSchema = new Schema(
  {
    tenHinhThuc: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("HinhThucDat", HinhThucDatSchema);
