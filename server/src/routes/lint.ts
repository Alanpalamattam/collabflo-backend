import express from 'express';
import { ESLint } from 'eslint';

const router = express.Router();

router.post('/lint', async (req, res) => {
    const { code } = req.body;

    try {
        const eslint = new ESLint();
        const results = await eslint.lintText(code);

        // Format the results
        const formatter = await eslint.loadFormatter('stylish');
        const resultText = formatter.format(results);

        res.json({ result: resultText });
    } catch (error) {
        console.error("Error during linting:", error);
        res.status(500).json({ error: 'Failed to analyze code.' });
    }
});

export default router;