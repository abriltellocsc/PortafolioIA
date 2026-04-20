import React, { useState } from 'react';

interface RiskProfileIntroProps {
  onContinue: () => void;
}

const RiskProfileIntro: React.FC<RiskProfileIntroProps> = ({ onContinue }) => {
  const [expandedAccordion, setExpandedAccordion] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setExpandedAccordion(expandedAccordion === index ? null : index);
  };

  const concepts = [
    {
      title: '📚 ¿Qué es Riesgo en Inversión?',
      description: 'La posibilidad de que tu inversión suba o baje de valor.',
      expanded: (
        <div className="space-y-3 text-gray-700">
          <p>Cuando inviertes, tu dinero no es estático. El mercado cambia constantemente y tu inversión también.</p>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="font-semibold text-blue-900 mb-2">Ejemplo:</p>
            <p>Inviertes $10,000 en acciones de Apple</p>
            <p className="text-sm text-gray-600">• Año bueno: $10,000 → $12,000 (+20% ✅)</p>
            <p className="text-sm text-gray-600">• Año malo: $10,000 → $8,500 (-15% ⚠️)</p>
            <p className="text-xs text-gray-600 mt-2">Ambos son normales. Por eso es "riesgo".</p>
          </div>
        </div>
      )
    },
    {
      title: '💰 ¿Qué es Retorno?',
      description: 'La ganancia que esperas obtener por tu inversión.',
      expanded: (
        <div className="space-y-3 text-gray-700">
          <p>Es el dinero que ganas (en promedio) por invertir.</p>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="font-semibold text-green-900 mb-2">Comparación de activos:</p>
            <div className="space-y-2 text-sm">
              <p>🏦 Bonos del gobierno: 5% anual (muy seguro, ganancia baja)</p>
              <p>📈 Acciones grandes: 12% anual (más riesgo, más ganancia)</p>
              <p>🚀 Acciones tech: 20%+ anual (muy variable, mayor riesgo)</p>
            </div>
            <p className="text-xs text-gray-600 mt-2"><strong>Regla de oro:</strong> Mayor riesgo = Mayor retorno potencial</p>
          </div>
        </div>
      )
    },
    {
      title: '⚙️ ¿Qué es Volatilidad?',
      description: 'Cuánto sube y baja el precio frecuentemente.',
      expanded: (
        <div className="space-y-3 text-gray-700">
          <p>Mide los cambios de precio. No significa que pierdas dinero, solo que hay más variación.</p>
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <p className="font-semibold text-amber-900 mb-2">Ejemplos:</p>
            <p className="text-sm">📊 Baja volatilidad (5%): Precio cambia lentamente. Predecible.</p>
            <p className="text-sm">🎢 Alta volatilidad (35%): Precio sube/baja rápidamente. Impredecible.</p>
            <p className="text-xs text-gray-600 mt-2">La volatilidad es <strong>temporal</strong>. A largo plazo, tiende a estabilizarse.</p>
          </div>
        </div>
      )
    },
    {
      title: '🎯 ¿Qué es Diversificación?',
      description: 'Invertir en múltiples activos para reducir riesgo.',
      expanded: (
        <div className="space-y-3 text-gray-700">
          <p>En lugar de poner todos los huevos en una canasta, los repartes.</p>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p className="font-semibold text-purple-900 mb-2">Comparación:</p>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-semibold">❌ Sin diversificación</p>
                <p className="text-xs text-gray-600">$10,000 solo en Apple. Si Apple baja 30%, pierdes $3,000.</p>
              </div>
              <div>
                <p className="text-sm font-semibold">✅ Con diversificación</p>
                <p className="text-xs text-gray-600">$10,000 en Apple (30%), Bitcoin (20%), Bonos (30%), Oro (20%). Si Apple baja 30%, pierdes ~$900. Otros compensan.</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const profiles = [
    {
      title: 'Perfil Conservador',
      icon: '🛡️',
      riskLevel: 'Bajo (-5% típico)',
      returnLevel: '6-8% anual',
      description: 'Para quien prefiere seguridad. El dinero crece lento pero seguro.',
      idealFor: 'Cercano a jubilación, necesita dinero pronto, duerme mal con volatilidad'
    },
    {
      title: 'Perfil Balanceado',
      icon: '⚖️',
      riskLevel: 'Medio (-15% típico)',
      returnLevel: '10-12% anual',
      description: 'Equilibrio entre ganancia y seguridad. Buen para la mayoría.',
      idealFor: 'Inversión a mediano plazo, tolera algo de volatilidad'
    },
    {
      title: 'Perfil Agresivo',
      icon: '🚀',
      riskLevel: 'Alto (-35% típico)',
      returnLevel: '15-25% anual',
      description: 'Para quien busca máxima ganancia. El dinero sube/baja mucho.',
      idealFor: 'Largo plazo (10+ años), tolera crises, busca máximo crecimiento'
    }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen p-4 relative overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Subtle Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 md:p-10 max-w-4xl w-full animate-fade-in relative z-10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-3">Antes de Empezar</h1>
          <p className="text-gray-600 text-lg">Aprende los conceptos clave en 5 minutos</p>
        </div>

        {/* Intro Message */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg mb-8">
          <p className="text-gray-800">
            <strong>🎯 Objetivo:</strong> Entender qué es riesgo, retorno y cómo funciona la diversificación. Después haremos una encuesta rápida para conocer TU perfil.
          </p>
        </div>

        {/* Accordion Concepts */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4 Conceptos Clave</h2>
          <div className="space-y-3">
            {concepts.map((concept, index) => (
              <div key={index} className="border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 py-4 bg-white hover:bg-gray-50 flex items-center justify-between font-semibold text-gray-900 transition-colors"
                >
                  <div className="text-left">
                    <p className="text-base">{concept.title}</p>
                    <p className="text-xs text-gray-500 mt-1 font-normal">{concept.description}</p>
                  </div>
                  <i className={`fas fa-chevron-down ml-4 transition-transform ${expandedAccordion === index ? 'rotate-180' : ''}`}></i>
                </button>
                {expandedAccordion === index && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    {concept.expanded}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Investor Profiles */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3 Tipos de Inversores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {profiles.map((profile, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-lg border border-gray-300">
                <p className="text-4xl mb-2">{profile.icon}</p>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{profile.title}</h3>
                <p className="text-sm text-gray-700 mb-3">{profile.description}</p>
                <div className="space-y-2 text-xs bg-white p-3 rounded-lg border border-gray-200">
                  <p><strong>Riesgo típico:</strong> {profile.riskLevel}</p>
                  <p><strong>Retorno esperado:</strong> {profile.returnLevel}</p>
                  <p><strong>Ideal para:</strong> {profile.idealFor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insight */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-600 p-5 rounded-lg mb-8">
          <p className="text-gray-800">
            <strong>✅ Lo Importante:</strong> No hay perfil "correcto" o "incorrecto". Tu perfil debe reflejar TU situación, TUS objetivos y CUÁNTO riesgo puedes tolerar.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={onContinue}
            className="bg-blue-900 text-white font-bold py-4 px-8 rounded-lg hover:bg-blue-800 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            Entendido, Vamos a la Encuesta →
          </button>
        </div>

        {/* Footer Help */}
        <p className="text-center text-gray-500 text-xs mt-6">
          💡 Recuerda: Puedes volver a esta página en cualquier momento desde el menú de ayuda.
        </p>
      </div>
    </div>
  );
};

export default RiskProfileIntro;
