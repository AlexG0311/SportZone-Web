import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY 

export const supabaseCliente = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,        // ✅ Persiste la sesión
      autoRefreshToken: true,      // ✅ Refresca tokens
      detectSessionInUrl: true,    // ✅ NECESARIO para OAuth
    },
  }
);
