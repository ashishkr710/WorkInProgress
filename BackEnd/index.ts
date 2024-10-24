import express, { NextFunction, Request, Response } from 'express';
import sequelize from './src/config/database';
import Userdetails from './src/models/Userdetails';
import cors from 'cors';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import userRoutes from './src/routes/userRoutes';
import path from 'path';
import ChatRoom from './src/models/ChatRoom';
import ChatMessage from './src/models/ChatMessage';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin:"*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(express.json());


io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    optionsSuccessStatus: 200
}));

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('joinRoom', (chatRoomId) => {
        socket.join(chatRoomId);
        console.log(`User joined room: ${chatRoomId}`);
    });
    socket.on('chat message', (msg) => {
        io.to(msg.chatRoomId).emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.use(express.static(path.join(__dirname, 'uploads')));
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

app.use('/', userRoutes);

const startServer = async () => {
    try {
        await sequelize.authenticate();
        await Userdetails.sync({ force: false });
        await ChatRoom.sync({ force: false });
        await ChatMessage.sync({ force: false });
        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error: any) {
        console.error('Unable to connect to the database:', error);
    }
};

export { io };
startServer();