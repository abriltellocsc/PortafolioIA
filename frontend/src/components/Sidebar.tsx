import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  onLogout: () => void;
  isAdmin?: boolean;
  userName?: string;
  isUserPremium?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, onLogout, isAdmin: _isAdmin, userName, isUserPremium }) => {
  const navigate = useNavigate();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [blockedFeature, setBlockedFeature] = useState<string>('');

  // Definir items con restricciones
  const allNavItems = [
    { name: 'Dashboard', path: 'overview', premiumOnly: false },
    { name: 'Recomendaciones', path: 'recommendations', premiumOnly: true },
    { name: 'Mi Portafolio', path: 'my-portfolio', premiumOnly: true },
    { name: 'Simulador', path: 'simulator', premiumOnly: true },
    { name: 'Educación', path: 'education', premiumOnly: true },
    { name: 'Noticias', path: 'news', premiumOnly: false },
    { name: 'Soporte', path: 'support', premiumOnly: false },
  ];

  const handleNavigation = (item: any) => {
    if (item.premiumOnly && !isUserPremium) {
      setBlockedFeature(item.name);
      setShowUpgradeModal(true);
      return;
    }
    setActivePage(item.path);
    navigate(`/dashboard/${item.path}`);
  };

  return (
    <div className="w-64 bg-white rounded-lg shadow-md p-6 flex flex-col fixed h-full m-4 border border-gray-200">
      <div className="text-xl font-bold text-gray-900 mb-6 text-center tracking-tight">PortafolioIA</div>
      {userName && (
        <div className="text-sm text-gray-700 mb-6 text-center font-medium border-b border-gray-200 pb-4">{userName}</div>
      )}
      <nav className="flex-grow">
        <ul className="space-y-1">
          {allNavItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => handleNavigation(item)}
                className={clsx(
                  "w-full text-left px-4 py-2.5 rounded text-sm font-medium transition-all duration-200 border-l-2 flex items-center justify-between",
                  item.premiumOnly && !isUserPremium ? 'bg-gray-50 text-gray-500 border-l-gray-200 cursor-not-allowed' :
                  activePage === item.path ? 'bg-blue-50 text-blue-900 border-l-blue-900' :
                  'text-gray-700 hover:bg-gray-50 border-l-transparent hover:text-gray-900'
                )}
                disabled={item.premiumOnly && !isUserPremium}
              >
                <span>{item.name}</span>
                {item.premiumOnly && !isUserPremium && <span className="text-xs">🔒</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-8 border-t border-gray-200 pt-4 space-y-3">
        <div className={`p-3 rounded-lg border ${
          isUserPremium 
            ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">Plan</p>
          <p className="text-sm font-bold text-gray-900">
            {isUserPremium ? 'Premium' : 'Gratuito'}
          </p>
          <button
            onClick={() => navigate('/plan')}
            className="mt-3 w-full px-3 py-2 bg-blue-900 text-white rounded font-semibold text-xs cursor-pointer hover:bg-blue-800 transition-colors"
          >
            Ver Planes
          </button>
        </div>
        
        <button
          onClick={onLogout}
          className="w-full px-4 py-2.5 rounded text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium border border-gray-200"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Modal Premium Required */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-lg" onClick={() => setShowUpgradeModal(false)}>
          <div className="bg-white rounded-lg p-8 max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full">
              <span className="text-base">🔒</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">Función Premium</h3>
            <p className="text-gray-600 text-sm mb-6 text-center">{blockedFeature} solo está disponible en el plan Premium. Actualiza tu plan para acceder a todas las funciones.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 px-4 py-2 rounded border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  navigate('/plan');
                  setShowUpgradeModal(false);
                }}
                className="flex-1 px-4 py-2 rounded bg-blue-900 text-white font-medium hover:bg-blue-800 transition-colors"
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

