"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Topic = { topic: string; category: string; mentions: number; depth: string; sentiment: string; summary: string };
type SWOT = { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] };
type Opportunity = { opportunity: string; category: string; impact: string; related_topics: string[] };
type Question = { asked: string[]; answered: string[]; unanswered: string[] };
type Intel = { meeting_id: number; topics: Topic[]; swot: SWOT; opportunities: Opportunity[]; commitments: any[]; questions: Question; relationship_signals: any };
type TopicTrend = { topic: string; category: string; occurrence_count: number; sentiment: string };

const CAT_COLORS: Record<string, string> = {
  data: '#d4a853', operations: '#6bc77c', strategy: '#7c9cf5', product: '#c77cb5',
  technology: '#5cc7c7', finance: '#e86b5a', people: '#e8a85a', process: '#9a9590',
};

const SENTIMENT_ICONS: Record<string, string> = {
  positive: '✓', neutral: '—', concern: '⚠', pain_point: '✕',
};

const SENTIMENT_COLORS: Record<string, string> = {
  positive: '#6bc77c', neutral: '#9a9590', concern: '#d4a853', pain_point: '#e86b5a',
};

const IMPACT_COLORS: Record<string, string> = { high: '#e86b5a', medium: '#d4a853', low: '#9a9590' };

