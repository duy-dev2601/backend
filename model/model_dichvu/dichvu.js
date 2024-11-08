const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dichVuSchema = new Schema(
  {
    TenDichVu: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    GiaDichVu: {
      type: Number,
      required: true,
    },
    MoTa: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DichVu", dichVuSchema);
