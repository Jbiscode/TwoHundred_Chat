import mongoose from "mongoose";

const conversationSchema = mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: [],
    }
  ]
}, { timestamps: true }); // 이속성으로 생성일자와 수정일자를 자동으로 생성.

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;