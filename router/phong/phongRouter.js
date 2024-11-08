const express = require("express");
const Phong = require("../../model/model_phong/phong");
const LoaiPhong = require("../../model/model_phong/loaiphong");
const upload = require("../upload");
const app = express.Router();
app.use(express.json());

// Thêm hình ảnh
app.post("../upload.js", upload.array("images", 4), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send({ message: "Hình ảnh là bắt buộc." });
  }
  const imagePaths = req.files.map((file) => file.path);
  res.status(200).send({ imagePaths });
});

// Thêm phòng
app.post("/phong", async (req, res) => {
  const { tenPhong, tang, moTa, id_loaiphong, image } = req.body;
  const imageUrls = Array.isArray(image) ? image : [];
  if (!tenPhong || !tang || !id_loaiphong) {
    return res.status(400).send({
      message: "Các trường tenPhong, tang và id_loaiphong là bắt buộc.",
    });
  }
  const p = new Phong({
    tenPhong,
    tang,
    image: imageUrls,
    moTa,
    id_loaiphong,
  });

  try {
    await p.save();
    res.status(201).send(p);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

app.get("/phong", async (req, res) => {
  try {
    const phongList = await Phong.find().populate("id_loaiphong");
    res.status(200).send(phongList);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Lỗi máy chủ", error: error.message });
  }
});

// Lấy 1 phòng
app.get("/phong/:id", async (req, res) => {
  try {
    const p = await Phong.findById(req.params.id).populate("id_loaiphong");
    if (!p) {
      return res.status(404).send({ message: "Phòng không tồn tại" });
    }
    res.status(200).send(p);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

// Xóa phòng
app.delete("/phong/:id", async (req, res) => {
  try {
    const p = await Phong.findByIdAndDelete(req.params.id);
    if (!p) {
      return res.status(404).send({ message: "Phòng không tồn tại" });
    }
    res.status(200).send(p);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

// Sửa phòng
app.put("/phong/:id", async (req, res) => {
  try {
    const p = await Phong.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!p) {
      return res.status(404).send({ message: "Phòng không tồn tại" });
    }
    res.status(200).send(p);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

// Lấy danh sách phòng theo loại phòng
app.get("/phong/loaiphong/:id_loaiphong", async (req, res) => {
  const id_loaiphong = req.params.id_loaiphong;
  try {
    const phongList = await Phong.find({ id_loaiphong }).populate(
      "id_loaiphong"
    );
    res.status(200).send(phongList);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

// Lấy danh sách loại phòng và phòng tương ứng
app.get("/loaiphongphong", async (req, res) => {
  try {
    const loaiPhongList = await LoaiPhong.find({}).populate({
      path: "phong",
      model: "Phong",
    });
    res.status(200).send(loaiPhongList);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

module.exports = app;
