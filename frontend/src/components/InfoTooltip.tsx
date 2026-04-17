import React from 'react';

interface InfoTooltipProps {
  title?: string;
  description: string;
  example?: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ title, description, example }) => {
  return (
    <div className="relative inline-flex items-center group">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-900 text-white text-sm font-bold cursor-help transition-transform duration-200 group-hover:scale-110">
        i
      </div>
      <div className="pointer-events-none absolute z-20 hidden w-80 max-w-[22rem] rounded-2xl bg-slate-900 p-4 text-left text-sm text-slate-100 shadow-2xl group-hover:block top-full left-1/2 -translate-x-1/2 mt-3">
        {title && <p className="font-semibold text-white mb-2">{title}</p>}
        <p className="text-slate-200 leading-relaxed">{description}</p>
        {example && (
          <div className="mt-3 rounded-xl bg-slate-800 p-3 text-slate-300 border border-slate-700">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-1">Ejemplo</p>
            <p>{example}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoTooltip;
