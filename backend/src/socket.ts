import { Server } from "socket.io";
import http from "http";

let io: Server;

// Initialize server
export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected", socket.id);

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected", socket.id, reason);
    });
  });
};

// Emitter - for donations
export const emitNewDonation = (donation: any) => {
  if (!io) {
    console.warn("Socket must be initialized");
  }

  io.emit("new-donation", donation);
};
