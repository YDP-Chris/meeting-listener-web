"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { use } from "react";

export default function PersonDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [person, setPerson] = useState<any>(null);
  const [meetings, setMeetings] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("people").select("*").eq("id", id).single().then(({ data }) => setPerson(data));
    supabase.from("participants").select("meeting_id, meetings:meeting_id(id, title, started_at)").eq("person_id", id)
      .then(({ data }) => setMeetings((data || []).map((d: any) => d.meetings).filter(Boolean)));
  }, [id]);

  if (!person) return <p className="text-slate-500 text-center py-20">Loading...</p>;

  const style = person.communication_style || {};
  const triggers = person.triggers || {};

  return (
    <div>
      <Link href="/people" className="text-sm text-slate-500 hover:text-rose-400 mb-4 inline-block">&larr; Back to people</Link>
      <h1 className="text-2xl font-semibold mb-1">{person.name}</h1>
      <p className="text-xs text-slate-500 mb-6">
        Since {person.first_seen ? new Date(person.first_seen).toLocaleDateString() : "N/A"}
        {person.rapport_score != null && ` · Rapport: ${person.rapport_score}/10 (${person.rapport_trend || "unknown"})`}
      </p>

      {Object.keys(style).length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-rose-500 uppercase tracking-wider mb-3">Communication Style</h2>
          <div className="space-y-2">
            {style.directness != null && <Bar label="Directness" value={style.directness} />}
            {style.formality != null && <Bar label="Formality" value={style.formality} />}
            {style.pace && <div className="text-sm text-slate-400">Pace: {style.pace}</div>}
            {style.preferred_format && <div className="text-sm text-slate-400">Format: {style.preferred_format}</div>}
          </div>
          {style.summary && <p className="text-sm text-slate-500 italic mt-3">{style.summary}</p>}
        </section>
      )}

      {triggers.positive_triggers?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-rose-500 uppercase tracking-wider mb-2">Responds Well To</h2>
          <ul className="list-disc list-inside text-sm text-emerald-400/80">
            {triggers.positive_triggers.map((t: any, i: number) => <li key={i}>{t.trigger}</li>)}
          </ul>
        </section>
      )}

      {triggers.negative_triggers?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-rose-500 uppercase tracking-wider mb-2">Sensitive To</h2>
          <ul className="list-disc list-inside text-sm text-rose-400/80">
            {triggers.negative_triggers.map((t: any, i: number) => <li key={i}>{t.trigger}</li>)}
          </ul>
        </section>
      )}

      {meetings.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-rose-500 uppercase tracking-wider mb-2">Interaction History</h2>
          <div className="space-y-2">
            {meetings.map((m: any) => (
              <Link key={m.id} href={`/meetings/${m.id}`} className="block bg-slate-900 border border-slate-800 rounded p-3 hover:border-rose-500 transition-colors">
                <span className="text-sm">{m.title}</span>
                <span className="text-xs text-slate-500 ml-2">{m.started_at ? new Date(m.started_at).toLocaleDateString() : ""}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-24 text-slate-500">{label}</span>
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-rose-500 rounded-full" style={{ width: `${value * 10}%` }} />
      </div>
      <span className="text-slate-400 w-8 text-right">{value}/10</span>
    </div>
  );
}
