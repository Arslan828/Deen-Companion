import React, { useState, useRef, useEffect } from 'react';
import { generateIslamicResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Bot, User, Sparkles } from 'lucide-react';

const AskAI: React.FC = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', role: 'model', text: 'As-salamu alaykum! I am your AI Deen Companion. Ask me about prayer times, Hadith meanings, historical events, or Duas.' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        const responseText = await generateIslamicResponse(input);
        
        const botMsg: ChatMessage = { 
            id: (Date.now() + 1).toString(), 
            role: 'model', 
            text: responseText 
        };
        
        setMessages(prev => [...prev, botMsg]);
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col h-full bg-off-white">
            <div className="bg-white p-4 shadow-sm z-10">
                <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                    <Sparkles className="text-accent" size={20} /> Deen AI Assistant
                </h2>
                <p className="text-xs text-gray-500">Powered by TEAM HALAL. Verify details with scholars.</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white border border-gray-100 shadow-sm rounded-bl-none'}`}>
                            <div className="flex items-center gap-2 mb-1 opacity-70 text-xs">
                                {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                                <span>{msg.role === 'user' ? 'You' : 'Assistant'}</span>
                            </div>
                            <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 flex gap-2 items-center">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-100 pb-24">
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask a question..."
                        className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="bg-primary text-white p-3 rounded-xl disabled:opacity-50 hover:bg-primary-dark transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AskAI;