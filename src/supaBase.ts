import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qqoyxltmodvcckuxdagl.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxb3l4bHRtb2R2Y2NrdXhkYWdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2OTUwNTUsImV4cCI6MjA3NTI3MTA1NX0.Wq0v67j9DPXFuRBotnq04EHROrdoqr4pmc5T9V8zL5A";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
