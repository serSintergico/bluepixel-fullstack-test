'use client';

import { RequestStatus } from "@/entities/entities.interfaces";

const statusStyles: Record<RequestStatus, string> = {
  [RequestStatus.DRAFT]: 'bg-slate-700/60 text-slate-300 border-slate-600',
  [RequestStatus.SUBMITTED]: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  [RequestStatus.APPROVED]: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  [RequestStatus.REJECTED]: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold border ${
        statusStyles[status] || 'bg-slate-800 text-slate-400 border-slate-700'
      }`}
    >
      {status}
    </span>
  );
}