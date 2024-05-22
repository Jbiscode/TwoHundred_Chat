import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  console.log("sendMessage");
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params; // 보낼때 receiverId는 상대방의 아이디
    const senderId = req.user._id; // 보낼때 senderId는 나의 아이디

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }, // senderId와 receiverId를 모두 포함하는 conversation을 찾음 $all은 mongoDB에서 모두 포함하는 것을 찾을 때 사용
    });

    if (!conversation) {
      conversation = await Conversation.create({
        // conversation이 없으면 생성해서 데이터베이스에 저장 create하면 new하고 save를 한번에 하는 것과 같음
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage);
    } else {
      return res.status(400).json({ message: "메시지 전송 실패" });
    }

    //* 소켓 IO가 올 자리

    // await newMessage.save();
    // await conversation.save();
    await Promise.all([newMessage.save(), conversation.save()]); // Promise.all을 사용하여 두 save를 동시에 실행

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "메시지 전송 중 오류가 발생했습니다." });
  }
};

export const getMessages = async (req, res) => {
  console.log("getMessages");
  try {
    const { id: receiverId } = req.params; // 받을때 receiverId는 나의 아이디
    const senderId = req.user._id; // 받을때 senderId는 상대방의 아이디

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages"); // conversation을 찾고 그 conversation에 있는 저장된 messages를 가져옴


    if (!conversation) {
      return res.status(400).json([]);
    }
    
    res.status(200).json(conversation.messages);

    // const messages = await Message.find({
    //   _id: { $in: conversation.messages },
    // });

    // res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "메시지 불러오기 중 오류가 발생했습니다." });
  }
};
