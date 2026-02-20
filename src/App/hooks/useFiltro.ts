import { useContext } from "react";
import { filtroContext } from "../context/filtroContext";

export const useFiltro = () => {
  const context = useContext(filtroContext);
  
  if (!context) {
    throw new Error("useFiltro debe ser usado dentro de un FiltroProvider");
  }
  
  return context;
};
