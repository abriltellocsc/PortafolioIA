export type RiskLevel = 'conservative' | 'moderate' | 'aggressive';

export const normalizeRiskLevel = (risk: string): RiskLevel => {
  switch (risk?.toLowerCase()) {
    case 'conservative':
    case 'bajo':
    case 'conservador':
      return 'conservative';
    case 'moderate':
    case 'medio':
    case 'moderado':
      return 'moderate';
    case 'aggressive':
    case 'alto':
    case 'agresivo':
      return 'aggressive';
    default:
      return 'moderate';
  }
};
