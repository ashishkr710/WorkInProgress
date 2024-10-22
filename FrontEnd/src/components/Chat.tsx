import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import { baseURL } from '../../environments/environment';


const socket = io('http://localhost:3000');

const Chat: React.FC = () => {
    const { userId, agencyId } = useParams<{ userId: string; agencyId: string }>();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<string[]>([]);
    console.log('messages', messages);

    useEffect(() => {
        const fetchMessages = async () => {
            // const response = await axios.get(`${baseURL}?chatRoomId=${userId}-${agencyId}`);
            // console.log('response', response.data);
            // is this right api call for  -  router.get('/getMessages', getMessages); 

            // setMessages(response.data);
            try {
                const response = await axios.get(`${baseURL}getMessages/${userId}-${agencyId}`);
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();

        socket.on('chat message', (msg: string) => {
            // console.log('messages', msg);
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            socket.off('chat message');
        };
    }, [userId, agencyId]);

    const sendMessage = async () => {
        try {
            const response = await axios.post(`${baseURL}sendMessage`, {
                chatRoomId: `${userId}-${agencyId}`,
                senderId: userId,
                message,
            });
            // console.log('Message sent:', response.data);
            socket.emit('chat message', response.data);
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        // <div>
        //     <div>
        //         { messages?.length > 0 ? (
        //             messages?.map((msg, index) => (
        //                 <div key={index}>{msg}</div>
        //             ))
        //         ) : (
        //             <div>No messages yet</div>
        //         )}
        //     </div>
        //     <input
        //         type="text"
        //         value={message}
        //         onChange={(e) => setMessage(e.target.value)}    
        //         placeholder="Type your message here"
        //     />
        //     <button onClick={sendMessage}>Send</button>
        // </div>
        <div className="container mt-5">
            <div className="card">
                <div className="card-header">
                    <h4>Chat Room</h4>
                </div>
                <div className="card-body">
                    <div className="chat-messages mb-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {/* {messages.map((msg, index) => (
                            <div key={index} className="alert alert-secondary">
                                {msg}
                            </div>
                        ))} */}
                        {messages?.length > 0 ? (
                            messages?.map((msg, index) => (
                                <div key={index} className='alert alert-secondry'>{msg}</div>
                            ))
                        ) : (
                            <div>No messages yet</div>
                        )}
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message here"
                        />
                        <button className="btn btn-primary" onClick={sendMessage}>
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;