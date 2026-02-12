import { useState } from "react"
import { ModalAddBanner } from "./ModalAddBanner";

export const HeaderBanner = () => {

    type Modal = {
        isOpen: boolean,

    }

    const [show, setShow] = useState<Modal>({
        isOpen: false,
    });

    const [showProfileModal, setShowProfileModal] = useState<Modal>({
        isOpen: false,
    });

    const [isHovering, setIsHovering] = useState(false);

    const closeModal = () => {
        setShow({
            isOpen: false
        })

        console.log("cerraaar")
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
            className="relative flex items-center h-60 rounded-b-lg bg-white cursor-pointer 
            bg-[url(https://imgs.search.brave.com/sUNza5V9E8uZqNlfxJ_G4zJRaTUSOx4ScdhUwWczu3g/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvaGQvMTky/MHgxMDgwLWhkLW5h/dHVyZS1yZWQtZm9y/ZXN0LThyNmU1M3By/YXRwczNqNjUuanBn)]">
            {/* Overlay con efecto hover */}
            <div className={`absolute inset-0 ${isHovering ? 'bg-black/30' : 'bg-black/0'} transition-colors duration-300 rounded-b-lg pointer-events-none`}></div>
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    OpenProfileModal();
                }}
                onMouseEnter={() => setIsHovering(false)}
                onMouseLeave={() => setIsHovering(true)}
                className="relative rounded flex items-center justify-center rounded-full ml-20 border-4 hover:bg-black/30 hover:border-green-700  w-40 h-40 bg-gray-200 z-10 bg-cover bg-center bg-[url(https://imgs.search.brave.com/keCjysNRSmj4cuqgBHFHLnQQ65fI3rKOKhy2JP_PKiU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvOTI2/ODEwMjk4L2VzL2Zv/dG8vbnVldmEteW9y/ay1jaXVkYWQtbWVu/dGUtZXN0YWRvLWNv/bmNlcHRvLWltYWdl/bi5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9b1ZnamlVT19m/Sjd5cVR0ZDZZTjVt/RGo4QzVwVURZUHIy/T21ReUQyY185TT0)]"
                role="img"
                aria-label="Imagen de perfil" >
                {/* Overlay con efecto hover */}
                <div className="absolute inset-0 hover:bg-black/30 transition-colors duration-400"></div>
            </div>

            <ModalAddBanner
                isOpen={show.isOpen}
                onClose={closeModal} />
        </div>
        

    )
}