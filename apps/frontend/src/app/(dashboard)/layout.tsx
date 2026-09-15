'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/(auth)/context/AuthContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p className="text-slate-400 animate-pulse">Verificando sesión...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Navbar Superior del Dashboard */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold text-blue-400">BluePixel B2B</h1>
          <p className="text-xs text-slate-400">
            {user?.email} | Organismo Tenant ID: <span className="font-mono text-slate-300">{user?.tenantId}</span>
          </p>
        </div>
        <button
          onClick={logout}
          className="bg-slate-700 hover:bg-slate-600 text-xs px-3 py-2 rounded transition"
        >
          Cerrar Sesión
        </button>
      </header>

      {/* Contenido Principal Protegido */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">{children}</main>
    </div>
  );
}