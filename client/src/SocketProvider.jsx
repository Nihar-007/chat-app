import { io } from 'socket.io-client';
import  { createContext, useMemo, useContext } from 'react';

const SocketContext = createContext(null);

export const useSocket = () => {
    const socket = useContext(SocketContext);
    if (!socket) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return socket;
}

export const SocketProvider = (props) => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    
    const socket = useMemo(() => io( baseUrl, {
        transports: ['websocket'],
        path: "/socket.io/",
        autoConnect: true,
        withCredentials: true,
    }), []);

    socket.on('connect', () => {
        console.log('Socket connected');
    });
    socket.on('disconnect', () => {
        console.log('Socket disconnected');
    });

    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    );
}