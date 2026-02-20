import { useEffect, useState } from "react"
import { ModalAddBanner } from "./ModalAddBanner";
import { GetImgBannerPerfilUser } from "../services/GetImgBannerPerfilUser";
import { useAuth } from "../hooks/useAuth";
import { ModalAddPerfil } from "./ModalAddPerfil";
export const HeaderBanner = () => {
    const [show, setShow] = useState<Modal>({
        isOpen: false,
    });
    const [showProfileModal, setShowProfileModal] = useState<Modal>({
        isOpen: false,
    });
    const [isHovering, setIsHovering] = useState(false);
    const {usuario} = useAuth();
    const [ImgBanner, setBanner] = useState<{url?: string}>();
    const [ImgPerfil, setPerfil] = useState<{url?: string}>();

    useEffect(()=>{

    const ObtenerImgPerfilBanner = async () => {
    if(!usuario) return
    const { Banner } = await GetImgBannerPerfilUser(usuario.id);
    setBanner(Banner.banner);
    setPerfil(Banner.perfil);

}
    ObtenerImgPerfilBanner();

    },[usuario])

    type Modal = {
        isOpen: boolean,}

    const closeModal = () => {
        setShow({
            isOpen: false
        })
    }

    const closeProfileModal = () => {
        setShowProfileModal({
            isOpen: false
        })
    }

    const OpenModal = () => {
        setShow({
            isOpen: true
        })
    }

    const OpenProfileModal = () => {
        setShowProfileModal({
            isOpen: true
        })
    }
    return (
        <div 
            onClick={OpenModal} 
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={{ backgroundImage:  `url(${ImgBanner?.url})`}}
            className="relative flex items-center h-60 rounded-b-lg bg-white cursor-pointer bg-cover bg-center">
           
            <div className={`absolute inset-0 ${isHovering ? 'bg-black/30' : 'bg-black/0'} transition-colors duration-300 rounded-b-lg pointer-events-none`}></div>

            <div
                onClick={(e) => {
                    e.stopPropagation();
                    OpenProfileModal();
                }}
                onMouseEnter={() => setIsHovering(false)}
                onMouseLeave={() => setIsHovering(true)}
                className="relative rounded flex items-center justify-center rounded-full ml-20 border-4 hover:bg-black/30 hover:border-green-700  w-40 h-40 bg-gray-200 z-10 bg-cover bg-center"
                role="img"
                style={{backgroundImage: `url(${ImgPerfil?.url})`}}
                aria-label="Imagen de perfil" >
                {/* Overlay con efecto hover */}
                <div className="absolute inset-0 hover:bg-black/30 rounded-full transition-colors duration-400"></div>
            </div>

            <ModalAddBanner
                isOpen={show.isOpen}
                onClose={closeModal} />

            
            <ModalAddPerfil
                isOpen={showProfileModal.isOpen}
                onClose={closeProfileModal} />
        </div>
        

    )
}