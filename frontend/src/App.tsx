          {/* <Route path="/admin/config" element={isAuthenticated && isAdmin ? <SystemConfig /> : <Navigate to="/" />} /> */}
// import SystemConfig from './pages/Admin/SystemConfig';
// Componente principal de la aplicación
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import AuthModal from './components/AuthModal';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import RiskProfileForm from './components/RiskProfileForm';
import AnimatedBackground from './components/AnimatedBackground';
import { getAuthToken, removeAuthToken, fetchCurrentUser, fetchUserPortfolio, logoutUser } from './services/api';
import AboutUs from './pages/AboutUs';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AuthCallback from './pages/AuthCallback';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PlanPage from './pages/PlanPage';
import Pago from './pages/Pago';
// Importar componentes de admin
import AdminDashboard from './pages/Admin/AdminDashboard';
// Eliminar referencias a LogsAudit y SupportMessages
function App() {
  // Estado para controlar si el usuario está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getAuthToken());
  // Estado para controlar si el modal de autenticación está abierto
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  // Estado para controlar si el modal debe abrir en modo registro
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  // Estado para almacenar el portafolio del usuario
  const [portfolio, setPortfolio] = useState<any>(null);
  // Estado para almacenar el nombre del usuario
  const [userName, setUserName] = useState<string>('');
  // Estado para mostrar carga
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Estado para saber si el usuario es admin
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  // Estado para saber si el usuario es premium
  const [isUserPremium, setIsUserPremium] = useState<boolean>(false);

  // Función para obtener el portafolio y rol del usuario desde el backend
  const fetchPortfolio = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      // Primero obtenemos el usuario actual
      const response = await fetchCurrentUser();
      console.log('Respuesta de /auth/me:', response.data); // LOG para depuración
      // Guardar el nombre del usuario
      if (response.data && response.data.name) {
        setUserName(response.data.name);
      } else {
        setUserName('');
      }
      // Verificar si el usuario es premium - ACTUALIZAR SIEMPRE
      setIsUserPremium(response.data?.is_premium || false);
      // Verificar si el usuario es admin (ajusta según tu backend)
      const isAdminUser = response.data?.role === 'admin';
      setIsAdmin(isAdminUser);
      console.log('Valor de isAdmin:', isAdminUser); // LOG para depuración
      console.log('Valor de isUserPremium:', response.data?.is_premium); // LOG para depuración

      // Obtener el user_id y luego el portafolio
      const userId = response.data?._id || response.data?.id || response.data?.user_id;
      if (userId) {
        try {
          const portfolioRes = await fetchUserPortfolio(userId);
          setPortfolio(portfolioRes.data);
        } catch (portfolioErr: any) {
          // 404 es normal si el usuario no tiene portafolio
          if (portfolioErr.response?.status === 404) {
            setPortfolio(null);
          } else {
            throw portfolioErr;
          }
        }
      } else {
        setPortfolio(null);
      }
    } catch (err: any) {
      console.error("Error fetching user portfolio:", err);
      // Si el error es 401 (Unauthorized), limpiar el token y cerrar sesión
      if (err.response?.status === 401) {
        console.log("Token inválido o expirado. Cerrando sesión...");
        removeAuthToken();
        setIsAuthenticated(false);
        setPortfolio(null);
        setIsAdmin(false);
        return;
      }
      // No cambiar setPortfolio ni setIsAdmin aquí - solo para otros errores no-404
      setPortfolio(null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Efecto para cargar el portafolio cuando el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated && !portfolio) {
      fetchPortfolio();
    }
  }, [isAuthenticated, portfolio, fetchPortfolio]);

  const navigate = useNavigate();
  // Función llamada cuando la autenticación es exitosa
  const handleLoginSuccess = async (source: 'login' | 'register') => {
    console.log('[handleLoginSuccess] Iniciando con source:', source);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);

    try {
      console.log('[handleLoginSuccess] Obteniendo usuario actual...');
      const me = await fetchCurrentUser();
      console.log('[handleLoginSuccess] Usuario obtenido:', me.data);
      
      const isAdminUser = me.data?.role === 'admin';
      setIsAdmin(isAdminUser); // Actualiza el estado global
      setIsUserPremium(me.data?.is_premium || false); // Actualiza el estado premium
      // Guardar el nombre del usuario
      if (me.data && me.data.name) {
        setUserName(me.data.name);
      } else {
        setUserName('');
      }
      
      console.log('[handleLoginSuccess] isAdminUser:', isAdminUser);
      if (isAdminUser) {
        console.log('[handleLoginSuccess] Redirigiendo a /admin');
        navigate('/admin');
        return;
      }
      if (source === 'register') {
        console.log('[handleLoginSuccess] Redirigiendo a /risk-profile-form (registro)');
        navigate('/risk-profile-form');
        return;
      }
      const hasPortfolio = !!me.data?.portfolio;
      console.log('[handleLoginSuccess] hasPortfolio:', hasPortfolio);
      if (hasPortfolio) {
        console.log('[handleLoginSuccess] Redirigiendo a /dashboard/overview');
        navigate('/dashboard/overview');
      } else {
        console.log('[handleLoginSuccess] Redirigiendo a /risk-profile-form (sin portafolio)');
        navigate('/risk-profile-form');
      }
    } catch (err: any) {
      console.error('[handleLoginSuccess] Error:', err);
      if (err.response?.status === 401) {
        console.error("Token inválido después del login:", err);
        removeAuthToken();
        setIsAuthenticated(false);
        setIsAdmin(false);
        return;
      }
      // No redirigir a '/'
    }
  };

  // Función para cerrar sesión
  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      // Intentar notificar al backend del logout
      await logoutUser();
      console.log('Logout realizado en el backend');
    } catch (error) {
      // Si falla la llamada al backend (ej: token expirado), continuar de todas formas
      console.log('Note: No se pudo contactar al backend para logout (posiblemente token expirado):', error);
    } finally {
      // Limpiar localStorage y estado local sin importar si el backend respondió
      removeAuthToken();
      localStorage.removeItem('user_id');
      
      // Resetear todo el estado de la aplicación
      setIsAuthenticated(false);
      setPortfolio(null);
      setUserName('');
      setIsAdmin(false);
      setIsUserPremium(false);
      
      console.log('Sesión cerrada: estado local limpiado');
      
      // Redirigir a la página de inicio
      window.location.href = '/';
    }
  };

  // Función llamada cuando se genera un portafolio
  const handlePortfolioGenerated = async (_newPortfolio: any) => {
    await fetchPortfolio();
    navigate('/dashboard/overview');
  };

  // Función para abrir el modal de autenticación y luego ir al cuestionario
  const handleOpenAuthModalForQuestionnaire = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  // Función para abrir modal en modo login
  const handleOpenAuthModalLogin = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  // Función para abrir modal en modo registro
  const handleOpenAuthModalRegister = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  // Función manejadora para el upgrade exitoso desde PlanPage
  const handleUpgradeSuccess = async () => {
    console.log('[handleUpgradeSuccess] Iniciando sincronización después del upgrade...');
    // Esperar a que fetchPortfolio complete para actualizar isUserPremium desde el backend
    await fetchPortfolio();
    // Establecer como premium DESPUÉS de fetchPortfolio para que no sea sobrescrito
    setIsUserPremium(true);
    console.log('[handleUpgradeSuccess] Sincronización completada');
  };

  // Función manejadora para la cancelación de plan exitosa desde PlanPage
  const handleCancelSuccess = async () => {
    console.log('[handleCancelSuccess] Iniciando sincronización después de la cancelación...');
    setIsUserPremium(false);
    // Esperar a que fetchPortfolio complete para actualizar isUserPremium desde el backend
    await fetchPortfolio();
    console.log('[handleCancelSuccess] Sincronización completada');
  };

  return (
    <div className="min-h-screen bg-[var(--color-primary-bg)] font-montserrat text-[var(--color-text-light)]">
      <AnimatedBackground />
      <Routes>
        <Route path="/" element={
          <Home
            onOpenAuthModalLogin={handleOpenAuthModalLogin}
            onOpenAuthModalRegister={handleOpenAuthModalRegister}
            onOpenAuthModalForQuestionnaire={handleOpenAuthModalForQuestionnaire}
            isAuthenticated={isAuthenticated}
            portfolio={portfolio}
            isLoading={isLoading}
            isAdmin={isAdmin}
          />
        } />
        {/* Rutas protegidas que requieren autenticación */}
        <Route
          path="/dashboard/*"
          element={isAuthenticated ? <Dashboard onLogout={handleLogout} portfolio={portfolio} isAdmin={isAdmin} userName={userName} isUserPremium={isUserPremium} /> : null}
        />
        <Route
          path="/plan"
          element={isAuthenticated ? <PlanPage initialIsUserPremium={isUserPremium} onUpgradeSuccess={handleUpgradeSuccess} onCancelSuccess={handleCancelSuccess} /> : null}
        />
        <Route
          path="/pago"
          element={isAuthenticated ? <Pago onSubscribeSuccess={handleUpgradeSuccess} /> : null}
        />
        <Route
          path="/risk-profile-form"
          element={isAuthenticated ? <RiskProfileForm onPortfolioGenerated={handlePortfolioGenerated} /> : null}
        />
        {/* Rutas de administración, solo para admin */}
        <Route path="/admin/*" element={isAuthenticated && isAdmin ? <AdminDashboard onLogout={handleLogout} /> : null} />
        {/* Páginas públicas */}
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        {/* Otras rutas públicas o de error */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="*" element={null} />
      </Routes>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialMode={authModalMode}
      />
    </div>
  );
}


export default App;
