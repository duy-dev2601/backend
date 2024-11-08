const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TrangThaiSchema = new Schema(
  {
    tenTrangThai: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("TrangThai", TrangThaiSchema);