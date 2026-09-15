import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, MessageCircle } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const AICompanion: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: 'As-salamu alaykum! I am Noor, your AI Islamic Companion. How can I assist you with your Deen today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(1) // skip the initial greeting
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'model', text: data.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: 'I apologize, but I am having trouble connecting right now. Please try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[600px] bg-bg-surface border border-border-primary rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-[#12161b] border-b border-border-primary px-6 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c6a55e] to-[#8d6f30] flex items-center justify-center shadow-lg">
          <Sparkles className="w-5 h-5 text-bg-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-text-primary font-serif-title flex items-center gap-2">
            Noor AI Companion
            <span className="text-[10px] font-sans font-semibold bg-[#c6a55e]/20 text-[#c6a55e] px-2 py-0.5 rounded-full border border-[#c6a55e]/30 tracking-wider">BETA</span>
          </h2>
          <p className="text-xs text-text-secondary">Ask questions, get motivation, and learn.</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-radial from-bg-primary to-bg-inset">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className="shrink-0">
                {msg.role === 'user' ? (
                  <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center">
                    <User className="w-4 h-4 text-sky-400" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#c6a55e]/20 border border-[#c6a55e]/30 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-[#c6a55e]" />
                  </div>
                )}
              </div>

              {/* Message Bubble */}
              <div className={`px-4 py-3 rounded-2xl text-sm ${
                msg.role === 'user' 
                  ? 'bg-sky-500/10 border border-sky-500/20 text-text-primary rounded-tr-none' 
                  : 'bg-bg-inset border border-border-primary text-text-primary rounded-tl-none'
              }`}>
                {msg.text.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i !== msg.text.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>

            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[85%] flex-row">
              <div className="shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#c6a55e]/20 border border-[#c6a55e]/30 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-[#c6a55e]" />
                </div>
              </div>
              <div className="px-5 py-4 rounded-2xl bg-bg-inset border border-border-primary rounded-tl-none flex items-center gap-2 text-[#c6a55e]">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-semibold animate-pulse">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border-primary bg-bg-surface">
        <form onSubmit={handleSend} className="flex items-center gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about prayers, habits, or Islamic history..."
            className="flex-1 bg-bg-inset border border-border-primary rounded-xl pl-4 pr-12 py-3 text-sm text-text-primary focus:outline-none focus:border-[#c6a55e] focus:ring-1 focus:ring-[#c6a55e]/50 transition-all placeholder-text-secondary/70"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-[#c6a55e] text-bg-primary hover:bg-[#d6b772] disabled:opacity-50 disabled:hover:bg-[#c6a55e] transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
