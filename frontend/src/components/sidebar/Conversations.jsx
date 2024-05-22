import useGetConversation from "../../hooks/useGetConversation";
import Conversation from "./Conversation";
import { getRandomEmoji } from '../../utils/emojis.js';

const Conversations = () => {
  const { loading, conversations } = useGetConversation();
  console.log(conversations);
  return (
    <div className="py-2 flex flex-col overflow-auto">
      {loading ? (
        <span className="loading loading-lg"></span>
      ) : (
        conversations.map((conversation) => (
          <Conversation
            key={conversation._id}
            conversation={conversation}
            emoji={getRandomEmoji()}
          />
        ))
      )}
    </div>
  );
};
export default Conversations;
