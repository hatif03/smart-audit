import Image from "next/image";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { SecurityIcon, GasIcon, CodeIcon, AIIcon, ComplianceIcon, ReportIcon } from "@/components/Icons";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cyber-black flex flex-col relative overflow-hidden">
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 cyber-grid-bg"></div>
      
      {/* Scan Line Effect */}
      <div className="absolute inset-0 scan-line"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-neon-cyan/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-neon-magenta/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-neon-lime/10 rounded-full blur-xl animate-pulse delay-2000"></div>
      
      <div className="absolute top-4 right-4 text-cyber-text-secondary font-cyber text-sm">
        <span className="text-neon-cyan">[</span>SYSTEM<span className="text-neon-cyan">]</span> ETH_TICKER_ACTIVE
      </div>

      <main className="max-w-7xl mx-auto px-4 py-20 flex-1 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-7xl font-bold font-cyber-heading mb-6">
            <span className="text-glow-cyan">SMART</span> <span className="text-glow-magenta">CONTRACT</span>
            <br />
            <span className="text-glow-lime">SECURITY</span>
          </h1>
          <p className="text-cyber-text-secondary text-xl font-cyber max-w-3xl mx-auto">
            <span className="text-neon-cyan">[</span>AI_POWERED<span className="text-neon-cyan">]</span> 
            Securing your blockchain future with real-time analysis
          </p>
        </div>

        <div className="flex justify-center gap-8 mb-20">
          <a
            href="/audit"
            className="group relative inline-flex items-center gap-3 px-10 py-5 
                     btn-cyber text-lg font-bold font-cyber-heading
                     hover:scale-105 transition-all duration-300"
          >
            <span className="relative z-10 text-glow-cyan">[START_AUDIT]</span>
            <svg 
              className="w-6 h-6 transform transition-transform duration-300 
                         group-hover:translate-x-1 text-glow-cyan" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>

          <a
            href="https://github.com/smart-support/smart-audit/blob/main/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 px-10 py-5
                     bg-cyber-dark border-2 border-neon-magenta rounded-lg
                     text-cyber-text-primary text-lg font-bold font-cyber-heading
                     transition-all duration-300 hover:scale-105
                     hover:shadow-neon-magenta"
          >
            <span className="text-glow-magenta">[DOCS]</span>
            <svg 
              className="w-6 h-6 text-glow-magenta" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="cyber-card p-8 group hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-neon-cyan/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-neon-cyan/30 transition-colors">
              <svg className="w-8 h-8 text-neon-cyan text-glow-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold font-cyber-heading text-glow-cyan mb-4">SECURITY_AUDIT</h3>
            <p className="text-cyber-text-secondary font-cyber leading-relaxed">
              <span className="text-neon-cyan">[</span>COMPREHENSIVE<span className="text-neon-cyan">]</span> 
              Vulnerability detection and security risk assessment
            </p>
          </div>

          <div className="cyber-card p-8 group hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-neon-lime/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-neon-lime/30 transition-colors">
              <svg className="w-8 h-8 text-neon-lime text-glow-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold font-cyber-heading text-glow-lime mb-4">GAS_OPTIMIZATION</h3>
            <p className="text-cyber-text-secondary font-cyber leading-relaxed">
              <span className="text-neon-lime">[</span>SMART_ANALYSIS<span className="text-neon-lime">]</span> 
              Minimizing transaction costs and gas consumption
            </p>
          </div>

          <div className="cyber-card p-8 group hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-neon-magenta/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-neon-magenta/30 transition-colors">
              <svg className="w-8 h-8 text-neon-magenta text-glow-magenta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold font-cyber-heading text-glow-magenta mb-4">AI_REPORTS</h3>
            <p className="text-cyber-text-secondary font-cyber leading-relaxed">
              <span className="text-neon-magenta">[</span>COMPREHENSIVE<span className="text-neon-magenta">]</span> 
              Audit reports powered by multiple AI models
            </p>
          </div>

          <div className="cyber-card p-8 group hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-neon-orange/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-neon-orange/30 transition-colors">
              <svg className="w-8 h-8 text-neon-orange text-glow-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold font-cyber-heading text-glow-orange mb-4">MULTI_MODEL_AI</h3>
            <p className="text-cyber-text-secondary font-cyber leading-relaxed">
              <span className="text-neon-orange">[</span>COMBINED_INSIGHTS<span className="text-neon-orange">]</span> 
              Enhanced security coverage from multiple AI models
            </p>
          </div>

          <div className="cyber-card p-8 group hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-neon-purple/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-neon-purple/30 transition-colors">
              <svg className="w-8 h-8 text-neon-purple text-glow-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" 
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold font-cyber-heading text-glow-purple mb-4">MULTI_CHAIN</h3>
            <p className="text-cyber-text-secondary font-cyber leading-relaxed">
              <span className="text-neon-purple">[</span>UNIFIED_ANALYSIS<span className="text-neon-purple">]</span> 
              Ethereum, Base, Arbitrum and other chains
            </p>
          </div>

          <div className="cyber-card p-8 group hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-cyber-danger/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-cyber-danger/30 transition-colors">
              <svg className="w-8 h-8 text-cyber-danger text-glow-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold font-cyber-heading text-glow-danger mb-4">SUPER_PROMPT</h3>
            <p className="text-cyber-text-secondary font-cyber leading-relaxed">
              <span className="text-cyber-danger">[</span>ENHANCED_ANALYSIS<span className="text-cyber-danger">]</span> 
              Specialized prompts for deeper security insights
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t-2 border-neon-cyan mt-auto bg-cyber-dark/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-6 text-sm font-cyber">
            <div className="text-cyber-text-secondary">
              <span className="text-neon-cyan">[</span>COPYRIGHT<span className="text-neon-cyan">]</span> 
              2024 smart-support. Licensed under{" "}
              <a
                href="https://github.com/smart-support/smart-audit/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon-cyan hover:text-glow-cyan transition-all duration-300"
              >
                AGPL-3.0
              </a>
            </div>
            <div className="w-px h-6 bg-neon-cyan"></div>
            <a
              href="https://github.com/smart-support/smart-audit"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-2 text-cyber-text-secondary hover:text-glow-cyan transition-all duration-300"
              aria-label="View on GitHub"
            >
              <svg
                className="w-6 h-6 group-hover:scale-110 transition-transform duration-300"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
