"use client";

import { useState } from 'react';
import { useAIConfig } from '@/utils/ai';
import Image from 'next/image';
import Link from 'next/link';
import HeaderAIConfig from '@/components/audit/HeaderAIConfig';

export default function Header() {
  const [isAIConfigOpen, setIsAIConfigOpen] = useState(false);
  const { config } = useAIConfig();

  const getCurrentModelName = () => {
    if (config.provider === "gpt") {
      return "GPT";
    } else if (config.provider === "claude") {
      return "Claude";
    } else if (config.provider === "gemini") {
      return "Gemini";
    } else if (config.provider === "xai") {
      return "xAI";
    }
    return "AI";
  };

  return (
    <>
      <header className="border-b border-neon-cyan/30 bg-gradient-to-r from-cyber-black via-cyber-dark to-cyber-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-neon-cyan to-transparent animate-scan-sweep"></div>
        <nav className="max-w-7xl mx-auto px-4 py-4 relative z-10">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 group">
              <div className="relative">
                <Image
                  src="/smart-audit-logo.svg"
                  alt="Smart Audit Logo"
                  width={32}
                  height={32}
                  priority
                  className="filter drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                />
                <div className="absolute inset-0 bg-neon-cyan/20 rounded-full blur-md animate-pulse"></div>
              </div>
              <span className="text-xl font-bold cyber-text-primary animate-neon-pulse">
                Smart <span className="text-neon-cyan animate-neon-flicker">Audit</span>
              </span>
            </Link>
            
            {/* Navigation Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                href="/audit" 
                className="cyber-text-secondary hover:text-neon-cyan transition-all duration-300 hover:animate-neon-pulse"
              >
                Start Audit
              </Link>
              <button
                onClick={() => setIsAIConfigOpen(true)}
                className="cyber-text-secondary hover:text-neon-cyan transition-all duration-300 hover:animate-neon-pulse flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {getCurrentModelName()}
              </button>
              <a 
                href="https://github.com/hatif03/smart-audit/blob/main/README.md" 
                target="_blank" 
                rel="noopener noreferrer"
                className="cyber-text-secondary hover:text-neon-cyan transition-all duration-300 hover:animate-neon-pulse"
              >
                Docs
              </a>
              <a 
                href="https://github.com/hatif03/smart-audit" 
                target="_blank" 
                rel="noopener noreferrer"
                className="cyber-text-secondary hover:text-neon-cyan transition-all duration-300 hover:animate-neon-pulse"
              >
                GitHub
              </a>
            </div>
            
            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 cyber-text-secondary hover:text-neon-cyan transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-neon-cyan/50"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-neon-cyan/50"></div>
      </header>

      {/* AI Configuration Modal */}
      <HeaderAIConfig 
        isOpen={isAIConfigOpen} 
        onClose={() => setIsAIConfigOpen(false)} 
      />
    </>
  );
}
