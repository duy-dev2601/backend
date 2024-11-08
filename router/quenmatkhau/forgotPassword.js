const express = require("express");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcryptjs = require("bcryptjs");
const User = require("../../model/model_khachhang/user");
const app = express();
app.use(express.json());
function validateEmail(email) {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
}
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email || !validateEmail(email)) {
    return res.status(400).send("Địa chỉ email không hợp lệ");
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send("Người dùng không tồn tại");
  }
  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();
  console.log("Generated Token:", resetToken);
  console.log("Expires At:", user.resetPasswordExpires);
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "duyldnps32006@fpt.edu.vn",
      pass: "xqkp kkmp cjjz zrgo",
    },
  });
  const resetUrl = `http://localhost:3002/reset-password/${resetToken}`;
  console.log("Reset URL:", resetUrl);
  const content = `
    <div style="padding: 10px; background-color: #4caf50">
      <div style="padding: 10px; background-color: white;">
        <h4 style="color: #0085ff">Đặt lại mật khẩu</h4>
        <p>Vui lòng nhấp vào liên kết bên dưới để đặt lại mật khẩu của bạn:</p>
        <a href="${resetUrl}">${resetUrl}</a>
      </div>
    </div>
  `;
  const mainOptions = {
    from: "duyldnps32006@fpt.edu.vn",
    to: email,
    subject: "Đặt lại mật khẩu",
    html: content,
  };
  transporter.sendMail(mainOptions, (err, info) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Lỗi khi gửi email: " + err);
    } else {
      console.log("Mail sent: " + info.response);
      return res
        .status(200)
        .send("Một email đã được gửi đến tài khoản của bạn");
    }
  });
});
app.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res
      .status(400)
      .send(
        "Token không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu một liên kết mới."
      );
  }
  // Mã hoá password mới
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(newPassword, salt);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return res.status(200).send("Mật khẩu đã được đặt lại thành công");
});

app.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).send("Token không hợp lệ hoặc đã hết hạn");
  }
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(newPassword, salt);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  return res.status(200).send("Mật khẩu đã được đặt lại thành công");
});
app.get("/reset-password/:token", async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).send(`
      <h1>Token không hợp lệ hoặc đã hết hạn</h1>
      <p>Vui lòng yêu cầu một liên kết đặt lại mật khẩu mới.</p>
      <a href="/forgot-password">Quay lại</a>
    `);
  }
  res.send(`
    <form action="/reset-password/${token}" method="POST">
      <label for="newPassword">Mật khẩu mới:</label>
      <input type="password" name="newPassword" required>
      <button type="submit">Đặt lại mật khẩu</button>
    </form>
  `);
});
module.exports = app;
