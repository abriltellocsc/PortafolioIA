import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'risk' | 'returns' | 'portfolio';
  icon: string;
}

const FAQPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'general' | 'risk' | 'returns' | 'portfolio'>('all');
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: '¿Cuánto dinero necesito para empezar a invertir?',
      answer: 'No hay un mínimo establecido. Puedes empezar con $100, $1,000 o lo que puedas permitirte. Recuerda: solo invierte dinero que NO necesites en los próximos 3+ años.',
      category: 'general',
      icon: '💵'
    },
    {
      question: '¿Es seguro invertir a través de portafolioAI?',
      answer: 'portafolioAI te da recomendaciones usando inteligencia artificial. TÚ eres quien decide dónde invertir. Siempre verifica con tu broker o asesor financiero antes de invertir dinero real.',
      category: 'general',
      icon: '🔒'
    },
    {
      question: '¿Puedo perder todo mi dinero?',
      answer: 'Con diversificación (que es lo que hacemos), el riesgo de perder TODO es muy bajo. Pero sí, es posible que baje 30-40% en años malos. Por eso recomendamos horizonte largo.',
      category: 'risk',
      icon: '📉'
    },
    {
      question: '¿Qué es volatilidad exactamente?',
      answer: 'Son los cambios de precio. Si un activo sube $100 hoy, baja $80 mañana, sube $110 pasado... eso es volatilidad. No significa que pierdas dinero, solo que hay cambios frecuentes.',
      category: 'risk',
      icon: '🎢'
    },
    {
      question: '¿Cuál es la diferencia entre riesgo y volatilidad?',
      answer: 'Riesgo = posibilidad de perder dinero a LARGO PLAZO. Volatilidad = cambios de precio a CORTO PLAZO. La volatilidad es temporal; el riesgo es más profundo.',
      category: 'risk',
      icon: '⚖️'
    },
    {
      question: '¿El retorno 24.96% es garantizado?',
      answer: 'NO. Es una ESTIMACIÓN basada en datos históricos. El mercado puede cambiar. Es por eso que mostramos "mejor caso" y "peor caso" en el simulador.',
      category: 'returns',
      icon: '📊'
    },
    {
      question: '¿Cuánto tiempo necesito para ver ganancias?',
      answer: 'Corto plazo (1-3 años): muy variable, puede haber pérdidas. Mediano plazo (3-7 años): tendencia positiva típica. Largo plazo (7+ años): casi siempre positivo en historia.',
      category: 'returns',
      icon: '⏱️'
    },
    {
      question: '¿Qué es el Sharpe Ratio?',
      answer: 'Mide eficiencia: cuánta ganancia obtienes por cada punto de riesgo. Sharpe 0.45 = normal. Sharpe 0.80+ = muy bueno. Cuanto más alto, mejor el balance riesgo/retorno.',
      category: 'portfolio',
      icon: '📈'
    },
    {
      question: '¿Por qué mi portafolio tiene Bitcoin si es muy volátil?',
      answer: 'Bitcoin diversifica tu cartera. Cuando acciones caen, Bitcoin a veces sube (movimientos no correlacionados). Esto reduce riesgo total incluso si Bitcoin es volátil.',
      category: 'portfolio',
      icon: '₿'
    },
    {
      question: '¿Puedo cambiar mi portafolio después?',
      answer: 'Sí. Puedes volver a hacer la encuesta cuando tu situación cambie (más dinero, menos riesgo, nuevo objetivo, etc.). Tu portafolio se actualiza automáticamente.',
      category: 'portfolio',
      icon: '🔄'
    },
    {
      question: '¿Qué es diversificación y por qué es importante?',
      answer: 'Dividir tu dinero en múltiples activos (acciones, bonos, crypto, etc.). Si uno cae, otros compensan. Reduce riesgo significativamente. Ejemplo: en vez de perder 30%, pierdes 5%.',
      category: 'portfolio',
      icon: '🎯'
    },
    {
      question: '¿Qué hago si el mercado cae 20% mañana?',
      answer: 'Si tu horizonte es largo (10+ años), no hagas nada. Las crisis temporales son normales. Históricamente, siempre se recuperan. Si necesitas el dinero pronto, entonces sí es problema.',
      category: 'risk',
      icon: '😰'
    }
  ];

  const categories = [
    { value: 'all' as const, label: 'Todas', icon: '📚' },
    { value: 'general' as const, label: 'General', icon: '❓' },
    { value: 'risk' as const, label: 'Riesgo', icon: '⚠️' },
    { value: 'returns' as const, label: 'Retornos', icon: '📊' },
    { value: 'portfolio' as const, label: 'Portafolio', icon: '🎯' }
  ];

  const filteredFAQs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-8 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-blue-900">Preguntas Frecuentes</h1>
          <p className="text-gray-600 text-lg">Respuestas a las dudas más comunes sobre inversión y portafolioAI</p>
        </div>

        {/* Categories Filter */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full font-semibold transition-all ${
                selectedCategory === cat.value
                  ? 'bg-blue-900 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-900'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {filteredFAQs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setExpandedItem(expandedItem === index ? null : index)}
                className="w-full px-6 py-4 flex items-start justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="text-left flex-1">
                  <p className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <span className="text-2xl">{faq.icon}</span>
                    {faq.question}
                  </p>
                </div>
                <i className={`fas fa-chevron-down ml-4 text-blue-900 transition-transform flex-shrink-0 ${expandedItem === index ? 'rotate-180' : ''}`}></i>
              </button>
              
              {expandedItem === index && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-gray-700 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg border-2 border-blue-200 text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">¿Aún tienes dudas?</h2>
          <p className="text-gray-700 mb-4">
            Visita nuestra sección de Educación para artículos detallados o contacta al soporte.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/dashboard/education" className="px-6 py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition">
              Ir a Educación
            </a>
            <a href="/support" className="px-6 py-3 bg-white border-2 border-blue-900 text-blue-900 rounded-lg font-semibold hover:bg-blue-50 transition">
              Contactar Soporte
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
