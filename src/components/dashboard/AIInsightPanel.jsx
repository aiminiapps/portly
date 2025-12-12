'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIInsightPanel({ portfolioData, walletAddress }) {
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: `Welcome! I've analyzed your portfolio. You're holding ${portfolioData?.assets?.length || 0} assets with a total value of $${portfolioData?.totalValue?.toFixed(2) || 0}. How can I help you today?`,
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
  }, [chatMessages]);

  const sendChatMessage = async () => {
    if (!userInput.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: userInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMessage]);
    const currentInput = userInput;
    setUserInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are an AI portfolio advisor for PORTLY.AI, a crypto portfolio management platform. Help users understand their crypto investments and make informed decisions.
              
              Current user portfolio:
              - Total Value: $${portfolioData?.totalValue?.toFixed(2) || 0}
              - Assets: ${portfolioData?.assets?.length || 0}
              - 24h Change: ${portfolioData?.changePercent?.toFixed(2) || 0}%
              - Risk Score: ${portfolioData?.riskScore?.toFixed(1) || 'N/A'}/10
              - Risk Profile: ${portfolioData?.riskProfile || 'Unknown'}
              - Top Holdings: ${portfolioData?.assets?.slice(0, 3).map(a => `${a.symbol} ($${a.value.toFixed(2)})`).join(', ') || 'None'}
              
              Provide helpful, actionable insights about:
              - Portfolio diversification and risk management
              - Asset allocation recommendations
              - Market trends and their impact
              - Profit/loss analysis
              - Rebalancing strategies
              
              Be concise, professional, and encouraging. Use specific numbers from their portfolio when relevant.`
            },
            ...chatMessages.slice(-6).map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: "user",
              content: currentInput
            }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Your API returns { reply: "content" }
        const responseContent = data.reply || generateFallbackResponse(currentInput, portfolioData);

        const assistantMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: responseContent,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setChatMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      console.error('Chat error:', error);

      const fallbackMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: generateFallbackResponse(currentInput, portfolioData),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateFallbackResponse = (input, data) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('risk') || lowerInput.includes('safe')) {
      return `Your current risk score is ${data?.riskScore?.toFixed(1) || 'N/A'}/10, indicating a ${data?.riskProfile || 'balanced'} portfolio. Consider diversifying across different asset types to manage risk effectively.`;
    }
    
    if (lowerInput.includes('profit') || lowerInput.includes('loss') || lowerInput.includes('pnl')) {
      const change = data?.change24h || 0;
      return `In the last 24 hours, your portfolio ${change >= 0 ? 'gained' : 'lost'} $${Math.abs(change).toFixed(2)} (${data?.changePercent?.toFixed(2)}%). ${change >= 0 ? 'Great performance!' : 'Market fluctuations are normal.'}`;
    }
    
    if (lowerInput.includes('diversif') || lowerInput.includes('allocation')) {
      return `You're currently holding ${data?.assets?.length || 0} different assets. For optimal diversification, consider spreading your investments across 5-10 quality projects in different sectors.`;
    }
    
    return `I can help you analyze your portfolio of ${data?.assets?.length || 0} assets valued at $${data?.totalValue?.toFixed(2) || 0}. Ask me about risk management, diversification, or specific asset performance!`;
  };

  const quickActions = [
    { label: 'Analyze Risk', prompt: 'Analyze my portfolio risk' },
    { label: 'Best Performers', prompt: 'Which are my best performing assets?' },
    { label: 'Diversify', prompt: 'How can I diversify better?' },
    { label: 'Rebalance', prompt: 'Should I rebalance my portfolio?' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card p-6 flex flex-col h-[600px]"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#242437]">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-[#F9FAFB]">AI Portfolio Advisor</h3>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse"></div>
            <p className="text-xs text-[#9CA3AF]">Powered by Llama 4</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => {
              setUserInput(action.prompt);
            }}
            className="px-3 py-1.5 rounded-lg bg-[#1E1F26] border border-[#242437] text-xs text-[#9CA3AF] hover:border-[#8B5CF6] hover:text-[#8B5CF6] transition-all"
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin scrollbar-thumb-[#242437] scrollbar-track-transparent">
        <AnimatePresence>
          {chatMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white'
                    : 'bg-[#1E1F26] text-[#E5E7EB]'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className="text-xs opacity-60 mt-1">{message.timestamp}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-[#1E1F26] rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#8B5CF6] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-[#8B5CF6] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-[#8B5CF6] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
          placeholder="Ask about your portfolio..."
          className="flex-1 px-4 py-3 bg-[#1E1F26] border border-[#242437] rounded-xl text-sm text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6] transition-colors"
        />
        <button
          onClick={sendChatMessage}
          disabled={!userInput.trim() || isTyping}
          className="btn-primary px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
