
export const Navbar = ({text,setText}) =>{

return (

<div className="flex gap-5 rounded-md mb-5  border border-gray-200 bg-white items-center w-auto h-15 p-5">

<input 
value={text}
onChange={e => setText(e.target.value)}
 name="buscador" 
 className="border-2 border-gray-300 w-full h-10 focus:outline-none focus:border-green-500 px-3 py-2 rounded" 
 type="text" placeholder="Buscar escenario..." />

<select className="cursor-pointer" name="Ordenar" id="">
    <option value="">Selection</option>
    <option value="">Selection</option>
</select>

<button className="bg-green-400 p-2 cursor-pointer h-10 w-50 rounded-md cursor-pointer">
    Crear escenario
</button>   
</div>

);
}