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

  if (loading) return <p className="text-slate-500 text-center py-20">Loading meetings...</p>;

  if (meetings.length === 0)
    return (
      <div className="text-center py-20">
        <h2 className="text-lg text-slate-400">No meetings synced yet</h2>
        <p className="text-sm text-slate-600 mt-2">Record a meeting in the desktop app and it will appear here.</p>
      </div>
    );

  return (
    <div>
      <h1 className="text-2xl font-semibold text-rose-500 mb-6">Meetings</h1>
      <div className="space-y-3">
        {meetings.map((m) => (
          <Link
            key={m.id}
            href={`/meetings/${m.id}`}
            className="block bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-rose-500 transition-colors"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">{m.title}</span>
              {m.meeting_type && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400">
                  {m.meeting_type}
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500">
              {new Date(m.started_at).toLocaleString()}
              {m.duration_seconds ? ` · ${Math.round(m.duration_seconds / 60)}min` : ""}
            </div>
            {m.summary && (
              <p className="text-sm text-slate-400 mt-2 line-clamp-2">{m.summary}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
