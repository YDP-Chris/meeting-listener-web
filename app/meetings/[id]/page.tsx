"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { use } from "react";

type Grade = { dimension: string; score: number; reasoning: string };

export default function MeetingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [meeting, setMeeting] = useState<any>(null);
  const [grades, setGrades] = useState<Grade[]>([]);

  useEffect(() => {
    supabase.from("meetings").select("*").eq("id", id).single().then(({ data }) => setMeeting(data));
    supabase.from("grades").select("*").eq("meeting_id", id).order("dimension").then(({ data }) => setGrades(data || []));
  }, [id]);

  if (!meeting) return <p className="text-slate-500 text-center py-20">Loading...</p>;

  return (
    <div>
      <Link href="/" className="text-sm text-slate-500 hover:text-rose-400 mb-4 inline-block">&larr; Back to meetings</Link>
      <div className="flex justify-between items-start mb-2">
        <h1 className="text-2xl font-semibold">{meeting.title}</h1>
        {meeting.meeting_type && <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-emerald-400">{meeting.meeting_type}</span>}
      </div>
      <p className="text-xs text-slate-500 mb-6">{new Date(meeting.started_at).toLocaleString()} · {Math.round((meeting.duration_seconds || 0) / 60)}min</p>

      {meeting.summary && (
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-rose-500 uppercase tracking-wider mb-2">Summary</h2>
          <p className="text-sm text-slate-300 leading-relaxed">{meeting.summary}</p>
        </section>
      )}

      {meeting.decisions?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-rose-500 uppercase tracking-wider mb-2">Decisions</h2>
          <ul className="space-y-1">
            {meeting.decisions.map((d: any, i: number) => (
              <li key={i} className="text-sm text-slate-300"><strong>{d.decision}</strong> — {d.made_by}</li>
            ))}
          </ul>
        </section>
      )}

      {meeting.discussion_threads?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-rose-500 uppercase tracking-wider mb-2">Discussion Threads</h2>
          {meeting.discussion_threads.map((t: any, i: number) => (
            <div key={i} className="mb-3">
              <h3 className="text-sm font-medium text-slate-200">{t.topic}</h3>
              <ul className="list-disc list-inside text-sm text-slate-400">
                {t.key_points?.map((p: string, j: number) => <li key={j}>{p}</li>)}
              </ul>
            </div>
          ))}
        </section>
      )}

      {grades.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-rose-500 uppercase tracking-wider mb-3">Communication Grades</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {grades.map((g) => (
              <div key={g.dimension} className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-center">
                <div className={`text-3xl font-bold ${g.score >= 8 ? "text-emerald-400" : g.score >= 5 ? "text-yellow-400" : "text-rose-400"}`}>{g.score}</div>
                <div className="text-xs text-slate-500 uppercase mt-1">{g.dimension.replace(/_/g, " ")}</div>
                <p className="text-xs text-slate-600 mt-2">{g.reasoning}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {meeting.transcript && (
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-rose-500 uppercase tracking-wider mb-2">Transcript</h2>
          <pre className="text-xs text-slate-500 bg-slate-900 p-4 rounded-lg overflow-auto max-h-80 whitespace-pre-wrap">{meeting.transcript}</pre>
        </section>
      )}
    </div>
  );
}
