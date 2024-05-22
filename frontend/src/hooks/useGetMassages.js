import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

function useGetMassages() {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/messages/get/${selectedConversation._id}`);
        const data = await response.json();
        if(data.error) throw new Error(data.error);

        setMessages(data);
      } catch (error) {
        toast.error(error.message + " 대화방을 선택해주세요.");
      } finally {
        setLoading(false);
      }
    };

    if (selectedConversation._id) {
      getMessages();
    }
  }, [selectedConversation?._id, setMessages]);

  return { loading, messages };
}

export default useGetMassages;
