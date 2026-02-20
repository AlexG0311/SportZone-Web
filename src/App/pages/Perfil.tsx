import { useEffect } from "react";
import { HeaderBanner } from "../components/HeaderBanner";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Perfil() {
  const navegar = useNavigate();

  const { usuario } = useAuth();

  if (usuario === null) {
    useEffect(() => {
      navegar("/auth/login");
    }, []);
    return;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-200">
        <HeaderBanner />

        <div className="bg-white w-auto h-100 ml-5 mr-5 mt-5 rounded-md p-10">
          <h1 className="text-black-600 font-bold text-6xl">
            Informacion del perfil
          </h1>
          <p className="text-2xl text-black-600">
            <span className="font-bold">Nombre:</span> {usuario.nombre}
          </p>
          <p className="text-2xl">
            <span className="font-bold">Correo:</span> {usuario.email}
          </p>
        </div>
      </div>
    </>
  );
}
