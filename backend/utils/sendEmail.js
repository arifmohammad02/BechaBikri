import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * এই ফাংশনটি এখন স্মার্টলি চেক করবে আপনি কি অবজেক্ট পাঠিয়েছেন নাকি আলাদা আলাদা প্যারামিটার।
 */
const sendEmail = async (params, subjectParam, textParam, htmlParam) => {
  let to, subject, text, html;

  // যদি প্রথম প্যারামিটারটি একটি অবজেক্ট হয় (যেমন অর্ডারের ক্ষেত্রে ব্যবহার করছেন)
  if (typeof params === "object" && params !== null && !Array.isArray(params)) {
    ({ to, subject, text, html } = params);
  } else {
    // যদি আপনি সরাসরি createUser থেকে পাঠাতে চান (যেমন: sendEmail(to, subject, text, html))
    to = params;
    subject = subjectParam;
    text = textParam;
    html = htmlParam;
  }

  try {
    const msg = {
      to,
      from: process.env.FROM_EMAIL, // আপনার ভেরিফাইড সেন্ডার ইমেইল
      subject,
      text,
      html,
    };

    await sgMail.send(msg);
    console.log(`✅ Email sent successfully to: ${to}`);
  } catch (error) {
    console.error(
      `❌ SendGrid Error for ${to}:`,
      error.response?.body?.errors || error.message,
    );
    // ইন্টারনাল এরর থ্রো করা যাতে কন্ট্রোলার বুঝতে পারে ইমেইল ফেইল হয়েছে
    throw new Error("Email delivery failed");
  }
};

export default sendEmail;
