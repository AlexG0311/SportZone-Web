import NavBar from "../components/NavBar";
import { useParams } from "react-router-dom";
import { ChartIngresos } from "../components/ChartIngresos";
import { ChartDays } from "../components/ChartDays";

export default function PanelControl() {
  const { id } = useParams();

  console.log("ID del escenario:", id);

  return (
    <div className="bg-white min-h-screen">
      <NavBar />
      <main className="p-6 bg-gray-100 rounded-lg min-h-screen shadow-md ml-6 mr-6">
        <header>
        <h1 className="text-2xl font-bold mb-4">Panel de Control</h1>
        <p>Bienvenido al panel de control. Aquí puedes gestionar las configuraciones y opciones de tu cuenta.</p>

        </header>
        <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
         <article className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Total de reservas</h2>
            <p className="text-5xl">24</p>
          </article>
          <article className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Ingresos</h2>
            <p className="text-5xl">100</p>
          </article>
          <article className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Reportes</h2>
            <p className="text-5xl">6</p>
          </article>
        </section>

        <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <article className="bg-white p-4 rounded-lg shadow-sm">
              <ChartIngresos />
          </article>
          
          <article className="bg-white p-4 rounded-lg shadow-sm">
              <ChartDays />
          </article>
        </section>
      </main>
    </div>
  );
}


