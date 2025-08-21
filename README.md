# DSA Chat App

Welcome to the **DSA Chat App**!

This is a full-stack AI-powered chat application.  
It uses a modern stack:

- **Frontend**: React (Vite)
- **Backend**: Node.js (or relevant framework), 
  - Integrates Retrieval-Augmented Generation (RAG)
  - Uses a Vector Database for semantic search
  - Connects to Google Gemini GenAI API for intelligent answers

---

## Features

- **Real-time Chat:** User-to-user and AI-powered chat
- **AI Responses:** RAG combines your data and Gemini AI for contextual answers
- **Semantic Search:** Uses a Vector DB for fast and meaningful retrieval
- **External File Ingestion:** The backend reads external files/documents to enhance AI responses
- **User Authentication:** (If implemented) Secure login and registration

---

## Architecture

### Frontend
- Built with **React** and **Vite** for fast development and HMR.
- Interacts with backend via REST or WebSocket for chat and AI features.

### Backend
- Runs a **RAG pipeline**: 
  - Reads and indexes external files/documents
  - Stores embeddings in a Vector Database (e.g., Pinecone, Qdrant, Weaviate, etc.)
  - Uses Gemini GenAI API (needs API Key) for generating answers
- Handles user, chat, and document APIs

### External Files
- The backend ingests files (e.g. PDFs, text, docs) for retrieval and answering.
- To add new knowledge, place files in a designated folder or upload via API.

---

## Getting Started

### Prerequisites

- Node.js and npm
- Gemini API Key ([Get from Google AI Studio](https://aistudio.google.com/))
- Vector DB credentials (see your chosen provider)
- (Optional) External files for ingestion

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/Rahulchaudharyji2/DSA-Chat-App.git
   cd DSA-Chat-App
   ```

2. **Setup Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Add .env with Gemini and Vector DB keys
   npm start
   ```

4. **Configure Environment Variables**
   ```
   GEMINI_API_KEY=your-gemini-api-key
   VECTOR_DB_URL=your-vector-db-url
   VECTOR_DB_API_KEY=your-vector-db-api-key
   ```

---

## Usage

- Start both server and client.
- Go to `http://localhost:3000`.
- Upload external files for RAG or place them in the ingestion folder.
- Start chatting! The AI uses your files plus Gemini for answers.

---

## Project Structure

```
DSA-Chat-App/
├── backend/
│   ├── src/
│   ├── ingestion/    
│   ├── .env
│   └── package.json
├── client/
│   ├── src/
│   └── README.md
├── README.md
└── ...
```

---

## Contributing

Pull requests are welcome!  
For major changes, open an issue first to discuss.

---

## License

[MIT](LICENSE)

---

## Acknowledgements

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Google Gemini](https://aistudio.google.com/)

