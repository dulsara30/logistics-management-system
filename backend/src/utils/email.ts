import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendCredentialsEmail = async (
  email: string,
  fullName: string,
  password: string
) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Login Credentials for Logistics Management System",
      text: `Hello ${fullName},\n\nYour login credentials:\nEmail: ${email}\nPassword: ${password}\n\nPlease keep this information secure.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", email, "Message ID:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};