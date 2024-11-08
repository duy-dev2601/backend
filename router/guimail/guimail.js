var express = require("express");
const nodemailer = require("nodemailer");
var app = express();
app.post("/send-mail", function (req, res) {
  let { tenhd, customer, email, ngaytao, tongtien, CTHD } = req.body;
  let text = "";
  text += "<table border=1 width = 100%><tr>";
  text +=
    "<td>Tensp</td><td>GiaSP</td><td>x</<td><td>SoLuong</td><td>=</td><td>Tiên</td>";
  text += "</tr>";
  CTHD.forEach((e) => {
    text += "<tr>";
    text += "<td>" + e.name + "</td>";
    text += "<td>" + e.price + "</td>";
    text += "<td>x</td>";
    text += "<td>" + e.quantity + "</td>";
    text += "<td>=</td>";
    text += "<td>" + e.price * e.quantity + "</td>";
    text += "</tr>";
  });
  text += "</table>";
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "duyldnps32006@fpt.edu.vn",
      pass: "",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  var content = "";
  content += `
        <div style="padding: 10px; background-color: #4caf50"> <div style="padding: 10px; background-color: white;">
            <h4 style="color: #0085ff">Đây là hoá đơn thanh toán của bạn</h4>
                <span style="color: black">Hóa Đơn: ${tenhd}</span><br/>
                <span style="color: black">Khách Hàng: ${customer}</span><br/>
                <span style="color: black">Email: ${email}</span><br/>
                <span style="color: black">Ngày Tao HD: ${ngaytao}</span><br/>
                <span style="color: black">Tổng Tiền: ${tongtien}</span><br/>
                <span style="color: black">Danh sách SP</span><br/>
                <span style="color: black"> ${text}</span><br/>
            </div>
        </div>
    `;
  var mainOptions = {
    from: "duyldnps32006@fpt.edu.vn",
    to: "duyldnps32006@fpt.edu.vn",
    subject: "Test Nodemailer",
    text: "Hoá đơn mua hàng", 
    html: content,
  };
  transporter.sendMail(mainOptions, function (err, info) {
    if (err) {
      console.log(err);
      req.flash("mess", "Lỗi gửi mail: " + err);
      res.redirect("/");
    } else {
      console.log("Message sent: " + info.response);
      req.flash("mess", "Một email đã được gửi đến tài khoản của bạn");
      res.redirect("/");
    }
  });
});

module.exports = app;
