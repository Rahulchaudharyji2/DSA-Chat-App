import React, { useState } from 'react';
import Header from './components/Header.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import InputForm from './components/InputForm.jsx';

// The main application component that manages state and handles API calls.
const App = () => {
    // State to hold the chat messages
    const [messages, setMessages] = useState([
        { text: "Hello! I am a chatbot trained on a document about Data Structures and Algorithms. How can I help you today?", sender: 'bot' }
    ]);
    // State to hold the user's current input
    const [input, setInput] = useState('');
    // State to manage the loading indicator
    const [isLoading, setIsLoading] = useState(false);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const userQuestion = input.trim();
        if (!userQuestion) return;

        // Add the user's message to the chat
        setMessages(prevMessages => [...prevMessages, { text: userQuestion, sender: 'user' }]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: userQuestion }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setMessages(prevMessages => [...prevMessages, { text: data.answer, sender: 'bot' }]);
        } catch (error) {
            console.error('Fetch error:', error);
            setMessages(prevMessages => [...prevMessages, { text: 'Sorry, something went wrong. Please try again.', sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 flex flex-col items-center justify-center min-h-screen p-4 font-['Inter']">
            <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl flex flex-col h-[80vh]">
                <Header />
                <ChatWindow messages={messages} isLoading={isLoading} />
                <InputForm
                    input={input}
                    setInput={setInput}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default App;