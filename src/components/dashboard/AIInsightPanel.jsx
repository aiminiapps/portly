'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { FiSend, FiCpu, FiUser, FiZap, FiRefreshCw, FiArrowRight } from 'react-icons/fi';

export default function AIInsightPanel({ portfolioData, walletAddress }) {
  // 1. Data Merging (Props + Local Cache)
  const [data, setData] = useState(portfolioData);
  
  useEffect(() => {
    if (portfolioData) {
      setData(portfolioData);
    } else {
      // Fallback to local storage if props are missing
      const cached = localStorage.getItem('portly_data_cache');
      if (cached) {
        try { setData(JSON.parse(cached)); } catch (e) {}
      }
    }
  }, [portfolioData]);

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: `**System Online.** 🟢\n\nI've synchronized with your wallet. I see **${data?.assets?.length || 0} assets** worth **$${data?.totalValue?.toLocaleString() || '0.00'}**.\n\nReady to analyze risk, predict trends, or optimize yields. What's your move?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  const sendChatMessage = async (text = userInput) => {
    if (!text.trim() || isTyping) return;

    // Add User Message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsTyping(true);

    try {
      // Prepare Context for AI
      const systemContext = `
        You are PORTLY.AI, an elite crypto portfolio strategist. 
        User Data:
        - Total Value: $${data?.totalValue?.toFixed(2) || 0}
        - 24h Change: ${data?.changePercent?.toFixed(2) || 0}%
        - Risk Score: ${data?.riskScore || 'N/A'}/10
        - Assets: ${data?.assets?.map(a => `${a.symbol} ($${a.value.toFixed(0)})`).join(', ') || 'None'}
        
        Guidelines:
        - Use Markdown (bold keys, bullet points).
        - Be concise, data-driven, and slightly futuristic/professional tone.
        - Focus on actionable financial advice (Risk, Rebalancing, Opportunities).
      `;

      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemContext },
            ...chatMessages.slice(-4).map(msg => ({ role: msg.role, content: msg.content })),
            { role: "user", content: text }
          ]
        })
      });

      if (response.ok) {
        const resData = await response.json();
        const botMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: resData.reply || "I'm recalibrating my neural net. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error("AI Offline");
      }
    } catch (error) {
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: "⚠️ **Connection Error**: Unable to reach neural core. Please check your connection.",
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    { label: '🛡️ Analyze Risk', prompt: 'Analyze my portfolio risk factors deeply.' },
    { label: '🚀 Growth Potentials', prompt: 'Which of my assets has the highest growth potential right now?' },
    { label: '⚖️ Rebalance', prompt: 'Suggest a rebalancing strategy for better stability.' },
    { label: '⛽ Gas Strategy', prompt: 'What is the best time to trade to save gas fees?' }
  ];

  return (
    <div className="flex flex-col h-[600px] w-full rounded-[2rem] border border-white/5 bg-[#121214]/80 backdrop-blur-2xl relative overflow-hidden shadow-2xl">
      
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between p-5 border-b border-white/5 bg-[#121214]/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <FiCpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm tracking-wide">PORTLY<span className="text-[#8B5CF6]">.AI</span></h3>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <p className="text-[10px] text-emerald-400 font-mono">NEURAL NET ACTIVE</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setChatMessages([])} 
          className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"
          title="Clear Chat"
        >
          <FiRefreshCw />
        </button>
      </div>

      {/* --- CHAT AREA --- */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        
        {chatMessages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-white/10' : 'bg-[#8B5CF6]/20'
            }`}>
              {msg.role === 'user' ? <FiUser className="w-4 h-4 text-white" /> : <FiZap className="w-4 h-4 text-[#8B5CF6]" />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-lg ${
              msg.role === 'user' 
                ? 'bg-[#8B5CF6] text-white rounded-tr-sm' 
                : 'bg-[#1E1E24] border border-white/5 text-gray-200 rounded-tl-sm'
            }`}>
              {msg.role === 'assistant' ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown 
                    components={{
                      strong: ({node, ...props}) => <span className="font-bold text-[#8B5CF6]" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1 my-2" {...props} />,
                      li: ({node, ...props}) => <li className="text-xs marker:text-[#8B5CF6]" {...props} />,
                      p: ({node, ...props}) => <p className="leading-relaxed text-sm mb-2 last:mb-0" {...props} />
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm">{msg.content}</p>
              )}
              <p className="text-[10px] opacity-40 mt-2 text-right">{msg.timestamp}</p>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center">
              <FiZap className="w-4 h-4 text-[#8B5CF6]" />
            </div>
            <div className="bg-[#1E1E24] border border-white/5 rounded-2xl p-4 rounded-tl-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#8B5CF6] rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-[#8B5CF6] rounded-full animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 bg-[#8B5CF6] rounded-full animate-bounce delay-200"></span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* --- INPUT AREA --- */}
      <div className="p-5 border-t border-white/5 bg-[#121214]/80 backdrop-blur-md">
        
        {/* Quick Suggestions */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-hide mask-fade-right">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => sendChatMessage(s.prompt)}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] text-white/60 hover:bg-[#8B5CF6]/20 hover:text-[#8B5CF6] hover:border-[#8B5CF6]/50 transition-all whitespace-nowrap"
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Input Field */}
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
            placeholder="Ask anything about your assets..."
            className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl py-3.5 pl-4 pr-12 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#8B5CF6]/50 focus:ring-1 focus:ring-[#8B5CF6]/50 transition-all"
          />
          <button
            onClick={() => sendChatMessage()}
            disabled={!userInput.trim() || isTyping}
            className="absolute right-2 p-2 rounded-lg bg-[#8B5CF6] text-white shadow-lg hover:shadow-[#8B5CF6]/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isTyping ? <FiRefreshCw className="w-4 h-4 animate-spin" /> : <FiArrowRight className="w-4 h-4" />}
          </button>
        </div>
        
        <div className="text-center mt-2">
          <p className="text-[9px] text-white/20">AI Guidance can be inaccurate. Always DYOR.</p>
        </div>
      </div>
    </div>
  );
}