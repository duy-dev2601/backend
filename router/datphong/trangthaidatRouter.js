const express = require("express");
const TrangThaiDat = require("../../model/model_datphong/trangthaidat"); // Đảm bảo sử dụng tên 'TrangThaiDat'
const app = express.Router();
app.use(express.json());

// Thêm trạng thái
app.post("/trangthaidat", async (req, res) => {
  const { tenTrangThai } = req.body;

  if (!tenTrangThai) {
    return res.status(400).send({
      message: "Trường tenTrangThai là bắt buộc.",
    });
  }
  
  const trangThai = new TrangThaiDat({ // Sử dụng TrangThaiDat ở đây
    tenTrangThai,
  });
  
  try {
    await trangThai.save();
    res.status(201).send(trangThai);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

// Lấy danh sách trạng thái
app.get("/trangthaidat", async (req, res) => {
  try {
    const trangThaiList = await TrangThaiDat.find(); // Sử dụng TrangThaiDat
    res.status(200).send(trangThaiList);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Lỗi máy chủ", error: error.message });
  }
});

// Lấy 1 trạng thái
app.get("/trangthaidat/:id", async (req, res) => {
  try {
    const trangThai = await TrangThaiDat.findById(req.params.id); // Sử dụng TrangThaiDat
    if (!trangThai) {
      return res.status(404).send({ message: "Trạng thái không tồn tại" });
    }
    res.status(200).send(trangThai);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

// Sửa trạng thái
app.put("/trangthaidat/:id", async (req, res) => {
  try {
    const trangThai = await TrangThaiDat.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!trangThai) {
      return res.status(404).send({ message: "Trạng thái không tồn tại" });
    }
    res.status(200).send(trangThai);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

// Xóa trạng thái
app.delete("/trangthaidat/:id", async (req, res) => {
  try {
    const trangThai = await TrangThaiDat.findByIdAndDelete(req.params.id); // Sử dụng TrangThaiDat
    if (!trangThai) {
      return res.status(404).send({ message: "Trạng thái không tồn tại" });
    }
    res.status(200).send(trangThai);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

module.exports = app;