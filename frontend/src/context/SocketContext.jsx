import {createContext, useEffect, useState, useContext} from 'react';
import { useAuthContext } from './AuthContext.jsx';
import io from 'socket.io-client';

export const SocketContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSocketContext = () => {
    return useContext(SocketContext);
}

export const SocketContextProvider = ({children}) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const {authUser} = useAuthContext();

    useEffect(() => {
        if(authUser){
            const newSocket = io("http://localhost:5000", {
                query: {
                    userId: authUser._id
                }
            });

            setSocket(newSocket);

            // socket서버에서 getOnlineUsers 이벤트를 받으면 onlineUsers를 업데이트한다.
            newSocket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            }
            );

            return () => newSocket.close();
        }else{
            if(socket){
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser]);

    return (
        <SocketContext.Provider value={{socket, onlineUsers}}>
            {children}
        </SocketContext.Provider>
    );
}