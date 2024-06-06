import { Server } from "socket.io"; // 꼭 Server를 가져와야함
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

const io = new Server(server,{
  // cors 설정
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
});

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    const userId = socket.handshake.query.userId;
    if(userId != "undefined"){
        userSocketMap[userId] = socket.id;
    }
    // emit은 이벤트를 보낼때 사용한다. 연결된 모든 클라이언트에게 이벤트를 보낼수있다.
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("user disconnected" , socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

    // // msg로 이벤트를 받을수있다.
    // socket.on("chat message", (msg) => {
    //     console.log("message: " + socket.id);
    //     io.emit("chat message", msg);
    // });
}
);

export {app, io, server};