import useGetConversations from "../../hooks/useGetConversations";
import Conversation from "./Conversation";
import { getRandomEmoji } from '../../utils/emojis.js';

const Conversations = () => {
  const { loading, conversations } = useGetConversations();
  console.log(conversations);
  return (
    <div className="py-2 flex flex-col overflow-auto">
      {loading ? (
        <span className="loading loading-spinner"></span>
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
