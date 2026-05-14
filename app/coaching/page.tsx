"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Insight = { id: number; insight: string; dimension: string; insight_type: string; priority: number; meeting_id: number; created_at: string };

const DIM_COLORS: Record<string, string> = {
  conciseness: '#e86b5a', assertiveness: '#d4a853', influence: '#d4a853',
  active_listening: '#6bc77c', clarity: '#6bc77c', follow_through: '#6bc77c',
};

export default function CoachingPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("ml_coaching_insights").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setInsights(data || []); setLoading(false); });
  }, []);

  if (loading) return <div className="flex items-center justify-center py-32"><div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#d4a853', borderTopColor: 'transparent' }} /></div>;

  const dims = [...new Set(insights.map(i => i.dimension).filter(Boolean))];
  const filtered = filter ? insights.filter(i => i.dimension === filter) : insights;

  if (insights.length === 0) return (
    <div className="text-center py-32">
      <span className="text-4xl block mb-4">💡</span>
      <h2 className="text-lg font-medium" style={{ color: '#9a9590' }}>No coaching insights yet</h2>
      <p className="text-sm mt-1" style={{ color: '#5e5a55' }}>Complete more meetings to unlock personalized coaching.</p>
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Coaching Feed</h1>
        <p className="text-sm mt-1" style={{ color: '#5e5a55' }}>AI-powered insights to improve your communication</p>
      </div>

      {/* Dimension Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setFilter(null)}
          className="text-xs px-3 py-1.5 rounded-full font-medium transition-all"
          style={{ background: !filter ? '#d4a85330' : '#1a1a1e', color: !filter ? '#e8c171' : '#5e5a55', border: `1px solid ${!filter ? '#d4a853' : '#2a2a30'}` }}>
          All
        </button>
        {dims.map(d => (
          <button key={d} onClick={() => setFilter(filter === d ? null : d)}
            className="text-xs px-3 py-1.5 rounded-full font-medium capitalize transition-all"
            style={{ background: filter === d ? '#d4a85330' : '#1a1a1e', color: filter === d ? '#e8c171' : '#5e5a55', border: `1px solid ${filter === d ? '#d4a853' : '#2a2a30'}` }}>
            {d.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Insights */}
      <div className="space-y-4">
        {filtered.map((ins) => (
          <div key={ins.id} className="rounded-xl p-5 relative overflow-hidden" style={{ background: '#1a1a1e', border: '1px solid #2a2a30' }}>
            <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full" style={{ background: DIM_COLORS[ins.dimension] || '#d4a853' }} />
            <div className="pl-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-[1.5px] capitalize" style={{ color: DIM_COLORS[ins.dimension] || '#d4a853' }}>
                  {ins.dimension?.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px]" style={{ color: '#3a3a3e' }}>
                  {ins.created_at ? new Date(ins.created_at).toLocaleDateString() : ''}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#9a9590' }}>{ins.insight}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
