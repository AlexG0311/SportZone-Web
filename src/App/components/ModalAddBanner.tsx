import { PropsModal } from "../types/modal"

export const ModalAddBanner = ({isOpen, onClose}:PropsModal ) => {

if(!isOpen){
    return null
}
return (
<div className="fixed z-50 inset-0 flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>

  {/* Overlay */}
    <div 
      className="absolute inset-0 bg-black/40" 
      onClick={onClose}/>

    <div className="flex flex-col items-center gap-5 justify-center relative bg-white rounded-xl p-6 shadow-xl max-w-md w-full mx-4 z-10">
    <h1 className="font-bold">Elige una foto de Perfil</h1>
    
    <input 
      id="file-upload"
      type="file"
      accept="image/*"
      className="hidden"
    />
    <label 
      htmlFor="file-upload"
      className="cursor-pointer px-6 py-2 hover:bg-green-600 rounded-md bg-green-500 text-white font-medium transition-colors">
      Agregar foto
    </label>

    </div>


   
</div>  


)


}