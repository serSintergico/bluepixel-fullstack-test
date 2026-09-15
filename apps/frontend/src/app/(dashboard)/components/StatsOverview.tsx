'use client';

interface StatsProps {
  stats: {
    total: number;
    draft: number;
    submitted: number;
    approved: number;
    rejected: number;
  };
}

export function StatsOverview({ stats }: StatsProps) {
  const cards = [
    { label: 'Total', value: stats.total, color: 'border-slate-700 text-white' },
    { label: 'Borrador', value: stats.draft, color: 'border-slate-600 text-slate-300' },
    { label: 'Enviadas', value: stats.submitted, color: 'border-amber-500/50 text-amber-400' },
    { label: 'Aprobadas', value: stats.approved, color: 'border-emerald-500/50 text-emerald-400' },
    { label: 'Rechazadas', value: stats.rejected, color: 'border-rose-500/50 text-rose-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-slate-800/80 backdrop-blur p-4 rounded-xl border ${card.color} shadow-sm transition hover:scale-[1.02]`}
        >
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            {card.label}
          </span>
          <p className="text-3xl font-extrabold mt-2">{card.value}</p>
        </div>
      ))}
    </div>
  );
}