  // Calcular horas y precio total
  export const calcularHoras = ({horaInicio, horaFin}: {horaInicio: string, horaFin: string}): number => {
    if (!horaInicio || !horaFin) return 0;
    
    const [horaIni, minIni] = horaInicio.split(':').map(Number);
    const [horaFi, minFi] = horaFin.split(':').map(Number);
    
    const minutosInicio = horaIni * 60 + minIni;
    const minutosFin = horaFi * 60 + minFi;
    
    const diferenciaMinutos = minutosFin - minutosInicio;
    return Math.max(0, diferenciaMinutos / 60);
  };
  