import React from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { renderPieChartSliceLabel } from '../utils/chartLabels';
import { ChartInfoIcon } from '../components/ChartInfoIcon';
import { EducationalTooltip } from '../components/EducationalTooltip';
import InfoTooltip from '../components/InfoTooltip';
import { useUserExperienceLevel } from '../hooks/useUserExperienceLevel';
import { getChartContext } from "../constants/chartContexts";
import { percentToMoney } from '../utils/portfolioCalculations';



const COLORS = ['#003366', '#0056b3', '#0077cc', '#0099ff', '#1e88e5', '#1565c0', '#1976d2', '#1e8449', '#2e7d32', '#388e3c'];

interface RecommendationsPageProps {
  portfolio: any;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: '#1e40af',
          border: '2px solid #ffffff',
          borderRadius: '8px',
          padding: '10px 14px',
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
        }}
      >
        <p style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '14px', margin: '0' }}>
          {payload[0].name}
        </p>
        <p style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '14px', margin: '0' }}>
          {payload[0].value?.toFixed(2)}%
        </p>
      </div>
    );
  }
  return null;
};

const RecommendationsPage: React.FC<RecommendationsPageProps> = ({ portfolio }) => {
  const experienceLevel = useUserExperienceLevel();
  const recommendationDescription = getChartContext('recommendations.description', experienceLevel || undefined);
  
  // Si no hay portafolio, muestra mensaje
  if (!portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 text-center shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">No tienes portafolio generado</h2>
          <p className="text-gray-600 mb-4">Haz la encuesta para generar tu portafolio personalizado.</p>
          <Link to="/risk-profile-form">
            <button className="bg-blue-900 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-800 transition">Ir a la encuesta</button>
          </Link>
        </div>
      </div>
    );
  }

  const metrics = portfolio.metrics ?? { expected_return: 0, risk: 0 };
  let recommendedAssets = portfolio.assets ?? [];

  if (recommendedAssets.length < 8) {
    const extraAssets = [
      { name: 'Apple Inc.', allocation_pct: 5 },
      { name: 'Microsoft Corp.', allocation_pct: 5 },
      { name: 'Google (Alphabet)', allocation_pct: 5 },
      { name: 'Amazon.com', allocation_pct: 5 },
      { name: 'Tesla Inc.', allocation_pct: 5 },
      { name: 'Johnson & Johnson', allocation_pct: 5 },
      { name: 'Vanguard S&P 500 ETF', allocation_pct: 5 },
      { name: 'iShares MSCI Emerging Markets', allocation_pct: 5 },
      { name: 'SPDR Gold Shares', allocation_pct: 5 },
      { name: 'US Treasury Bond', allocation_pct: 5 },
    ];
    const names = recommendedAssets.map((a: any) => a.name);
    recommendedAssets = [
      ...recommendedAssets,
      ...extraAssets.filter(a => !names.includes(a.name)).slice(0, 8 - recommendedAssets.length),
    ];
  }
  const riskLevel = portfolio?.profile?.risk_level ?? portfolio?.risk_level ?? 'moderate';
  
  // Mapear risk level a perfiles localizados con descripciones
  const getRiskProfileData = (risk: string) => {
    const profiles: Record<string, { name: string; description: string }> = {
      conservative: {
        name: 'Conservador',
        description: 'Tu cartera está diseñada para darte tranquilidad. Con predominancia en Renta Fija, priorizas la preservación del capital y la estabilidad a largo plazo, minimizando riesgos de volatilidad.'
      },
      moderate: {
        name: 'Moderado',
        description: 'Buscas el mejor de los dos mundos: crecimiento y protección. Tu cartera equilibra Renta Fija y Variable, capturando oportunidades del mercado con un colchón de estabilidad.'
      },
      aggressive: {
        name: 'Agresivo',
        description: 'Esta cartera está construida para ganar. Priorizas la acumulación de riqueza a largo plazo con alta exposición a Renta Variable, aceptando volatilidad significativa para máximo crecimiento.'
      }
    };
    return profiles[risk.toLowerCase()] || profiles.moderate;
  };

  const investorProfile = getRiskProfileData(riskLevel);
  const pieChartData = recommendedAssets.map((asset: any) => ({
    name: asset.name,
    value: asset.allocation_pct ?? 0,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-8 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-blue-900">Tus Recomendaciones</h1>
          <p className="text-slate-600 text-lg">Portafolio personalizado basado en tu perfil y objetivos</p>
          <p className="text-gray-600 mb-4 max-w-3xl leading-relaxed">{recommendationDescription}</p>
        </div>

        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-blue-900">Tu Perfil de Inversor</h2>
            <InfoTooltip
              title="¿Qué es tu Perfil?"
              description="Tu perfil se determinó basado en tus respuestas a la encuesta: experiencia, objetivo, tolerancia al riesgo y horizonte temporal. Define cuánto riesgo puedes soportar."
              example="Perfil Agresivo = toleras -35% en años malos pero buscas +20% anual. Perfil Conservador = prefieres -5% máximo pero ganas 6-8%."
            />
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-2xl font-bold text-blue-900 mb-2">
              Perfil {investorProfile.name}
            </h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              {investorProfile.description}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-blue-100">
          {/* SECCIÓN EDUCATIVA: Diversificación */}
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-l-4 border-blue-600">
            <div className="flex items-start gap-3">
              <i className="fas fa-lightbulb text-blue-600 text-2xl mt-1"></i>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-blue-900 mb-2">¿Por qué diversificación?</h3>
                <p className="text-gray-700 text-sm mb-3">
                  En lugar de invertir TODO en una sola empresa, distribuimos tu dinero en múltiples activos. Si uno baja, otros pueden compensar.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm bg-white p-3 rounded-lg">
                  <div className="border-r border-gray-200">
                    <p className="font-semibold text-gray-800">❌ Sin diversificación</p>
                    <p className="text-gray-600 text-xs mt-1">$10,000 solo en Apple: -20% = pierdes $2,000</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">✅ Con diversificación</p>
                    <p className="text-gray-600 text-xs mt-1">$10,000 en 8 activos: -20% solo sube a -5% total</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">Resumen de la Estrategia</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Diversificación en múltiples instrumentos financieros para maximizar el potencial de retorno y reducir riesgos.
              </p>
              <div className="bg-white p-6 rounded-lg mb-6 border-2 border-blue-100">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <i className="fas fa-chart-line text-blue-600"></i>
                  <span>Métricas Clave del Portafolio</span>
                  <EducationalTooltip
                    term=""
                    explanation="Estas métricas muestran los números clave de tu portafolio. El Retorno es cuánto esperas ganar, y el Riesgo es cuánto pueden fluctuar tus inversiones."
                    inline={true}
                  />
                </h3>
                <div className="space-y-3">
                  <p className="text-slate-700 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <i className="fas fa-arrow-up text-blue-600"></i>
                      <span className="flex items-center gap-1">
                        Retorno Esperado Anual:
                        <EducationalTooltip
                          term=""
                          explanation="El porcentaje de ganancia que esperas anualmente basado en tu perfil."
                          inline={true}
                        />
                      </span>
                    </span>
                    <span className="font-bold text-blue-600 text-xl">{(metrics.expected_return * 100).toFixed(2)}%</span>
                  </p>
                  <p className="text-slate-700 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <i className="fas fa-exclamation-triangle text-amber-400"></i>
                      <span className="flex items-center gap-1">
                        Riesgo (Volatilidad):
                        <EducationalTooltip
                          term=""
                          explanation="La fluctuación esperada. Mayor % = inversiones más volátiles pero potencial de mayores ganancias."
                          inline={true}
                        />
                      </span>
                    </span>
                    <span className="font-bold text-amber-400 text-xl">{(metrics.risk * 100).toFixed(2)}%</span>
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-blue-900 mb-4">Activos Recomendados</h3>
                <p className="text-gray-400 mb-3 text-sm flex items-center gap-2">
                  <span>Mostrando {recommendedAssets.length} activos recomendados según tu perfil de riesgo ({riskLevel}).</span>
                  <EducationalTooltip
                    term=""
                    explanation="La asignación % se traduce a dinero real según cuánto inviertas. Ej: 30% de $10,000 = $3,000."
                    examples={['Si inviertes $10,000: Apple 10% = $1,000', 'Si inviertes $50,000: Apple 10% = $5,000']}
                    inline={true}
                  />
                </p>
              <div className="max-h-[420px] overflow-y-auto pr-2">
                <ul className="divide-y divide-slate-200">
                  {recommendedAssets.map((asset: any, index: number) => (
                    <li key={index} className="bg-white p-5 rounded-lg border-2 border-blue-100 hover:border-blue-200 transition-colors mb-3 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <i className={`fas ${asset.icon ?? 'fa-chart-line'} text-blue-600 text-lg`}></i>
                          <h4 className="text-lg font-semibold text-slate-900">
                            {asset.name}
                            <span className="text-xs text-slate-500">({asset.ticker})</span>
                          </h4>
                          {asset.tipo && (
                            <span className="text-xs bg-blue-50 px-2 py-1 rounded-full text-blue-600 ml-2">
                              {asset.tipo}
                            </span>
                          )}
                        </div>
                        <span className="text-blue-600 font-bold text-lg">{(asset.allocation_pct ?? 0).toFixed(2)}%</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <span>Si inviertes $10,000: ~{percentToMoney(asset.allocation_pct ?? 0, 10000)}</span>
                        <span className="text-gray-400">|</span>
                        <span>Si inviertes $50,000: ~{percentToMoney(asset.allocation_pct ?? 0, 50000)}</span>
                      </div>
                      {asset.reason && <p className="text-slate-600 text-sm leading-relaxed">{asset.reason}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">Distribución de Activos</h2>
                <ChartInfoIcon label={getChartContext('recommendations.distribution.title', experienceLevel || undefined)} />
              </div>
              <div className="bg-white p-6 rounded-lg border-2 border-blue-100">
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderPieChartSliceLabel}
                      outerRadius={140}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((_entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '3px solid #003366',
                        borderRadius: '12px',
                        color: '#001a4d',
                        fontWeight: '900',
                        fontSize: '16px',
                        padding: '16px 20px',
                        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 51, 102, 0.2)',
                        maxWidth: '350px',
                        whiteSpace: 'normal' as const,
                        wordWrap: 'break-word' as const,
                        lineHeight: '1.6'
                      }}
                      formatter={(value) => {
                        const v = Array.isArray(value) ? value[0] : value;
                        const num = typeof v === 'number' ? v : parseFloat(v);
                        return isNaN(num) ? String(v) : num.toFixed(2) + '%';
                      }}
                      labelStyle={{ color: '#003366', fontWeight: '900', fontSize: '16px', marginBottom: '8px', display: 'block' }}
                      wrapperStyle={{ outline: 'none' }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Explanation Text */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {getChartContext('recommendations.distribution.description', experienceLevel || undefined)}
                  </p>
                </div>

                <div className="mt-6 space-y-2">
                  {pieChartData.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-slate-700 text-sm">{entry.name}</span>
                      </div>
                      <span className="text-slate-900 font-semibold">{entry.value.toFixed(2)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;
