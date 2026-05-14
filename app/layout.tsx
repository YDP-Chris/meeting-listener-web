import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "./components/sidebar";

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
      <body className="min-h-full" style={{ background: '#111113', color: '#f0ece4' }}>
        <Sidebar />
        <main className="lg:ml-[220px] min-h-screen pt-14 pb-6 px-4 lg:pt-8 lg:px-8 max-w-6xl">
          {children}
        </main>
      </body>
    </html>
  );
}
