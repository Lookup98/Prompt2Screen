"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, AlertTriangle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Premium Typing Effect Component
function TypingEffect({ text, onComplete }) {
  const [displayedText, setDisplayedText] = useState("");
  const words = text.split(" ");
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayedText("");
    
    const interval = setInterval(() => {
      if (indexRef.current < words.length) {
        setDisplayedText((prev) => (prev ? prev + " " + words[indexRef.current] : words[indexRef.current]));
        indexRef.current += 1;
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 45); // Speed of character generation pipeline

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="prose prose-invert max-w-none text-[15px] leading-relaxed text-zinc-200">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayedText}</ReactMarkdown>
      <span className="inline-block w-1.5 h-4 ml-1 bg-indigo-400 animate-pulse vertical-middle" />
    </div>
  );
}

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [completedAnimations, setCompletedAnimations] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput(""); 
    setIsLoading(true);

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history: chatHistory }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        const err = new Error(typeof data.error === 'string' ? data.error : data.message || "API_ERROR");
        err.status = response.status;
        err.rawError = data.error;
        throw err;
      }

      setMessages((prev) => [...prev, { role: "model", text: data.text }]);
      setChatHistory(data.history || []);
    } catch (error) {
      console.warn("Handled API Interception:", error.message);
      let displayMessage = "Something went wrong. Please try again.";

      if (error.message === "RATE_LIMIT_EXHAUSTED" || error.status === 429 || error.rawError === "RATE_LIMIT_EXHAUSTED") {
        displayMessage = "⏱️ Rate limit exceeded. The Free Tier of the Gemini API allows limited requests per minute. Please wait about 30 seconds before sending another message!";
      } else if (error.status === 503 || error.message.includes("demand")) {
        displayMessage = "⚠️ Gemini servers are heavily congested right now. Retrying your prompt shortly may help.";
      }

      setMessages((prev) => [...prev, { role: "system-error", text: displayMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 font-sans antialiased">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-600/10 rounded-xl border border-indigo-500/20 text-indigo-400">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="font-semibold text-sm tracking-wide">Gemini Premium</h1>
            <p className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Engine Resilient v2
            </p>
          </div>
        </div>
      </header>

      {/* Main Chat Viewport */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-3xl w-full mx-auto scrollbar-none">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40 pt-32 space-y-3">
            <Bot size={44} className="text-zinc-500" />
            <h2 className="text-xl font-medium tracking-tight">How can I assist you today?</h2>
            <p className="text-sm text-zinc-400 max-w-xs">Ask questions, render markdown, or debug software layouts natively.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role !== "user" && msg.role !== "system-error" && (
                    <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 shrink-0 shadow-sm">
                      <Bot size={16} />
                    </div>
                  )}

                  {msg.role === "system-error" ? (
                    <div className="flex items-start gap-3 w-full max-w-[85%] bg-amber-950/20 border border-amber-900/30 p-4 rounded-2xl text-amber-400 text-[14px]">
                      <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                      <div>{msg.text}</div>
                    </div>
                  ) : msg.role === "user" ? (
                    <div className="max-w-[85%] px-4 py-3 rounded-2xl text-[15px] bg-indigo-600 text-white rounded-br-none shadow-md whitespace-pre-wrap leading-relaxed">
                      {msg.text}
                    </div>
                  ) : (
                    <div className="max-w-[85%] px-5 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-none shadow-sm overflow-hidden">
                      {/* Apply Typing Animation only to the latest block if it hasn't finished yet */}
                      {index === messages.length - 1 && !completedAnimations[index] ? (
                        <TypingEffect 
                          text={msg.text} 
                          onComplete={() => setCompletedAnimations(prev => ({ ...prev, [index]: true }))} 
                        />
                      ) : (
                        <div className="prose prose-invert max-w-none text-[15px] leading-relaxed markdown-container">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.text}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  )}

                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                      <User size={16} />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* CSS Loading Thinking Dots */}
        {isLoading && (
          <div className="flex gap-4 justify-start items-center">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
              <Bot size={16} />
            </div>
            <div className="flex space-x-1.5 p-3 bg-zinc-900 border border-zinc-800 rounded-2xl items-center">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Action Panel */}
      <footer className="p-4 border-t border-zinc-900 bg-zinc-950 sticky bottom-0">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Gemini..."
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 text-zinc-100 placeholder-zinc-500 rounded-2xl pl-4 pr-12 py-3.5 text-sm transition-all shadow-inner"
            disabled={isLoading}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-900 disabled:text-zinc-700 text-white transition-all shadow-md"
          >
            <Send size={16} />
          </button>
        </form>
      </footer>
    </div>
  );
}