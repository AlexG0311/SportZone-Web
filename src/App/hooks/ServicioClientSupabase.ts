
import { useEffect, useState } from "react";
import { supabaseCliente  } from "../pages/supabase/clienteSupabase.ts";



export const ServicioClientSupabase = () => {
const [session, setSession] = useState<any>(null);

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