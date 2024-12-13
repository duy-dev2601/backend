const express = require("express");
const HoaDon = require("../../model/model_hoadon/hoadon");
const CT_DatPhong = require("../../model/model_datphong/ct_datphong");
const HinhThucThanhToan = require("../../model/model_hoadon/hinhthucthanhtoan");
const app = express.Router();
const upload = require("../upload");
app.use(express.json());

// Thêm hình ảnh
app.post("../upload.js", upload.array("images", 4), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send({ message: "Hình ảnh là bắt buộc." });
  }
  const imagePaths = req.files.map((file) => file.path);
  res.status(200).send({ imagePaths });
});

// Thêm hóa đơn
app.post("/hoadon", async (req, res) => {
  const { id_ct_datphong, id_hinhthucthanhtoan, NgayLap, TongTien } = req.body;

  const ctDatPhongRecord = await CT_DatPhong.findById(id_ct_datphong);
  const hinhThucThanhToanRecord = await HinhThucThanhToan.findById(
    id_hinhthucthanhtoan
  );

  if (!ctDatPhongRecord || !hinhThucThanhToanRecord) {
    return res.status(400).send({ message: "Các tham chiếu không hợp lệ." });
  }

  const newHoaDon = new HoaDon({
    id_ct_datphong,
    id_hinhthucthanhtoan,
    NgayLap,
    TongTien,
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
      .populate({
        path: "id_ct_datphong",
        populate: [
          {
            path: "id_datphong",
            select:
              "id_khachhang id_nhanvien NgayDat NgayDen NgayDi YeuCau_DacBiet SoNguoiLon SoTreEm HinhThucDatPhong TrangThaiDatPhong",
            populate: {
              path: "id_khachhang",
              select: "tenkhachhang email phone address", // Lấy thông tin cần thiết của khách hàng
            },
          },
          {
            path: "id_phong",
            select: "tenPhong tang image moTa id_loaiphong",
            populate: {
              path: "id_loaiphong",
              select: "tenLoai giaTien", // Lấy trường giá tiền
            },
          },
        ],
      })
      .populate("id_hinhthucthanhtoan", "TenHinhThuc")
      .exec();

    // Kiểm tra nếu danh sách hóa đơn rỗng
    if (!hoaDonList.length) {
      return res.status(404).send({ message: "Không tìm thấy hóa đơn." });
    }

    res.status(200).send(hoaDonList);
  } catch (error) {
    console.error("Error fetching invoices:", error); // Ghi log lỗi
    res.status(500).send({ message: "Lỗi máy chủ", error: error.message });
  }
});

// Lấy hóa đơn theo ID
app.get("/hoadon/:id", async (req, res) => {
  try {
    const hoaDon = await HoaDon.findById(req.params.id)
      .populate({
        path: "id_ct_datphong",
        populate: [
          {
            path: "id_datphong",
            select:
              "id_khachhang id_nhanvien NgayDat NgayDen NgayDi YeuCau_DacBiet SoNguoiLon SoTreEm HinhThucDatPhong TrangThaiDatPhong",
            populate: [
              {
                path: "id_khachhang",
                select: "tenkhachhang",
              },
              {
                path: "id_nhanvien",
                select: "TenNhanVien DiaChi Email SoDienThoai",
              },
            ],
          },
          {
            path: "id_phong",
            select: "tenPhong image moTa id_loaiphong",
            populate: {
              path: "id_loaiphong",
              select: "tenLoai giaTien",
            },
          },
        ],
      })
      .populate("id_hinhthucthanhtoan", "TenHinhThuc")
      .exec();

    if (!hoaDon) {
      return res.status(404).send({ message: "Hóa đơn không tồn tại" });
    }

    console.log("Dữ liệu hóa đơn:", hoaDon); // Log dữ liệu hóa đơn
    res.status(200).send(hoaDon);
  } catch (error) {
    console.error("Lỗi máy chủ:", error);
    res.status(500).send({ message: "Lỗi máy chủ", error: error.message });
  }
});
// Cập nhật hóa đơn
app.put("/hoadon/:id", async (req, res) => {
  const { id_ct_datphong, id_hinhthucthanhtoan, NgayLap, TongTien } = req.body;

  try {
    const invalidReferences = [];

    if (id_ct_datphong) {
      const ctDatPhongRecord = await CT_DatPhong.findById(id_ct_datphong);
      if (!ctDatPhongRecord) invalidReferences.push("id_ct_datphong");
    }
    if (id_hinhthucthanhtoan) {
      const hinhThucThanhToanRecord = await HinhThucThanhToan.findById(
        id_hinhthucthanhtoan
      );
      if (!hinhThucThanhToanRecord)
        invalidReferences.push("id_hinhthucthanhtoan");
    }

    if (invalidReferences.length > 0) {
      return res.status(400).send({
        message: "Các tham chiếu không hợp lệ:",
        invalidReferences: invalidReferences,
      });
    }

    const hoaDon = await HoaDon.findByIdAndUpdate(
      req.params.id,
      { id_ct_datphong, id_hinhthucthanhtoan, NgayLap, TongTien },
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
