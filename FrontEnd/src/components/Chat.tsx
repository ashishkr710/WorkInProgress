import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import { baseURL } from '../../environments/environment';
// import 'bootstrap/dist/css/bootstrap.min.css';

const socket = io('http://localhost:3000');

const Chat: React.FC = () => {
    const { userId, agencyId } = useParams<{ userId: string; agencyId: string }>();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<{ id: string; chatRoomId: string; senderId: string; message: string; createdAt: string; updatedAt: string; }[]>([]);

    useEffect(() => {
        const fetchMessages = async() => {
            try {
                const response = await axios.get(`${baseURL}getMessages/${userId}-${agencyId}`);
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();

        socket.emit('joinRoom', `${userId}-${agencyId}`);

        socket.on('chat message', (msg: { id: string; chatRoomId: string; senderId: string; message: string; createdAt: string; updatedAt: string; }) => {
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
            socket.emit('chat message', response.data);
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <h4>Chat Room</h4>
                        <button className="btn btn-secondary mt-6" style={{ marginRight: '0' }} onClick={() => window.history.back()}>
                            Back to Profile
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="chat-messages mb-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {messages.map((msg) => (
                            <div key={msg.id} className="alert alert-secondary">
                                {msg.message}
                            </div>
                        ))}
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