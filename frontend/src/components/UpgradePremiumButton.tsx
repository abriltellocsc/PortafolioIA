import React, { useState } from 'react';
import api from '../services/api';

interface UpgradePremiumButtonProps {
  isUserPremium: boolean;
  onUpgradeSuccess?: (userData: any) => Promise<void> | void;
}

/**
 * 💳 Componente con botón para simular el pago y upgrade a Premium
 * Hace una llamada al backend (/api/usuarios/mejorar-plan)
 * Actualiza el estado local sin necesidad de recargar la página
 */
const UpgradePremiumButton: React.FC<UpgradePremiumButtonProps> = ({
  isUserPremium,
  onUpgradeSuccess
}) => {
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Función para procesar el upgrade
  const handleUpgrade = async () => {
    setCargando(true);
    setMensaje(null);
    setError(null);

    try {
      console.log('📤 Enviando solicitud de upgrade...');
      
      // Llamar al backend para mejorar plan
      const respuesta = await api.post('/usuarios/mejorar-plan', {
        metodo_pago: 'tarjeta'
      });

      console.log('✅ Upgrade exitoso:', respuesta.data);

      // Mostrar mensaje de éxito
      setMensaje('¡Felicitaciones! Ya eres Premium 🎉');

      // Llamar callback con datos actualizados (puede ser async o sync)
      if (onUpgradeSuccess && respuesta.data.usuario) {
        const result = onUpgradeSuccess(respuesta.data.usuario);
        // Si retorna una Promise, esperar
        if (result instanceof Promise) {
          await result;
        }
      }

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMensaje(null), 3000);

    } catch (err: any) {
      console.error('❌ Error en upgrade:', err);
      
      const mensajeError =
        err.response?.data?.detail ||
        err.message ||
        'Error al procesar el upgrade';
      
      setError(mensajeError);
      setTimeout(() => setError(null), 5000);
    } finally {
      setCargando(false);
    }
  };

  // Si ya es Premium, mostrar badge
  if (isUserPremium) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 border-2 border-purple-300 rounded-lg">
        <span className="text-yellow-500 text-xl">⭐</span>
        <span className="font-bold text-purple-800">Premium Activo</span>
      </div>
    );
  }

  // Mostrar botón de upgrade
  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleUpgrade}
        disabled={cargando}
        className={`px-6 py-3 font-bold rounded-lg text-white transition-all duration-200 ${
          cargando
            ? 'bg-gray-400 cursor-not-allowed opacity-50'
            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg'
        }`}
      >
        {cargando ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">⏳</span>
            Procesando...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <span>💎</span>
            Simular Pago Premium
          </span>
        )}
      </button>

      {/* Mostrar mensajes de éxito */}
      {mensaje && (
        <div className="bg-green-100 border-2 border-green-400 text-green-800 px-4 py-2 rounded">
          ✅ {mensaje}
        </div>
      )}

      {/* Mostrar mensajes de error */}
      {error && (
        <div className="bg-red-100 border-2 border-red-400 text-red-800 px-4 py-2 rounded">
          ❌ {error}
        </div>
      )}
    </div>
  );
};

export default UpgradePremiumButton;
