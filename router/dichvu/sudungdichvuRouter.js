const express = require("express");
const SuDungDichVu = require("../../model/model_dichvu/sudungdichvu");
const DichVu = require("../../model/model_dichvu/dichvu");
const CT_DatPhong = require("../../model/model_datphong/ct_datphong");

const app = express.Router();
app.use(express.json());

// Thêm dịch vụ sử dụng
app.post("/sudungdichvu", async (req, res) => {
  const {
    id_dichvu,
    CT_DatPhong: ctDatPhongId,
    NgaySuDung,
    SoLuong,
    GiaTien,
  } = req.body;

  // Kiểm tra dịch vụ có hợp lệ không
  const dichVuRecord = await DichVu.findById(id_dichvu);
  if (!dichVuRecord) {
    return res
      .status(400)
      .send({ message: "Tham chiếu dịch vụ không hợp lệ." });
  }

  // Kiểm tra chi tiết đặt phòng có hợp lệ không
  const ctDatPhongRecord = await CT_DatPhong.findById(ctDatPhongId);
  if (!ctDatPhongRecord) {
    return res
      .status(400)
      .send({ message: "Tham chiếu chi tiết đặt phòng không hợp lệ." });
  }

  const newSuDungDichVu = new SuDungDichVu({
    id_dichvu,
    CT_DatPhong: ctDatPhongId,
    NgaySuDung,
    SoLuong,
    GiaTien,
  });

  try {
    await newSuDungDichVu.save();
    res.status(201).send(newSuDungDichVu);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

// Lấy danh sách dịch vụ đã sử dụng
app.get("/sudungdichvu", async (req, res) => {
  try {
    const suDungDichVuList = await SuDungDichVu.find()
      .populate("id_dichvu", "TenDichVu image GiaDichVu MoTa")
      .populate({
        path: "CT_DatPhong",
        populate: [
          {
            path: "id_phong",
            select: "tenPhong tang image gia moTa trangthai",
          },
          {
            path: "id_datphong",
            select:
              "NgayDat NgayDen NgayDi YeuCau_DacBiet SoNguoiLon SoTreEm HinhThucDatPhong TrangThaiDatPhong",
          },
        ],
      });

    res.status(200).send(suDungDichVuList);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error: error.message });
  }
});

// Lấy thông tin dịch vụ đã sử dụng theo ID
app.get("/sudungdichvu/:id", async (req, res) => {
  try {
    const suDungDichVu = await SuDungDichVu.findById(req.params.id)
      .populate("id_dichvu", "TenDichVu image GiaDichVu MoTa")
      .populate({
        path: "CT_DatPhong",
        populate: [
          {
            path: "id_phong",
            select: "tenPhong tang image gia moTa trangthai",
          },
          {
            path: "id_datphong",
            select:
              "NgayDat NgayDen NgayDi YeuCau_DacBiet SoNguoiLon SoTreEm HinhThucDatPhong TrangThaiDatPhong",
          },
        ],
      });

    if (!suDungDichVu) {
      return res.status(404).send({ message: "Dịch vụ sử dụng không tồn tại" });
    }
    res.status(200).send(suDungDichVu);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

// Sửa thông tin dịch vụ sử dụng
app.put("/sudungdichvu/:id", async (req, res) => {
  try {
    const suDungDichVu = await SuDungDichVu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!suDungDichVu) {
      return res.status(404).send({ message: "Dịch vụ sử dụng không tồn tại" });
    }
    res.status(200).send(suDungDichVu);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

// Xóa dịch vụ sử dụng
app.delete("/sudungdichvu/:id", async (req, res) => {
  try {
    const suDungDichVu = await SuDungDichVu.findByIdAndDelete(req.params.id);
    if (!suDungDichVu) {
      return res.status(404).send({ message: "Dịch vụ sử dụng không tồn tại" });
    }
    res.status(200).send(suDungDichVu);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

module.exports = app;
