import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
}, { timestamps: true }); // 이속성으로 생성일자와 수정일자를 자동으로 생성해줍니다.

const Message = mongoose.model("Message", messageSchema);

export default Message;