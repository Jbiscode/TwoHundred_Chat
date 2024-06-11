import mysql from "mysql";
import jwt from "jsonwebtoken";

const connectToMysqlDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_DB_HOST,
      port: process.env.MYSQL_DB_PORT,
      user: process.env.MYSQL_DB_USER,
      password: process.env.MYSQL_DB_PASSWORD,
      database: process.env.MYSQL_DB_DATABASE,
    });
    console.log("MySQL DB Connected");
    return connection;
  } catch (error) {
    console.log("Error connecting to MySQL DB", error);
  }
};

const verifyTokenAndCheckUser = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const userId = decoded.userid;

    const connection = await connectToMysqlDB();
    connection.query("SELECT * FROM user WHERE user_id = ?", [userId], (error, results) => {
      if (error) {
        throw new Error("쿼리 실행 중 오류가 발생했습니다.");
      }

      if (results.length === 0) {
        throw new Error("권한이 없는 사용자입니다.");
      } else {
        // return "권한이 확인되었습니다.";
        console.log(results);
      }
    });
  } catch (error) {
    return Promise.reject("토큰 검증 실패: " + error.message);
  }
};


export { verifyTokenAndCheckUser };

export default connectToMysqlDB;
