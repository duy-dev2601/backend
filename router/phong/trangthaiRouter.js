const express = require("express");
const TrangThai = require("../../model/model_phong/trangthai"); // Đảm bảo sử dụng tên 'TrangThai'
const app = express.Router();
app.use(express.json());

// Thêm trạng thái
app.post("/trangthai", async (req, res) => {
  const { tenTrangThai } = req.body;

  if (!tenTrangThai) {
    return res.status(400).send({
      message: "Trường tenTrangThai là bắt buộc.",
    });
  }
  const trangThai = new TrangThai({
    // Sử dụng TrangThai ở đây
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
app.get("/trangthai", async (req, res) => {
  try {
    const trangThaiList = await TrangThai.find(); // Sử dụng TrangThai
    res.status(200).send(trangThaiList);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Lỗi máy chủ", error: error.message });
  }
});

// Lấy 1 trạng thái
app.get("/trangthai/:id", async (req, res) => {
  try {
    const trangThai = await TrangThai.findById(req.params.id); // Sử dụng TrangThai
    if (!trangThai) {
      return res.status(404).send({ message: "Trạng thái không tồn tại" });
    }
    res.status(200).send(trangThai);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

// Sửa trạng thái
app.put("/trangthai/:id", async (req, res) => {
  try {
    const trangThai = await TrangThai.findByIdAndUpdate(
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
app.delete("/trangthai/:id", async (req, res) => {
  try {
    const trangThai = await TrangThai.findByIdAndDelete(req.params.id); // Sử dụng TrangThai
    if (!trangThai) {
      return res.status(404).send({ message: "Trạng thái không tồn tại" });
    }
    res.status(200).send(trangThai);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

module.exports = app;
