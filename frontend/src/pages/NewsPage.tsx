import React, { useEffect, useMemo, useState } from 'react';
import { fetchNews } from '../services/api';

interface NewsItem {
  source: string;
  title: string;
  summary: string;
  date: string;
  url: string;
  category?: string;
  author?: string;
  imageUrl?: string;
}

interface NewsItemProps {
  news: NewsItem;
}

const NewsItemCard: React.FC<NewsItemProps> = ({ news }) => {
  // color decided by global theme; function removed to avoid unused-variable warnings


  const getSourceIcon = (src: string) => {
    const lowerSrc = src.toLowerCase();
    if (lowerSrc.includes('bloomberg') || lowerSrc.includes('financial')) return 'fa-newspaper';
    if (lowerSrc.includes('reuters') || lowerSrc.includes('wire')) return 'fa-rss';
    if (lowerSrc.includes('wsj') || lowerSrc.includes('journal')) return 'fa-book-open';
    if (lowerSrc.includes('cnbc') || lowerSrc.includes('market')) return 'fa-chart-line';
    return 'fa-globe';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-blue-200 hover:border-blue-600 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
          <i className={`fas ${getSourceIcon(news.source)} text-white text-xl`}></i>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{news.source}</span>
            <span className="text-xs text-slate-500">
              <i className="fas fa-clock mr-1"></i>
              {new Date(news.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
            {news.title}
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">{news.summary}</p>
          <a 
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Click en enlace:', news.url);
            }}
            className="text-blue-600 hover:text-blue-700 text-sm font-bold inline-flex items-center gap-2 hover:gap-3 transition-all cursor-pointer z-10 relative"
          >
            Leer más <i className="fas fa-external-link-alt"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

type NewsApiResponse = {
  articles?: NewsItem[];
  source?: string;
  updated_at?: string;
};

const NEWS_SECTIONS = [
  { id: 'Mercados', label: 'Mercados', icon: 'fa-chart-line' },
  { id: 'Empresas', label: 'Empresas', icon: 'fa-building' },
  { id: 'Economía', label: 'Economía', icon: 'fa-landmark' },
  { id: 'Tecnología', label: 'Tecnología', icon: 'fa-microchip' },
] as const;

type NewsCategory = (typeof NEWS_SECTIONS)[number]['id'];

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newsSource, setNewsSource] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('Mercados');

  // Noticias de ejemplo con URLs reales de Google News
  const mockNews: NewsItem[] = [
    // Economía
    {
      source: 'El Financiero',
      title: 'La Fed mantiene tasas de interés estables en medio de señales económicas mixtas',
      summary: 'El Comité Federal de Mercado Abierto decidió mantener las tasas de interés sin cambios, señalando preocupaciones sobre la inflación persistente.',
      date: new Date().toISOString(),
      url: 'https://www.bloomberg.com/markets/rates-bonds',
      category: 'Economía',
      author: 'María González'
    },
    {
      source: 'Bloomberg Línea',
      title: 'Dólar alcanza nuevo máximo frente al peso mexicano',
      summary: 'La moneda estadounidense se fortalece ante la incertidumbre económica global y las políticas monetarias restrictivas.',
      date: new Date(Date.now() - 43200000).toISOString(),
      url: 'https://www.investing.com/currencies/usd-mxn',
      category: 'Economía',
      author: 'Pedro Ramírez'
    },
    {
      source: 'El Economista',
      title: 'Inflación en México muestra signos de desaceleración',
      summary: 'Los últimos datos del INEGI revelan una tendencia a la baja en los precios al consumidor durante el último trimestre.',
      date: new Date(Date.now() - 86400000).toISOString(),
      url: 'https://www.reuters.com/world/americas/',
      category: 'Economía',
      author: 'Laura Méndez'
    },
    // Mercados
    {
      source: 'Investing.com',
      title: 'Wall Street cierra con ganancias impulsado por sector tecnológico',
      summary: 'Los principales índices estadounidenses registran alzas significativas ante resultados corporativos positivos.',
      date: new Date(Date.now() - 7200000).toISOString(),
      url: 'https://www.cnbc.com/world/?region=world',
      category: 'Mercados',
      author: 'Ricardo Torres'
    },
    {
      source: 'MarketWatch',
      title: 'Oro alcanza precio récord en mercado internacional',
      summary: 'El metal precioso supera los $2,100 dólares la onza ante la búsqueda de activos refugio por parte de inversionistas.',
      date: new Date(Date.now() - 129600000).toISOString(),
      url: 'https://www.investing.com/commodities/gold',
      category: 'Mercados',
      author: 'Sofía Hernández'
    },
    {
      source: 'Financial Times',
      title: 'Petróleo WTI sube por tensiones en Medio Oriente',
      summary: 'El barril de crudo texano alcanza los $85 dólares ante preocupaciones sobre la oferta energética global.',
      date: new Date(Date.now() - 172800000).toISOString(),
      url: 'https://www.bloomberg.com/energy',
      category: 'Mercados',
      author: 'Miguel Ángel Cruz'
    },
    // Tecnología
    {
      source: 'TechCrunch',
      title: 'Apple anuncia nuevo iPhone con capacidades de IA revolucionarias',
      summary: 'La compañía tecnológica presenta su última innovación que integra inteligencia artificial avanzada directamente en el dispositivo.',
      date: new Date(Date.now() - 21600000).toISOString(),
      url: 'https://techcrunch.com/category/artificial-intelligence/',
      category: 'Tecnología',
      author: 'Carlos Rodríguez'
    },
    {
      source: 'The Verge',
      title: 'Google lanza nueva actualización de Gemini AI para competir con ChatGPT',
      summary: 'El gigante tecnológico mejora sus capacidades de inteligencia artificial con procesamiento más rápido y respuestas más precisas.',
      date: new Date(Date.now() - 108000000).toISOString(),
      url: 'https://www.theverge.com/ai-artificial-intelligence',
      category: 'Tecnología',
      author: 'Andrea López'
    },
    {
      source: 'Wired',
      title: 'Meta presenta nuevas gafas de realidad aumentada para 2025',
      summary: 'Mark Zuckerberg revela el prototipo de dispositivos AR que prometen revolucionar la forma en que interactuamos con el mundo digital.',
      date: new Date(Date.now() - 259200000).toISOString(),
      url: 'https://www.wired.com/tag/virtual-reality/',
      category: 'Tecnología',
      author: 'Fernando Jiménez'
    },
    // Empresas
    {
      source: 'CNBC',
      title: 'Tesla reporta ganancias récord impulsadas por ventas de Model Y',
      summary: 'El fabricante de vehículos eléctricos supera las expectativas de Wall Street con un incremento del 25% en entregas trimestrales.',
      date: new Date(Date.now() - 50400000).toISOString(),
      url: 'https://www.reuters.com/business/autos-transportation/',
      category: 'Empresas',
      author: 'Roberto Sánchez'
    },
    {
      source: 'Forbes',
      title: 'Amazon expande operaciones en América Latina con nuevos centros',
      summary: 'El gigante del comercio electrónico anuncia inversión de $2 mil millones para infraestructura logística en la región.',
      date: new Date(Date.now() - 302400000).toISOString(),
      url: 'https://www.reuters.com/technology/',
      category: 'Empresas',
      author: 'Patricia Vega'
    },
    {
      source: 'Business Insider',
      title: 'Microsoft supera a Apple como la empresa más valiosa del mundo',
      summary: 'La capitalización de mercado de Microsoft alcanza los $3.2 billones impulsada por el crecimiento en servicios de nube e IA.',
      date: new Date(Date.now() - 388800000).toISOString(),
      url: 'https://www.bloomberg.com/technology',
      category: 'Empresas',
      author: 'Javier Morales'
    }
  ];

  const parseNewsResponse = (data: NewsItem[] | NewsApiResponse): NewsItem[] => {
    if (Array.isArray(data)) {
      return data.filter((item) => item?.title && item?.url);
    }
    if (data?.articles?.length) {
      return data.articles.filter((item) => item?.title && item?.url);
    }
    return [];
  };

  const loadNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchNews();
      const payload = response.data as NewsItem[] | NewsApiResponse;
      const items = parseNewsResponse(payload);
      if (items.length > 0) {
        setNews(items);
        if (!Array.isArray(payload) && payload.source) {
          setNewsSource(payload.source);
        }
      } else {
        setNews(mockNews);
        setNewsSource('fallback');
      }
    } catch (err) {
      console.warn('Error cargando noticias, usando respaldo local', err);
      setNews(mockNews);
      setNewsSource('fallback');
      setError('No se pudo conectar con el servidor. Mostrando noticias de ejemplo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const newsByCategory = useMemo(() => {
    const grouped: Record<string, NewsItem[]> = {};
    for (const section of NEWS_SECTIONS) {
      grouped[section.id] = [];
    }
    const validIds = NEWS_SECTIONS.map((s) => s.id);
    for (const item of news) {
      const cat =
        item.category && validIds.includes(item.category as (typeof validIds)[number])
          ? item.category
          : 'Mercados';
      grouped[cat].push(item);
    }
    return grouped;
  }, [news]);

  const activeSection = NEWS_SECTIONS.find((s) => s.id === activeCategory)!;
  const filteredNews = newsByCategory[activeCategory] ?? [];

  const sourceLabel =
    newsSource === 'newsapi'
      ? 'Fuente: NewsAPI (actualizado)'
      : newsSource === 'rss'
        ? 'Fuente: RSS en tiempo real'
        : newsSource === 'fallback'
          ? 'Fuente: datos de demostración'
          : '';

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-xl text-slate-600">Cargando noticias financieras...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header con diseño mejorado */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <i className="fas fa-newspaper text-[200px] text-blue-600"></i>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent relative z-10">
            <i className="fas fa-newspaper mr-4"></i>Noticias Financieras
          </h1>
          <p className="text-slate-600 text-xl relative z-10 mb-2">
            Las últimas actualizaciones del mercado en tiempo real
          </p>
          {sourceLabel && (
            <p className="text-sm text-blue-700 relative z-10 mb-6">
              <i className="fas fa-rss mr-2"></i>
              {sourceLabel}
            </p>
          )}
          {error && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 relative z-10 mb-4 max-w-xl mx-auto">
              {error}
            </p>
          )}
          
          {/* Indicadores de mercado */}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="bg-white px-6 py-3 rounded-full border-2 border-blue-200 shadow-sm">
              <span className="text-sm text-slate-600 mr-2">S&P 500:</span>
              <span className="font-bold text-green-600">
                <i className="fas fa-arrow-up mr-1"></i>+1.2%
              </span>
            </div>
            <div className="bg-white px-6 py-3 rounded-full border-2 border-blue-200 shadow-sm">
              <span className="text-sm text-slate-600 mr-2">NASDAQ:</span>
              <span className="font-bold text-green-600">
                <i className="fas fa-arrow-up mr-1"></i>+0.8%
              </span>
            </div>
            <div className="bg-white px-6 py-3 rounded-full border-2 border-blue-200 shadow-sm">
              <span className="text-sm text-slate-600 mr-2">DOW JONES:</span>
              <span className="font-bold text-red-600">
                <i className="fas fa-arrow-down mr-1"></i>-0.3%
              </span>
            </div>
          </div>
        </div>

        {/* Filtro por categoría */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border-2 border-blue-200">
          <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
            <i className="fas fa-filter mr-2"></i>Categorías
          </h3>
          <div className="flex flex-wrap gap-3">
            {NEWS_SECTIONS.map((section) => {
              const count = newsByCategory[section.id]?.length ?? 0;
              const isActive = activeCategory === section.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveCategory(section.id)}
                  className={`px-6 py-3 rounded-full font-bold transform hover:scale-105 transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-blue-200 hover:border-blue-600'
                  }`}
                >
                  <i className={`fas ${section.icon} mr-2`}></i>
                  {section.label}
                  <span
                    className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20' : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Noticias de la categoría seleccionada */}
        <div className="mb-6 flex items-center justify-between pb-3 border-b-2 border-blue-200">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md">
              <i className={`fas ${activeSection.icon} text-white`}></i>
            </span>
            {activeSection.label}
          </h2>
          <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {filteredNews.length} {filteredNews.length === 1 ? 'noticia' : 'noticias'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredNews.length > 0 ? (
            filteredNews.map((item, index) => (
              <NewsItemCard key={`${activeCategory}-${item.url}-${index}`} news={item} />
            ))
          ) : news.length > 0 ? (
            <div className="col-span-2 text-center py-20 bg-white rounded-xl border border-blue-100">
              <i className="fas fa-inbox text-6xl text-slate-300 mb-4"></i>
              <p className="text-xl text-slate-500">
                No hay noticias en {activeSection.label} por el momento.
              </p>
              <p className="text-sm text-slate-400 mt-2">Prueba otra categoría en el filtro superior.</p>
            </div>
          ) : (
            <div className="col-span-2 text-center py-20">
              <i className="fas fa-inbox text-6xl text-slate-300 mb-4"></i>
              <p className="text-xl text-slate-500 mb-4">No hay noticias disponibles en este momento</p>
              <button
                type="button"
                onClick={loadNews}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              >
                Actualizar noticias
              </button>
            </div>
          )}
        </div>

        {/* Footer con estadísticas */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border-2 border-blue-200 text-center hover:border-blue-600 transition-all shadow-sm hover:shadow-md">
            <i className="fas fa-sync-alt text-3xl text-blue-600 mb-3"></i>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">En vivo</h3>
            <p className="text-slate-600 text-sm">Actualizaciones continuas</p>
          </div>
          <div className="bg-white p-6 rounded-xl border-2 border-blue-200 text-center hover:border-blue-600 transition-all shadow-sm hover:shadow-md">
            <i className="fas fa-bolt text-3xl text-blue-600 mb-3"></i>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">24/7</h3>
            <p className="text-slate-600 text-sm">Cobertura global</p>
          </div>
          <div className="bg-white p-6 rounded-xl border-2 border-blue-200 text-center hover:border-blue-600 transition-all shadow-sm hover:shadow-md">
            <i className="fas fa-shield-alt text-3xl text-blue-600 mb-3"></i>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Verificado</h3>
            <p className="text-slate-600 text-sm">Fuentes confiables</p>
          </div>
          <div className="bg-white p-6 rounded-xl border-2 border-blue-200 text-center hover:border-blue-600 transition-all shadow-sm hover:shadow-md">
            <i className="fas fa-brain text-3xl text-blue-600 mb-3"></i>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">IA</h3>
            <p className="text-slate-600 text-sm">Análisis inteligente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
