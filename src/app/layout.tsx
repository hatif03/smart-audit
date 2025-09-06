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
  title: "Smart Audit - Smart Contract Security Platform",
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
        <div className="min-h-screen flex flex-col cyber-grid-bg">
          <header className="border-b-2 border-neon-cyan bg-cyber-black/90 backdrop-blur-md sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 py-4">
              <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 group">
                <div className="relative">
                  <Image 
                    src="/mush.png" 
                    alt="Smart Logo" 
                    width={32} 
                    height={32} 
                    priority
                    className="group-hover:animate-pulse"
                  />
                  <div className="absolute inset-0 bg-neon-cyan/20 rounded-full blur-md group-hover:bg-neon-cyan/40 transition-all duration-300"></div>
                </div>
                <span className="text-2xl font-bold font-cyber-heading text-glow-cyan">
                  SMART <span className="text-neon-magenta text-glow-magenta">AUDIT</span>
                </span>
              </Link>
            </nav>
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
              background: 'var(--cyber-dark)',
              color: 'var(--cyber-text-primary)',
              borderRadius: '8px',
              border: '2px solid var(--neon-cyan)',
              boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
              fontFamily: 'JetBrains Mono, monospace',
            },
            error: {
              style: {
                background: 'var(--cyber-dark)',
                color: 'var(--cyber-text-primary)',
                border: '2px solid var(--cyber-danger)',
                boxShadow: '0 0 20px rgba(255, 0, 64, 0.3)',
              },
              iconTheme: {
                primary: 'var(--cyber-danger)',
                secondary: 'var(--cyber-dark)',
              },
              duration: 4000,
            },
            success: {
              style: {
                background: 'var(--cyber-dark)',
                color: 'var(--cyber-text-primary)',
                border: '2px solid var(--cyber-success)',
                boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
              },
              iconTheme: {
                primary: 'var(--cyber-success)',
                secondary: 'var(--cyber-dark)',
              },
              duration: 4000,
            },
          }}
        />
      </body>
    </html>
  );
}
