"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Average = { dimension: string; avg_score: number; count: number };
type Grade = { dimension: string; score: number; meeting_id: number; created_at: string };

export default function DashboardPage() {
  const [averages, setAverages] = useState<Average[]>([]);
  const [recent, setRecent] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("grades").select("dimension, score"),
      supabase.from("grades").select("dimension, score, meeting_id, created_at").order("created_at", { ascending: false }).limit(30),
    ]).then(([avgRes, recentRes]) => {
      // Compute averages client-side
      const grades = avgRes.data || [];
      const byDim: Record<string, number[]> = {};
      grades.forEach((g) => {
        if (!byDim[g.dimension]) byDim[g.dimension] = [];
        byDim[g.dimension].push(g.score);
      });
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

  if (loading) return <p className="text-slate-500 text-center py-20">Loading...</p>;
  if (averages.length === 0) return <p className="text-slate-500 text-center py-20">Complete some meetings to see your dashboard.</p>;

  const strengths = averages.slice(0, 2);
  const weaknesses = [...averages].sort((a, b) => a.avg_score - b.avg_score).slice(0, 2);

  const scoreColor = (s: number) => s >= 8 ? "text-emerald-400" : s >= 5 ? "text-yellow-400" : "text-rose-400";

  return (
    <div>
      <h1 className="text-2xl font-semibold text-rose-500 mb-6">Communication Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Overall Scores</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {averages.map((a) => (
            <div key={a.dimension} className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-center">
              <div className={`text-3xl font-bold ${scoreColor(a.avg_score)}`}>{a.avg_score}</div>
              <div className="text-[10px] text-slate-500 uppercase mt-1">{a.dimension.replace(/_/g, " ")}</div>
              <div className="text-[10px] text-slate-600">{a.count} meetings</div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <section>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Strengths</h2>
          {strengths.map((s) => (
            <div key={s.dimension} className="bg-emerald-400/10 text-emerald-400 rounded p-3 mb-2 text-sm capitalize">
              {s.dimension.replace(/_/g, " ")}: {s.avg_score}/10
            </div>
          ))}
        </section>
        <section>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Areas for Improvement</h2>
          {weaknesses.map((w) => (
            <div key={w.dimension} className="bg-rose-400/10 text-rose-400 rounded p-3 mb-2 text-sm capitalize">
              {w.dimension.replace(/_/g, " ")}: {w.avg_score}/10
            </div>
          ))}
        </section>
      </div>

      {recent.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Recent Scores</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 max-h-96 overflow-auto">
            {recent.map((g, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5 border-b border-slate-800 text-sm last:border-0">
                <span className="flex-1 capitalize text-slate-400">{g.dimension.replace(/_/g, " ")}</span>
                <span className={`font-semibold ${scoreColor(g.score)}`}>{g.score}</span>
                <span className="text-xs text-slate-600">{g.created_at ? new Date(g.created_at).toLocaleDateString() : ""}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
