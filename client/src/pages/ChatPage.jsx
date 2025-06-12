import React, {useEffect, useState} from 'react'
import { useSocket } from '../SocketProvider';

function ChatPage() {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const socket = useSocket()
    const [chat, setChat] = useState("");
    const [messages, setMessages] = useState([]);
    const [to, setTo] = useState();

    const handleSend = (e) => {
        e.preventDefault()
        if (!chat.trim()) return; 

        console.log(socket.id)
        socket.emit('single-send', {chat, receiverID: to});
        setChat('');

    }

    useEffect(() => {
      socket.on('single-receive', ({chat}) => {
        setMessages( prevMsg => [...prevMsg, chat]);
    })
    
    return () => {
        socket.off('single-receive')
    }
}, [socket])

  return (
    <div>
        <div>
            <div>ChatPage</div>
            <input type="text" placeholder='Type your message' value={chat} onChange={(e) => setChat(e.target.value)} />
            <input type="text" placeholder='Receiver' value={to} onChange={(e) => setTo(e.target.value)} />
            <button type="submit" onClick={(e) => handleSend(e)}>Send</button>
        </div>

        <div>
            <div>Messages</div>
            <div>
                {messages.map((message, index) => (
                    <div key={index}>{message}</div>
                ))}
            </div>
        </div>

    </div>

  )
}

export default ChatPage