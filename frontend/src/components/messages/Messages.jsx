import { useRef, useEffect } from "react";
import useGetMassages from "../../hooks/useGetMassages.js";
import Message from "./Message";
import MessageSkeleton from "../skeletons/MessageSkeleton";

const Messages = () => {
  const { messages, loading } = useGetMassages();
  const lastMessageRef = useRef();

  useEffect(() => {
    // setTimeout이 없으면 메시지가 렌더링되기 전에 scrollIntoView가 실행되어 제대로 작동하지 않음
    setTimeout(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  console.log(messages);
  return (
    <div className="px-4 flex-1 overflow-auto">
      {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}

      {!loading && messages.length === 0 && (
        <p className="text-center">메시지를 작성해 대화를 시작해보세요!</p>
      )}
      {!loading &&
        messages.length > 0 &&
        messages.map((message) => (
          <div key={message._id} ref={lastMessageRef}>
            <Message message={message} />
          </div>
        ))}
    </div>
  );
};
export default Messages;
