'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSend, FiZap, FiCpu } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';

export default function AIAgentModal({ isOpen, onClose, portfolioData, walletAddress }) {
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: `## Welcome to PORTLY.AI Assistant! 👋\n\nI've analyzed your portfolio:\n\n- **Total Assets**: ${portfolioData?.assets?.length || 0}\n- **Portfolio Value**: $${portfolioData?.totalValue?.toFixed(2) || 0}\n- **24h Change**: ${portfolioData?.changePercent?.toFixed(2) || 0}%\n\nHow can I help you optimize your crypto holdings today?`,
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
              content: `You are an AI portfolio advisor for PORTLY.AI. Provide insights in markdown format.
              
Current portfolio:
- Total Value: $${portfolioData?.totalValue?.toFixed(2) || 0}
- Assets: ${portfolioData?.assets?.length || 0}
- 24h Change: ${portfolioData?.changePercent?.toFixed(2) || 0}%
- Risk Score: ${portfolioData?.riskScore?.toFixed(1) || 'N/A'}/10
- Top Holdings: ${portfolioData?.assets?.slice(0, 3).map(a => `${a.symbol} ($${a.value.toFixed(2)})`).join(', ') || 'None'}

Use markdown formatting with:
- **Bold** for emphasis
- ## Headers for sections
- • Bullet points for lists
- \`code\` for numbers/values

Be concise, actionable, and data-driven.`
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
        const responseContent = data.reply || 'I apologize, but I encountered an issue. Please try again.';

        const assistantMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: responseContent,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setChatMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    { icon: FiZap, text: 'Analyze my risk exposure', prompt: 'Analyze my portfolio risk and suggest improvements' },
    { icon: FiCpu, text: 'Top performers', prompt: 'Which assets are performing best and why?' },
    { icon: FiZap, text: 'Diversification tips', prompt: 'How can I improve my portfolio diversification?' },
    { icon: FiCpu, text: 'Rebalancing strategy', prompt: 'Should I rebalance my portfolio? Give me a strategy.' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:right-6 md:top-20 md:bottom-6 md:w-[500px] z-50"
          >
            <div className="glass-card h-full flex flex-col overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="p-6 border-b border-[#242437] bg-gradient-to-r from-[#7C3AED]/10 to-[#8B5CF6]/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center pulse-glow">
                      <FiCpu className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[#F9FAFB]">AI Portfolio Advisor</h2>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse"></div>
                        <span className="text-xs text-[#9CA3AF]">Powered by Llama 4</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-[#1E1F26] transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Quick Prompts */}
              <div className="p-4 border-b border-[#242437] bg-[#16171D]/50">
                <div className="grid grid-cols-2 gap-2">
                  {quickPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setUserInput(prompt.prompt)}
                      className="flex items-center gap-2 p-3 rounded-lg bg-[#1E1F26]/50 border border-[#242437] hover:border-[#8B5CF6] transition-all text-left group"
                    >
                      <prompt.icon className="w-4 h-4 text-[#8B5CF6] group-hover:scale-110 transition-transform" />
                      <span className="text-xs text-[#9CA3AF] group-hover:text-[#E5E7EB]">{prompt.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white'
                          : 'bg-[#1E1F26] text-[#E5E7EB] border border-[#242437]'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <ReactMarkdown
                          className="prose prose-invert prose-sm max-w-none"
                          components={{
                            h2: ({node, ...props}) => <h2 className="text-lg font-bold text-[#8B5CF6] mt-3 mb-2" {...props} />,
                            strong: ({node, ...props}) => <strong className="text-[#A78BFA] font-semibold" {...props} />,
                            code: ({node, ...props}) => <code className="bg-[#0F0F14] px-1.5 py-0.5 rounded text-[#8B5CF6]" {...props} />,
                            ul: ({node, ...props}) => <ul className="space-y-1 my-2" {...props} />,
                            li: ({node, ...props}) => <li className="text-sm" {...props} />
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      )}
                      <p className="text-xs opacity-60 mt-2">{message.timestamp}</p>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-[#1E1F26] border border-[#242437] rounded-2xl px-4 py-3">
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-[#8B5CF6] rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 150}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-[#242437] bg-[#16171D]/50">
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
                    className="btn-3d p-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiSend className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
