export const getChartContext = (key: string, experienceLevel?: string): string => {
  const contexts: Record<string, string> = {
    'portfolio.performance.description': 'El rendimiento histórico muestra cómo ha evolucionado tu portafolio a lo largo del tiempo.',
    'dashboard.distribution.description': 'Esta distribución muestra la asignación recomendada de activos según tu perfil de riesgo.',
    'simulator.projection.description': 'Esta proyección estima el crecimiento potencial de tu inversión basado en parámetros históricos.',
    'recommendations.distribution.title': 'La distribución de activos optimizada para tu perfil de riesgo.',
    'portfolio.performance.title': 'Rendimiento del Portafolio',
  };
  return contexts[key] || key;
};

export const getChartContextByRisk = (key: string, riskLevel: string, experienceLevel?: string): string => {
  const contexts: Record<string, string> = {
    'dashboard.distribution.description': `Distribución recomendada para perfil ${riskLevel}.`,
  };
  return contexts[key] || key;
};
