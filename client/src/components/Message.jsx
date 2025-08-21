import React from 'react';

// Component for a single chat message.
const Message = ({ text, sender }) => (
    <div
        className={`p-4 rounded-xl max-w-[75%] shadow-sm transition-all duration-300 transform ${
            sender === 'user'
                ? 'bg-blue-100 border-b-2 border-blue-200 ml-auto'
                : 'bg-gray-100 border-b-2 border-gray-200 mr-auto'
        }`}
    >
        <p className="whitespace-pre-wrap">{text}</p>
    </div>
);

export default Message;
