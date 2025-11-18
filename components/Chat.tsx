
import React, { useState, useEffect, useRef } from 'react';
import type { Chat as ChatSession } from '@google/genai';
import { startChat, sendMessage } from '../services/geminiService';
import type { ChatMessage } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { UserIcon, BotIcon, SendIcon } from './Icon';

const Chat: React.FC = () => {
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = () => {
      try {
        const session = startChat();
        setChatSession(session);
        setHistory(session.history as ChatMessage[]); 
      } catch (e) {
        setError("Failed to initialize chat session. Please check your API key.");
        console.error(e);
      }
    };
    initChat();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [history, isLoading]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || !chatSession || isLoading) return;

    const newUserMessage: ChatMessage = {
      role: 'user',
      parts: [{ text: userInput }],
    };

    setHistory(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    setError(null);
    const userText = userInput;
    setUserInput('');

    const responseText = await sendMessage(chatSession, userText);

    if (responseText.startsWith('Error:')) {
      setError(responseText);
      // Remove the user message if the API call failed to avoid confusion
      setHistory(prev => prev.slice(0, prev.length - 1));
    } else {
      const modelMessage: ChatMessage = {
        role: 'model',
        parts: [{ text: responseText }],
      };
      setHistory(prev => [...prev, modelMessage]);
    }

    setIsLoading(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800/50 rounded-lg shadow-xl overflow-hidden">
      <div ref={chatContainerRef} className="flex-1 p-6 space-y-6 overflow-y-auto">
        {history.map((msg, index) => (
          <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"><BotIcon className="w-5 h-5 text-white" /></div>}
            <div className={`max-w-xl p-4 rounded-xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
              <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
            </div>
            {msg.role === 'user' && <div className="flex-shrink-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center"><UserIcon className="w-5 h-5 text-white" /></div>}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"><BotIcon className="w-5 h-5 text-white" /></div>
            <div className="max-w-xl p-4 rounded-xl bg-gray-700 text-gray-200 rounded-bl-none flex items-center">
              <LoadingSpinner />
            </div>
          </div>
        )}
        {error && <p className="text-red-400 text-center">{error}</p>}
      </div>

      <div className="p-4 bg-gray-900 border-t border-gray-700">
        <div className="relative">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full bg-gray-700 text-gray-200 rounded-lg p-3 pr-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !userInput.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
