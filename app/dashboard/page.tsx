"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Average = { dimension: string; avg_score: number; count: number };
type Grade = { dimension: string; score: number; meeting_id: number; created_at: string };

function scoreColor(s: number) { return s >= 8 ? '#06d6a0' : s >= 5 ? '#f59e0b' : '#ef4444'; }

export default function DashboardPage() {
  const [averages, setAverages] = useState<Average[]>([]);
  const [recent, setRecent] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("ml_grades").select("dimension, score"),
      supabase.from("ml_grades").select("dimension, score, meeting_id, created_at").order("created_at", { ascending: false }).limit(30),
    ]).then(([avgRes, recentRes]) => {
      const grades = avgRes.data || [];
      const byDim: Record<string, number[]> = {};
      grades.forEach((g) => { if (!byDim[g.dimension]) byDim[g.dimension] = []; byDim[g.dimension].push(g.score); });
      const avgs = Object.entries(byDim).map(([dim, scores]) => ({
        dimension: dim,
        avg_score: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10,
        count: scores.length,
      }));
      setAverages(avgs.sort((a, b) => b.avg_score - a.avg_score));
      setRecent(recentRes.data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex items-center justify-center py-32"><div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#6366f1', borderTopColor: 'transparent' }} /></div>;
  if (averages.length === 0) return <p className="text-center py-32" style={{ color: '#64748b' }}>Complete some meetings to see your dashboard.</p>;

  const strengths = averages.slice(0, 2);
  const weaknesses = [...averages].sort((a, b) => a.avg_score - b.avg_score).slice(0, 2);
  const overall = Math.round((averages.reduce((a, b) => a + b.avg_score, 0) / averages.length) * 10) / 10;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Communication Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>Your performance across all meetings</p>
        </div>
        <div className="text-center px-6 py-3 rounded-xl" style={{ background: '#111827', border: '1px solid #1e293b' }}>
          <div className="text-3xl font-bold" style={{ color: scoreColor(overall) }}>{overall}</div>
          <div className="text-[10px] uppercase tracking-widest" style={{ color: '#64748b' }}>Overall</div>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6366f1' }}>Scores by Dimension</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {averages.map((a) => (
            <div key={a.dimension} className="rounded-xl p-4 text-center" style={{ background: '#111827', border: '1px solid #1e293b' }}>
              <div className="text-3xl font-bold" style={{ color: scoreColor(a.avg_score) }}>{a.avg_score}</div>
              <div className="text-[10px] uppercase tracking-wider mt-1 font-medium" style={{ color: '#64748b' }}>{a.dimension.replace(/_/g, " ")}</div>
              <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: '#1e293b' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${a.avg_score * 10}%`, background: scoreColor(a.avg_score) }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl p-5" style={{ background: '#111827', border: '1px solid #1e293b' }}>
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#06d6a0' }}>Strengths</h2>
          {strengths.map((s) => (
            <div key={s.dimension} className="flex items-center justify-between py-2 capitalize text-sm">
              <span>{s.dimension.replace(/_/g, " ")}</span>
              <span className="font-bold" style={{ color: '#06d6a0' }}>{s.avg_score}</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl p-5" style={{ background: '#111827', border: '1px solid #1e293b' }}>
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#f59e0b' }}>Focus Areas</h2>
          {weaknesses.map((w) => (
            <div key={w.dimension} className="flex items-center justify-between py-2 capitalize text-sm">
              <span>{w.dimension.replace(/_/g, " ")}</span>
              <span className="font-bold" style={{ color: '#f59e0b' }}>{w.avg_score}</span>
            </div>
          ))}
        </div>
      </div>

      {recent.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6366f1' }}>Recent Scores</h2>
          <div className="rounded-xl p-4 max-h-96 overflow-auto" style={{ background: '#111827', border: '1px solid #1e293b' }}>
            {recent.map((g, i) => (
              <div key={i} className="flex items-center gap-3 py-2 text-sm" style={{ borderBottom: i < recent.length - 1 ? '1px solid #1e293b' : 'none' }}>
                <span className="flex-1 capitalize" style={{ color: '#94a3b8' }}>{g.dimension.replace(/_/g, " ")}</span>
                <span className="font-bold w-8 text-center" style={{ color: scoreColor(g.score) }}>{g.score}</span>
                <span className="text-xs w-20 text-right" style={{ color: '#475569' }}>{g.created_at ? new Date(g.created_at).toLocaleDateString() : ""}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
