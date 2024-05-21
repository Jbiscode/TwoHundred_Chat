import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routers.js';
import messageRoutes from './routes/message.routers.js';
import connectToMongoDB  from './db/connectToMongoDB.js';
import cookieParser from 'cookie-parser'; // 쿠키 파서 미들웨어가 있어야 쿠키를 불러 올 수 있다.

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json()); // to parse the incoming requests with JSON payloads (from request.body)
app.use(cookieParser()); // 쿠키파서 미들웨어 추가

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);



app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${PORT}`);
});
