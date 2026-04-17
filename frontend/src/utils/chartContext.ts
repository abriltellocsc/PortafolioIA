export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type RiskLevel = 'low' | 'medium' | 'high' | 'conservative' | 'moderate' | 'aggressive';

export const normalizeRiskLevel = (value: string): RiskLevel => {
  const normalized = value?.toString().trim().toLowerCase();
  if (normalized === 'low' || normalized === 'conservative') return 'conservative';
  if (normalized === 'high' || normalized === 'aggressive') return 'aggressive';
  return 'moderate';
};

const chartContext: Record<string, Record<ExperienceLevel, string>> = {
  'dashboard.distribution.description.conservative': {
    beginner:
      'Esta distribución prioriza la estabilidad. Se busca que el crecimiento sea más suave y que las caídas del mercado tengan menor impacto en tu portafolio.',
    intermediate:
      'Gráfica: mayor peso en renta fija y menor exposición a renta variable. Significa estabilidad con potencial de crecimiento moderado. Qué hacer: mantén la estrategia y rebalancea cada 6-12 meses.',
    advanced:
      'Conservative allocation: heavy fixed income, light equity exposure. Designed for capital preservation with modest upside. Maintain target weights and rebalance semiannually.'
  },
  'dashboard.distribution.description.moderate': {
    beginner:
      'Buscamos el mejor de los dos mundos. Como ves en la gráfica, combinamos la seguridad de los bonos (renta fija) con el potencial de las acciones (renta variable). Esta distribución permite que tu patrimonio crezca a mediano plazo, pero con un colchón de seguridad.',
    intermediate:
      'Gráfica: balance 50/50 entre renta fija y renta variable. Significa crecimiento moderado con volatilidad controlada. Qué hacer: invierte según estos pesos y revisa tu asignación cada seis meses.',
    advanced:
      'Moderate allocation: roughly equal fixed income and equity exposure. Balanced growth with controlled volatility. Action: execute allocation, monitor correlations, rebalance semiannually.'
  },
  'dashboard.distribution.description.aggressive': {
    beginner:
      'Esta cartera busca crecimiento más agresivo. Tiene mayor exposición a acciones y activos de mayor rendimiento, lo que eleva la volatilidad, pero también el potencial de retorno.',
    intermediate:
      'Gráfica: mayor peso en renta variable y menor exposición a renta fija. Significa búsqueda de crecimiento con mayor fluctuación. Qué hacer: acepta los altibajos y revisa tu portafolio con disciplina.',
    advanced:
      'Aggressive allocation: equity-heavy portfolio with limited fixed income. Optimized for long-term growth and higher volatility. Execute discipline, monitor market regime, rebalance as needed.'
  },
  'recommendations.distribution.description': {
    beginner:
      'Tus recomendaciones se adaptan a tu nivel de experiencia. Aquí verás por qué cada activo forma parte de la estrategia y cómo contribuye a tu portafolio.',
    intermediate:
      'Estas recomendaciones equilibran riesgo y retorno según tu experiencia. Incluyen una mezcla de activos con propósito definido y una explicación clara de su rol.',
    advanced:
      'Recommendation summary based on experience level, balancing diversification, factor exposure and expected return. Focus on execution and periodic rebalancing.'
  },
  'portfolio.performance.description': {
    beginner:
      'El rendimiento muestra cuánto puede crecer tu portafolio con el tiempo. Es una estimación basada en la combinación actual de activos y el nivel de riesgo elegido.',
    intermediate:
      'Este rendimiento refleja la expectativa de crecimiento de tu portafolio. Ten en cuenta que variará según los cambios de mercado y el rebalanceo de los activos.',
    advanced:
      'Performance estimate based on current allocation, volatility and return assumptions. Use it as a directional guide, not a guarantee.'
  },
  'simulator.projection.description': {
    beginner:
      'El simulador crea escenarios hipotéticos para que entiendas cómo podría comportarse tu inversión. No es una predicción exacta, pero te ayuda a ver el rango posible.',
    intermediate:
      'La proyección muestra distintos escenarios de retorno según la volatilidad y horizonte elegido. Úsala para comparar riesgos y definir expectativas realistas.',
    advanced:
      'Monte Carlo-style projection using assumed return and volatility. Helps visualize optimistic, expected, and pessimistic scenarios for planning.'
  }
};

export const getChartContextByRisk = (
  key: string,
  riskLevel: string,
  experienceLevel: ExperienceLevel
): string => {
  const normalizedRisk = normalizeRiskLevel(riskLevel);
  const fullKey = `${key}.${normalizedRisk}`;
  const levelContext = chartContext[fullKey];
  if (levelContext && levelContext[experienceLevel]) {
    return levelContext[experienceLevel];
  }

  const fallback = chartContext[`${key}.moderate`]?.[experienceLevel];
  return fallback || 'Información no disponible para este nivel.';
};

export const getChartContext = (key: string, experienceLevel: ExperienceLevel): string => {
  const levelContext = chartContext[key];
  if (levelContext && levelContext[experienceLevel]) {
    return levelContext[experienceLevel];
  }

  return 'Información no disponible para este nivel.';
};
