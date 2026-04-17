import React from 'react';

interface DataClarityBadgeProps {
  type?: 'real' | 'simulated' | 'estimated';
}

const badgeStyles: Record<string, { label: string; color: string }> = {
  real: { label: 'Datos reales', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  simulated: { label: 'Datos simulados', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  estimated: { label: 'Datos estimados', color: 'bg-sky-100 text-sky-800 border-sky-200' }
};

const DataClarityBadge: React.FC<DataClarityBadgeProps> = ({ type = 'real' }) => {
  const config = badgeStyles[type] ?? badgeStyles.real;

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${config.color}`}>
      <span className="inline-flex h-2.5 w-2.5 rounded-full bg-current"></span>
      <span>{config.label}</span>
    </div>
  );
};

export default DataClarityBadge;
