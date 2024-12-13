const mongoose = require("mongoose");

const ct_datphongSchema = new mongoose.Schema(
  {
    id_phong: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Phong",
        required: true,
      },
    ],
    id_datphong: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DatPhong",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CT_DatPhong", ct_datphongSchema);
