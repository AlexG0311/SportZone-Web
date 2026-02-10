// src/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import NavBar from '@/App/components/NavBar';

export default function MainLayout() {
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}