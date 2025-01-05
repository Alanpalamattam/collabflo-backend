// models/Room.ts
import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  participants: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Room = mongoose.model('Room', RoomSchema);
export default Room;
