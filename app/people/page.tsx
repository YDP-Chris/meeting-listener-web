"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Person = {
  id: number;
  name: string;
  first_seen: string;
  rapport_score: number | null;
  rapport_trend: string | null;
  communication_style: any;
};

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("people").select("*").order("name").then(({ data }) => {
      setPeople(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-slate-500 text-center py-20">Loading...</p>;
  if (people.length === 0) return <p className="text-slate-500 text-center py-20">No people profiles yet.</p>;

  const rapportColor = (s: number) => s >= 7 ? "text-emerald-400 bg-emerald-400/10" : s >= 4 ? "text-yellow-400 bg-yellow-400/10" : "text-rose-400 bg-rose-400/10";

  return (
    <div>
      <h1 className="text-2xl font-semibold text-rose-500 mb-6">People</h1>
      <div className="space-y-3">
        {people.map((p) => (
          <Link key={p.id} href={`/people/${p.id}`} className="block bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-rose-500 transition-colors">
            <div className="flex justify-between items-center">
              <span className="font-medium">{p.name}</span>
              {p.rapport_score != null && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${rapportColor(p.rapport_score)}`}>{p.rapport_score}/10</span>
              )}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {p.rapport_trend && `Trend: ${p.rapport_trend}`}
              {p.first_seen && ` · Since ${new Date(p.first_seen).toLocaleDateString()}`}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
