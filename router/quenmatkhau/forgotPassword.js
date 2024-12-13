const express = require("express");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcryptjs = require("bcryptjs");
const User = require("../../model/model_khachhang/user");

const app = express();
app.use(express.json());
let otpStore = {};
function validateEmail(email) {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
}

// Endpoint gửi mã OTP
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email || !validateEmail(email)) {
    return res.status(400).send("Địa chỉ email không hợp lệ");
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send("Người dùng không tồn tại");
  }

  // Tạo mã OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  otpStore[email] = { otp, expires: Date.now() + 300000 }; // Hết hạn sau 5 phút
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "duyldnps32006@fpt.edu.vn",
      pass: "xqkp kkmp cjjz zrgo",
    },
  });

 // Gửi mã OTP qua email
const mainOptions = {
  from: "duyldnps32006@fpt.edu.vn",
  to: email,
  subject: "Mã OTP để đặt lại mật khẩu",
  html: `
      <div style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f0f0f0;">
          <div style="max-width: 400px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); text-align: center;">
              <h2 style="color: #333;">Mã OTP của bạn là:</h2>
              <div style="font-size: 24px; font-weight: bold; color: #007bff; letter-spacing: 2px; margin: 20px 0;">${otp}</div>
              <p style="color: #666;">Vui lòng sử dụng mã này để đặt lại mật khẩu của bạn.</p>
              <p style="color: #999; font-size: 12px;">Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
          </div>
      </div>
  `,
};

  transporter.sendMail(mainOptions, (err, info) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Lỗi khi gửi email: " + err);
    } else {
      console.log("Mail sent: " + info.response);
      return res.status(200).send("Mã OTP đã được gửi đến tài khoản của bạn");
    }
  });
});

// Xác thực mã OTP
app.post("/otp", async (req, res) => {
  const { email, otp } = req.body;

  if (
    !otpStore[email] ||
    otpStore[email].otp !== otp ||
    Date.now() > otpStore[email].expires
  ) {
    return res.status(400).send("Mã OTP không hợp lệ hoặc đã hết hạn");
  }

  delete otpStore[email];
  res
    .status(200)
    .send("Xác thực mã OTP thành công. Bạn có thể đặt lại mật khẩu.");
});

// Đặt lại mật khẩu
app.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).send("Người dùng không tồn tại");
  }

  // Mã hóa mật khẩu mới
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(newPassword, salt);
  user.password = hashedPassword;
  await user.save();

  return res.status(200).send("Mật khẩu đã được đặt lại thành công");
});
module.exports = app;
