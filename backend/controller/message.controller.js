import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js"; // io는 생성된 socket.io 서버를 가져옴
import connectToMysqlDB from "../db/connectToMysqlDB.js";

export const sendMessage = async (req, res) => {
  console.log("sendMessage");
  try {
    const { message } = req.body;
    const { roomId, userId } = req.params; // 보낼때 receiverId는 상대방의 아이디

    const getUserAndWriterIds = await fetchUserAndWriterIds(roomId);
    const { user_id, writer_id } = await getUserAndWriterIds();

    if (![user_id, writer_id].includes(Number(userId))) {
      return res.status(403).json({ message: "권한이 없습니다." });
    }

    const senderId = req.user.user_id; // 보낼때 senderId는 나의 아이디
    const receiverId = user_id === senderId ? writer_id : user_id;

    console.log(senderId, receiverId);

    let conversation = await Conversation.findOne({
      chatRoomId: roomId,
      participants: { $all: [Number(senderId), Number(receiverId)] }, // senderId와 receiverId를 모두 포함하는 conversation을 찾음 $all은 mongoDB에서 모두 포함하는 것을 찾을 때 사용
    });
    
    if (conversation == null) {
      conversation = await Conversation.create({
        // conversation이 없으면 생성해서 데이터베이스에 저장 create하면 new하고 save를 한번에 하는 것과 같음
        chatRoomId: roomId,
        participants: [Number(senderId), Number(receiverId)],
      });
    }

    const newMessage = new Message({
      senderId: Number(senderId),
      receiverId: Number(receiverId),
      message,
      roomId: roomId,
      isRead: false, // 메시지가 처음 전송될 때는 읽지 않은 상태로 설정
    });

    if (newMessage) {
      conversation.messages.push(newMessage);
    } else {
      return res.status(400).json({ message: "메시지 전송 실패" });
    }

    await Promise.all([newMessage.save(), conversation.save()]); // Promise.all을 사용하여 두 save를 동시에 실행

    //* 소켓 IO가 올 자리
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // 그냥 emit은 전체, io.to는 특정 소켓에만 보내는 것
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    const mysqlConnection = await connectToMysqlDB();
    const sqlQuery = `UPDATE chat_room 
                      SET modified_date = NOW()
                      WHERE id = ?`;
    mysqlConnection.query(sqlQuery, [roomId], (err, response) => {
      if (err) {
        console.error("에러: ", err);
        return res.status(500).json({ message: "메시지 업데이트 중 오류가 발생했습니다." });
      }
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "메시지 전송 중 오류가 발생했습니다." });
  }
};

export const getMessages = async (req, res) => {
  console.log("getMessages");
  try {
    const { roomId, userId } = req.params; // roomId는 상대방과의 대화방의 아이디
    const getUserAndWriterIds = await fetchUserAndWriterIds(roomId);
    const { user_id, writer_id } = await getUserAndWriterIds();

    if (![user_id, writer_id].includes(Number(userId))) {
      return res.status(403).json({ message: "권한이 없습니다." });
    }

    const senderId = req.user.user_id; // 받을때 senderId는 상대방의 아이디
    const receiverId = user_id === senderId ? writer_id : user_id;

    let conversation = await Conversation.findOne({
      chatRoomId: roomId,
      participants: { $all: [Number(senderId), Number(receiverId)] },
    }).populate("messages"); // conversation을 찾고 그 conversation에 있는 저장된 messages를 가져옴

    if (!conversation) {
      return res.status(200).json([]);
    }

    // 메시지를 읽음 상태로 업데이트
    const unreadMessages = conversation.messages.filter(msg => !msg.isRead && msg.receiverId === senderId);
    for (let msg of unreadMessages) {
      msg.isRead = true;
      await msg.save(); // 각 메시지를 개별적으로 저장
    }

    res.status(200).json(conversation.messages);

  } catch (error) {
    res.status(500).json({ message: "메시지 불러오기 중 오류가 발생했습니다." });
  }
};

export const getLastAndUnreadMessages = async (req, res) => {
  console.log("getLastAndUnreadMessages");
  try {
    const { roomId, userId } = req.params; // roomId는 상대방과의 대화방의 아이디
    const getUserAndWriterIds = await fetchUserAndWriterIds(roomId);
    const { user_id, writer_id } = await getUserAndWriterIds();

    if (![user_id, writer_id].includes(Number(userId))) {
      return res.status(403).json({ message: "권한이 없습니다." });
    }

    let messages = await Message.find({
      roomId: roomId,
    }).sort({ createdAt: -1 });

    if (messages.length === 0) {
      return res.status(200).json({ unreadCount: 0, lastMessage: "" });
    }

    const unreadCount = messages.filter(msg => msg.receiverId == userId && !msg.isRead).length;
    const lastMessage = messages[0].message;
    const modifiedDate = messages[0].createdAt;
    console.log(modifiedDate);
    res.status(200).json({ unreadCount, lastMessage, modifiedDate });

  } catch (error) {
    res.status(500).json({ message: "메시지 불러오기 중 오류가 발생했습니다." });
  }
}


async function fetchUserAndWriterIds(roomId) {
  const mysqlConnection = await connectToMysqlDB();
  const sqlQuery = `SELECT user_id, writer_id
                      FROM chat_room 
                      LEFT JOIN article ON chat_room.article_id = article.article_id 
                      WHERE chat_room.id = ?`;

  const getUserAndWriterIds = () => {
    return new Promise((resolve, reject) => {
      mysqlConnection.query(sqlQuery, [roomId], (err, response) => {
        if (err) {
          console.error("에러: ", err);
          return reject(err);
        }
        
        const user_id = response[0]?.user_id;
        const writer_id = response[0]?.writer_id;
        resolve({ user_id, writer_id });
      });
    });
  };
  return getUserAndWriterIds;
}
