'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateRequest } from '../../hooks/useRequests';

export default function NewRequestPage() {
  const router = useRouter();
  const createMutation = useCreateRequest();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createMutation.mutate(
      { title, description },
      {
        onSuccess: () => {
          router.push('/dashboard');
        },
      }
    );
  };

  return (
    <div className="max-w-xl mx-auto pt-4">
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white">Crear Nueva Solicitud</h2>
          <p className="text-xs text-slate-400">Se registrará inicialmente como borrador (DRAFT)</p>
        </div>

        {createMutation.error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs p-3 rounded">
            Error al crear la solicitud. Intentelo nuevamente.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
              Título del Requerimiento
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              placeholder="Ej. Requisición de Laptop para desarrollo"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
              Descripción Detallada
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              placeholder="Escriba los detalles de la solicitud..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-slate-300 font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
            >
              {createMutation.isPending ? 'Guardando...' : 'Crear Solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}