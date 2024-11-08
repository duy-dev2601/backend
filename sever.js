const express = require("express");
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/datn")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 3002;
// Người dùng và admin
const khachhangRouter = require("./router/khachhang/khachhangRouter");
const nhanvien = require("./router/nhanvien/nhanvienRouter");
//Phòng
const loaiphongRouter = require("./router/phong/loaiphongRouter");
const phongRouter = require("./router/phong/phongRouter");
const ttPhong = require("./router/phong/tinhtrangphongRouter");
const TrangThai = require("./router/phong/trangthaiRouter");
//Đặt phòng
const datphong = require("./router/datphong/datphongRouter");
const CT_DatPhong = require("./router//datphong/CT_DatPhongRouter");
const trangthaidat = require("./router/datphong/trangthaidatRouter");
const HinhThucDatPhong = require("./router/datphong/hinhthucdatRouter");
//Dịch vụ
const dichvu = require("./router/dichvu/dichvuRouter");
const suDungDichVu = require("./router/dichvu/sudungdichvuRouter");
//Hoá Đơn
const HoaDon = require("./router/hoadon/hoadonRouter");
const HinhThucThanhToan = require("./router/hoadon/hinhthucttRouter");
const tintuc = require("./router/dichvu/tintucRouter");
//Gửi mail, quên mật khẩu
const guimail = require("./router/guimail/guimail");
//passed
const forgotPassword = require("./router/quenmatkhau/forgotPassword");
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json());
// mongoose.connect(url);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/img", express.static(__dirname + "public/img"));
app.use(khachhangRouter);
app.use(phongRouter);
app.use(loaiphongRouter);
app.use(forgotPassword);
app.use(dichvu);
app.use(suDungDichVu);
app.use(CT_DatPhong);
app.use(nhanvien);
app.use(datphong);
app.use(TrangThai);
app.use(ttPhong);
app.use(guimail);
app.use(HoaDon);
app.use(HinhThucThanhToan);
app.use(tintuc);
app.use(trangthaidat);
app.use(HinhThucDatPhong);

app.listen(port, () => console.log(`Đang hoạt động với ${port}`));
