import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text }) => {
  if (!to) {
    console.warn("Email not sent: 'to' field is empty!");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Order System" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};

export default sendEmail;
