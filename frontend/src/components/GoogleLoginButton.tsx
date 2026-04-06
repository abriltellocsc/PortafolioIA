import React, { useEffect, useRef, useState } from 'react';
import api from '../services/api';

const GoogleLoginButton: React.FC = () => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    console.log('[GoogleLoginButton] Inicializando con Client ID:', !!clientId);

    if (!clientId) {
      console.error('[GoogleLoginButton] VITE_GOOGLE_CLIENT_ID no configurado');
      return;
    }

    // Cargar script si no existe
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.id = 'google-login-script';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        console.log('[GoogleLoginButton] Script cargado');
        initGoogle();
      };

      document.body.appendChild(script);
    } else {
      initGoogle();
    }

    function initGoogle() {
      setTimeout(() => {
        try {
          if (!window.google?.accounts?.id) {
            console.error('[GoogleLoginButton] Google.accounts.id no disponible');
            return;
          }

          const handleCredential = async (response: any) => {
            const id_token = response?.credential;
            if (!id_token) {
              console.error('[GoogleLoginButton] Sin credential');
              return;
            }

            setIsLoading(true);
            try {
              console.log('[GoogleLoginButton] Verificando token...');
              const resp = await api.post('/auth/google/verify', { id_token });
              console.log('[GoogleLoginButton] Respuesta:', resp.data);

              const token = resp.data?.access_token;
              if (!token) {
                alert('Error: Sin token');
                return;
              }

              localStorage.setItem('token', token);
              try {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                if (decoded?.user_id) {
                  localStorage.setItem('user_id', decoded.user_id);
                }
              } catch (e) {
                console.warn('[GoogleLoginButton] No se pudo decodificar');
              }

              window.location.href = '/';
            } catch (err: any) {
              console.error('[GoogleLoginButton] Error:', err);
              alert('Error: ' + (err.response?.data?.detail || err.message));
              setIsLoading(false);
            }
          };

          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredential,
            use_fedcm_for_prompt: false,
          });
        } catch (err) {
          console.error('[GoogleLoginButton] Error inicializando:', err);
        }
      }, 100);
    }
  }, []);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      window.google?.accounts?.id?.prompt?.((notification: any) => {
        console.log('[GoogleLoginButton] Prompt resultado:', notification);
        if (notification.isDismissedMoment()) {
          setIsLoading(false);
        }
      });
    } catch (err) {
      console.error('[GoogleLoginButton] Error mostrando prompt:', err);
      setIsLoading(false);
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={isLoading}
      className="w-full px-6 py-3 rounded-lg border-2 border-gray-200 bg-white hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-3 hover:border-indigo-400 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-gray-700 hover:text-gray-900"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      <span>{isLoading ? 'Verificando...' : 'Iniciar sesión con Google'}</span>
    </button>
  );
};

export default GoogleLoginButton;
