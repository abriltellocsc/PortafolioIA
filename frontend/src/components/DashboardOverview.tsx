
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import DataClarityBadge from './DataClarityBadge';
import InfoTooltip from './InfoTooltip';
import useUserExperienceLevel from '../hooks/useUserExperienceLevel';
import { getChartContextByRisk, normalizeRiskLevel } from '../utils/chartContext';



const COLORS = ['#003366', '#0056b3', '#0077cc', '#0099ff', '#1e88e5', '#1565c0', '#1976d2', '#1e8449', '#2e7d32', '#388e3c'];



interface DashboardOverviewProps {
  portfolio: any;
  isUserPremium?: boolean;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ portfolio, isUserPremium }) => {
  const navigate = useNavigate();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const experienceLevel = useUserExperienceLevel(portfolio);

  const handleViewStrategy = () => {
    if (!isUserPremium) {
      setShowPremiumModal(true);
      return;
    }
    navigate('/dashboard/recommendations');
  };
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

  // Extraer métricas y activos del portafolio real
  const metrics = portfolio.metrics ?? { expected_return: 0, risk: 0 };
  const assets = portfolio.assets ?? [];
  const riskLevel = normalizeRiskLevel(portfolio?.profile?.risk_level ?? portfolio?.risk_level ?? 'medium');
  const chartDescription = getChartContextByRisk('dashboard.distribution.description', riskLevel, experienceLevel);
  const dataType = portfolio?.is_simulated ? 'simulated' : 'real';
  
  // Debug logging
  console.log('[DashboardOverview] Portfolio recibido:', portfolio);
  console.log('[DashboardOverview] Métricas extraídas:', metrics);
  console.log('[DashboardOverview] metrics.risk =', metrics.risk, '| expected_return =', metrics.expected_return);
  // Selección de activos principales para Overview (top 3 por porcentaje)
  const mainAssets = [...assets]
    .sort((a, b) => (b.allocation_pct ?? 0) - (a.allocation_pct ?? 0))
    .slice(0, 3);
  const chartData = mainAssets.map(asset => ({
    name: asset.name,
    value: parseFloat((asset.allocation_pct ?? 0).toFixed(2)),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-2 sm:px-4 md:px-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Alert de Premium si no es premium */}
        {!isUserPremium && (
          <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg flex items-center justify-between">
            <div>
              <h3 className="font-bold text-blue-900">Acceso Limitado</h3>
              <p className="text-sm text-blue-700">Mejora a Premium para acceso ilimitado a todas las funciones</p>
            </div>
            <Link to="/plan">
              <button className="ml-4 px-4 py-2 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors whitespace-nowrap">
                Ver Planes
              </button>
            </Link>
          </div>
        )}

        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-gray-900">Tu Portafolio Actual</h1>
          <p className="text-gray-600 text-base sm:text-lg">Basado en tu perfil de riesgo, estos son los activos recomendados para tu inversión</p>
          <div className="mt-4 flex flex-col sm:flex-row items-start gap-3">
            <Link to="/risk-profile-form">
              <button className="flex items-center gap-2 text-gray-900 font-semibold px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm">
                Actualizar Portafolio
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Métricas Clave */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
              <div className="flex items-start gap-2 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Retorno Esperado Anual</h3>
                <InfoTooltip
                  title="Retorno Esperado Anual"
                  description="Estimación del rendimiento anual de tu portafolio basada en tu perfil y los activos seleccionados. Es una proyección informativa y no una garantía de resultado."
                  example="Por ejemplo, 24.96% sugiere un posible crecimiento anual en el rango estimado."
                />
              </div>
              <p className="text-4xl sm:text-5xl font-bold text-blue-900">{(metrics.expected_return * 100).toFixed(2)}%</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
              <div className="flex items-start gap-2 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Nivel de Riesgo</h3>
                <InfoTooltip
                  title="Nivel de Riesgo"
                  description="Mide la volatilidad esperada de tu portafolio. Un número más alto indica que el valor puede subir o bajar con mayor amplitud."
                  example="Por ejemplo, 9.91% refleja una volatilidad anualizada estimada en el portafolio."
                />
              </div>
              <p className="text-4xl sm:text-5xl font-bold text-orange-600">{(metrics.risk * 100).toFixed(2)}%</p>
            </div>
            <div className="mt-6">
              <button
                onClick={handleViewStrategy}
                className="w-full bg-blue-900 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-800 transition duration-300 shadow-md"
              >
                Ver Estrategia Completa
              </button>
            </div>
          </div>

          {/* Distribución de Activos */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-start gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">Distribución de Activos Recomendados</h3>
                  <InfoTooltip
                    title="Distribución de Activos"
                    description={chartDescription}
                    example="Esta descripción te ayuda a entender por qué elegimos cada clase de activo en tu portafolio." 
                  />
                </div>
              </div>
              <DataClarityBadge type={dataType} />
            </div>
            <div className="flex flex-col items-center gap-6">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#374151',
                        border: '1px solid #4b5563',
                        borderRadius: '8px',
                        color: '#e5e7eb'
                      }}
                      formatter={(value) => `${value}%`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 sm:space-y-4 w-full">
                {mainAssets.map((asset, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-center justify-between bg-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 shadow-md gap-2 sm:gap-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-3 sm:w-4 h-3 sm:h-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-gray-200 text-sm sm:text-base font-medium">{asset.name}</span>
                      <span className="text-xs text-gray-400">({asset.ticker})</span>
                    </div>
                    <span className="text-white font-bold text-base sm:text-lg">{asset.allocation_pct?.toFixed(2) ?? '0.00'}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Modal */}
      {showPremiumModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-lg" 
          onClick={() => setShowPremiumModal(false)}
        >
          <div 
            className="bg-white rounded-lg p-8 max-w-sm shadow-xl" 
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">Función Premium</h3>
            <p className="text-gray-600 text-sm mb-6 text-center">Recomendaciones solo está disponible con plan Premium. Mejora tu plan para acceder.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowPremiumModal(false)} 
                className="flex-1 px-4 py-2 rounded border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  navigate('/plan');
                  setShowPremiumModal(false);
                }} 
                className="flex-1 px-4 py-2 rounded bg-blue-900 text-white hover:bg-blue-800 transition"
              >
                Ver Planes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;
