import mongoose, { Document, Schema } from "mongoose";

export interface ILog extends Document {
  level: "info" | "error" | "warn" | "debug";
  message: string;
  method?: string;
  url?: string;
  statusCode?: number;
  responseTime?: string;
  stack?: string;
}

const LogSchema: Schema = new Schema(
  {
    level: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    method: String,
    url: String,
    statusCode: Number,
    responseTime: String,
    stack: String,
  },
  { timestamps: true },
);

export default mongoose.model<ILog>("Server Logs", LogSchema);
