const express = require("express");
const CT_DatPhong = require("../../model/model_datphong/ct_datphong");
const Phong = require("../../model/model_phong/phong");
const DatPhong = require("../../model/model_datphong/datphong");

const app = express.Router();
app.use(express.json());

// Thêm chi tiết đặt phòng
app.post("/ct_datphong", async (req, res) => {
  const { id_phong, id_datphong, YeuCau_DacBiet } = req.body;

  // Kiểm tra các tham chiếu
  const phongRecord = await Phong.findById(id_phong);
  const datphongRecord = await DatPhong.findById(id_datphong);

  if (!phongRecord || !datphongRecord) {
    return res.status(400).send({ message: "Các tham chiếu không hợp lệ." });
  }

  const newCtDatPhong = new CT_DatPhong({
    id_phong,
    id_datphong,
    YeuCau_DacBiet,
  });

  try {
    await newCtDatPhong.save();
    res.status(201).send(newCtDatPhong);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

// Lấy danh sách chi tiết đặt phòng
app.get("/ct_datphong", async (req, res) => {
  try {
    const ctDatPhongList = await CT_DatPhong.find()
      .populate("id_phong", "tenPhong tang image gia moTa trangthai")
      .populate({
        path: "id_datphong",
        select:
          "NgayDat NgayDen NgayDi YeuCau_DacBiet SoNguoiLon SoTreEm HinhThucDatPhong TrangThaiDatPhong",
        populate: [
          { path: "id_khachhang", select: "name email phone" },
          { path: "id_nhanvien", select: "TenNhanVien ChucVu SoDienThoai" },
          { path: "HinhThucDatPhong", select: "tenHinhThuc" }, // Populate cho Hình Thức Đặt Phòng
          { path: "TrangThaiDatPhong", select: "tenTrangThai" }, // Populate cho Trạng Thái Đặt Phòng
        ],
      });

    res.status(200).send(ctDatPhongList);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error: error.message });
  }
});

// Lấy chi tiết theo ID
app.get("/ct_datphong/:id", async (req, res) => {
  try {
    const ctDatPhong = await CT_DatPhong.findById(req.params.id)
      .populate("id_phong", "tenPhong tang image gia moTa trangthai")
      .populate({
        path: "id_datphong",
        select:
          "NgayDat NgayDen NgayDi YeuCau_DacBiet SoNguoiLon SoTreEm HinhThucDatPhong TrangThaiDatPhong",
        populate: [
          { path: "id_khachhang", select: "name email phone" },
          { path: "id_nhanvien", select: "TenNhanVien ChucVu SoDienThoai" },
          { path: "HinhThucDatPhong", select: "tenHinhThuc" }, // Populate cho Hình Thức Đặt Phòng
          { path: "TrangThaiDatPhong", select: "tenTrangThai" }, // Populate cho Trạng Thái Đặt Phòng
        ],
      });

    if (!ctDatPhong) {
      return res
        .status(404)
        .send({ message: "Chi tiết đặt phòng không tồn tại" });
    }
    res.status(200).send(ctDatPhong);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

// Cập nhật thông tin chi tiết đặt phòng
app.put("/ct_datphong/:id", async (req, res) => {
  try {
    const ctDatPhong = await CT_DatPhong.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!ctDatPhong) {
      return res
        .status(404)
        .send({ message: "Chi tiết đặt phòng không tồn tại" });
    }
    res.status(200).send(ctDatPhong);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

// Xóa chi tiết đặt phòng
app.delete("/ct_datphong/:id", async (req, res) => {
  try {
    const ctDatPhong = await CT_DatPhong.findByIdAndDelete(req.params.id);
    if (!ctDatPhong) {
      return res
        .status(404)
        .send({ message: "Chi tiết đặt phòng không tồn tại" });
    }
    res.status(200).send(ctDatPhong);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

module.exports = app;
