// Environment Variable Connection
import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT as string,
  mongoUri: process.env.MONGO_URI as string,
  jwtSecret: process.env.JWT_SECRET_KEY as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN as "1h" | "7d" | "30m",
  nodeEnv: process.env.NODE_ENV as string,
  emailUser: process.env.EMAIL_USER as string,
  emailPassword: process.env.EMAIL_PASS as string,
  supabasePublicUrl: process.env.VITE_SUPABASE_URL as string,
  supabaseServiceKey: process.env.VITE_SUPABASE_SERVICE_ROLE_KEY as string,
  supabaseBucket: process.env.VITE_SUPABASE_BUCKET as string,
  brevoUser: process.env.BREVO_SMTP_USER as string,
  brevoPass: process.env.BREVO_SMTP_PASS as string
};
