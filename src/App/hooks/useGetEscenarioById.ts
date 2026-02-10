import { useEffect, useState } from "react";
import { type Escenario } from "../types/escenario";

export const useGetEscenarioById = (id: string | undefined) => {
  const [escenario, setEscenario] = useState<Escenario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    fetch(`https://${import.meta.env.VITE_SERVER_IP}/api/escenario/${id}`, {
      method: 'GET',
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        setEscenario(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching escenario:', error);
        setLoading(false);
      });
  }, [id]);

  return { escenario, loading };
};
