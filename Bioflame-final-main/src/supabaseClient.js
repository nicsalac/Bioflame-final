// ─── Supabase Client ──────────────────────────────────────────────────────────
// Replace the values below with your actual Supabase project credentials.
// Get them from: https://app.supabase.com → Project Settings → API

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  || "https://vnmsbxrmdndvbchvvyzj.supabase.co";
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZubXNieHJtZG5kdmJjaHZ2eXpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MTk5MTksImV4cCI6MjA3ODQ5NTkxOX0._vG85bXqgP7-OD8D4SFwCF_GdsTZ1a3mY-8JMHHUR1w";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
