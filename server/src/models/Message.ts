import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    sender: String,
    content: String,
    timestamp: Date,
    attachments: [{
        name: String,
        content: String,
        type: String
    }],
    roomId: String
});

export const Message = mongoose.model('Message', MessageSchema);
