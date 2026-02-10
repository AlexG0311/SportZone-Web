import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}