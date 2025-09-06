import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Image from 'next/image';
import Link from 'next/link';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Mush Audit - Smart Contract Security Platform",
  description: "AI-powered smart contract security audit platform",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    viewportFit: 'cover'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-cyber-black text-cyber-text-primary">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-cyber`}>
        <div className="min-h-screen flex flex-col relative">
          {/* Cyberpunk Header */}
          <header className="border-b border-neon-cyan/30 bg-gradient-to-r from-cyber-black via-cyber-dark to-cyber-black relative overflow-hidden">
            {/* Animated scan line */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-neon-cyan to-transparent animate-scan-sweep"></div>
            
            <nav className="max-w-7xl mx-auto px-4 py-4 relative z-10">
              <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 group">
                <div className="relative">
                  <Image 
                    src="/mush.png" 
                    alt="Mush Logo" 
                    width={32} 
                    height={32} 
                    priority
                    className="filter drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                  />
                  <div className="absolute inset-0 bg-neon-cyan/20 rounded-full blur-md animate-pulse"></div>
                </div>
                <span className="text-xl font-bold cyber-text-primary animate-neon-pulse">
                  Mush <span className="text-neon-cyan animate-neon-flicker">Audit</span>
                </span>
              </Link>
            </nav>
            
            {/* Cyberpunk corner decorations */}
            <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-neon-cyan/50"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-neon-cyan/50"></div>
          </header>
          
          <main className="flex-1 relative">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'linear-gradient(135deg, #0A0A0A, #1A1A1A)',
              color: '#00FFFF',
              borderRadius: '8px',
              border: '1px solid rgba(0, 255, 255, 0.3)',
              boxShadow: '0 0 20px rgba(0, 255, 255, 0.2), inset 0 0 20px rgba(0, 255, 255, 0.05)',
              textShadow: '0 0 5px rgba(0, 255, 255, 0.5)',
            },
            error: {
              style: {
                background: 'linear-gradient(135deg, #0A0A0A, #1A1A1A)',
                color: '#FF0040',
                border: '1px solid rgba(255, 0, 64, 0.3)',
                boxShadow: '0 0 20px rgba(255, 0, 64, 0.2), inset 0 0 20px rgba(255, 0, 64, 0.05)',
                textShadow: '0 0 5px rgba(255, 0, 64, 0.5)',
              },
              iconTheme: {
                primary: '#FF0040',
                secondary: '#0A0A0A',
              },
              duration: 4000,
            },
            success: {
              style: {
                background: 'linear-gradient(135deg, #0A0A0A, #1A1A1A)',
                color: '#00FF88',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                boxShadow: '0 0 20px rgba(0, 255, 136, 0.2), inset 0 0 20px rgba(0, 255, 136, 0.05)',
                textShadow: '0 0 5px rgba(0, 255, 136, 0.5)',
              },
              iconTheme: {
                primary: '#00FF88',
                secondary: '#0A0A0A',
              },
              duration: 4000,
            },
          }}
        />
      </body>
    </html>
  );
}
