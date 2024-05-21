import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // 쿠키에서 jwt를 가져옴 (쿠키는 cookie-parser 미들웨어를 통해 req.cookies에 저장됨)

    if (!token) {
      return res.status(401).json({ message: "토큰이 없습니다." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "토큰이 유효하지않습니다." });
    }

    const user = await User.findById(decoded.userId).select("-password"); // 토크에 담긴 userId로 유저를 찾아서 password를 제외한 정보를 가져옴

    if (!user) {
      return res.status(404).json({ message: "해당 유저가 없습니다." });
    }

    // req.user에 user 정보를 넣어줌
    // 이후 sendMessage, getMessages 등의 함수에서 req.user로 유저 정보에 접근 가능
    req.user = user;

    // 다음 미들웨어로 이동
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "인증에 실패했습니다." });
  }
}

export default protectRoute;