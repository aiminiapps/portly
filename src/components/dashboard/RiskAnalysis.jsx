'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const defaultTasks = [
  {
    id: 1,
    title: 'Connect Your Wallet',
    description: 'Link your wallet to start earning rewards',
    reward: 100,
    icon: '🔗',
    category: 'onboarding',
    completed: true,
  },
  {
    id: 2,
    title: 'Complete Portfolio Analysis',
    description: 'Let AI analyze your first portfolio',
    reward: 150,
    icon: '📊',
    category: 'onboarding',
    completed: false,
  },
  {
    id: 3,
    title: 'Ask AI 5 Questions',
    description: 'Engage with the AI advisor',
    reward: 200,
    icon: '💬',
    category: 'engagement',
    completed: false,
    progress: 0,
    total: 5,
  },
  {
    id: 4,
    title: 'Share on Twitter',
    description: 'Share your portfolio insights',
    reward: 250,
    icon: '🐦',
    category: 'social',
    completed: false,
  },
  {
    id: 5,
    title: 'Invite 3 Friends',
    description: 'Get bonus tokens for referrals',
    reward: 500,
    icon: '👥',
    category: 'referral',
    completed: false,
    progress: 0,
    total: 3,
  },
  {
    id: 6,
    title: 'Check Daily Report',
    description: 'Review your portfolio daily for 7 days',
    reward: 300,
    icon: '📅',
    category: 'streak',
    completed: false,
    progress: 0,
    total: 7,
  },
];

export default function TaskCenter({ walletAddress, completedTasks = [] }) {
  const [tasks, setTasks] = useState(defaultTasks);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Tasks', icon: '📋' },
    { id: 'onboarding', name: 'Getting Started', icon: '🚀' },
    { id: 'engagement', name: 'Engagement', icon: '⚡' },
    { id: 'social', name: 'Social', icon: '🌐' },
    { id: 'referral', name: 'Referrals', icon: '🎁' },
  ];

  const totalRewards = tasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + t.reward, 0);

  const filteredTasks =
    selectedCategory === 'all'
      ? tasks
      : tasks.filter((t) => t.category === selectedCategory);

  const handleCompleteTask = async (taskId) => {
    // TODO: Integrate with backend to verify and award tokens
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: true } : task
      )
    );

    // Show success notification
    // TODO: Add toast notification
    console.log(`Task ${taskId} completed! Tokens awarded to ${walletAddress}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 space-y-6"
    >
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#F9FAFB]">Task Center</h3>
          <div className="px-3 py-1.5 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20">
            <span className="text-sm font-semibold text-[#8B5CF6]">
              {totalRewards} Tokens
            </span>
          </div>
        </div>

        {/* Total Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#9CA3AF]">Overall Progress</span>
            <span className="text-[#E5E7EB] font-medium">
              {tasks.filter((t) => t.completed).length} / {tasks.length}
            </span>
          </div>
          <div className="h-2 bg-[#1E1F26] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${(tasks.filter((t) => t.completed).length / tasks.length) * 100}%`,
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6]"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#242437]">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white'
                  : 'bg-[#1E1F26] text-[#9CA3AF] hover:text-[#E5E7EB]'
              }`}
            >
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#242437]">
        <AnimatePresence>
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-xl border transition-all ${
                task.completed
                  ? 'bg-[#4ADE80]/5 border-[#4ADE80]/20'
                  : 'bg-[#1E1F26] border-[#242437] hover:border-[#8B5CF6]/50'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 ${
                    task.completed
                      ? 'bg-[#4ADE80]/10'
                      : 'bg-[#8B5CF6]/10'
                  }`}
                >
                  {task.completed ? '✓' : task.icon}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <div>
                    <h4 className="text-sm font-semibold text-[#F9FAFB]">
                      {task.title}
                    </h4>
                    <p className="text-xs text-[#9CA3AF] mt-1">
                      {task.description}
                    </p>
                  </div>

                  {/* Progress Bar (if applicable) */}
                  {task.progress !== undefined && task.total && !task.completed && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#9CA3AF]">Progress</span>
                        <span className="text-[#E5E7EB] font-medium">
                          {task.progress} / {task.total}
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#16171D] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6]"
                          style={{ width: `${(task.progress / task.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Reward & Action */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg">🪙</span>
                      <span className="text-sm font-semibold text-[#8B5CF6]">
                        +{task.reward}
                      </span>
                    </div>

                    {!task.completed && (
                      <button
                        onClick={() => handleCompleteTask(task.id)}
                        className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white text-xs font-medium hover:shadow-lg hover:shadow-[#8B5CF6]/20 transition-all"
                      >
                        Complete
                      </button>
                    )}

                    {task.completed && (
                      <span className="text-xs font-medium text-[#4ADE80] flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Claim All Button */}
      {totalRewards > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full btn-primary py-4 flex items-center justify-center gap-2"
        >
          <span>Claim {totalRewards} Tokens</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </motion.button>
      )}
    </motion.div>
  );
}
