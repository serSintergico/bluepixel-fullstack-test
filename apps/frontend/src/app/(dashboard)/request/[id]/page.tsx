'use client';

import { useParams, useRouter } from 'next/navigation';
// import { useGetRequestDetail, useUpdateRequestStatus } from '@/hooks/useRequests';
// import { StatusBadge } from '@/components/ui/StatusBadge';
// import { AuditTimeline } from '@/components/requests/AuditTimeline';
// import { Can } from '@/components/Can';
// import { RequestStatus, Role } from '@/lib/api';

import { useGetRequestDetail, useUpdateRequestStatus } from '../../hooks/useRequests';
import { StatusBadge } from '../../components/StatusBadge';
import { AuditTimeline } from '../../components/AuditLimitTime';
import { Can } from '@/app/(auth)/components/CanComponent';
import { RequestStatus, Role } from '@/entities/entities.interfaces';


export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: request, isLoading } = useGetRequestDetail(id);
  const updateStatusMutation = useUpdateRequestStatus();

  if (isLoading) {
    return <div className="p-6 text-slate-400">Cargando detalle de la solicitud...</div>;
  }

  if (!request) {
    return <div className="p-6 text-rose-400">Solicitud no encontrada.</div>;
  }

  const handleStatusChange = (status: RequestStatus) => {
    updateStatusMutation.mutate({ id, status });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => router.push('/dashboard')}
        className="text-blue-400 hover:underline text-xs flex items-center space-x-1"
      >
        <span>← Volver al Dashboard</span>
      </button>

      {/* Card principal del requerimiento */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-6 shadow-xl">
        <div className="flex justify-between items-start border-b border-slate-700/60 pb-4">
          <div>
            <h1 className="text-xl font-bold text-white">{request.title}</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Creado por: <span className="text-slate-300 font-semibold">{request.createdBy?.email}</span>
            </p>
          </div>
          <StatusBadge status={request.status} />
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase text-slate-400 mb-1">Descripción</h3>
          <p className="text-xs text-slate-300 bg-slate-900/60 p-4 rounded-lg border border-slate-700/50 leading-relaxed">
            {request.description}
          </p>
        </div>

        {/* Acciones del Flujo de Estado */}
        <div className="border-t border-slate-700/60 pt-4 space-y-2">
          <h3 className="text-xs font-semibold uppercase text-slate-400">Acciones Disponibles</h3>
          
          <div className="flex flex-wrap gap-2">
            {/* Cualquier usuario puede Enviar (SUBMIT) si está en DRAFT */}
            {request.status === RequestStatus.DRAFT && (
              <button
                onClick={() => handleStatusChange(RequestStatus.SUBMITTED)}
                disabled={updateStatusMutation.isPending}
                className="bg-amber-600 hover:bg-amber-500 text-white text-xs px-3 py-2 rounded-lg font-semibold transition"
              >
                Enviar a Revisión (Submit)
              </button>
            )}

            {/* Delimitación UI: Solamente el Rol ADMIN puede APROBAR o RECHAZAR */}
            <Can role={Role.ADMIN}>
              {request.status !== RequestStatus.APPROVED && (
                <button
                  onClick={() => handleStatusChange(RequestStatus.APPROVED)}
                  disabled={updateStatusMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-2 rounded-lg font-semibold transition"
                >
                  Aprobar Solicitud
                </button>
              )}

              {request.status !== RequestStatus.REJECTED && (
                <button
                  onClick={() => handleStatusChange(RequestStatus.REJECTED)}
                  disabled={updateStatusMutation.isPending}
                  className="bg-rose-600 hover:bg-rose-500 text-white text-xs px-3 py-2 rounded-lg font-semibold transition"
                >
                  Rechazar Solicitud
                </button>
              )}
            </Can>
          </div>
        </div>
      </div>

      {/* Historial de Auditoría */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
          Historial de Auditoría (RequestHistory)
        </h3>
        <AuditTimeline histories={request.histories} />
      </div>
    </div>
  );
}