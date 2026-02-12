import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Users, DollarSign, ArrowLeft } from 'lucide-react';
import { useGetEscenarioById } from '../hooks/useGetEscenarioById';
import AddImageCard from '../components/AddImageCard';
import { useHandleDeleteImage } from '../hooks/useHandleDeleteImage';
import { useHandleChangeImage } from '../hooks/useHandleChangeImage';
import ImageCard from '../components/ImageCard';

export default function DetailEscenario() {
 
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {escenario, loading} = useGetEscenarioById(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!escenario) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-xl text-gray-600">Escenario no encontrado</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Volver
        </button>
      </div>
    );
  }
  const imagenesOrdenadas = [...escenario.imagenes].sort((a, b) => a.orden - b.orden);
  const imagenPrincipal = imagenesOrdenadas[0];
  const imagenesAdicionales = imagenesOrdenadas.slice(1);
  const maxImagenes = 6; // Máximo de imágenes permitidas
  const puedeAgregarMas = escenario.imagenes.length < maxImagenes;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header con botón volver */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Volver</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Grid principal: Imagen + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Imagen Principal */}
          <div>
            {imagenPrincipal ? (
              <ImageCard
                imagen={imagenPrincipal}
                index={0}
                isMain={true}
                onDelete={useHandleDeleteImage}
                onChange={useHandleChangeImage}
              />
            ) : (
              <AddImageCard
                label="Agregar imagen principal"
                escenarioId={id}
                escenario={escenario}
              />
            )}
          </div>

          {/* Información del Escenario */}
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {escenario.nombre}
                </h1>
                <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-lg ${
                  escenario.tipo === 'Público' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {escenario.tipo}
                </span>
              </div>

              <span className={`px-3 py-1 text-sm font-medium rounded-lg ${
                escenario.estadoId === 1
                  ? 'bg-green-100 text-green-700'
                  : escenario.estadoId === 3
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {escenario.estado.nombre}
              </span>
            </div>

            {/* Detalles en cards */}
            <div className="grid grid-cols-1 gap-4">
              {/* Precio */}
              {escenario.tipo === 'Privado' && (
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-700 uppercase">Precio por hora</p>
                    <p className="text-2xl font-bold text-green-900">
                      ${parseFloat(escenario.precio).toLocaleString('es-CO')}
                    </p>
                  </div>
                </div>
              )}

              {/* Capacidad */}
              <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-700 uppercase">Capacidad</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {escenario.capacidad} personas
                  </p>
                </div>
              </div>

              {/* Dirección */}
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-blue-700 uppercase">Dirección</p>
                  <p className="text-sm font-semibold text-blue-900">
                    {escenario.direccion}
                  </p>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
              <p className="text-gray-600 leading-relaxed">
                {escenario.descripcion}
              </p>
            </div>

            {/* Encargado */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">Encargado</p>
              <p className="font-semibold text-gray-900">{escenario.encargado.nombre}</p>
              <p className="text-sm text-gray-600">{escenario.encargado.email}</p>
            </div>
          </div>
        </div>

        {/* Imágenes Adicionales */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Imágenes Adicionales ({imagenesAdicionales.length})
            </h2>
            {puedeAgregarMas && (
              <span className="text-sm text-gray-500">
                Puedes agregar {maxImagenes - escenario.imagenes.length} más
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {imagenesAdicionales.map((imagen, index) => (
              <ImageCard
                key={imagen.id}
                imagen={imagen}
                index={index + 1}
                isMain={false}
                onDelete={useHandleDeleteImage}
                onChange={useHandleChangeImage}
              />
            ))}

            {/* Botón para agregar más imágenes */}
            {puedeAgregarMas && (
              <AddImageCard
                label="Agregar imagen"
                escenarioId={id}
                escenario={escenario}
              />
            )}
          </div>

          {!puedeAgregarMas && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-sm text-yellow-800">
                ⚠️ Has alcanzado el límite máximo de {maxImagenes} imágenes
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}