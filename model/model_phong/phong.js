const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const phongSchema = new Schema(
  {
    tenPhong: { type: String, required: true },
    tang: { type: Number, required: true },
    image: [{ type: String }],
    moTa: { type: String },
    id_loaiphong: {
      type: Schema.Types.ObjectId,
      ref: "LoaiPhong",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Phong", phongSchema);
