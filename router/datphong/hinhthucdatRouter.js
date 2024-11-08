const express = require("express");
const HinhThucDat = require("../../model/model_datphong/hinhthucdat"); // Đảm bảo sử dụng tên 'HinhThucDat'
const app = express.Router();
app.use(express.json());

// Thêm hình thức đặt
app.post("/hinhthucdat", async (req, res) => {
  const { tenHinhThuc } = req.body;

  if (!tenHinhThuc) {
    return res.status(400).send({
      message: "Trường tenHinhThuc là bắt buộc.",
    });
  }

  const hinhThucDat = new HinhThucDat({ // Sử dụng HinhThucDat ở đây
    tenHinhThuc,
  });
  
  try {
    await hinhThucDat.save();
    res.status(201).send(hinhThucDat);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

// Lấy danh sách hình thức đặt
app.get("/hinhthucdat", async (req, res) => {
  try {
    const hinhThucDatList = await HinhThucDat.find(); // Sử dụng HinhThucDat
    res.status(200).send(hinhThucDatList);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Lỗi máy chủ", error: error.message });
  }
});

// Lấy 1 hình thức đặt
app.get("/hinhthucdat/:id", async (req, res) => {
  try {
    const hinhThucDat = await HinhThucDat.findById(req.params.id); // Sử dụng HinhThucDat
    if (!hinhThucDat) {
      return res.status(404).send({ message: "Hình thức đặt không tồn tại" });
    }
    res.status(200).send(hinhThucDat);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

// Sửa hình thức đặt
app.put("/hinhthucdat/:id", async (req, res) => {
  try {
    const hinhThucDat = await HinhThucDat.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!hinhThucDat) {
      return res.status(404).send({ message: "Hình thức đặt không tồn tại" });
    }
    res.status(200).send(hinhThucDat);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

// Xóa hình thức đặt
app.delete("/hinhthucdat/:id", async (req, res) => {
  try {
    const hinhThucDat = await HinhThucDat.findByIdAndDelete(req.params.id); // Sử dụng HinhThucDat
    if (!hinhThucDat) {
      return res.status(404).send({ message: "Hình thức đặt không tồn tại" });
    }
    res.status(200).send(hinhThucDat);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

module.exports = app;