import React from 'react';

interface InfoTooltipProps {
  title?: string;
  description: string;
  example?: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ title, description, example }) => {
  return (
    <div className="relative inline-flex items-center group">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold cursor-help hover:bg-blue-700 transition-colors duration-200 hover:shadow-md flex-shrink-0">
        ?
      </div>
      {/* Tooltip Container - Más ancho para que no se corte */}
      <div className="pointer-events-auto absolute z-50 hidden px-4 py-3 rounded-lg bg-white border border-gray-300 text-left text-xs text-gray-800 shadow-xl group-hover:block top-full left-1/2 -translate-x-1/2 mt-3 w-96 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200">
        {/* Flecha visual */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-t border-l border-gray-300 rotate-45"></div>
        
        {/* Contenido */}
        {title && <p className="font-semibold text-gray-900 mb-1.5">{title}</p>}
        <p className="text-gray-700 leading-relaxed text-xs whitespace-normal">{description}</p>
        
        {/* Ejemplo (si existe) */}
        {example && (
          <div className="mt-2.5 rounded-md bg-gray-50 p-2.5 border border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-1">Ejemplo:</p>
            <p className="text-xs text-gray-700 whitespace-normal leading-relaxed">{example}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoTooltip;
