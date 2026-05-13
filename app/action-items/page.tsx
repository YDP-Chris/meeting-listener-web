"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ActionItem = {
  id: number;
  task: string;
  owner: string;
  deadline: string;
  status: string;
  is_user_task: boolean;
  meeting_id: number;
};

export default function ActionItemsPage() {
  const [items, setItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("action_items").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setItems(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-slate-500 text-center py-20">Loading...</p>;

  const overdue = items.filter((i) => i.status === "overdue");
  const open = items.filter((i) => i.status === "open");
  const complete = items.filter((i) => i.status === "complete");

  const renderItem = (item: ActionItem) => (
    <div key={item.id} className={`flex items-start gap-3 py-3 border-b border-slate-800 ${item.status === "overdue" ? "border-l-2 border-l-rose-500 pl-3" : ""}`}>
      <input type="checkbox" checked={item.status === "complete"} readOnly className="mt-1 accent-emerald-400" />
      <div>
        <p className="text-sm">{item.task}</p>
        <p className="text-xs text-slate-500">
          {item.owner && `Owner: ${item.owner}`}
          {item.deadline && ` · Due: ${item.deadline}`}
          {item.is_user_task && <span className="ml-1 px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px]">You</span>}
        </p>
      </div>
    </div>
  );

  if (items.length === 0) return <p className="text-slate-500 text-center py-20">No action items yet.</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-rose-500 mb-6">Action Items</h1>
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        {overdue.length > 0 && <><h3 className="text-xs font-semibold text-rose-400 uppercase mb-2">Overdue ({overdue.length})</h3>{overdue.map(renderItem)}</>}
        {open.length > 0 && <><h3 className="text-xs font-semibold text-slate-500 uppercase mt-4 mb-2">Open ({open.length})</h3>{open.map(renderItem)}</>}
        {complete.length > 0 && <><h3 className="text-xs font-semibold text-emerald-400 uppercase mt-4 mb-2">Completed ({complete.length})</h3>{complete.map(renderItem)}</>}
      </div>
    </div>
  );
}
