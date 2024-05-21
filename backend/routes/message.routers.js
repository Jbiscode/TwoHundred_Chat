import express from 'express';
import { sendMessage, getMessages } from '../controller/message.controller.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

router.post('/send/:id',protectRoute, sendMessage); // protectRoute는 미들웨어로서, sendMessage,getMessages 함수를 실행하기 전에 먼저 실행됨
router.get('/get/:id',protectRoute, getMessages);

export default router;