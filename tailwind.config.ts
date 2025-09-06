import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        // Cyberpunk Color Palette
        'cyber-black': '#0A0A0A',
        'cyber-dark': '#1A1A1A',
        'cyber-gray': '#2A2A2A',
        'cyber-light-gray': '#404040',
        
        // Neon Accents
        'neon-cyan': '#00FFFF',
        'neon-magenta': '#FF00FF',
        'neon-lime': '#00FF00',
        'neon-orange': '#FF6600',
        'neon-purple': '#8A2BE2',
        'neon-pink': '#FF1493',
        
        // Status Colors
        'cyber-success': '#00FF88',
        'cyber-warning': '#FFD700',
        'cyber-danger': '#FF0040',
        'cyber-info': '#00BFFF',
        
        // Text Colors
        'cyber-text-primary': '#FFFFFF',
        'cyber-text-secondary': '#B0B0B0',
        'cyber-text-muted': '#808080',
        
        // Legacy colors for compatibility
        'smart-orange': '#FF8B3E',
        'smart-green': '#4EC9B0',
      },
      fontFamily: {
        'cyber': ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        'cyber-heading': ['Orbitron', 'Exo 2', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'neon-flicker': 'neon-flicker 0.15s infinite linear',
        'scan-line': 'scan-line 3s linear infinite',
        'scan-sweep': 'scan-sweep 3s ease-in-out infinite',
        'grid-move': 'grid-move 20s linear infinite',
        'loading-sweep': 'loading-sweep 1.5s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
      },
      keyframes: {
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-5%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        'neon-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'neon-flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
          '25%': { opacity: '0.9' },
          '75%': { opacity: '0.7' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'scan-sweep': {
          '0%': { left: '-100%' },
          '50%': { left: '100%' },
          '100%': { left: '100%' },
        },
        'grid-move': {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(20px, 20px)' },
        },
        'loading-sweep': {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
        'glow-pulse': {
          '0%': { 
            boxShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
          },
          '100%': { 
            boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cyber-grid': `
          linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
        `,
        'neon-gradient': 'linear-gradient(45deg, #00FFFF, #FF00FF, #00FF00)',
      },
      boxShadow: {
        'neon-cyan': '0 0 5px #00FFFF, 0 0 10px #00FFFF, 0 0 15px #00FFFF',
        'neon-magenta': '0 0 5px #FF00FF, 0 0 10px #FF00FF, 0 0 15px #FF00FF',
        'neon-lime': '0 0 5px #00FF00, 0 0 10px #00FF00, 0 0 15px #00FF00',
        'neon-danger': '0 0 5px #FF0040, 0 0 10px #FF0040, 0 0 15px #FF0040',
        'cyber-card': '0 0 20px rgba(0, 255, 255, 0.3), inset 0 0 20px rgba(0, 255, 255, 0.1)',
      },
      textShadow: {
        'neon-cyan': '0 0 5px #00FFFF, 0 0 10px #00FFFF, 0 0 15px #00FFFF',
        'neon-magenta': '0 0 5px #FF00FF, 0 0 10px #FF00FF, 0 0 15px #FF00FF',
        'neon-lime': '0 0 5px #00FF00, 0 0 10px #00FF00, 0 0 15px #00FF00',
        'neon-danger': '0 0 5px #FF0040, 0 0 10px #FF0040, 0 0 15px #FF0040',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
