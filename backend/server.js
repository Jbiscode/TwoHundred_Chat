import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routers.js';
import messageRoutes from './routes/message.routers.js';
import userRoutes from './routes/user.routers.js';

import connectToMongoDB  from './db/connectToMongoDB.js';
import connectToMysqlDB from './db/connectToMysqlDB.js';
import cookieParser from 'cookie-parser'; // 쿠키 파서 미들웨어가 있어야 쿠키를 불러 올 수 있다.
import {app, server} from './socket/socket.js'; // socket.io를 사용하기 위해 express 서버를 가져옴
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // 자체 인증서 오류 해결
// const app = express(); // 여기서 주석하고 socket.io를 사용하기 위해 위에서 가져옴
const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json()); // to parse the incoming requests with JSON payloads (from request.body)
app.use(cookieParser()); // 쿠키파서 미들웨어 추가

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chatrooms", userRoutes);



server.listen(PORT, () => {
  connectToMongoDB();
  connectToMysqlDB();

  console.log(`Server is running on port ${PORT}`);
});
