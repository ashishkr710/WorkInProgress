// models/ChatRoom.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';


class ChatRoom extends Model {
    public id!: string;
    public agencyId!: string;
    public jobSeekerId!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

ChatRoom.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    agencyId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    jobSeekerId: {
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
    modelName: 'ChatRoom',
});




export default ChatRoom;