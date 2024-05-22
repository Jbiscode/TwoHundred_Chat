import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages } = useConversation();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      newMessage.Shakeit = true; // 새로운 메시지가 왔을 때 흔들림 효과를 주기 위해 Shakeit 프로퍼티를 추가
      setMessages([...messages, newMessage]);
    });

    // 마운트 해제 시 리스너 제거 그래야만 채팅을 나갔을때 메시지를 받지 않음
    return () => {
      socket?.off("newMessage"); 
    };
  }, [socket, setMessages, messages]);
};

export default useListenMessages;
