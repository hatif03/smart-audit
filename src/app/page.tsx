import Image from "next/image";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { SecurityIcon, GasIcon, CodeIcon, AIIcon, ComplianceIcon, ReportIcon } from "@/components/Icons";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cyber-black flex flex-col relative overflow-hidden">
      {/* Cyberpunk Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-black via-cyber-dark to-cyber-black"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-cyber-grid opacity-20"></div>
      
      {/* Floating particles effect */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-1 h-1 bg-neon-magenta rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-neon-lime rounded-full animate-pulse delay-2000"></div>
      <div className="absolute top-60 left-1/3 w-1 h-1 bg-neon-purple rounded-full animate-pulse delay-3000"></div>
      <div className="absolute bottom-60 right-1/3 w-1.5 h-1.5 bg-neon-orange rounded-full animate-pulse delay-4000"></div>
      
      <div className="absolute top-4 right-4 cyber-text-secondary animate-neon-flicker hidden sm:block">
        The ticker is ETH
      </div>

      <main className="max-w-7xl mx-auto px-4 py-20 flex-1 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-neon-cyan/10 border border-neon-cyan/30 rounded-full text-neon-cyan text-sm font-medium animate-neon-pulse hover:bg-neon-cyan/20 transition-colors cursor-default">
              🚀 AI-Powered Security Analysis
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold cyber-text-primary mb-6 animate-neon-pulse leading-tight">
            Smart Contract <br />
            <span className="text-neon-cyan animate-neon-flicker bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent">
              Security Platform
            </span>
          </h1>
          
          <p className="cyber-text-secondary text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Comprehensive vulnerability detection and security analysis powered by multiple AI models. 
            Secure your blockchain future with real-time, multi-chain analysis.
          </p>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12 px-4">
            <a
              href="/audit"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 
                       cyber-card rounded-lg text-neon-cyan text-lg font-medium
                       transition-all duration-300 ease-out
                       hover:shadow-neon-cyan hover:scale-105
                       cyber-loading min-w-[200px]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="relative z-10 animate-neon-pulse">Start Free Audit</span>
              <svg 
                className="w-5 h-5 transform transition-transform duration-300 
                           group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>


            <a
              href="https://github.com/hatif03/smart-audit/blob/main/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 
                       cyber-card rounded-lg cyber-text-secondary text-lg font-medium
                       transition-all duration-300
                       hover:shadow-neon-lime hover:scale-105 hover:text-neon-lime
                       min-w-[200px]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="relative z-10">Documentation</span>
            </a>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto px-4">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-neon-cyan animate-neon-pulse">1000+</div>
              <div className="text-sm cyber-text-secondary">Contracts Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-neon-magenta animate-neon-pulse">5+</div>
              <div className="text-sm cyber-text-secondary">AI Models</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-neon-lime animate-neon-pulse">10+</div>
              <div className="text-sm cyber-text-secondary">Blockchain Networks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-neon-orange animate-neon-pulse">99.9%</div>
              <div className="text-sm cyber-text-secondary">Accuracy Rate</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold cyber-text-primary mb-4 animate-neon-pulse">
              Why Choose <span className="text-neon-cyan">Smart Audit</span>?
            </h2>
            <p className="cyber-text-secondary text-lg max-w-2xl mx-auto">
              Advanced AI-powered security analysis with comprehensive coverage and detailed reporting
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="cyber-card p-8 rounded-xl group hover:shadow-neon-cyan transition-all duration-300 hover:scale-105 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-neon-cyan/5 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-neon-cyan/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-neon-cyan/20 transition-colors">
                  <svg className="w-8 h-8 text-neon-cyan animate-neon-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold cyber-text-primary mb-4 animate-neon-pulse">Security Audit</h3>
                <p className="cyber-text-secondary mb-4 leading-relaxed">
                  Comprehensive vulnerability detection and security risk assessment with real-time analysis.
                </p>
                <div className="flex items-center text-neon-cyan text-sm font-medium group-hover:animate-neon-pulse">
                  Learn more
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="cyber-card p-8 rounded-xl group hover:shadow-neon-orange transition-all duration-300 hover:scale-105 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-neon-orange/5 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-neon-orange/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-neon-orange/20 transition-colors">
                  <svg className="w-8 h-8 text-neon-orange animate-neon-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold cyber-text-primary mb-4 animate-neon-pulse">Gas Optimization</h3>
                <p className="cyber-text-secondary mb-4 leading-relaxed">
                  Smart analysis for minimizing transaction costs and gas consumption across all operations.
                </p>
                <div className="flex items-center text-neon-orange text-sm font-medium group-hover:animate-neon-pulse">
                  Learn more
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="cyber-card p-8 rounded-xl group hover:shadow-neon-magenta transition-all duration-300 hover:scale-105 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-neon-magenta/5 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-neon-magenta/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-neon-magenta/20 transition-colors">
                  <svg className="w-8 h-8 text-neon-magenta animate-neon-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold cyber-text-primary mb-4 animate-neon-pulse">AI Reports</h3>
                <p className="cyber-text-secondary mb-4 leading-relaxed">
                  Comprehensive audit reports powered by multiple AI models with detailed analysis and recommendations.
                </p>
                <div className="flex items-center text-neon-magenta text-sm font-medium group-hover:animate-neon-pulse">
                  Learn more
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="cyber-card p-8 rounded-xl group hover:shadow-neon-lime transition-all duration-300 hover:scale-105 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-neon-lime/5 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-neon-lime/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-neon-lime/20 transition-colors">
                  <svg className="w-8 h-8 text-neon-lime animate-neon-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold cyber-text-primary mb-4 animate-neon-pulse">Multi-Model Analysis</h3>
                <p className="cyber-text-secondary mb-4 leading-relaxed">
                  Combined insights from multiple AI models for enhanced security coverage and accuracy.
                </p>
                <div className="flex items-center text-neon-lime text-sm font-medium group-hover:animate-neon-pulse">
                  Learn more
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="cyber-card p-8 rounded-xl group hover:shadow-neon-purple transition-all duration-300 hover:scale-105 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-neon-purple/5 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-neon-purple/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-neon-purple/20 transition-colors">
                  <svg className="w-8 h-8 text-neon-purple animate-neon-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold cyber-text-primary mb-4 animate-neon-pulse">Multi-Chain Support</h3>
                <p className="cyber-text-secondary mb-4 leading-relaxed">
                  Unified analysis across Ethereum, Base, Arbitrum and other major blockchain networks.
                </p>
                <div className="flex items-center text-neon-purple text-sm font-medium group-hover:animate-neon-pulse">
                  Learn more
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="cyber-card p-8 rounded-xl group hover:shadow-neon-pink transition-all duration-300 hover:scale-105 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-neon-pink/5 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-neon-pink/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-neon-pink/20 transition-colors">
                  <svg className="w-8 h-8 text-neon-pink animate-neon-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold cyber-text-primary mb-4 animate-neon-pulse">Super Prompt</h3>
                <p className="cyber-text-secondary mb-4 leading-relaxed">
                  Enhanced analysis with specialized prompts for deeper security insights and recommendations.
                </p>
                <div className="flex items-center text-neon-pink text-sm font-medium group-hover:animate-neon-pulse">
                  Learn more
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold cyber-text-primary mb-4 animate-neon-pulse">
              Get Started in <span className="text-neon-cyan">3 Steps</span>
            </h2>
            <p className="cyber-text-secondary text-lg max-w-2xl mx-auto">
              Start securing your smart contracts in minutes with our intuitive platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto px-4">
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-neon-cyan/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-neon-cyan/20 transition-colors">
                  <span className="text-2xl font-bold text-neon-cyan animate-neon-pulse">1</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-neon-cyan rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-cyber-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold cyber-text-primary mb-3">Connect Contract</h3>
              <p className="cyber-text-secondary leading-relaxed">
                Enter your contract address or upload source code for analysis
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-neon-magenta/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-neon-magenta/20 transition-colors">
                  <span className="text-2xl font-bold text-neon-magenta animate-neon-pulse">2</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-neon-magenta rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-cyber-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold cyber-text-primary mb-3">AI Analysis</h3>
              <p className="cyber-text-secondary leading-relaxed">
                Our AI models analyze your contract for vulnerabilities and optimizations
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-neon-lime/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-neon-lime/20 transition-colors">
                  <span className="text-2xl font-bold text-neon-lime animate-neon-pulse">3</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-neon-lime rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-cyber-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold cyber-text-primary mb-3">Get Report</h3>
              <p className="cyber-text-secondary leading-relaxed">
                Receive detailed security report with actionable recommendations
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <a
              href="/audit"
              className="inline-flex items-center gap-3 px-8 py-4 
                       bg-gradient-to-r from-neon-cyan to-neon-magenta text-cyber-black font-bold text-lg
                       rounded-lg transition-all duration-300 ease-out
                       hover:scale-105 hover:shadow-neon-cyan
                       cyber-loading"
            >
              <span className="relative z-10">Start Your First Audit</span>
              <svg className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </main>

      <footer className="border-t border-neon-cyan/30 mt-auto bg-gradient-to-r from-cyber-black via-cyber-dark to-cyber-black relative overflow-hidden">
        {/* Animated scan line */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-neon-cyan to-transparent animate-scan-sweep"></div>
        
        <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm cyber-text-secondary">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div>
                ©2025 hatif03. Licensed under{" "}
                <a
                  href="https://github.com/hatif03/smart-audit/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neon-cyan hover:text-neon-cyan/80 transition-colors animate-neon-pulse"
                >
                  AGPL-3.0
                </a>
              </div>
              <div className="hidden md:block w-px h-4 bg-neon-cyan/30"></div>
              <div className="text-xs cyber-text-muted">
                Securing the future of blockchain
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/hatif03/smart-audit"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 cyber-text-secondary hover:text-neon-cyan transition-colors group rounded-lg hover:bg-neon-cyan/10"
                aria-label="View on GitHub"
              >
                <svg
                  className="w-5 h-5 group-hover:animate-neon-pulse"
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
              
              <a
                href="/audit"
                className="px-4 py-2 text-xs font-medium text-neon-cyan border border-neon-cyan/30 rounded-lg hover:bg-neon-cyan/10 hover:border-neon-cyan/50 transition-all duration-300"
              >
                Start Auditing
              </a>
            </div>
          </div>
        </div>
        
        {/* Cyberpunk corner decorations */}
        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-neon-cyan/50"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-neon-cyan/50"></div>
      </footer>
    </div>
  );
}
