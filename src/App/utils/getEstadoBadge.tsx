 import {   CheckCircle, XCircle, AlertCircle } from 'lucide-react';
 
 export const getEstadoBadge = (estadoId: number | null, estadoNombre: string | null) => {
    if (estadoId === null || estadoNombre === null) {
      return {
        color: 'bg-gray-100 text-gray-700',
        icon: <AlertCircle className="w-4 h-4" />,
        nombre: 'Pendiente'
      };
    }

    switch (estadoId) {
      case 4: // Aprobada
        return {
          color: 'bg-green-100 text-green-700',
          icon: <CheckCircle className="w-4 h-4" />,
          nombre: estadoNombre
        };
      case 5: // Cancelada
        return {
          color: 'bg-red-100 text-red-700',
          icon: <XCircle className="w-4 h-4" />,
          nombre: estadoNombre
        };
      default:
        return {
          color: 'bg-yellow-100 text-yellow-700',
          icon: <AlertCircle className="w-4 h-4" />,
          nombre: estadoNombre
        };
    }
  };