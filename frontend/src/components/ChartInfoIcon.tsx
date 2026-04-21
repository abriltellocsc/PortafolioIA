import React from 'react';

interface ChartInfoIconProps {
  label: string;
}

const ChartInfoIcon: React.FC<ChartInfoIconProps> = ({ label }) => {
  return (
    <div className="inline-flex items-center ml-2">
      <i className="fas fa-info-circle text-blue-400 text-sm"></i>
      <span className="sr-only">{label}</span>
    </div>
  );
};

export { ChartInfoIcon };
