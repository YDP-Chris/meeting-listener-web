import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Table names (public views pointing to ml schema)
export const T = {
  meetings: 'ml_meetings',
  people: 'ml_people',
  participants: 'ml_participants',
  action_items: 'ml_action_items',
  grades: 'ml_grades',
  goals: 'ml_goals',
} as const;
