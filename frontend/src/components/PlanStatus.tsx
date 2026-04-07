import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface PlanInfo {
  usuario_id: number;
  nombre: string;
  email: string;
  plan: 'Premium' | 'Gratuito';
  es_premium: boolean;
  contador_ia_usado: number;
  limite_ia: number | string;
  consultas_restantes: number | string;
  subscription_id?: string;
}

interface PlanStatusProps {
  refreshTrigger?: number; // Trigger para refrescar datos
}

/**
 * 📊 Componente que muestra el estado del plan del usuario
 * Información sobre límites, consumo y estado de suscripción
 */
const PlanStatus: React.FC<PlanStatusProps> = ({ refreshTrigger = 0 }) => {
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar información del plan al montar el componente
  useEffect(() => {
    const cargarPlan = async () => {
      try {
        setCargando(true);
        const respuesta = await api.get('/usuarios/mi-plan');
        setPlanInfo(respuesta.data);
        console.log('📋 Plan info cargado:', respuesta.data);
      } catch (err: any) {
        console.error('❌ Error cargando plan:', err);
        setError('No se pudo cargar la información del plan');
      } finally {
        setCargando(false);
      }
    };

    cargarPlan();
  }, [refreshTrigger]); // Recargar cuando refreshTrigger cambia

  if (cargando) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <p className="text-gray-600">Cargando información del plan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-2 border-red-400 text-red-800 rounded-lg p-4">
        ❌ {error}
      </div>
    );
  }

  if (!planInfo) {
    return null;
  }

  const porcentajeUso =
    typeof planInfo.limite_ia === 'number'
      ? (planInfo.contador_ia_usado / planInfo.limite_ia) * 100
      : 0;

  return (
    <div
      className={`rounded-lg p-6 border-2 ${
        planInfo.es_premium
          ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-300'
          : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300'
      }`}
    >
      {/* Encabezado con plan */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`text-3xl ${planInfo.es_premium ? '⭐' : '🆓'}`} />
          <div>
            <h3 className="font-bold text-lg">
              {planInfo.es_premium ? 'Plan Premium' : 'Plan Gratuito'}
            </h3>
            <p className="text-sm text-gray-600">{planInfo.nombre}</p>
          </div>
        </div>
        {planInfo.subscription_id && (
          <div className="text-xs bg-white px-3 py-1 rounded border border-gray-300">
            ID: {planInfo.subscription_id.substring(0, 20)}...
          </div>
        )}
      </div>

      {/* Información de uso de IA */}
      {!planInfo.es_premium && typeof planInfo.limite_ia === 'number' && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-gray-700">
              Llamadas a IA Usadas
            </label>
            <span className="text-sm font-bold">
              {planInfo.contador_ia_usado} / {planInfo.limite_ia}
            </span>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-400 to-red-500 h-full transition-all duration-300"
              style={{ width: `${Math.min(porcentajeUso, 100)}%` }}
            />
          </div>

          <p className="text-xs text-gray-600 mt-2">
            {typeof planInfo.consultas_restantes === 'number'
              ? `Te quedan ${planInfo.consultas_restantes} consultas gratuitas`
              : 'Sin límite de consultas'}
          </p>
        </div>
      )}

      {planInfo.es_premium && (
        <div className="bg-green-100 border-l-4 border-green-500 rounded p-3">
          <p className="text-sm font-semibold text-green-800">
            ✅ Acceso ilimitado a todas las funciones sin restricciones
          </p>
        </div>
      )}

      {/* Detalles */}
      <div className="mt-4 text-xs text-gray-600 space-y-1">
        <p><strong>Email:</strong> {planInfo.email}</p>
        <p>
          <strong>Estado:</strong>{' '}
          <span className={planInfo.es_premium ? 'text-green-700 font-bold' : 'text-orange-700 font-bold'}>
            {planInfo.plan}
          </span>
        </p>
      </div>
    </div>
  );
};

export default PlanStatus;
