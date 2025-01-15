// / getAIResponse.ts
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface ChatMessage {
    sender: string;
    content: string;
    timestamp: Date;
}

interface Attachment {
    name: string;
    content: string;
    type: string;
}

interface AIRequestParams {
    message: string;
    context?: ChatMessage[];
    attachments?: Attachment[];
}

const API_BASE_URL = process.env.API_BASE_URL;

const getAIResponse = async ({
    message,
    context = [],
    attachments = []
}: AIRequestParams): Promise<string> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/ai/ask`, {
            message,
            context,
            attachments
        });
        
        console.log('AI API response:', response.data);
        return response.data.response;
    } catch (error) {
        console.error('Error fetching AI response:', error);
        throw error;
    }
};

export default getAIResponse;