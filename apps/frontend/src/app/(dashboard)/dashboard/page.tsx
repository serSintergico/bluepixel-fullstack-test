'use client';

import { useRouter } from 'next/navigation';
// import { useGetRequests, useGetDashboardStats } from '@/hooks/useRequests';
// import { StatsOverview } from '@/components/dashboard/StatsOverview';
// import { StatusBadge } from '@/components/ui/StatusBadge';

import { useGetDashboardStats, useGetRequests } from '../hooks/useRequests';
import { StatusBadge } from '../components/StatusBadge';
import { StatsOverview } from '../components/StatsOverview';

export default function DashboardPage() {
  const router = useRouter();
  const { data: requests, isLoading: loadingReqs } = useGetRequests();
  const { data: stats, isLoading: loadingStats } = useGetDashboardStats();

  if (loadingReqs || loadingStats) {
    return <div className="p-6 text-slate-400">Cargando solicitudes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Resumen de Solicitudes</h2>
          <p className="text-xs text-slate-400">Gestión de requerimientos del Tenant</p>
        </div>
        <button
          onClick={() => router.push('/request/new')}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold text-xs transition"
        >
          + Nueva Solicitud
        </button>
      </div>

      {/* KPI Stats */}
      {stats && <StatsOverview stats={stats} />}

      {/* Tabla de Solicitudes */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900/60 border-b border-slate-700 text-slate-400 uppercase font-semibold">
              <th className="p-4">Título</th>
              <th className="p-4">Creado por</th>
              <th className="p-4">Fecha</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {requests?.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500">
                  No hay solicitudes creadas aún.
                </td>
              </tr>
            ) : (
              requests?.map((req) => (
                <tr key={req.id} className="hover:bg-slate-700/30 transition">
                  <td className="p-4 font-semibold text-white">{req.title}</td>
                  <td className="p-4 text-slate-400">{req.createdBy?.email}</td>
                  <td className="p-4 text-slate-400">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => router.push(`/request/${req.id}`)}
                      className="text-blue-400 hover:text-blue-300 font-semibold text-xs"
                    >
                      Ver Detalle →
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}