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
      <body className="min-h-full flex flex-col" style={{ background: '#111113', color: '#f0ece4' }}>
        <header className="border-b px-6 py-3" style={{ background: '#1a1a1e', borderColor: '#2a2a30' }}>
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <rect x="12" y="4" width="8" height="14" rx="4" fill="#d4a853" />
                <path d="M8 16v2a8 8 0 0 0 16 0v-2" stroke="#d4a853" strokeWidth="2" strokeLinecap="round" fill="none" />
                <line x1="16" y1="26" x2="16" y2="29" stroke="#d4a853" strokeWidth="2" strokeLinecap="round" />
                <path d="M24 10c2 1 3 3 3 6s-1 5-3 6" stroke="#e8c171" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
                <path d="M27 8c2.5 2 4 5 4 8s-1.5 6-4 8" stroke="#e8c171" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3" />
              </svg>
              <span className="text-lg font-bold tracking-tight" style={{ color: '#f0ece4' }}>
                Meeting<span style={{ color: '#d4a853' }}>IQ</span>
              </span>
            </Link>
            <Nav />
          </div>
        </header>
        <main className="flex-1 p-6 max-w-6xl mx-auto w-full">{children}</main>
        <footer className="border-t px-6 py-4" style={{ borderColor: '#2a2a30' }}>
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <p className="text-xs" style={{ color: '#5e5a55' }}>MeetingIQ — Communication Intelligence</p>
            <p className="text-xs font-semibold" style={{ color: '#5e5a55', letterSpacing: 2 }}>ESSAYONS</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
