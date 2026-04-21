import React, { useState, useEffect } from 'react';
import { fetchPublicEducation } from '../services/api';

interface Article {
  id: number;
  category: string;
  title: string;
  summary: string;
  tags: string[];
  full_content: string;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-blue-200 hover:border-blue-600 hover:shadow-md transition-all duration-300 group">
    <div className="flex items-center justify-between mb-3">
      <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold text-blue-900 bg-blue-100 rounded-full uppercase tracking-wide">
        <i className="fas fa-graduation-cap"></i>
        {article.category}
      </span>
      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
        <i className="fas fa-book-reader text-slate-600 group-hover:text-blue-900"></i>
      </div>
    </div>
    <h3 className="text-xl font-bold text-slate-900 mt-4 mb-3 leading-tight group-hover:text-blue-900 transition-colors">{article.title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed mb-6">{article.summary}</p>
    <button 
      onClick={onClick}
      className="text-blue-900 hover:text-blue-700 text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all group-hover:translate-x-1"
    >
      Leer Más <i className="fas fa-arrow-right"></i>
    </button>
  </div>
);

const categoryFilters = [
  { key: 'Básico', icon: 'fa-seedling', label: 'Básico' },
  { key: 'Intermedio', icon: 'fa-layer-group', label: 'Intermedio' },
  { key: 'Avanzado', icon: 'fa-rocket', label: 'Avanzado' },
  { key: 'Estrategias', icon: 'fa-chess', label: 'Estrategias' },
  { key: 'Economía', icon: 'fa-chart-line', label: 'Economía' },
];

const EducationPage: React.FC = () => {
  const [filter, setFilter] = useState('Básico');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const closeModal = () => setSelectedArticle(null);

  useEffect(() => {
    setLoading(true);
    fetchPublicEducation({ category: filter })
      .then((res) => {
        setArticles(res.data.contents || []);
        setError(null);
      })
      .catch(() => {
        setError('Error al cargar el contenido educativo');
      })
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-8 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Modal para mostrar el artículo completo */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Fondo difuminado */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in"></div>
          {/* Modal principal */}
          <div className="relative z-10 max-w-2xl w-full mx-4">
            <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-200 p-10 pt-16 animate-fade-in flex flex-col" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Cerrar"
              >
                <span className="text-2xl font-bold">&times;</span>
              </button>
              <h2 className="text-5xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 drop-shadow-2xl text-center tracking-tight">
                {selectedArticle.title}
              </h2>
              <div className="prose prose-slate max-w-none text-slate-900 text-xl leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: selectedArticle.full_content.replace(/<h2>/g, '<h2 class=\"text-3xl font-bold text-blue-600 mb-4 mt-8\">').replace(/<h3>/g, '<h3 class=\"text-2xl font-semibold text-blue-700 mb-2 mt-6\">').replace(/<ul>/g, '<ul class=\"list-disc ml-6 mb-4\">').replace(/<li>/g, '<li class=\"mb-2\">') }} />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        {/* Header with decorative elements */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <i className="fas fa-graduation-cap text-[200px] text-blue-600"></i>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent relative z-10">
            <i className="fas fa-book-open mr-4"></i>Centro Educativo
          </h1>
          <p className="text-slate-600 text-xl relative z-10 mb-6">
            Aprende sobre inversión inteligente con recursos curados por IA
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-slate-600">
            <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border-2 border-blue-200 shadow-sm">
              <i className="fas fa-book text-blue-600"></i>
              {articles.length} Artículos
            </span>
            <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border-2 border-blue-200 shadow-sm">
              <i className="fas fa-certificate text-blue-600"></i>
              Certificación disponible
            </span>
            <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border-2 border-blue-200 shadow-sm">
              <i className="fas fa-star text-blue-600"></i>
              Calidad premium
            </span>
          </div>
        </div>

        {/* Filtros como pills con iconos mejorados */}
        <div className="mb-12 bg-white p-6 rounded-xl shadow-lg border-2 border-blue-200">
          <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
            <i className="fas fa-filter mr-2"></i>Filtrar por nivel
          </h3>
          <div className="flex flex-wrap gap-3">
            {categoryFilters.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setFilter(cat.key)}
                className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                  filter === cat.key
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-blue-200 hover:border-blue-600'
                }`}
              >
                <i className={`fas ${cat.icon} mr-2`}></i>{cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Artículos */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl text-slate-500">Cargando artículos...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <i className="fas fa-exclamation-triangle text-6xl text-red-300 mb-4"></i>
            <p className="text-xl text-red-500">{error}</p>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onClick={() => setSelectedArticle(article)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <i className="fas fa-search text-6xl text-slate-300 mb-4"></i>
            <p className="text-xl text-slate-500">No se encontraron artículos para este filtro</p>
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border-2 border-blue-200 text-center hover:border-blue-600 transition-all shadow-sm hover:shadow-md">
            <i className="fas fa-users text-4xl text-blue-600 mb-3"></i>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">10,000+</h3>
            <p className="text-slate-600">Estudiantes activos</p>
          </div>
          <div className="bg-white p-6 rounded-xl border-2 border-blue-200 text-center hover:border-blue-600 transition-all shadow-sm hover:shadow-md">
            <i className="fas fa-trophy text-4xl text-blue-600 mb-3"></i>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">98%</h3>
            <p className="text-slate-600">Tasa de satisfacción</p>
          </div>
          <div className="bg-white p-6 rounded-xl border-2 border-blue-200 text-center hover:border-blue-600 transition-all shadow-sm hover:shadow-md">
            <i className="fas fa-clock text-4xl text-blue-600 mb-3"></i>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">24/7</h3>
            <p className="text-slate-600">Acceso ilimitado</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationPage;
