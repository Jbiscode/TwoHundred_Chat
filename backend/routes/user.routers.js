import express from 'express';
import { getUsersForSidebar } from '../controller/user.controller.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

router.get('/', protectRoute, getUsersForSidebar);

export default router;
// 유저의 정보를 가져오는 라우터.
//이 라우터는 protectRoute 미들웨어를 통해 인증을 거친 후에 getUsersForSidebar 함수를 실행. 
//이 함수는 유저의 정보를 가져와서 클라이언트에게 보내주는 역할을 합니다.
