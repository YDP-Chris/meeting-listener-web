"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ActionItem = { id: number; task: string; owner: string; deadline: string; status: string; is_user_task: boolean; meeting_id: number };

export default function ActionItemsPage() {
  const [items, setItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("ml_action_items").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setItems(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex items-center justify-center py-32"><div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#d4a853', borderTopColor: 'transparent' }} /></div>;
  if (items.length === 0) return <p className="text-center py-32" style={{ color: '#5e5a55' }}>No action items yet.</p>;

  const overdue = items.filter((i) => i.status === "overdue");
  const open = items.filter((i) => i.status === "open");
  const complete = items.filter((i) => i.status === "complete");

  const renderItem = (item: ActionItem) => (
    <div key={item.id} className="flex items-start gap-3 py-3" style={{ borderBottom: '1px solid #2a2a30', ...(item.status === "overdue" ? { borderLeft: '3px solid #e86b5a', paddingLeft: 12 } : {}) }}>
      <input type="checkbox" checked={item.status === "complete"} readOnly className="mt-1" style={{ accentColor: '#6bc77c' }} />
      <div>
        <p className="text-sm">{item.task}</p>
        <p className="text-xs mt-0.5" style={{ color: '#5e5a55' }}>
          {item.owner && `${item.owner}`}
          {item.deadline && ` · ${item.deadline}`}
          {item.is_user_task && <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: '#d4a85320', color: '#e8c171' }}>You</span>}
        </p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Action Items</h1>
        <p className="text-sm mt-1" style={{ color: '#5e5a55' }}>{open.length} open · {complete.length} done</p>
      </div>
      <div className="rounded-xl p-5" style={{ background: '#1a1a1e', border: '1px solid #2a2a30' }}>
        {overdue.length > 0 && <><h3 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#e86b5a' }}>Overdue ({overdue.length})</h3>{overdue.map(renderItem)}</>}
        {open.length > 0 && <><h3 className="text-xs font-semibold uppercase tracking-widest mt-5 mb-2" style={{ color: '#d4a853' }}>Open ({open.length})</h3>{open.map(renderItem)}</>}
        {complete.length > 0 && <><h3 className="text-xs font-semibold uppercase tracking-widest mt-5 mb-2" style={{ color: '#6bc77c' }}>Completed ({complete.length})</h3>{complete.map(renderItem)}</>}
      </div>
    </div>
  );
}
