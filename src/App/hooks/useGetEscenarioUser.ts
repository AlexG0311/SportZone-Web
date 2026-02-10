import { useEffect, useState } from "react";
import { type Escenario } from "../types/escenario";
import { useAuth } from "../hooks/useAuth";

export const useGetEscenarioUser = () =>{
const { usuario } = useAuth();
const [escenarios, setEscenarios] = useState<Escenario[]>([]);
const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetch(`https://${import.meta.env.VITE_SERVER_IP}/api/escenario/usuario/${usuario?.id}`,
      {                
        method: 'GET', 
        credentials: 'include'
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setEscenarios(data);
        setLoading(false);
      })
      .catch(error => console.error('Error fetching escenarios:', error));
  }, []);


  return {escenarios,loading}


}