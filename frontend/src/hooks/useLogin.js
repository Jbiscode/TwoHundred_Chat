import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const login = async (username, password) => {
    const success = handleInputErrors(username, password);
    if (!success) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      });
      const data = await response.json();

      if (response.status === 400 || response.status === 500) {
        throw new Error(data.message);
      }

      if (response.status === 200) {
        localStorage.setItem('chat-user', JSON.stringify(data));
        setAuthUser(data);
        toast.success('로그인 성공!');
      }

    
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};

export default useLogin;

function handleInputErrors(username, password) {
  if (!username || !password) {
    toast.error("모든 필드를 입력하세요.");
    return false;
  }

  if (password.length < 6) {
    toast.error("비밀번호는 6자 이상이어야 합니다.");
    return false;
  }
  return true;
}