const express = require("express");
const HinhThucThanhToan = require("../../model/model_hoadon/hinhthucthanhtoan");
const app = express.Router();
app.use(express.json());

// Thêm hình thức thanh toán
app.post("/hinhthucthanhtoan", async (req, res) => {
  const { TenHinhThuc } = req.body;

  if (!TenHinhThuc) {
    return res
      .status(400)
      .send({ message: "Tên hình thức thanh toán là bắt buộc." });
  }

  const hinhThucThanhToan = new HinhThucThanhToan({ TenHinhThuc });

  try {
    await hinhThucThanhToan.save();
    res.status(201).send(hinhThucThanhToan);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

// Lấy danh sách hình thức thanh toán
app.get("/hinhthucthanhtoan", async (req, res) => {
  try {
    const hinhThucList = await HinhThucThanhToan.find();
    res.status(200).send(hinhThucList);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Lỗi máy chủ", error: error.message });
  }
});

// Lấy một hình thức thanh toán theo ID
app.get("/hinhthucthanhtoan/:id", async (req, res) => {
  try {
    const hinhThuc = await HinhThucThanhToan.findById(req.params.id);
    if (!hinhThuc) {
      return res
        .status(404)
        .send({ message: "Hình thức thanh toán không tồn tại" });
    }
    res.status(200).send(hinhThuc);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

// Cập nhật thông tin hình thức thanh toán
app.put("/hinhthucthanhtoan/:id", async (req, res) => {
  try {
    const hinhThuc = await HinhThucThanhToan.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!hinhThuc) {
      return res
        .status(404)
        .send({ message: "Hình thức thanh toán không tồn tại" });
    }
    res.status(200).send(hinhThuc);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

// Xóa hình thức thanh toán
app.delete("/hinhthucthanhtoan/:id", async (req, res) => {
  try {
    const hinhThuc = await HinhThucThanhToan.findByIdAndDelete(req.params.id);
    if (!hinhThuc) {
      return res
        .status(404)
        .send({ message: "Hình thức thanh toán không tồn tại" });
    }
    res.status(200).send(hinhThuc);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

module.exports = app;
