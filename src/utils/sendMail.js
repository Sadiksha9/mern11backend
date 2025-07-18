import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.user,
    pass: process.env.pass,
  },
});

// Wrap in an async IIFE so we can use await.
const sendMail = async (email, message) => {
  const info = await transporter.sendMail({
    from: '"Sadiksha KC" <kcneupanesadiksha@gmail.com>',
    to: email,
    subject: "new",
    // text: "Hello world?",
    html: `<b>${message}</b>`,
  });

  console.log("Message sent:", info.messageId);
};

export { sendMail };
