import {createContext, useState, useContext} from 'react';

// 자동완성을 위해 createContext를 사용하여 AuthContext를 생성
export const AuthContext = createContext({
    authUser: null,
    setAuthUser: () => {}
  });

// AuthContext를 간편하게 사용할 수 있도록 useAuthContext 후크를 생성
// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  return useContext(AuthContext);
}


export const AuthContextProvider = ({children}) => {
  const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem('chat-user')) || null);

  return (
    <AuthContext.Provider value={{authUser, setAuthUser}}>
      {children}
    </AuthContext.Provider>
  );
}