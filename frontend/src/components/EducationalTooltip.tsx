import React from 'react';

interface EducationalTooltipProps {
  title?: string;
  description?: string;
  example?: string;
  term?: string;
  explanation?: string;
  examples?: string[];
  inline?: boolean;
}

const EducationalTooltip: React.FC<EducationalTooltipProps> = ({ title, description, example }) => {
  return (
    <div className="relative inline-flex items-center group">
      <span className="text-sm font-semibold text-gray-800">{title}</span>
      <div className="ml-2 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold cursor-help hover:bg-blue-700 transition-colors duration-200 hover:shadow-md">
        ?
      </div>
      {/* Tooltip Container - Responsivo y minimalista */}
      <div className="pointer-events-none absolute z-50 hidden px-3 sm:px-4 py-3 rounded-lg bg-white border border-gray-300 text-left text-xs sm:text-sm text-gray-800 shadow-lg group-hover:block group-hover:opacity-100 group-hover:visible top-full left-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm lg:max-w-md transition-all duration-200 opacity-0 invisible group-hover:visible">
        {/* Flecha visual */}
        <div className="absolute -top-1 left-6 w-2 h-2 bg-white border-t border-l border-gray-300 rotate-45"></div>
        
        {/* Contenido */}
        <p className="font-semibold text-gray-900 mb-1.5">{title}</p>
        <p className="text-gray-700 leading-relaxed text-xs sm:text-sm">{description}</p>
        
        {/* Ejemplo (si existe) */}
        {example && (
          <div className="mt-2.5 rounded-md bg-gray-50 p-2.5 text-gray-700 border border-gray-200">
            <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1">Ejemplo</p>
            <p className="text-xs text-gray-800">{example}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export { EducationalTooltip };
export default EducationalTooltip;
