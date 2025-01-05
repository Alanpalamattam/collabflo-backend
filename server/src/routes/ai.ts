import express, { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Ensure your API Key is set
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
    throw new Error("API key not found. Please set the GOOGLE_API_KEY environment variable.");
}

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(apiKey);

// Define the route to handle AI requests
router.post('/ask', async (req: Request, res: Response) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ error: 'Question is required.' });
    }

    try {
        // Get the Gemini Pro model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Generate content
        const result = await model.generateContent(question);
        const response = await result.response;
        const answer = response.text();

        res.json({ answer });
    } catch (error) {
        console.error('Error generating response:', error);
        res.status(500).json({ error: 'Failed to generate response from AI.' });
    }
});

export default router;