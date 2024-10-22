import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

// import ChatRoom from './ChatRoom';

class ChatMessage extends Model {
    public id!: string;
    public chatRoomId!: string;
    public senderId!: string;
    public message!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

ChatMessage.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    chatRoomId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    senderId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: { 
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'ChatMessage',
    timestamps: true,
});


export default ChatMessage;