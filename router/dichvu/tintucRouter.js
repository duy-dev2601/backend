const express = require("express");
const TinTuc = require("../../model/model_dichvu/tintuc");
const app = express.Router();
app.use(express.json());

// Tất cả tin tức
app.get("/tintuc", async (req, res) => {
  try {
    const news = await TinTuc.find({});
    res.status(200).send(news);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

// Lấy 1 tin tức
app.get("/tintuc/:id", async (req, res) => {
  try {
    const news = await TinTuc.findById(req.params.id);
    if (!news) {
      return res.status(404).send({ message: "Tin tức không tồn tại" });
    }
    res.status(200).send(news);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

// Thêm tin tức
app.post("/tintuc", async (req, res) => {
  const { TenTinTuc, image, NoiDung } = req.body;

  if (!TenTinTuc || !image || !NoiDung) {
    return res.status(400).send({
      message: "Các trường TenTinTuc, image và NoiDung là bắt buộc.",
    });
  }

  try {
    const news = new TinTuc({ TenTinTuc, image, NoiDung });
    await news.save();
    res.status(201).send(news);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

// Xóa tin tức
app.delete("/tintuc/:id", async (req, res) => {
  try {
    const news = await TinTuc.findByIdAndDelete(req.params.id);
    if (!news) {
      return res.status(404).send({ message: "Tin tức không tồn tại" });
    }
    res.status(200).send(news);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

// Sửa tin tức
app.put("/tintuc/:id", async (req, res) => {
  const { TenTinTuc, image, NoiDung } = req.body;
  if (!TenTinTuc && !image && !NoiDung) {
    return res
      .status(400)
      .send({ message: "Cần ít nhất một trường để cập nhật." });
  }

  try {
    const news = await TinTuc.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!news) {
      return res.status(404).send({ message: "Tin tức không tồn tại" });
    }
    res.status(200).send(news);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

module.exports = app;
