// server.js
import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { PineconeStore } from '@langchain/pinecone';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env file
dotenv.config();

// Create a new instance of the Google Generative AI model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Chat history array to maintain context for the current session
const history = [];

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Rewrites a follow-up question into a standalone query based on chat history.
 * @param {string} question The user's follow-up question.
 * @returns {Promise<string>} The rewritten, standalone question.
 */
async function transformQuery(question) {
    history.push({
        role: 'user',
        parts: [{ text: question }]
    });

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const chat = model.startChat({
            history: history,
        });

        const result = await chat.sendMessage(`Rewrite the "Follow Up user Question" into a complete, standalone question that can be understood without the chat history.
Follow Up user Question: ${question}
Only output the rewritten question and nothing else.`);

        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error transforming query:", error);
        return question; // Fallback to original question on error
    } finally {
        history.pop(); // Remove the temporary user question from history
    }
}

/**
 * Handles the RAG process: vector search, context creation, and AI response generation.
 * @param {string} question The user's question.
 * @returns {Promise<string>} The AI's answer.
 */
async function getChatResponse(question) {
    // Transform the question into a complete, standalone query
    const queries = await transformQuery(question);
    console.log("Rewritten query:", queries);

    // Initialize the embeddings model
    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY,
        model: 'text-embedding-004',
    });

    // Generate the vector for the query
    const queryVector = await embeddings.embedQuery(queries);

    // Make connection with Pinecone and search for similar documents
    // NOTE: The 'environment' property is no longer used in the latest Pinecone client.
    const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    });
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    const searchResults = await pineconeIndex.query({
        topK: 10,
        vector: queryVector,
        includeMetadata: true,
    });

    // Extract the text content from the top search results to create the context
    const context = searchResults.matches.map(match => match.metadata.text).join("\n\n---\n\n");
    console.log("Context from Pinecone:", context);

    // Use Gemini to generate a final answer based on the retrieved context
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const chat = model.startChat({
        history: history,
    });

    const prompt = `You are a Data Structure and Algorithm Expert.
You will be given a context of relevant information and a user question.
Your task is to answer the user's question based ONLY on the provided context.
If the answer is not in the context, you must say "I could not find the answer in the provided document."
Keep your answers clear, concise, and educational.

Context: ${context}
User Question: ${queries}
`;

    const result = await chat.sendMessage(prompt);
    const responseText = await result.response.text();

    // Add the user query and model response to the chat history
    history.push({
        role: 'user',
        parts: [{ text: queries }]
    });
    history.push({
        role: 'model',
        parts: [{ text: responseText }]
    });
    
    return responseText;
}

// --- Express.js setup for the API server ---

const app = express();
const port = 3000;

// Middleware to parse JSON bodies and enable CORS
app.use(express.json());
app.use(cors());

// Define the API endpoint for chat
app.post('/api/chat', async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ error: 'Question is required.' });
    }

    try {
        const answer = await getChatResponse(question);
        res.json({ answer });
    } catch (error) {
        console.error("Error in chat endpoint:", error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

// --- Your indexing script, now as a separate function ---
async function indexDocument() {
    console.log("Starting document indexing...");
    const PDF_PATH = join(__dirname, 'dsa.pdf');
    const pdfLoader = new PDFLoader(PDF_PATH);
    const rawDocs = await pdfLoader.load();
    
    // Chunking
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const chunkedDocs = await textSplitter.splitDocuments(rawDocs);
    console.log(`Chunking Completed. Total chunks: ${chunkedDocs.length}`);
    
    // Vector Embedding model
    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY,
        model: 'text-embedding-004',
    });
    console.log("Embedding model configured.");

    // Initialize Pinecone Client
    const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    });
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);
    console.log("Pinecone configured.");

    // Store chunks in Pinecone
    await PineconeStore.fromDocuments(chunkedDocs, embeddings, {
        pineconeIndex,
        maxConcurrency: 5,
    });
    console.log("Data Stored successfully.");
}

// To run this function, uncomment the line below and run `node server.js`
// indexDocument();
