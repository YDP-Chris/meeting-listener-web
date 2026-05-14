"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Person = { id: number; name: string; first_seen: string; rapport_score: number | null; rapport_trend: string | null; communication_style: any };

function rapportColor(s: number) { return s >= 7 ? '#6bc77c' : s >= 4 ? '#d4a853' : '#e86b5a'; }

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("ml_people").select("*").order("name").then(({ data }) => { setPeople(data || []); setLoading(false); });
  }, []);

  if (loading) return <div className="flex items-center justify-center py-32"><div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#d4a853', borderTopColor: 'transparent' }} /></div>;
  if (people.length === 0) return <p className="text-center py-32" style={{ color: '#5e5a55' }}>No people profiles yet.</p>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">People</h1>
        <p className="text-sm mt-1" style={{ color: '#5e5a55' }}>{people.length} profile{people.length !== 1 ? 's' : ''}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {people.map((p) => (
          <Link key={p.id} href={`/people/${p.id}`}
            className="rounded-xl p-5 transition-all hover:translate-y-[-1px]"
            style={{ background: '#1a1a1e', border: '1px solid #2a2a30' }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#d4a853')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#2a2a30')}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: '#d4a85320', color: '#e8c171' }}>
                  {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <span className="font-semibold">{p.name}</span>
              </div>
              {p.rapport_score != null && (
                <div className="text-center">
                  <div className="text-lg font-bold" style={{ color: rapportColor(p.rapport_score) }}>{p.rapport_score}</div>
                  <div className="text-[9px] uppercase" style={{ color: '#5e5a55' }}>rapport</div>
                </div>
              )}
            </div>
            <div className="text-xs" style={{ color: '#5e5a55' }}>
              {p.rapport_trend && <span className="capitalize">{p.rapport_trend}</span>}
              {p.first_seen && ` · Since ${new Date(p.first_seen).toLocaleDateString()}`}
            </div>
            {p.communication_style?.summary && (
              <p className="text-xs mt-2 line-clamp-2" style={{ color: '#9a9590' }}>{p.communication_style.summary}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
