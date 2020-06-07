const nodeMailer = require("nodemailer");
const config = require("config");

exports.sendEmail = async (to, subject, html) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: config.get("email"),
      pass: config.get("password")
    }
  });

  try {
    await transporter.sendMail({
      from: config.get("email"),
      to,
      subject,
      html
    });

    console.log(`Message sent to: ${to}`);
  } catch (err) {
    console.error(err.message);
  }
};
