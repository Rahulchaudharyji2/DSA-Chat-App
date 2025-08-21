import React, { useEffect, useRef } from 'react';
import Message from './Message.jsx';

// Component that contains and displays all the chat messages.
const ChatWindow = ({ messages, isLoading }) => {
    const chatBoxRef = useRef(null);

    // Auto-scroll to the bottom when messages are updated.
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div ref={chatBoxRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, index) => (
                <Message key={index} text={msg.text} sender={msg.sender} />
            ))}
            {isLoading && (
                <div className="p-4 rounded-xl max-w-[75%] shadow-sm animate-pulse bg-gray-100 mr-auto">
                    <div className="dot-flashing w-3 h-3 bg-gray-400 rounded-full inline-block mx-1 animate-[dot-flashing_1s_infinite_alternate]"></div>
                    <div className="dot-flashing w-3 h-3 bg-gray-400 rounded-full inline-block mx-1 animate-[dot-flashing_1s_infinite_alternate_0.2s]"></div>
                    <div className="dot-flashing w-3 h-3 bg-gray-400 rounded-full inline-block mx-1 animate-[dot-flashing_1s_infinite_alternate_0.4s]"></div>
                </div>
            )}
        </div>
    );
};

export default ChatWindow;