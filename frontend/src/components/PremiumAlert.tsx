import React, { useState } from 'react';

interface PremiumAlertProps {
  isUserPremium: boolean;
  onUpgradeClick?: () => void;
}

/**
 * 💎 Componente que muestra una alerta si el usuario es Gratuito
 * Incentiva al usuario a pasar a Premium para funciones ilimitadas
 */
const PremiumAlert: React.FC<PremiumAlertProps> = ({
  isUserPremium,
  onUpgradeClick
}) => {
  const [mostrarAlerta, setMostrarAlerta] = useState(!isUserPremium);

  // Si es Premium, no mostramos la alerta
  if (isUserPremium) {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4 flex items-center gap-3">
        <span className="text-2xl">✅</span>
        <div>
          <h3 className="font-bold text-green-800">¡Eres Premium!</h3>
          <p className="text-sm text-green-700">Disfruta de funciones ilimitadas sin restricciones</p>
        </div>
      </div>
    );
  }

  // Mostrar alerta para usuarios gratuitos
  return mostrarAlerta ? (
    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="text-2xl">⚠️</span>
        <div>
          <h3 className="font-bold text-yellow-800">Plan Gratuito - Límite Alcanzado</h3>
          <p className="text-sm text-yellow-700">
            Pasate a Premium para funciones ilimitadas y sin restricciones
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onUpgradeClick}
          className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition"
        >
          Mejorar Plan →
        </button>
        <button
          onClick={() => setMostrarAlerta(false)}
          className="px-3 py-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    </div>
  ) : null;
};

export default PremiumAlert;
