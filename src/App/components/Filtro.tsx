import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFiltro } from "../hooks/useFiltro";

type Props = {
  onClose: () => void;
  isClose: boolean;
};

export const Filtro = ({ onClose, isClose }: Props) => {

const { setPrice, setTipo, tipo, setCapacity}  = useFiltro();
const [value, setValue] = useState(0)
const [capacityValue, setCapacityValue] = useState(0)

 
const handleChangePrice = (e:any) =>{
setValue(e.target.value);
}

const handleChanceCapacity = (e:any) =>{
  setCapacityValue(e.target.value)
}

const handleChangeTipo = (e: any) => {
  setTipo(e.target.value)
}

const limpiarFiltros = () => {
  setValue(0);
  setPrice(0);
  setCapacityValue(0);
  setCapacity(0);
  setTipo("");
}

useEffect(() => {
  setPrice(value);
},[value])

useEffect(() => {
  setCapacity(capacityValue);
}, [capacityValue])


  return (
    <div
      className={`flex flex-col w-70 h-full bg-white p-5 gap-3 transition-all ${isClose ? "-translate-x-0 opacity-100" : "-translate-x-full opacity-50"} duration-300`}
    >
      <div className="flex justify-end">
        <div className="flex items-center w-10 p-1 h-10 hover:bg-gray-200 border rounded-md cursor-pointer">
          <X strokeWidth={2.5} onClick={onClose} />
        </div>
      </div>
      <h4 className="font-bold ">Filtro</h4>
      <span className="font-bold">Buscar por precio: ${value} </span>
      <input type="range" name="" id="" min={0} max={50000} onChange={handleChangePrice} />
       <div className="flex justify-between">
       <p>$0</p> <p>$25.000</p>  <p>$10.000</p> 
      </div>
      <div className="flex flex-col justify-start gap-2">
        <span className="font-bold">Buscar por tipo:</span>
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            name="tipo" 
            value="" 
            id="todos__"
            checked={tipo === ""}
            onChange={handleChangeTipo}
          />
          Todos
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            name="tipo" 
            value="Privado" 
            id="privado__"
            checked={tipo === "Privado"}
            onChange={handleChangeTipo}
          />
          Privado
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            name="tipo" 
            value="Público" 
            id="publico__"
            checked={tipo === "Público"}
            onChange={handleChangeTipo}
          />
          Publico
        </label>
      </div>
      <span className="font-bold">Capacidad del escenario: {capacityValue} </span>
      <input type="range" id="capacity" onChange={handleChanceCapacity} max={10000} min={0}/>
      <div className="flex justify-between">
       <p>0</p> <p>5.000</p>  <p>10.000</p> 
      </div>
      
      <button 
        onClick={limpiarFiltros}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Limpiar Filtros
      </button>
      
    </div>
  );
};
