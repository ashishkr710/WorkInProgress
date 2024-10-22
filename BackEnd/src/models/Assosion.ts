import ChatMessage from "./ChatMessage";
import ChatRoom from "./ChatRoom";
import Userdetails from "./Userdetails";

Userdetails.hasMany(ChatRoom, { foreignKey: 'agencyId', as: 'agencyChatRooms' });
Userdetails.hasMany(ChatRoom, { foreignKey: 'jobSeekerId', as: 'jobSeekerChatRooms' });

ChatRoom.belongsTo(Userdetails, { foreignKey: 'agencyId', as: 'agency' });
ChatRoom.belongsTo(Userdetails, { foreignKey: 'jobSeekerId', as: 'jobSeeker' });

ChatRoom.hasMany(ChatRoom, { foreignKey: 'chatRoomId' });
ChatRoom.belongsTo(ChatRoom, { foreignKey: 'chatRoomId' });

Userdetails.hasMany(ChatMessage, { foreignKey: 'senderId' });
ChatMessage.belongsTo(Userdetails, { foreignKey: 'senderId' });