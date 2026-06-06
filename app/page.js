"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Sparkles, AlertTriangle, Cpu, ArrowDown, Square, Check, Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Platform Brand Mini Logo Vector
function MiniLogo() {
  return (
    <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/20">
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 002-2H4a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    </div>
  );
}

// Kodular Bot Logo Vector
function KodularBotLogo() {
  return (
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md border border-indigo-400/20">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M12 18h.01" />
        <path d="M9 6h6" />
        <path d="M9 10h6" />
      </svg>
    </div>
  );
}

// Premium Code Renderer Component with Integrated Copy Mechanics
function ModernCodeBlock({ children, className }) {
  const [isCopied, setIsCopied] = useState(false);
  const codeContent = String(children).replace(/\n$/, "");

  const handleCopyAction = async () => {
    try {
      await navigator.clipboard.writeText(codeContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy target code layout:", err);
    }
  };

  return (
    <div className="relative my-4 group/code rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
      {/* Top Header Controls Panel Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/80 border-b border-zinc-800/60 text-[11px] font-mono text-zinc-500">
        <span>KODULAR_UI_LAYOUT_ASSET</span>
        <button
          onClick={handleCopyAction}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-all cursor-pointer"
        >
          {isCopied ? (
            <>
              <Check size={12} className="text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Inline Pre Content Viewport block area */}
      <pre className="p-4 overflow-x-auto text-xs font-mono text-zinc-300 leading-relaxed m-0!">
        <code className={className}>{codeContent}</code>
      </pre>
    </div>
  );
}

// Fluid Character Component Incremental Visual Array Streamer Loop
function TypingEffect({ text, onComplete, abortSignalRef }) {
  const [displayedText, setDisplayedText] = useState("");
  const words = text.split(" ");
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayedText("");

    const interval = setInterval(() => {
      if (abortSignalRef?.current) {
        clearInterval(interval);
        if (onComplete) onComplete();
        return;
      }

      if (indexRef.current < words.length) {
        setDisplayedText((prev) => (prev ? prev + " " + words[indexRef.current] : words[indexRef.current]));
        indexRef.current += 1;
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 15);

    return () => clearInterval(interval);
  }, [text, abortSignalRef]);

  return (
    <div className="prose prose-invert max-w-none text-[15px] leading-relaxed text-zinc-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // FIX: Prevents invalid HTML nesting by rendering text directly or shifting wrapping container block types
          p({ children }) {
            return <div className="mb-4 last:mb-0 leading-relaxed">{children}</div>;
          },
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline ? (
              <ModernCodeBlock className={className}>{children}</ModernCodeBlock>
            ) : (
              <code className="bg-zinc-900 text-indigo-400 px-1.5 py-0.5 rounded font-mono text-xs border border-zinc-800" {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {displayedText}
      </ReactMarkdown>
    </div>
  );
}

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [completedAnimations, setCompletedAnimations] = useState({});

  // Abort controller reference handles immediate stream cuts
  const abortSignalRef = useRef(false);
  const mainViewportRef = useRef(null);
  const messagesEndRef = useRef(null);

  const handleViewportScroll = (e) => {
    const target = e.currentTarget;
    const isFloating = target.scrollHeight - target.scrollTop - target.clientHeight > 150;
    setShowScrollBtn(isFloating);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // High Fidelity Stop Handler Loop
  const handleStopGeneration = () => {
    abortSignalRef.current = true;
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);
    abortSignalRef.current = false; // Reset block frame state

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history: chatHistory }),
      });

      const data = await response.json();

      // If execution was cut during api parsing, reject mutations
      if (abortSignalRef.current) return;

      if (!response.ok || data.error) {
        throw new Error(data.error || "API_ERROR");
      }

      setMessages((prev) => [...prev, { role: "model", text: data.text }]);
      setChatHistory(data.history || []);
    } catch (error) {
      if (abortSignalRef.current) return;
      let displayMessage = "Something went wrong. Please try again.";
      if (error.status === 429 || error.message.includes("LIMIT")) {
        displayMessage = "⏱️ System limits reached. Free Tier slots reset inside 30 seconds.";
      }
      setMessages((prev) => [...prev, { role: "system-error", text: displayMessage }]);
    } finally {
      if (!abortSignalRef.current) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-zinc-950 text-zinc-100 font-sans antialiased relative overflow-hidden">
      {/* Mesh Overlay */}
      <div className="absolute top-0 left-0 w-[50%] h-[30%] rounded-full bg-indigo-950/10 blur-[120px] pointer-events-none z-0" />

      {/* Header Panel */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-900 bg-zinc-950 z-20 shrink-0 relative">
        <div className="flex items-center gap-3">
          <MiniLogo />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight bg-gradient-to-r from-zinc-50 to-zinc-400 bg-clip-text text-transparent">Kodular Craft AI</span>
              <span className="px-1.5 py-0.5 text-[10px] uppercase font-mono font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-md">v2.1</span>
            </div>
            <p className="text-xs text-zinc-400">Prompt to Functional UI Layout Blocks</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-zinc-400 hidden sm:inline">Active Workspace Mode</span>
        </div>
      </header>

      {/* Main Container Viewport Area Layout */}
      <main
        ref={mainViewportRef}
        onScroll={handleViewportScroll}
        className="flex-1 min-h-0 overflow-y-auto px-4 md:px-8 py-6 space-y-6 max-w-5xl w-full mx-auto relative z-10 scrollbar-none scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-lg mx-auto">
            <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 shadow-inner">
              <Cpu className="w-10 h-10 text-indigo-400 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-50">What layout are we building?</h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Describe your application view. I will instantly output structured component layout assets configured for your custom workspace.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 pb-12">
            {messages.map((msg, index) => {
              if (msg.role === "user") return null;

              const correspondingUserPrompt = messages[index - 1]?.text || "Custom UI Modification Request";

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full bg-zinc-900/30 border border-zinc-900/80 rounded-2xl overflow-hidden shadow-xs backdrop-blur-md"
                >
                  {/* Prompt Text Wrapper Header */}
                  <div className="px-5 py-3 bg-zinc-950/60 border-b border-zinc-900 text-xs text-zinc-400 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-zinc-800 flex items-center justify-center text-zinc-300 shrink-0 mt-0.5">
                      <User size={12} />
                    </div>
                    <div className="leading-relaxed">
                      <span className="font-mono text-zinc-500 font-semibold uppercase">Prompt:</span>{" "}
                      <span className="text-zinc-200 font-sans">{correspondingUserPrompt}</span>
                    </div>
                  </div>

                  {/* AI Content Response Segment Wrapper */}
                  <div className="p-5 flex gap-4 items-start">
                    {msg.role === "system-error" ? (
                      <div className="flex items-start gap-3 w-full bg-amber-950/10 border border-amber-900/30 p-4 rounded-xl text-amber-400 text-sm">
                        <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                        <div>{msg.text}</div>
                      </div>
                    ) : (
                      <>
                        <KodularBotLogo />
                        <div className="flex-1 overflow-hidden min-w-0">
                          {index === messages.length - 1 && !completedAnimations[index] ? (
                            <TypingEffect
                              text={msg.text}
                              abortSignalRef={abortSignalRef}
                              onComplete={() => setCompletedAnimations(prev => ({ ...prev, [index]: true }))}
                            />
                          ) : (
                            <div className="prose prose-invert max-w-none text-[15px] leading-relaxed">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  // FIX: Prevents hydration errors by overriding paragraph tags with divs
                                  p({ children }) {
                                    return <div className="mb-4 last:mb-0 leading-relaxed">{children}</div>;
                                  },
                                  code({ node, inline, className, children, ...props }) {
                                    return !inline ? (
                                      <ModernCodeBlock className={className}>{children}</ModernCodeBlock>
                                    ) : (
                                      <code className="bg-zinc-900 text-indigo-400 px-1.5 py-0.5 rounded font-mono text-xs border border-zinc-800" {...props}>
                                        {children}
                                      </code>
                                    );
                                  }
                                }}
                              >
                                {msg.text}
                              </ReactMarkdown>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Loading Tray / Stop Stream Trigger Action Row */}
        {isLoading && (
          <div className="w-full bg-zinc-900/20 border border-zinc-900 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <KodularBotLogo />
              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono tracking-wide bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent uppercase animate-pulse">Compiling Layout Matrix</span>
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>

            {/* The Prompt Generation Stop Trigger Button */}
            <button
              type="button"
              onClick={handleStopGeneration}
              className="flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 text-xs font-medium text-zinc-300 transition-all cursor-pointer shadow-sm self-start sm:self-auto"
            >
              <Square size={11} className="fill-zinc-400 stroke-zinc-400" />
              <span>Stop Generating</span>
            </button>
          </div>
        )}
        <div ref={messagesEndRef} className="h-2" />
      </main>

      {/* Floating Action Button: Go To End Page Icon */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToBottom}
            className="absolute bottom-28 right-6 p-3.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-indigo-400 hover:text-indigo-300 shadow-2xl backdrop-blur-md cursor-pointer z-50 transition-all"
            title="Go to end page"
          >
            <ArrowDown size={18} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input Action Form Tray Footer Panel */}
      <footer className="px-4 py-4 md:px-8 border-t border-zinc-900 bg-zinc-950 z-20 shrink-0 relative">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto relative flex items-center group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-lg opacity-40 group-focus-within:opacity-100 transition duration-300" />

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your design layout block or screen updates..."
            className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-indigo-500/40 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 text-zinc-100 placeholder-zinc-500 rounded-2xl pl-5 pr-14 py-3.5 text-sm transition-all shadow-inner relative z-10"
            disabled={isLoading}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2.5 p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 disabled:bg-zinc-900 disabled:text-zinc-700 text-white transition-all shadow-md z-20 cursor-pointer"
          >
            <Send size={14} />
          </button>
        </form>
      </footer>
    </div>
  );
}