import app from "./app.js";
import connectDB from "./config/db.js";
import { env } from "./config/env.js";
import { initSocket } from "./socket.js";

import http from "http";

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    const port = Number(env.port);

    const server = http.createServer(app);
    initSocket(server);

    server.listen(port, () => {
      console.log(`Server is running on PORT ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
