const express = require("express");
const TTPhong = require("../../model/model_phong/tt_phong");
const Phong = require("../../model/model_phong/phong");
const trangthai = require("../../model/model_phong/trangthai");

const app = express.Router();
app.use(express.json());

// Thêm tình trạng phòng
app.post("/tinhtrangphong", async (req, res) => {
  const { id_phong, id_trangthai, ngayBatDau, ngayKetThuc } = req.body;
  if (!id_phong || !id_trangthai) {
    return res.status(400).send({
      message: "id_phong và id_trangthai là bắt buộc.",
    });
  }
  const ttPhong = new TTPhong({
    id_phong,
    id_trangthai,
    ngayBatDau,
    ngayKetThuc,
  });

  try {
    await ttPhong.save();
    res.status(201).send(ttPhong);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});
// Lấy danh sách tình trạng phòng
app.get("/tinhtrangphong", async (req, res) => {
  try {
    const ttPhongList = await TTPhong.find()
      .populate("id_phong id_trangthai")
      .populate({
        path: "id_phong",
        populate: {
          path: "id_loaiphong",
        },
      });
    res.status(200).send(ttPhongList);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Lỗi máy chủ", error: error.message });
  }
});
// Lấy 1 tình trạng phòng
app.get("/tinhtrangphong/:id", async (req, res) => {
  try {
    const ttPhong = await TTPhong.findById(req.params.id)
      .populate("id_phong id_trangthai")
      .populate({
        path: "id_phong",
        populate: {
          path: "id_loaiphong",
        },
      });
    if (!ttPhong) {
      return res
        .status(404)
        .send({ message: "Trạng thái phòng không tồn tại" });
    }
    res.status(200).send(ttPhong);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

// Sửa tình trạng phòng
app.put("/tinhtrangphong/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  console.log(`Updating TTPhong with ID: ${id}`);
  console.log(`Update Data:`, updateData);

  try {
    const ttPhong = await TTPhong.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("id_phong id_trangthai")
      .populate({
        path: "id_phong",
        populate: {
          path: "id_loaiphong",
        },
      });

    if (!ttPhong) {
      return res
        .status(404)
        .send({ message: "Trạng thái phòng không tồn tại" });
    }
    res.status(200).send(ttPhong);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});
// Xóa tình trạng phòng
app.delete("/tinhtrangphong/:id", async (req, res) => {
  try {
    const ttPhong = await TTPhong.findByIdAndDelete(req.params.id);
    if (!ttPhong) {
      return res
        .status(404)
        .send({ message: "Trạng thái phòng không tồn tại" });
    }
    res.status(200).send(ttPhong);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

// Lấy danh sách trạng thái phòng theo trạng thái
app.get("/tinhtrangphong/trangthai/:id", async (req, res) => {
  try {
    const { trangthaiId } = req.params;
    const ttPhongList = await TTPhong.find({ id_trangthai: trangthaiId })
      .populate("id_phong")
      .populate({
        path: "id_phong",
        populate: {
          path: "id_loaiphong",
        },
      });

    if (!ttPhongList.length) {
      return res
        .status(404)
        .send({ message: "Không có trạng thái phòng nào với trạng thái này" });
    }
    res.status(200).send(ttPhongList);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

module.exports = app;
