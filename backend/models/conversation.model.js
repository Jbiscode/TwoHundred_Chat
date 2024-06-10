import mongoose from "mongoose";

const conversationSchema = mongoose.Schema({
  chatRoomId: 
    {
      type: Number,
      unique: true,
      required: true,
    },
  participants: [
    {
      type: Number,
      required: true,
    }
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: [],
    }
  ]
}, { timestamps: true }); // 이 속성으로 생성일자와 수정일자를 자동으로 생성.

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;