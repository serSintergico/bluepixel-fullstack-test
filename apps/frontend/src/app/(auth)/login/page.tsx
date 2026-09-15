'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, loginMutation } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          router.push('/dashboard');
        },
      }
    );
  };

  // Extraer mensaje de error desde la respuesta de TanStack Query
  const errorMessage = loginMutation.error
    ? (loginMutation.error as any).response?.data?.message || 'Error de inicio de sesión'
    : null;


  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-blue-400">BluePixel B2B</h1>
        <p className="text-xs text-slate-400 mt-1">
          Ingresa tus credenciales para acceder a tu organización
        </p>
      </div>

      {errorMessage && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs p-3 rounded-lg mb-4 text-center">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition"
            placeholder="admin@alfa.com"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg text-sm transition duration-200 disabled:opacity-50 mt-2"
        >
          {loginMutation.isPending ? 'Validando...' : 'Iniciar Sesión'}
        </button>
      </form>

      <div className="mt-6 border-t border-slate-700/60 pt-4 text-[11px] text-slate-400">
        <p className="font-semibold text-slate-300 mb-1">Usuarios de prueba (Password: password123):</p>
        <div className="space-y-0.5 font-mono text-[10px]">
          <p><span className="text-blue-400">Admin Tenant Alfa:</span> admin@alfa.com</p>
          <p><span className="text-slate-300">Member Tenant Alfa:</span> member@alfa.com</p>
          <p><span className="text-amber-400">Admin Tenant Beta:</span> admin@beta.com</p>
        </div>
      </div>
    </div>
  );
}