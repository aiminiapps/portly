'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSend, FiZap, FiCpu, FiActivity, FiArrowUpRight, FiLayers } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';

export default function AIAgentModal({ isOpen, onClose, portfolioData, walletAddress }) {
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: `**Welcome back.** 🚀\n\nI've analyzed your portfolio. You are currently tracking **${portfolioData?.assets?.length || 0} assets** with a total valuation of **$${portfolioData?.totalValue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}**.\n\nHow can I assist you with your investment strategy today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [chatMessages, isOpen]);

  // Main Send Function
  const sendChatMessage = async () => {
    if (!userInput.trim() || isTyping) return;

    const currentInput = userInput;
    setUserInput(''); // Clear input for better UX
    
    // Add user message immediately
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: currentInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Construct a data-rich context prompt
      const contextPrompt = `
        CONTEXT: You are PORTLY.AI, an advanced crypto portfolio assistant.
        USER DATA:
        - Wallet: ${walletAddress || 'Connected'}
        - Total Net Worth: $${portfolioData?.totalValue || 0}
        - Asset Count: ${portfolioData?.assets?.length || 0}
        - Top 3 Assets: ${portfolioData?.assets?.slice(0,3).map(a => `${a.symbol} ($${a.value.toFixed(0)})`).join(', ') || 'None'}
        - Risk Score: ${portfolioData?.riskScore || 'N/A'}
        
        USER QUESTION: "${currentInput}"
        
        INSTRUCTIONS: Answer concisely in Markdown. Use bold for key figures. Be professional but conversational.
      `;

      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are a helpful financial AI assistant." },
            { role: "user", content: contextPrompt }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.reply || "I'm analyzing the blockchain data. Could you rephrase that?";
        
        setChatMessages(prev => [...prev, {
          id: Date.now() + 1,
          role: 'assistant',
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error("API Failure");
      }
    } catch (error) {
      console.error(error);
      // Smart Fallback using local data if API fails
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          id: Date.now() + 1,
          role: 'assistant',
          content: `**Network Update:** I'm currently running in offline mode.\n\nBased on your local cache:\n* **Holdings:** ${portfolioData?.assets?.length} assets\n* **Top Asset:** ${portfolioData?.assets?.[0]?.symbol || 'N/A'}\n\nPlease check your connection for deeper market analysis.`,
          timestamp: new Date().toLocaleTimeString()
        }]);
      }, 1500);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    { icon: FiActivity, label: 'Risk Analysis', prompt: 'Analyze the risk level of my current holdings.' },
    { icon: FiArrowUpRight, label: 'Top Movers', prompt: 'Which of my assets performed best in the last 24h?' },
    { icon: FiLayers, label: 'Diversification', prompt: 'Is my portfolio well-diversified?' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
          />

          {/* Modal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:right-8 md:bottom-24 md:w-[420px] md:h-[650px] z-[100] flex flex-col"
          >
            <div className="flex-1 flex flex-col bg-[#121214] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden relative ring-1 ring-white/5">
              
              {/* Header */}
              <div className="px-5 py-4 bg-[#1E1E24]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/20 relative">
                    <FiCpu className="text-white w-5 h-5 relative z-10" />
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm tracking-wide">PORTLY AI</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]"></span>
                      <span className="text-[10px] text-white/50 uppercase tracking-wider font-medium">Online</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {chatMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white rounded-tr-sm shadow-md shadow-[#8B5CF6]/10' 
                        : 'bg-[#1E1E24] text-gray-200 border border-white/5 rounded-tl-sm'
                    }`}>
                      <ReactMarkdown components={{
                        strong: ({node, ...props}) => <span className="font-bold text-white" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-4 mt-2 space-y-1 text-white/80" {...props} />,
                        li: ({node, ...props}) => <li className="pl-1" {...props} />,
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />
                      }}>
                        {msg.content}
                      </ReactMarkdown>
                      <p className={`text-[9px] mt-1.5 text-right opacity-60 font-mono tracking-tight ${msg.role === 'user' ? 'text-white' : 'text-gray-400'}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-[#1E1E24] border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center shadow-sm">
                      <span className="w-1.5 h-1.5 bg-[#8B5CF6] rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-[#8B5CF6] rounded-full animate-bounce delay-100"></span>
                      <span className="w-1.5 h-1.5 bg-[#8B5CF6] rounded-full animate-bounce delay-200"></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions Chips */}
              {chatMessages.length < 3 && !userInput && (
                <div className="px-5 pb-2">
                  <p className="text-[9px] text-white/30 uppercase tracking-widest mb-2 ml-1">Suggested Actions</p>
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => setUserInput(s.prompt)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-[#8B5CF6]/30 transition-all whitespace-nowrap group active:scale-95"
                      >
                        <s.icon className="text-[#8B5CF6] w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                        <span className="text-xs text-white/70 font-medium">{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 bg-[#1E1E24] border-t border-white/5 relative z-20">
                <div className="relative flex items-center gap-2">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    placeholder="Ask about crypto, trends, or risks..."
                    className="w-full bg-[#0A0A0B] text-white text-sm rounded-xl pl-4 pr-12 py-3.5 border border-white/10 focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] outline-none transition-all placeholder:text-white/20 shadow-inner"
                  />
                  <button
                    onClick={sendChatMessage}
                    disabled={!userInput.trim() || isTyping}
                    className="absolute right-2 p-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-lg disabled:opacity-50 disabled:bg-white/10 disabled:text-white/20 transition-all shadow-lg shadow-[#8B5CF6]/20 active:scale-95"
                  >
                    <FiSend className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2.5 flex justify-center">
                  <p className="text-[9px] text-white/20 flex items-center gap-1.5 font-medium tracking-wide">
                    <FiZap className="w-3 h-3" /> POWERED BY LLAMA-4 & ALCHEMY
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}