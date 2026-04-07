import React, { useState } from 'react';
import api from '../services/api';

interface CancelPremiumButtonProps {
  isUserPremium: boolean;
  onCancelSuccess?: (userData: any) => Promise<void> | void;
}

/**
 * ❌ Componente con botón para cancelar el plan Premium
 * Hace una llamada al backend (/api/usuarios/cancelar-plan)
 * Actualiza el estado local sin necesidad de recargar la página
 */
const CancelPremiumButton: React.FC<CancelPremiumButtonProps> = ({
  isUserPremium,
  onCancelSuccess
}) => {
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Función para procesar la cancelación
  const handleCancel = async () => {
    setCargando(true);
    setMensaje(null);
    setError(null);
    setShowConfirm(false);

    try {
      console.log('📤 Enviando solicitud de cancelación de plan...');
      
      // Llamar al backend para cancelar plan
      const respuesta = await api.post('/usuarios/cancelar-plan');

      console.log('✅ Cancelación exitosa:', respuesta.data);

      // Mostrar mensaje de éxito
      setMensaje('Tu plan Premium ha sido cancelado');

      // Llamar callback con datos actualizados (puede ser async o sync)
      if (onCancelSuccess && respuesta.data.usuario) {
        const result = onCancelSuccess(respuesta.data.usuario);
        // Si retorna una Promise, esperar
        if (result instanceof Promise) {
          await result;
        }
      }

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMensaje(null), 3000);

    } catch (err: any) {
      console.error('❌ Error en cancelación:', err);
      
      const mensajeError =
        err.response?.data?.detail ||
        err.message ||
        'Error al procesar la cancelación';
      
      setError(mensajeError);
      setTimeout(() => setError(null), 5000);
    } finally {
      setCargando(false);
    }
  };

  // Si no es Premium, no mostrar nada
  if (!isUserPremium) {
    return null;
  }

  // Mostrar botón con confirmación
  return (
    <div className="flex flex-col gap-2">
      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          disabled={cargando}
          className={`px-6 py-3 font-bold rounded-lg text-white transition-all duration-200 ${
            cargando
              ? 'bg-gray-400 cursor-not-allowed opacity-50'
              : 'bg-red-600 hover:bg-red-700 hover:shadow-lg'
          }`}
        >
          {cargando ? 'Cancelando...' : 'Cancelar Plan Premium'}
        </button>
      ) : (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 space-y-3">
          <p className="text-sm font-bold text-red-800 text-center">
            ¿Estás seguro de que quieres cancelar tu plan Premium?
          </p>
          <p className="text-xs text-red-700 text-center">
            Volverás a plan Gratuito con acceso limitado.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={cargando}
              className="flex-1 px-4 py-2 rounded border border-red-300 text-red-700 font-medium hover:bg-red-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleCancel}
              disabled={cargando}
              className="flex-1 px-4 py-2 rounded bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {cargando ? 'Procesando...' : 'Confirmar Cancelación'}
            </button>
          </div>
        </div>
      )}

      {/* Mostrar mensajes */}
      {mensaje && (
        <div className="bg-green-100 border-2 border-green-400 text-green-800 px-4 py-2 rounded text-sm">
          {mensaje}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-2 border-red-400 text-red-800 px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default CancelPremiumButton;
