import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meeting Listener",
  description: "Communication improvement dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-200">
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-rose-500">Meeting Listener</Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors">Meetings</Link>
            <Link href="/action-items" className="text-slate-400 hover:text-white transition-colors">Action Items</Link>
            <Link href="/people" className="text-slate-400 hover:text-white transition-colors">People</Link>
            <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">Dashboard</Link>
          </nav>
        </header>
        <main className="flex-1 p-6 max-w-6xl mx-auto w-full">{children}</main>
      </body>
    </html>
  );
}
