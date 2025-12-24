"use client";
import React from "react";
import { MessageCircle } from "lucide-react";

const ChatBubble = () => {
    const handleClick = () => {
        window.open("https://www.messenger.com/t/100011338106937", "_blank");
    };

    return (
        <div className="fixed bottom-4 right-8 z-50">
            <button
                onClick={handleClick}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-all duration-200"
            >
                <MessageCircle size={24} />
            </button>
        </div>
    );
};

export default ChatBubble;