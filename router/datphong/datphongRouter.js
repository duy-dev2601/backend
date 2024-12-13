const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const DatPhong = require("../../model/model_datphong/datphong");
const admin = require("../../model/model_admin/admin");
const KhachHang = require("../../model/model_khachhang/user");
const app = express.Router();
app.use(express.json());
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Thêm đặt phòng
app.post("/datphong", async (req, res) => {
  const {
    id_khachhang,
    id_nhanvien,
    NgayDat,
    NgayDen,
    NgayDi,
    YeuCau_DacBiet,
    SoNguoiLon,
    SoTreEm,
    HinhThucDatPhong,
    TrangThaiDatPhong,
  } = req.body;

  // Kiểm tra tính hợp lệ của các tham số
  if (
    !isValidObjectId(id_khachhang) ||
    !isValidObjectId(id_nhanvien) ||
    !NgayDat ||
    !NgayDen ||
    !NgayDi ||
    !YeuCau_DacBiet ||
    !SoNguoiLon ||
    !SoTreEm ||
    !HinhThucDatPhong ||
    !TrangThaiDatPhong
  ) {
    return res
      .status(400)
      .json({ message: "Tất cả các trường là bắt buộc và ID phải hợp lệ." });
  }

  // Tạo đối tượng đặt phòng
  const datPhong = new DatPhong({
    id_khachhang: new mongoose.Types.ObjectId(id_khachhang),
    id_nhanvien: new mongoose.Types.ObjectId(id_nhanvien),
    NgayDat,
    NgayDen,
    NgayDi,
    YeuCau_DacBiet,
    SoNguoiLon,
    SoTreEm,
    HinhThucDatPhong,
    TrangThaiDatPhong,
  });

  try {
    // Lưu vào cơ sở dữ liệu
    const savedDatPhong = await datPhong.save();
    // Trả về id_datphong
    res.status(201).json({ id_datphong: savedDatPhong._id });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
});
// Hiện thị datphong
app.get("/datphong", async (req, res) => {
  try {
    const datPhongList = await DatPhong.find()
      .populate("id_khachhang", "tenkhachhang email phone address")
      .populate("id_nhanvien", "TenNhanVien ChucVu DiaChi Email SoDienThoai");

    res.status(200).json(datPhongList);
  } catch (error) {
    console.error("Error fetching booking list:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
});
// Lấy 1 đặt phòng theo ID
app.get("/datphong/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "ID không hợp lệ." });
  }

  try {
    const datPhong = await DatPhong.findById(id)
      .populate("id_khachhang", "tenkhachhang email phone address")
      .populate("id_nhanvien", "TenNhanVien ChucVu DiaChi Email SoDienThoai");

    if (!datPhong) {
      return res.status(404).json({ message: "Đặt phòng không tồn tại" });
    }

    res.status(200).json(datPhong);
  } catch (error) {
    console.error("Error fetching booking by ID:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
});

// Xóa đặt phòng
app.delete("/datphong/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "ID không hợp lệ." });
  }

  try {
    const datPhong = await DatPhong.findByIdAndDelete(id);
    if (!datPhong) {
      return res.status(404).json({ message: "Đặt phòng không tồn tại" });
    }
    res.status(200).json({ message: "Xóa thành công", datPhong });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
});

// Sửa thông tin đặt phòng
app.put("/datphong/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "ID không hợp lệ." });
  }

  try {
    const datPhong = await DatPhong.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!datPhong) {
      return res.status(404).json({ message: "Đặt phòng không tồn tại" });
    }
    res.status(200).json(datPhong);
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
});

// Lấy danh sách đặt phòng theo khách hàng
app.get("/datphong/khachhang/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "ID không hợp lệ." });
  }

  try {
    const datPhongList = await DatPhong.find({ id_khachhang: id })
      .populate("id_khachhang", "tenkhachhang email phone address")
      .populate("id_nhanvien", "TenNhanVien ChucVu DiaChi Email SoDienThoai");
    if (datPhongList.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy đặt phòng cho khách hàng này." });
    }

    res.status(200).json(datPhongList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
});

module.exports = app;
