import User from "../models/user.model.js";
import connectToMysqlDB from "../db/connectToMysqlDB.js";

export const getUsersForSidebar = async (req, res) => {
  let results;
  try {
    //! LMS에서는 같은 기수사람들의 정보를 가져와보자.
    const mysqlConnection = await connectToMysqlDB();
    
    mysqlConnection.connect( () => {
      const sqlQuery = `SELECT chat_room.id,
                                  chat_room.user_id,
                                  chat_room.created_date,
                                  chat_room.modified_date AS chat_modified_date,
                                  article.*
                                  , writer.username AS writer_name
                                  , user.username AS user_name
                                  , product_image.thumbnail_url AS thumbnail_url
                        FROM chat_room 
                        LEFT JOIN article 
                          ON chat_room.article_id = article.article_id 
                        LEFT JOIN product_image
                          ON article.article_id = product_image.article_id
                        LEFT JOIN user AS writer
                          ON article.writer_id = writer.user_id
                        LEFT JOIN user AS user
                          ON chat_room.user_id = user.user_id
                        WHERE thumbnail_url IS NOT NULL AND (article.writer_id = ? OR chat_room.user_id = ?)
                        ORDER BY chat_modified_date DESC`;
      mysqlConnection.query(sqlQuery, [req.user.user_id, req.user.user_id], (err, response) => {
        if (err) {
          console.error("에러: ", err);
          return;
        }

        res.status(200).json(response);
      });
    });

    // const loggedInUser = req.user._id; // protectRoute 미들웨어를 통해 req.user에 로그인한 유저 정보가 담겨있음
    
    // $ne는 not equal을 의미!! 나만 제외하고 다른 유저들을 가져옴
    // const filterUsers = await User.find({ _id: { $ne: loggedInUser } }).select("-password"); // password를 제외한 모든 정보를 가져옴/원하는 정보들만 가져올 수도 있음
    // res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "유저 정보를 불러오는 중 오류가 발생했습니다." });
  }
}