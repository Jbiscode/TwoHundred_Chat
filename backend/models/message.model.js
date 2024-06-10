import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId:{
    type: Number,
    required: true,
  },
  receiverId:{
    type: Number,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  roomId: {
    type: Number,
    required: true,
  },
  isRead: {
    type: Boolean,
    // default: false,
  },
}, { timestamps: true }); // 이 속성으로 생성일자와 수정일자를 자동으로 생성해줍니다.

const Message = mongoose.model("Message", messageSchema);

export default Message;