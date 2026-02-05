import axios from "axios";
import { env } from "../config/env.js";

interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
}: SendEmailParams): Promise<void> => {
  if (!to) {
    throw new Error("Recipient email (to) is missing");
  }

  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: env.emailUser,
          name: env.emailName,
        },
        to: [{ email: to }],
        subject,
        textContent: text,
        htmlContent: html || `<p>${text}</p>`,
      },
      {
        headers: {
          "api-key": env.brevoApiKey,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("📧 Email sent successfully via Brevo");
  } catch (error: any) {
    console.error("Email failed:", error.response?.data || error.message);
    throw error;
  }
};
