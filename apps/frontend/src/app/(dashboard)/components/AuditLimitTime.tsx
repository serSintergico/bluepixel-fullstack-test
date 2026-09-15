'use client';

import { RequestHistory } from '@/entities/entities.interfaces';
import { StatusBadge } from './StatusBadge';

export function AuditTimeline({ histories }: { histories?: RequestHistory[] }) {
  if (!histories || histories.length === 0) {
    return (
      <p className="text-slate-500 text-xs italic">
        No se han registrado cambios de estado para esta solicitud.
      </p>
    );
  }

  return (
    <div className="relative border-l border-slate-700 ml-4 space-y-6">
      {histories.map((h) => (
        <div key={h.id} className="relative pl-6">
          <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-blue-500" />
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Estado cambiado de</span>
              <StatusBadge status={h.previousStatus} />
              <span className="text-slate-400">a</span>
              <StatusBadge status={h.newStatus} />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 pt-1">
              <span>Por: {h.changedBy?.email}</span>
              <span>{new Date(h.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}