export default function IntelligencePage() {
  const [intels, setIntels] = useState<Intel[]>([]);
  const [trends, setTrends] = useState<TopicTrend[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'swot' | 'opportunities' | 'questions'>('overview');

  useEffect(() => {
    Promise.all([
      supabase.from("ml_transcript_intelligence").select("*"),
      supabase.from("ml_topic_trends").select("*").order("occurrence_count", { ascending: false }),
      supabase.from("ml_meetings").select("id, title").order("started_at", { ascending: false }),
    ]).then(([intelRes, trendRes, meetRes]) => {
      setIntels(intelRes.data || []);
      setTrends(trendRes.data || []);
      setMeetings(meetRes.data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex items-center justify-center py-32"><div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#d4a853', borderTopColor: 'transparent' }} /></div>;

  // Merge all SWOTs
  const mergedSWOT: SWOT = { strengths: [], weaknesses: [], opportunities: [], threats: [] };
  intels.forEach(i => {
    const s = typeof i.swot === 'string' ? JSON.parse(i.swot) : i.swot;
    if (s) {
      mergedSWOT.strengths.push(...(s.strengths || []));
      mergedSWOT.weaknesses.push(...(s.weaknesses || []));
      mergedSWOT.opportunities.push(...(s.opportunities || []));
      mergedSWOT.threats.push(...(s.threats || []));
    }
  });

  // Merge all opportunities
  const allOpps: Opportunity[] = intels.flatMap(i => {
    const o = typeof i.opportunities === 'string' ? JSON.parse(i.opportunities) : i.opportunities;
    return o || [];
  });

  // Merge all questions
  const allQuestions: Question = { asked: [], answered: [], unanswered: [] };
  intels.forEach(i => {
    const q = typeof i.questions === 'string' ? JSON.parse(i.questions) : i.questions;
    if (q) {
      allQuestions.asked.push(...(q.asked || []));
      allQuestions.answered.push(...(q.answered || []));
      allQuestions.unanswered.push(...(q.unanswered || []));
    }
  });

  // Merge all topics
  const allTopics: Topic[] = intels.flatMap(i => {
    const t = typeof i.topics === 'string' ? JSON.parse(i.topics) : i.topics;
    return t || [];
  });

  const tabs = [
    { key: 'overview', label: 'Topics & Trends' },
    { key: 'swot', label: 'SWOT Analysis' },
    { key: 'opportunities', label: 'Opportunities' },
    { key: 'questions', label: 'Open Questions' },
  ] as const;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Transcript Intelligence</h1>
        <p className="text-sm mt-1" style={{ color: '#5e5a55' }}>Deep analysis across {intels.length} meetings · {allTopics.length} topics extracted</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className="text-xs px-4 py-2 rounded-lg font-medium transition-all"
            style={{ background: activeTab === tab.key ? '#d4a85320' : '#1a1a1e', color: activeTab === tab.key ? '#e8c171' : '#5e5a55', border: `1px solid ${activeTab === tab.key ? '#d4a853' : '#2a2a30'}` }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Topic Trends */}
          <div className="rounded-xl p-5" style={{ background: '#1a1a1e', border: '1px solid #2a2a30' }}>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#d4a853' }}>Cross-Meeting Topic Trends</h2>
            <div className="space-y-3">
              {trends.map((t, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-bold w-8 text-right" style={{ color: '#f0ece4' }}>{t.occurrence_count}x</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#2a2a30' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, t.occurrence_count * 6)}%`, background: CAT_COLORS[t.category] || '#d4a853' }} />
                  </div>
                  <span className="text-sm flex-shrink-0 w-52">{t.topic}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: (CAT_COLORS[t.category] || '#5e5a55') + '20', color: CAT_COLORS[t.category] || '#5e5a55' }}>{t.category}</span>
                  <span className="text-xs" style={{ color: SENTIMENT_COLORS[t.sentiment] || '#9a9590' }}>{SENTIMENT_ICONS[t.sentiment] || '—'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Per-meeting topics */}
          {intels.map(intel => {
            const topics = typeof intel.topics === 'string' ? JSON.parse(intel.topics) : intel.topics;
            const meeting = meetings.find(m => m.id === intel.meeting_id);
            return (
              <div key={intel.meeting_id} className="rounded-xl p-5" style={{ background: '#1a1a1e', border: '1px solid #2a2a30' }}>
                <h3 className="text-sm font-semibold mb-3">{meeting?.title || `Meeting #${intel.meeting_id}`}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {(topics || []).map((t: Topic, i: number) => (
                    <div key={i} className="rounded-lg p-3" style={{ background: '#141416', border: '1px solid #2a2a30' }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: (CAT_COLORS[t.category] || '#5e5a55') + '20', color: CAT_COLORS[t.category] }}>{t.category}</span>
                        <span className="text-xs font-bold" style={{ color: SENTIMENT_COLORS[t.sentiment] }}>{t.mentions}x</span>
                      </div>
                      <div className="text-xs font-medium mt-1">{t.topic}</div>
                      <div className="text-[10px] mt-1" style={{ color: '#5e5a55' }}>{t.summary}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SWOT Tab */}
      {activeTab === 'swot' && (
        <div className="grid grid-cols-2 gap-4">
          {([['Strengths', mergedSWOT.strengths, '#6bc77c'], ['Weaknesses', mergedSWOT.weaknesses, '#e86b5a'], ['Opportunities', mergedSWOT.opportunities, '#d4a853'], ['Threats', mergedSWOT.threats, '#7c9cf5']] as const).map(([label, items, color]) => (
            <div key={label} className="rounded-xl p-5" style={{ background: '#1a1a1e', border: '1px solid #2a2a30' }}>
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color }}>{label} ({items.length})</h3>
              <ul className="space-y-2">
                {items.map((item, i) => (
                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: '#9a9590' }}>
                    <span style={{ color }}>·</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Opportunities Tab */}
      {activeTab === 'opportunities' && (
        <div className="space-y-3">
          {['high', 'medium', 'low'].map(impact => {
            const filtered = allOpps.filter(o => o.impact === impact);
            if (!filtered.length) return null;
            return (
              <div key={impact}>
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: IMPACT_COLORS[impact] }}>{impact} Impact ({filtered.length})</h3>
                {filtered.map((o, i) => (
                  <div key={i} className="rounded-xl p-4 mb-2 flex items-start gap-3" style={{ background: '#1a1a1e', border: '1px solid #2a2a30' }}>
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: IMPACT_COLORS[o.impact] }} />
                    <div>
                      <p className="text-sm">{o.opportunity}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: '#d4a85320', color: '#e8c171' }}>{o.category}</span>
                        {o.related_topics?.map((t, j) => (
                          <span key={j} className="text-[10px]" style={{ color: '#5e5a55' }}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl p-5" style={{ background: '#1a1a1e', border: '1px solid #2a2a30' }}>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#e86b5a' }}>
              Open / Unanswered ({allQuestions.unanswered.length})
            </h3>
            <ul className="space-y-2">
              {allQuestions.unanswered.map((q, i) => (
                <li key={i} className="text-sm flex items-start gap-2" style={{ color: '#9a9590' }}>
                  <span style={{ color: '#e86b5a' }}>?</span> {q}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl p-5" style={{ background: '#1a1a1e', border: '1px solid #2a2a30' }}>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6bc77c' }}>
              Answered ({allQuestions.answered.length})
            </h3>
            <ul className="space-y-2">
              {allQuestions.answered.map((q, i) => (
                <li key={i} className="text-sm flex items-start gap-2" style={{ color: '#9a9590' }}>
                  <span style={{ color: '#6bc77c' }}>✓</span> {q}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl p-5" style={{ background: '#1a1a1e', border: '1px solid #2a2a30' }}>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#d4a853' }}>
              Questions Asked ({allQuestions.asked.length})
            </h3>
            <ul className="space-y-2">
              {allQuestions.asked.map((q, i) => (
                <li key={i} className="text-sm" style={{ color: '#6e6a65' }}>→ {q}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
