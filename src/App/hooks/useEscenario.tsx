
import { EscenarioContext } from "../context/EscenarioContext"
import { useContext } from "react";

export function useEscenario() {
  const context = useContext(EscenarioContext)
  if (!context) {
    throw new Error('useEscenario debe usarse dentro de EscenarioProvider')
  }
  return context
}