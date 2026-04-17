import React from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import InfoTooltip from '../components/InfoTooltip';
import { getChartContext } from '../utils/chartContext';
import useUserExperienceLevel from '../hooks/useUserExperienceLevel';

const COLORS = ['#003366', '#0056b3', '#0077cc', '#0099ff', '#1e88e5', '#1565c0', '#1976d2', '#1e8449', '#2e7d32', '#388e3c'];

interface RecommendationsPageProps {
  portfolio: any;
}

const RecommendationsPage: React.FC<RecommendationsPageProps> = ({ portfolio }) => {
  const experienceLevel = useUserExperienceLevel(portfolio);

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

  const riskLevel = portfolio?.profile?.risk_level ?? portfolio?.risk_level ?? 'medium';
  const recommendationDescription = getChartContext('recommendations.distribution.description', experienceLevel);
  const investorProfile = portfolio.profile ?? {
    name: 'Personalizado',
    description: 'Portafolio generado según tu última encuesta.',
    color: 'teal',
    icon: 'fa-balance-scale',
  };

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
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-blue-900">Tu Perfil de Inversor</h2>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Perfil {investorProfile.name}</h3>
            <p className="text-gray-700 leading-relaxed">{investorProfile.description}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-blue-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex flex-col gap-3 mb-4">
                <h2 className="text-2xl font-semibold text-slate-900">Resumen de la Estrategia</h2>
                <p className="text-slate-600 leading-relaxed">
                  Diversificación en múltiples instrumentos financieros para maximizar el potencial de retorno y reducir riesgos.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-lg mb-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <i className="fas fa-chart-line text-blue-600"></i>
                    Métricas Clave del Portafolio
                  </h3>
                  <InfoTooltip
                    title="Métricas Clave"
                    description="Estas métricas muestran el retorno estimado y la volatilidad del portafolio. Son indicadores para entender el balance entre rentabilidad y riesgo."
                    example="Un retorno de 38.75% no garantiza ganancias, solo indica una proyección basada en los datos actuales."
                  />
                </div>
                <div className="space-y-3">
                  <p className="text-slate-700 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <i className="fas fa-arrow-up text-blue-600"></i>
                      Retorno Esperado Anual:
                    </span>
                    <span className="font-bold text-blue-600 text-xl">{(metrics.expected_return * 100).toFixed(2)}%</span>
                  </p>
                  <p className="text-slate-700 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <i className="fas fa-exclamation-triangle text-amber-400"></i>
                      Riesgo (Volatilidad):
                    </span>
                    <span className="font-bold text-amber-400 text-xl">{(metrics.risk * 100).toFixed(2)}%</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-slate-900">Activos Recomendados</h3>
                <InfoTooltip
                  title="Activos Recomendados"
                  description="Estos son los valores o fondos que forman tu portafolio sugerido. La lista muestra lo que portafolioAI recomienda según tu perfil."
                  example="Si ves 8 activos, tu inversión está diversificada en 8 partes distintas."
                />
              </div>
              <p className="text-gray-500 mb-2 text-sm">Mostrando {recommendedAssets.length} activos recomendados según tu perfil de riesgo ({riskLevel}).</p>
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
                      {asset.reason && <p className="text-slate-600 text-sm mt-1 leading-relaxed">{asset.reason}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">Distribución de Activos</h2>
                <InfoTooltip
                  title="Distribución de Activos"
                  description="Este gráfico muestra cómo se reparte tu portafolio entre los activos recomendados. Es útil para ver diversificación y peso de cada inversión."
                  example="Si un activo tiene 32%, significa que casi un tercio de la cartera está asignada a ese activo."
                />
              </div>
              <div className="bg-white p-6 rounded-lg border border-blue-100">
                <div className="h-[320px] w-full max-w-[560px] mx-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        label={({ percent }) => (percent ? `${(percent * 100).toFixed(0)}%` : '')}
                        labelLine={false}
                        outerRadius={110}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((_entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e40af',
                          border: '2px solid #ffffff',
                          borderRadius: '8px',
                          color: '#ffffff',
                          fontWeight: 'bold',
                          padding: '8px 12px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                        }}
                        formatter={(value) => {
                          const v = Array.isArray(value) ? value[0] : value;
                          const num = typeof v === 'number' ? v : parseFloat(v);
                          return isNaN(num) ? String(v) : num.toFixed(2) + '%';
                        }}
                        labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
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
