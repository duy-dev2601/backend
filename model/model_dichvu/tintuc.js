const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tinTucSchema = new Schema(
  {
    TenTinTuc: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    NoiDung: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TinTuc", tinTucSchema);
