import nodemailer from "nodemailer";
import { env } from "../config/env";

interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
}

export const sendEmail = async ({
  to,
  subject,
  text,
}: SendEmailParams): Promise<void> => {
  if (!to) {
    throw new Error("Recipient email (to) is missing");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: env.emailUser,
      pass: env.emailPassword,
    },
  });

  await transporter.sendMail({
    from: env.emailUser,
    to: to,
    subject: subject,
    text: text,
  });

  console.log("📧 Gmail OTP email sent successfully");
};
