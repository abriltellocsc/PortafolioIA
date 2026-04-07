import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordRequest } from '../services/api';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Por favor ingresa tu correo electrónico');
      return;
    }

    setLoading(true);

    try {
      const response = await forgotPasswordRequest(email);
      setSubmitted(true);
      setMessage(response.data?.message || 'Si el correo existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña.');
      setEmail('');
    } catch (err: any) {
      setError('Error de conexión. Por favor, intenta de nuevo más tarde.');
      console.error('Error requesting password reset:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Subtle Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
      </div>

      <div className="relative z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Recuperar Contraseña</h1>
        <p className="text-gray-500 text-center text-sm mb-6">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
        </p>

        {submitted ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 font-medium text-center mb-2">Solicitud Enviada</p>
              <p className="text-green-600 text-sm text-center">{message}</p>
            </div>
            <p className="text-gray-600 text-sm text-center">
              Revisa tu bandeja de entrada (y carpeta de spam) en los próximos minutos.
            </p>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors duration-200"
            >
              Ir al Inicio
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
            </button>

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="block w-full text-blue-900 hover:text-blue-800 font-medium text-sm"
              >
                Volver al Inicio
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
