const express = require("express");
const HoaDon = require("../../model/model_hoadon/hoadon");
const CT_DatPhong = require("../../model/model_datphong/ct_datphong");
const NhanVien = require("../../model/model_nhanvien/nhanvien");
const HinhThucThanhToan = require("../../model/model_hoadon/hinhthucthanhtoan");
const app = express.Router();
app.use(express.json());
// Thêm hóa đơn
app.post("/hoadon", async (req, res) => {
  const { id_ct_datphong, id_nhanvien, id_hinhthucthanhtoan, NgayLap } =
    req.body;
  const ctDatPhongRecord = await CT_DatPhong.findById(id_ct_datphong);
  const nhanVienRecord = await NhanVien.findById(id_nhanvien);
  const hinhThucThanhToanRecord = await HinhThucThanhToan.findById(
    id_hinhthucthanhtoan
  );
  if (!ctDatPhongRecord || !nhanVienRecord || !hinhThucThanhToanRecord) {
    return res.status(400).send({ message: "Các tham chiếu không hợp lệ." });
  }
  const newHoaDon = new HoaDon({
    id_ct_datphong,
    id_nhanvien,
    id_hinhthucthanhtoan,
    NgayLap,
    TongTien: 0,
  });
  try {
    await newHoaDon.save();
    res.status(201).send(newHoaDon);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});
// Lấy danh sách hóa đơn
app.get("/hoadon", async (req, res) => {
  try {
    const hoaDonList = await HoaDon.find()
      .populate("id_ct_datphong", "id_datphong id_phong")
      .populate({
        path: "id_ct_datphong",
        populate: [
          {
            path: "id_datphong",
            select:
              " id_khachhang NgayDat NgayDen NgayDi SoNguoiLon SoTreEm HinhThucDatPhong TrangThaiDatPhong YeuCau_DacBiet",
          },
          { path: "id_phong", select: "tenPhong image gia moTa" },
          {
            path: "id_sudungdichvu",
            select: "id_dichvu TenDichVu GiaDichVu NgaySuDung SoLuong GiaTien",
          },
        ],
      })
      .populate("id_nhanvien", "TenNhanVien ChucVu Email SoDienThoai")
      .populate("id_hinhthucthanhtoan", "TenHinhThuc")
      .exec();

    res.status(200).send(hoaDonList);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error: error.message });
  }
});
// Lấy hóa đơn theo ID
app.get("/hoadon/:id", async (req, res) => {
  try {
    const hoaDon = await HoaDon.findById(req.params.id)
      .populate("id_ct_datphong", "id_datphong id_phong")
      .populate({
        path: "id_ct_datphong",
        populate: [
          {
            path: "id_datphong",
            select: "NgayDat NgayDen NgayDi YeuCau_DacBiet",
          },
          { path: "id_phong", select: "tenPhong tang gia" },
          { path: "id_sudungdichvu", select: "id_dichvu" },
        ],
      })
      .populate("id_nhanvien", "TenNhanVien ChucVu Email SoDienThoai")
      .populate("id_hinhthucthanhtoan", "TenHinhThuc")
      .exec();

    if (!hoaDon) {
      return res.status(404).send({ message: "Hóa đơn không tồn tại" });
    }
    res.status(200).send(hoaDon);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});
app.put("/hoadon/:id", async (req, res) => {
  const { id_ct_datphong, id_nhanvien, id_hinhthuc_thanhtoan, NgayLap } =
    req.body;

  try {
    // Kiểm tra sự tồn tại của các tham chiếu nếu có thay đổi
    const invalidReferences = [];

    if (id_ct_datphong) {
      const ctDatPhongRecord = await CT_DatPhong.findById(id_ct_datphong);
      if (!ctDatPhongRecord) invalidReferences.push("id_ct_datphong");
    }
    if (id_nhanvien) {
      const nhanVienRecord = await NhanVien.findById(id_nhanvien);
      if (!nhanVienRecord) invalidReferences.push("id_nhanvien");
    }
    if (id_hinhthuc_thanhtoan) {
      const hinhThucThanhToanRecord = await HinhThucThanhToan.findById(
        id_hinhthuc_thanhtoan
      );
      if (!hinhThucThanhToanRecord)
        invalidReferences.push("id_hinhthuc_thanhtoan");
    }

    if (invalidReferences.length > 0) {
      return res.status(400).send({
        message: "Các tham chiếu không hợp lệ:",
        invalidReferences: invalidReferences,
      });
    }

    // Cập nhật hóa đơn
    const hoaDon = await HoaDon.findByIdAndUpdate(
      req.params.id,
      { id_ct_datphong, id_nhanvien, id_hinhthuc_thanhtoan, NgayLap },
      { new: true, runValidators: true }
    );

    if (!hoaDon) {
      return res.status(404).send({ message: "Hóa đơn không tồn tại" });
    }

    res.status(200).send(hoaDon);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});
// Xóa hóa đơn
app.delete("/hoadon/:id", async (req, res) => {
  try {
    const hoaDon = await HoaDon.findByIdAndDelete(req.params.id);
    if (!hoaDon) {
      return res.status(404).send({ message: "Hóa đơn không tồn tại" });
    }
    res.status(200).send(hoaDon);
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ", error });
  }
});

module.exports = app;
