import React from 'react';

interface EducationalTooltipProps {
  title: string;
  description: string;
  example?: string;
}

const EducationalTooltip: React.FC<EducationalTooltipProps> = ({ title, description, example }) => {
  return (
    <div className="relative inline-flex items-center group">
      <span className="text-sm font-semibold text-gray-800">{title}</span>
      <div className="ml-2 flex h-7 w-7 items-center justify-center rounded-full bg-blue-900 text-white text-xs font-bold cursor-help transition-transform duration-200 group-hover:scale-110">
        i
      </div>
      <div className="pointer-events-none absolute z-20 hidden w-80 max-w-[22rem] rounded-2xl bg-slate-900 p-4 text-left text-sm text-slate-100 shadow-2xl group-hover:block group-focus:block top-full left-0 mt-3">
        <p className="font-semibold text-white mb-2">{title}</p>
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

export default EducationalTooltip;
