
 export  const formatHora = (hora: string) => {
    return new Date(hora).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

