import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Header from '@/components/Header';

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
        <div className="min-h-screen flex flex-col relative">
          <Header />
          
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
