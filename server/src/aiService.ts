import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Determine the API base URL from the .env file
const API_BASE_URL = process.env.API_BASE_URL;

const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/ai/ask`, { message: userMessage });
        console.log('AI API response:', response.data);  // Log entire response
        return response.data.response;  // Only return the AI response content
    } catch (error) {
        console.error('Error fetching AI response:', error);
        throw error;
    }
};

export default getAIResponse;
