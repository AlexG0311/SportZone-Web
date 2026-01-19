import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom"
import { supabaseCliente  } from "../pages/supabase/clienteSupabase.ts";


export function DropdownMenuDemo() {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button  className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold cursor-pointer hover:bg-green-600 transition-colors" variant="outline">U</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 z-[1001]" align="start">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/perfil')}>
            Perfil
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/mi-escenario')}>
            Escenario
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/panel-control/1')}>
            Reportes
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem  onClick={() => navigate('/mis-reservas')}>
            Reservas
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/crear-escenario')}>
            Crear Escenario
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={async () => {
          try {
            // Petición al backend para eliminar el token de la cookie
            await fetch(`https://${import.meta.env.VITE_SERVER_IP}/api/usuario/logout`, {
              method: 'POST',
              credentials: 'include', // Envía las cookies con la petición
            });
          } catch (error) {
            console.error('Error al hacer logout en el backend:', error);
          }
          // Finalmente, hacer signOut de Supabase
          await supabaseCliente.auth.signOut(); 
          console.log('Usuario deslogueado de Supabase');
          
          // Refrescar la página
          window.location.href = '/Home';
          // O si quieres solo recargar sin navegar:
          // window.location.reload();
        }}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
