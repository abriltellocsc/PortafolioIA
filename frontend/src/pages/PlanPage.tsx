import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CancelPremiumButton from '../components/CancelPremiumButton';

interface PlanPageProps {
  initialIsUserPremium?: boolean;
  onUpgradeSuccess?: () => Promise<void>;
  onCancelSuccess?: () => Promise<void>;
}

const PlanPage: React.FC<PlanPageProps> = ({ initialIsUserPremium = false, onUpgradeSuccess, onCancelSuccess }) => {
  const navigate = useNavigate();
  const [isUserPremium, setIsUserPremium] = useState(initialIsUserPremium);

  const handleOpenPago = () => {
    navigate('/pago');
  };

  const handleCancelSuccess = async (userData: any) => {
    console.log('Plan Premium cancelado:', userData);
    
    setIsUserPremium(false);
    localStorage.removeItem('is_premium');
    
    // Llamar el callback para actualizar el estado global en App.tsx
    if (onCancelSuccess) {
      try {
        // Esperar a que se complete la sincronización en App.tsx
        await onCancelSuccess();
        console.log('Estado global sincronizado tras cancelación');
      } catch (err) {
        console.error('Error sincronizando estado:', err);
      }
    }
    
    // Redirigir al dashboard después de 1 segundo
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header con botón de volver */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              className="mb-4 text-blue-900 font-medium hover:text-blue-700 transition-colors flex items-center gap-2"
            >
              ← Volver
            </button>
            <h1 className="text-4xl font-bold text-gray-900">Planes</h1>
            <p className="text-gray-600 mt-2">Elige el plan perfecto para ti</p>
          </div>
        </div>

        {/* Grid de planes */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Plan Gratuito */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Gratuito</h3>
              <p className="text-gray-600 text-sm">Para empezar</p>
            </div>
            
            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-4xl font-bold text-gray-900">$0<span className="text-lg text-gray-600">/mes</span></p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-blue-900 font-bold mt-0.5">✓</span>
                <span className="text-gray-700 text-sm">3 consultas de IA por mes</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-900 font-bold mt-0.5">✓</span>
                <span className="text-gray-700 text-sm">Análisis básico de portafolio</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-900 font-bold mt-0.5">✓</span>
                <span className="text-gray-700 text-sm">3 portafolios máximo</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-900 font-bold mt-0.5">✓</span>
                <span className="text-gray-700 text-sm">Acceso a Dashboard y Noticias</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 font-bold mt-0.5">✗</span>
                <span className="text-gray-600 text-sm">Soporte Premium</span>
              </li>
            </ul>

            {!isUserPremium ? (
              <div className="bg-blue-50 border border-blue-200 rounded p-3 text-center">
                <p className="text-blue-900 font-semibold text-sm">Tu plan actual</p>
              </div>
            ) : (
              <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                Cambiar a Gratuito
              </button>
            )}
          </div>

          {/* Plan Premium */}
          <div className={`border-2 rounded-lg p-8 hover:shadow-lg transition-shadow ${
            isUserPremium
              ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-400'
              : 'bg-white border-gray-300'
          }`}>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-gray-900">Premium</h3>
                <span className="bg-blue-900 text-white px-3 py-1 rounded-full text-xs font-bold">Recomendado</span>
              </div>
              <p className="text-gray-600 text-sm">Acceso ilimitado</p>
            </div>
            
            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-4xl font-bold text-gray-900">$9.99<span className="text-lg text-gray-600">/mes</span></p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-blue-900 font-bold mt-0.5">✓</span>
                <span className="text-gray-700 text-sm">Consultas ilimitadas de IA</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-900 font-bold mt-0.5">✓</span>
                <span className="text-gray-700 text-sm">Análisis avanzado de portafolio</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-900 font-bold mt-0.5">✓</span>
                <span className="text-gray-700 text-sm">Portafolios ilimitados</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-900 font-bold mt-0.5">✓</span>
                <span className="text-gray-700 text-sm">Acceso a todas las funciones</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-900 font-bold mt-0.5">✓</span>
                <span className="text-gray-700 text-sm">Soporte Premium 24/7</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-900 font-bold mt-0.5">✓</span>
                <span className="text-gray-700 text-sm">Reportes personalizados</span>
              </li>
            </ul>

            {isUserPremium ? (
              <div className="space-y-3">
                <div className="bg-green-100 border-2 border-green-400 rounded p-3 text-center">
                  <p className="text-green-800 font-bold text-sm">Plan activo</p>
                </div>
                <CancelPremiumButton
                  isUserPremium={isUserPremium}
                  onCancelSuccess={handleCancelSuccess}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleOpenPago}
                  className="w-full px-6 py-3 font-bold rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg transition-all duration-200"
                >
                  💎 Cambiar a Premium
                </button>
                <p className="text-sm text-gray-500">Serás redirigido a la página de pago para activar Premium.</p>
              </div>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Preguntas frecuentes</h2>

          <div className="space-y-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">¿Puedo cambiar de plan en cualquier momento?</h4>
              <p className="text-gray-600 text-sm">Sí, puedes cambiar entre planes instantáneamente sin perder tus datos.</p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">¿Cómo se cuentan las consultas de IA?</h4>
              <p className="text-gray-600 text-sm">En el plan Gratuito, cada vez que utilizas una función de IA se cuenta como una consulta. El contador se reinicia cada mes.</p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">¿Qué pasa si excedo mis 3 portafolios?</h4>
              <p className="text-gray-600 text-sm">Si intentas crear un cuarto portafolio, se te mostrará un aviso para que actualices a Premium.</p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">¿Mi información está segura?</h4>
              <p className="text-gray-600 text-sm">Todos tus datos están encriptados y almacenados de forma segura. Nunca compartimos información con terceros.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanPage;
