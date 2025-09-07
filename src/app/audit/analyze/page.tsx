"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { analyzeContract } from '@/services/audit/contractAnalyzer';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Analysis, AnalysisResult } from "@/types/blockchain";

function AnalyzeContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const address = searchParams.get('address');
  const chain = searchParams.get('chain');

  useEffect(() => {
    const startAnalysis = async () => {
      if (!address || !chain) {
        toast.error('Missing required parameters');
        return;
      }

      try {
        setLoading(true);
        // Fetch contract source and analyze
        const response = await fetch(`/api/source?address=${address}&chain=${chain}`);
        const data = await response.json();
        
        if (data.error) {
          toast.error(data.error);
          return;
        }

        // Start analysis
        const result: AnalysisResult = await analyzeContract({
          files: data.files,
          contractName: data.contractName,
          chain: chain
        });

        setAnalysis({
          summary: {
            totalIssues: 0,
            criticalIssues: 0,
            highIssues: 0,
            mediumIssues: 0,
            lowIssues: 0,
          },
          contractInfo: {},
          analysis: result.report.analysis,
          recommendations: [],
        });
      } catch (error) {
        console.error('Analysis error:', error);
        toast.error('Failed to analyze contract');
      } finally {
        setLoading(false);
      }
    };

    startAnalysis();
  }, [address, chain]);

  return (
    <div className="min-h-screen bg-cyber-black relative overflow-hidden">
      {/* Cyberpunk Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-black via-cyber-dark to-cyber-black"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-cyber-grid opacity-20"></div>
      
      {loading ? (
        <div className="flex items-center justify-center h-screen relative z-10">
          <div className="cyber-card rounded-lg p-8 flex flex-col items-center relative overflow-hidden">
            {/* Animated scan line */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-neon-cyan to-transparent animate-scan-sweep"></div>
            
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 border-4 border-t-neon-cyan border-r-neon-cyan/50 border-b-neon-cyan/30 border-l-neon-cyan/10 rounded-full animate-spin" />
              <div className="absolute inset-2 bg-cyber-black rounded-full flex items-center justify-center">
                <Image
                  src="/smart-audit-logo.svg"
                  alt="Smart Audit Loading"
                  width={32}
                  height={32}
                  className="animate-bounce-slow"
                />
              </div>
            </div>
            <p className="cyber-text-primary animate-neon-pulse">Analyzing contract...</p>
          </div>
        </div>
      ) : analysis ? (
        <div className="max-w-5xl mx-auto py-8 px-6 relative z-10">
          {/* Contract Info */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold cyber-text-primary mb-4 animate-neon-pulse">Contract Analysis</h1>
            <div className="flex items-center gap-2 cyber-text-secondary text-sm">
              <span>Contract:</span>
              <code className="px-2 py-1 cyber-card rounded text-neon-orange">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </code>
              <span>on</span>
              <span className="capitalize text-neon-cyan">{chain}</span>
            </div>
          </div>

          {/* Markdown Content */}
          <div className="cyber-card rounded-lg p-6">
            <div className="prose prose-invert max-w-none
                          prose-headings:cyber-text-primary
                          prose-h1:text-3xl prose-h1:mb-8 prose-h1:animate-neon-pulse
                          prose-h2:text-2xl prose-h2:text-neon-orange prose-h2:mt-8 prose-h2:mb-4
                          prose-h3:text-xl prose-h3:text-neon-lime prose-h3:mt-6 prose-h3:mb-3
                          prose-p:cyber-text-secondary prose-p:leading-relaxed
                          prose-strong:text-neon-lime
                          prose-code:text-neon-orange prose-code:bg-cyber-dark
                          prose-li:cyber-text-secondary
                          [&_ul]:mt-2 [&_ul]:mb-4 [&_ul]:pl-6
                          [&_li]:my-1">
              <ReactMarkdown>{analysis.analysis}</ReactMarkdown>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center text-[#E5E5E5]">
            No analysis results available
          </div>
        </div>
      )}
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8B3E] mb-4"></div>
          <p className="text-[#E5E5E5]">Loading...</p>
        </div>
      </div>
    }>
      <AnalyzeContent />
    </Suspense>
  );
} 