import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { toast } from 'react-hot-toast';

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const {setAuthUser} = useAuthContext();

  const logout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);

      if (response.status === 400) {
        throw new Error(data.message);
      }

      if (response.status === 200) {
        localStorage.removeItem("chat-user");
        setAuthUser(null);
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, logout };
}

export default useLogout;