
import { useEffect, useState } from "react";
import { supabaseCliente  } from "../pages/supabase/clienteSupabase.ts";
import { Session } from '@supabase/supabase-js';



export const ServicioClientSupabase = () => {
const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
   // Check for existing session
        supabaseCliente.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });
        // Listen for auth changes
        const {
            data: { subscription },
        } = supabaseCliente.auth.onAuthStateChange((_event, session) => {
            setSession(session);
         
        });
        return () => subscription.unsubscribe();
  }, []);

return { session };

}