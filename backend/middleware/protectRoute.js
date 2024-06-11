import jwt from "jsonwebtoken";
import connectToMysqlDB from "../db/connectToMysqlDB.js";
// import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split("Bearer ")[1];

    if (!token) {
      return res.status(401).json({ message: "토큰이 없습니다." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "토큰이 유효하지않습니다." });
    }

    const connection = await connectToMysqlDB();
    connection.connect((err) => {
      if (err) {
        return res.status(500).json({ message: "데이터베이스 연결에 실패했습니다." });
      }

      connection.query("SELECT * FROM user WHERE user_id = ?", [decoded.userid], (error, results) => {
        if (error) {
          return res.status(500).json({ message: "유저를 찾을 수 없습니다." });
        }

        const user = results.length > 0 ? results[0] : null;

        if (user === null) {
          return res.status(404).json({ message: "해당 유저가 없습니다." });
        }

        // console.log(user);
        req.user = user;
        next();
      });
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.log(error.message);
      return res.status(401).json({ message: "토큰이 만료되었습니다." });
    }
    console.log(error.message);
    return res.status(500).json({ message: "인증에 실패했습니다." });
  }
}

export default protectRoute;