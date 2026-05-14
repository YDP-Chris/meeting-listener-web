import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Nav } from "./components/nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MeetingIQ — Communication Intelligence",
  description: "Track, analyze, and improve how you communicate in every meeting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ background: '#0a0b14', color: '#e2e8f0' }}>
        <header className="border-b px-6 py-3" style={{ background: '#111827', borderColor: '#1e293b' }}>
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #06d6a0)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" x2="12" y1="19" y2="22"/>
                </svg>
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight" style={{ color: '#e2e8f0' }}>
                  Meeting<span style={{ color: '#6366f1' }}>IQ</span>
                </span>
              </div>
            </Link>
            <Nav />
          </div>
        </header>
        <main className="flex-1 p-6 max-w-6xl mx-auto w-full">{children}</main>
        <footer className="border-t px-6 py-4 text-center" style={{ borderColor: '#1e293b' }}>
          <p className="text-xs" style={{ color: '#475569' }}>
            MeetingIQ — Communication Intelligence Platform
          </p>
        </footer>
      </body>
    </html>
  );
}
