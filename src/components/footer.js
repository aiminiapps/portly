'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { FaXTwitter } from "react-icons/fa6";
import { LiaTelegramPlane } from "react-icons/lia";
import { SiBnbchain } from "react-icons/si";
import Image from 'next/image';

const SocialLink = ({ href, icon: Icon, label }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 group p-2"
    whileHover={{ y: -3 }}
  >
    <div className="relative p-3 rounded-xl bg-white/5 border border-white/10 overflow-hidden group-hover:border-[#8B5CF6]/50 transition-colors duration-300">
      {/* Icon */}
      <Icon className="text-xl text-gray-400 group-hover:text-white relative z-10 transition-colors" />
      
      {/* Hover Gradient Fill */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#8B5CF6] to-[#3B82F6] opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
    </div>
    <span className="hidden sm:block text-sm font-medium text-gray-400 group-hover:text-white transition-colors">{label}</span>
  </motion.a>
);

const NavLink = ({ href, label }) => (
  <a href={href} className="text-sm font-medium text-gray-400 hover:text-white transition-colors py-2 px-4 relative group">
    {label}
    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#8B5CF6] group-hover:w-full transition-all duration-300" />
  </a>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="relative w-full bg-[#050509] overflow-hidden flex flex-col pt-10">
      {/* Content Area */}
      <div className="relative z-20 w-full bg-[#08080C] border-t border-white/5 backdrop-blur-sm bg-opacity-90">
        
        {/* Top Glow Line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6]/50 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            
            {/* Brand */}
            <div className="flex items-center gap-4">
              <Image src='/logo.png' alt='logo' width={150} height={60}/>
            </div>

            {/* Links */}
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <nav className="flex items-center gap-2">
                <NavLink href="/ai" label="Agent Dashboard" />
                <NavLink href="/ai#tasks" label="Rewards" />
              </nav>
              
              <div className="w-12 h-px bg-white/10 lg:w-px lg:h-8" />

              <div className="flex items-center gap-3">
                <SocialLink href="https://twitter.com" icon={FaXTwitter} label="X" />
                <SocialLink href="https://telegram.org" icon={LiaTelegramPlane} label="Telegram" />
                <SocialLink href="https://bscscan.com" icon={SiBnbchain} label="Scan" />
              </div>
            </div>

          </div>

          <div className="mt-10 flex flex-col sm:flex-row justify-between items-center border-t border-white/5 pt-6 text-xs text-gray-600">
            <p>© {currentYear} Portly Project. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;