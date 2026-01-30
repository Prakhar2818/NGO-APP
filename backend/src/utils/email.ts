import nodemailer from "nodemailer";
import { env } from "../config/env.js";

interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: env.emailUser,
    pass: env.emailPassword,
  },

  connectionTimeout: 10_000, // 10 sec
  greetingTimeout: 10_000,
  socketTimeout: 10_000,
});
export const sendEmail = async ({
  to,
  subject,
  text,
}: SendEmailParams): Promise<void> => {
  if (!to) {
    console.warn("Email not sent: recipient missing");
    return;
  }

  try {
    await transporter.sendMail({
      from: `"My App" <${env.emailUser}>`,
      to,
      subject,
      text,
    });

    console.log("📧 Email sent successfully");
  } catch (error) {
    console.error("❌ Email send failed", error);
  }
};
