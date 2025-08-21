import React from 'react';

// Component for the user input field and send button.
const InputForm = ({ input, setInput, handleSubmit, isLoading }) => (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                required
            />
            <button
                type="submit"
                className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 transition-colors duration-200 shadow-lg transform hover:scale-105"
                disabled={isLoading}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-horizontal">
                    <path d="m3 3 3 9-3 9 19-9Z"/><path d="M6 12h16"/>
                </svg>
            </button>
        </div>
    </form>
);

export default InputForm;
