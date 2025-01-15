// aiRoutes.ts
import express, { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
    throw new Error("API key not found. Please set the GOOGLE_API_KEY environment variable.");
}

const genAI = new GoogleGenerativeAI(apiKey);

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

interface AIRequest {
    question: string;
    context?: ChatMessage[];
    attachments?: Attachment[];
}

router.post('/ask', async (req: Request<{}, {}, AIRequest>, res: Response) => {
    const { question, context = [], attachments = [] } = req.body;

    if (!question && attachments.length === 0) {
        return res.status(400).json({ error: 'Question or attachments are required.' });
    }

    // List of simple greetings and their responses
    const simpleResponses = new Map([
        ['hi', 'Hello! How can I help you today?'],
        ['hello', 'Hi there! What can I do for you?'],
        ['hey', 'Hey! How can I assist you?'],
        ['greetings', 'Greetings! How may I help you?'],
        ['hola', 'Hello! How can I assist you today?'],
    ]);

    try {
        // Check for simple greetings first
        const lowercaseQuestion = question.toLowerCase().trim();
        if (simpleResponses.has(lowercaseQuestion)) {
            return res.json({ 
                answer: simpleResponses.get(lowercaseQuestion),
                timestamp: new Date(),
                type: 'greeting'
            });
        }

        // Regular AI processing for other messages
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Construct the prompt based on context and attachments
        let prompt = '';
        
        if (context.length > 0) {
            prompt += `Previous conversation:\n${context
                .map(msg => `${msg.sender}: ${msg.content}`)
                .join('\n')}\n\n`;
        }
        
        if (attachments.length > 0) {
            prompt += `Attached files:\n${attachments
                .map(file => `File "${file.name}":\n${file.content}`)
                .join('\n\n')}\n\n`;
        }
        
        prompt += `Current question: ${question}\n\n`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const answer = response.text();

        res.json({ 
            answer,
            timestamp: new Date(),
            type: 'ai_response'
        });
    } catch (error) {
        console.error('Error generating response:', error);
        res.status(500).json({ error: 'Failed to generate response from AI.' });
    }
});

// Route to handle file analysis
router.post('/analyze-files', async (req: Request, res: Response) => {
    const { files } = req.body;

    if (!files || !Array.isArray(files) || files.length === 0) {
        return res.status(400).json({ error: 'Files are required for analysis.' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const filesContent = files
            .map(file => `File "${file.name}":\n${file.content}`)
            .join('\n\n');

        const prompt = `Please analyze the following files and provide insights about their structure, potential issues, and suggestions for improvement:\n\n${filesContent}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const analysis = response.text();

        res.json({ analysis });
    } catch (error) {
        console.error('Error analyzing files:', error);
        res.status(500).json({ error: 'Failed to analyze files.' });
    }
});

export default router;