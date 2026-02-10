import { useEffect, useState } from "react";
import { Reserva } from "../types/reserva";
import { useAuth } from "./useAuth";
export const useReservas = () => {
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [loading, setLoading] = useState(true);
    const { usuario } = useAuth();

    useEffect(() => {
    const fetchReservas = async () => {
        try {
            const response = await fetch(`https://${import.meta.env.VITE_SERVER_IP}/api/reserva/usuario/${usuario?.id}`, {
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Error al cargar reservas');

            const data = await response.json();
            setReservas(data);
        } catch (error) {
            console.error('Error:', error);
            alert('Error al cargar las reservas');
        } finally {
            setLoading(false);
        }}
    fetchReservas();
        
    }, [usuario])

    return { reservas, loading, setReservas }

};
