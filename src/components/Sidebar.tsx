"use client";

import { useState } from "react";

interface SidebarProps {
  items: Array<{
    icon: React.ReactNode;
    label: string;
  }>;
}

export function Sidebar({ items }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <div 
        className={`fixed right-0 top-0 h-screen flex transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-8px)]'
        }`}
      >
        {/* Cyberpunk Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-20 w-2 flex items-center justify-center self-center -ml-2 rounded-l
            bg-cyber-dark/80 backdrop-blur-cyber hover:bg-cyber-gray transition-all duration-300
            border border-r-0 border-neon-cyan/30
            hover:border-neon-cyan/60 hover:shadow-neon-cyan/20"
          title={isOpen ? "Hide Sidebar" : "Show Sidebar"}
        >
          <svg
            className={`w-4 h-4 text-neon-cyan transition-all duration-300 animate-neon-pulse ${
              isOpen ? 'rotate-0' : 'rotate-180'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
            />
          </svg>
        </button>

        {/* Cyberpunk Sidebar Content */}
        <div className="w-16 cyber-card h-screen flex flex-col items-center relative overflow-hidden">
          {/* Animated scan line */}
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-neon-cyan to-transparent animate-scan-sweep"></div>
          
          <div className="flex-1 flex flex-col items-center justify-center gap-8 py-12 relative z-10">
            {items.map((item, index) => (
              <div
                key={index}
                className="p-2 hover:bg-neon-cyan/10 rounded-lg cursor-pointer group transition-all duration-300
                         hover:shadow-neon-cyan/20 hover:scale-110"
                title={item.label}
              >
                <div className="group-hover:animate-neon-pulse">
                  {item.icon}
                </div>
              </div>
            ))}
          </div>
          
          {/* Cyberpunk corner decorations */}
          <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-neon-cyan/50"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-neon-cyan/50"></div>
        </div>
      </div>
    </>
  );
} 