"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Meeting = {
  id: number;
  title: string;
  started_at: string;
  duration_seconds: number;
  meeting_type: string | null;
  summary: string | null;
};

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("ml_meetings")
      .select("id, title, started_at, duration_seconds, meeting_type, summary")
      .order("started_at", { ascending: false })
      .then(({ data }) => {
        setMeetings(data || []);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#d4a853', borderTopColor: 'transparent' }} />
      </div>
    );

  if (meetings.length === 0)
    return (
      <div className="text-center py-32">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: '#2a2a30' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4a853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          </svg>
        </div>
        <h2 className="text-lg font-medium" style={{ color: '#9a9590' }}>No meetings yet</h2>
        <p className="text-sm mt-1" style={{ color: '#5e5a55' }}>Record your first meeting in the desktop app to get started.</p>
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meetings</h1>
          <p className="text-sm mt-1" style={{ color: '#5e5a55' }}>{meetings.length} conversation{meetings.length !== 1 ? 's' : ''} analyzed</p>
        </div>
      </div>
      <div className="space-y-3">
        {meetings.map((m) => (
          <Link
            key={m.id}
            href={`/meetings/${m.id}`}
            className="block rounded-xl p-5 transition-all hover:translate-y-[-1px]"
            style={{ background: '#1a1a1e', border: '1px solid #2a2a30' }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#d4a853')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#2a2a30')}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold">{m.title}</span>
              {m.meeting_type && (
                <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: '#d4a85320', color: '#e8c171' }}>
                  {m.meeting_type}
                </span>
              )}
            </div>
            <div className="text-xs mb-2" style={{ color: '#5e5a55' }}>
              {new Date(m.started_at).toLocaleString()}
              {m.duration_seconds ? ` · ${Math.round(m.duration_seconds / 60)}min` : ""}
            </div>
            {m.summary && (
              <p className="text-sm line-clamp-2 leading-relaxed" style={{ color: '#9a9590' }}>{m.summary}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
