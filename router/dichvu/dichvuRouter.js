const express = require("express");
const DichVu = require("../../model/model_dichvu/dichvu");
const upload = require("../upload");
const app = express.Router();

// Thêm hình ảnh
app.post("/dichvu/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "Hình ảnh là bắt buộc." });
    }
    res.status(200).send({ imagePath: req.file.path });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Lỗi khi tải lên hình ảnh.", error });
  }
});

// Lấy tất cả dịch vụ
app.get("/dichvu", async (req, res) => {
  try {
    const dichVus = await DichVu.find({});
    res.status(200).send(dichVus);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Lấy 1 dịch vụ
app.get("/dichvu/:id", async (req, res) => {
  try {
    const dichVu = await DichVu.findById(req.params.id);
    if (!dichVu) {
      return res.status(404).send({ message: "Dịch vụ không tồn tại." });
    }
    res.status(200).send(dichVu);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Thêm dịch vụ
app.post("/dichvu", async (req, res) => {
  const { TenDichVu, GiaDichVu, MoTa, image } = req.body;
  const data = {
    TenDichVu,
    GiaDichVu,
    MoTa,
    image,
  };

  const newDichVu = new DichVu(data);
  try {
    await newDichVu.save();
    res.status(201).send(newDichVu);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Xóa dịch vụ
app.delete("/dichvu/:id", async (req, res) => {
  try {
    const deletedDichVu = await DichVu.findByIdAndDelete(req.params.id);
    if (!deletedDichVu) {
      return res.status(404).send({ message: "Dịch vụ không tồn tại." });
    }
    res.status(200).send(deletedDichVu);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Sửa dịch vụ
app.put("/dichvu/:id", async (req, res) => {
  try {
    const updatedDichVu = await DichVu.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedDichVu) {
      return res.status(404).send({ message: "Dịch vụ không tồn tại." });
    }
    res.status(200).send(updatedDichVu);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Lấy dịch vụ theo danh mục (nếu có)
app.get("/dichvu/danhmuc/:id_danhmuc", async (req, res) => {
  try {
    const dichVus = await DichVu.find({ id_danhmuc: req.params.id_danhmuc });
    res.status(200).json(dichVus);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = app;
