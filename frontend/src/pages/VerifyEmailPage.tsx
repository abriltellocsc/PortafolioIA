import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      const email = searchParams.get('email');

      if (!token || !email) {
        setStatus('error');
        setMessage('Token o email inválido. Parámetros faltantes.');
        return;
      }

      try {
        const response = await api.get('/auth/verify-email', {
          params: {
            token,
            email
          }
        });

        setStatus('success');
        setMessage(response.data.message || 'Email verificado correctamente. Redirigiendo al login...');

        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } catch (err: any) {
        setStatus('error');
        const errorMsg = err.response?.data?.detail || err.message || 'Error al verificar el email';
        setMessage(errorMsg);
        console.error('Error verificando email:', err);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-900 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verificando email...</h2>
            <p className="text-gray-600">Por favor espera mientras verificamos tu correo</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">¡Email Verificado!</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">Redirigiendo al login automáticamente...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-5xl mb-4">✕</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Error en verificación</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            >
              Volver al inicio
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
