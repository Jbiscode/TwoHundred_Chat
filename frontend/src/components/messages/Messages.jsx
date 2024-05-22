import useGetMassages from "../../hooks/useGetMassages.js";
import Message from "./Message";
import MessageSkeleton from "../skeletons/MessageSkeleton";

const Messages = () => {
  const { messages, loading } = useGetMassages();
  console.log(messages);
  return (
    <div className="px-4 flex-1 overflow-auto">
      {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}

      {!loading && messages.length === 0 && (
        <p className="text-center">메시지를 작성해 대화를 시작해보세요!</p>
      )}
      {!loading &&
        messages.length > 0 &&
        messages.map((message) => <Message key={message} message={message} />)}
    </div>
  );
};
export default Messages;
