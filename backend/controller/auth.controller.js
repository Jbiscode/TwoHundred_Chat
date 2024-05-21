import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateJWTAndSetCookie from "../utils/generateJWT.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "비밀번호가 서로 다릅니다." });
    }

    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "중복된 아이디가 존재합니다." });
    }
    // 비밀번호 암호화
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });
    if (newUser) {
      generateJWTAndSetCookie(newUser._id, res);
      try {
        await newUser.save();
      } catch (error) {
        return res
          .status(500)
          .json({ message: "사용자 저장 중 오류가 발생했습니다." });
      }
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "회원가입에 실패했습니다." });
    }
  } catch (error) {
    res.status(500).json({ message: "응답에 실패했습니다." });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res
        .status(400)
        .json({ message: "아이디 또는 비밀번호가 일치하지 않습니다." });
    }

    generateJWTAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ message: "로그인 중 오류가 발생했습니다." });
  }
};

export const logout = (req, res) => {
try {
  res.clearCookie("jwt");
  res.status(200).json({ message: "로그아웃 되었습니다." });
} catch (error) {
  console.log("Error in logout: ", error);
  res.status(500).json({ message: "로그아웃 중 오류가 발생했습니다." });
}
};
