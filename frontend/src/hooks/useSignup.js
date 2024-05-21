import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const {setAuthUser} =useAuthContext();

  const signup = async (inputs) => {
    const success = handleInputErrors(inputs);
    if (!success) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const data = await response.json();
      console.log(data);

      if(data.error){
        toast.error(data.error);
        throw new Error(data.error);
      }
      if (response.status === 400) {
        toast.error(data.message);
      }

      if (response.status === 201) {
        toast.success("회원가입 성공!");
        // localStorage에 저장
        localStorage.setItem("chat-user", JSON.stringify(data));
        // context에 저장
        setAuthUser(data);
      }



    } catch (error) {
      toast.error(error.message);
    }finally {
      setLoading(false);
    }
  };

  return { loading, signup };
};

export default useSignup;

function handleInputErrors(inputs) {
  if (!inputs.fullName || !inputs.username || !inputs.password || !inputs.confirmPassword || !inputs.gender) {
    toast.error("모든 필드를 입력하세요.");
    return false;
  }
  if (inputs.password !== inputs.confirmPassword) {
    toast.error("비밀번호가 일치하지 않습니다.");
    return false;
  }

  if (inputs.password.length < 6) {
    toast.error("비밀번호는 6자 이상이어야 합니다.");
    return false;
  }
  return true;
}

