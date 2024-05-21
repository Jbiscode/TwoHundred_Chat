import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    //! LMS에서는 같은 기수사람들의 정보를 가져와보자.
    const loggedInUser = req.user._id; // protectRoute 미들웨어를 통해 req.user에 로그인한 유저 정보가 담겨있음
    
    // $ne는 not equal을 의미!! 나만 제외하고 다른 유저들을 가져옴
    const filterUsers = await User.find({ _id: { $ne: loggedInUser } }).select("-password"); // password를 제외한 모든 정보를 가져옴/원하는 정보들만 가져올 수도 있음

    res.status(200).json(filterUsers);
  } catch (error) {
    res.status(500).json({ message: "유저 정보를 불러오는 중 오류가 발생했습니다." });
  }
}