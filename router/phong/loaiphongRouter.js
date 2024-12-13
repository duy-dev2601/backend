const express = require("express");
const loaiphong = require("../../model/model_phong/loaiphong");
const phong = require("../../model/model_phong/phong");
const app = express.Router();
app.use(express.json());

// Tất cả loại phòng với tùy chọn lọc theo số lượng
app.get("/loaiphong", async (req, res) => {
  try {
    const { soLuong } = req.query;
    let query = {};
    if (soLuong) {
      query.soLuong = { $gte: parseInt(soLuong) };
    }

    const lp = await loaiphong.find(query);
    res.status(200).send(lp);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

app.get("/loaiphong/:id", async (req, res) => {
  try {
    const lp = await loaiphong.findById(req.params.id);
    if (!lp) {
      return res.status(404).send({ message: "Loại phòng không tồn tại" });
    }
    const countPhong = await phong.countDocuments({ loaiPhongId: lp._id });
    const response = {
      id: lp._id,
      tenLoai: lp.tenLoai,
      soLuong: lp.soLuong,
      tienNghi: lp.tienNghi,
      giaTien: lp.giaTien,
      soLuongPhong: countPhong,
    };

    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});
// Thêm loại phòng
app.post("/loaiphong", async (req, res) => {
  const { tenLoai, soLuong, tienNghi, giaTien } = req.body;

  if (!tenLoai || !soLuong || !giaTien) {
    return res.status(400).send({
      message: "Các trường tenLoai, soLuong và giaTien là bắt buộc.",
    });
  }

  try {
    const lp = new loaiphong({ tenLoai, soLuong, tienNghi, giaTien });
    await lp.save();
    res.status(201).send(lp);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

// Xóa loại phòng
app.delete("/loaiphong/:id", async (req, res) => {
  try {
    const lp = await loaiphong.findByIdAndDelete(req.params.id);
    if (!lp) {
      return res.status(404).send({ message: "Loại phòng không tồn tại" });
    }
    res.status(200).send(lp);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

// Sửa loại phòng
app.put("/loaiphong/:id", async (req, res) => {
  const { tenLoai, soLuong, tienNghi, giaTien } = req.body;
  if (!tenLoai && !soLuong && !tienNghi && !giaTien) {
    return res
      .status(400)
      .send({ message: "Cần ít nhất một trường để cập nhật." });
  }
  try {
    const lp = await loaiphong.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!lp) {
      return res.status(404).send({ message: "Loại phòng không tồn tại" });
    }
    res.status(200).send(lp);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

module.exports = app;
