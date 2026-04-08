import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { upgradeToPremium } from '../services/api';

interface PagoProps {
  onSubscribeSuccess?: () => Promise<void>;
}

const Pago: React.FC<PagoProps> = ({ onSubscribeSuccess }) => {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(value);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9/]/g, '').slice(0, 5);
    setExpiry(value);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCvc(value);
  };

  const handleSubscribe = async () => {
    if (!cardNumber.trim() || !expiry.trim() || !cvc.trim()) {
      setError('Completa todos los datos de pago.');
      return;
    }
    if (!agreeTerms) {
      setError('Debes aceptar los términos y condiciones.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      console.log('[handleSubscribe] Iniciando upgrade a Premium...');
      
      // Llamar al backend para actualizar is_premium en la BD
      const response = await upgradeToPremium('tarjeta');
      console.log('[handleSubscribe] Respuesta del backend:', response.data);
      
      // También guardar en localStorage como backup
      localStorage.setItem('is_premium', 'true');
      
      // Llamar callback para sincronizar estado global
      if (onSubscribeSuccess) {
        console.log('[handleSubscribe] Ejecutando callback onSubscribeSuccess...');
        await onSubscribeSuccess();
      }
      
      // Ahora mostrar mensaje de éxito
      setLoading(false);
      setSuccess(true);
      
      // Esperar 3 segundos antes de redirigir
      setTimeout(() => {
        console.log('[handleSubscribe] Redirigiendo a dashboard...');
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      console.error('[handleSubscribe] Error:', err);
      setError('No se pudo procesar la suscripción. Por favor intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-primary-bg)] flex items-center justify-center px-4 py-10">
      {success ? (
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-[var(--color-text-light)] mb-2">¡Suscripto con éxito!</h2>
            <p className="text-[var(--color-text-muted)] mb-4">Redirigiendo al inicio automáticamente...</p>
            <div className="text-sm text-[var(--color-text-muted)]">Espera 3 segundos...</div>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl w-full grid lg:grid-cols-[1.4fr_1fr] gap-8">
          <div className="bg-[var(--color-secondary-bg)] rounded-3xl p-8 shadow-lg">
            <div className="mb-6">
              <button 
                className="text-[var(--color-accent-secondary)] hover:text-[var(--color-accent-primary)] text-sm mb-4 font-medium"
                onClick={() => navigate('/plan')}
              >
                ← Volver a planes
              </button>
              <h1 className="text-4xl font-bold text-[var(--color-text-light)]">Plan Premium</h1>
              <p className="text-[var(--color-text-muted)] mt-3">Completa el pago para activar tu plan Premium y mejorar tus portafolios.</p>
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl p-6 bg-[var(--color-accent-light)]">
                <label className="block text-sm text-[var(--color-accent-primary)] mb-2 font-medium">Número de tarjeta</label>
                <input
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={16}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary-bg)] px-4 py-4 text-[var(--color-text-light)] focus:border-[var(--color-accent-secondary)] outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl p-6 bg-[var(--color-accent-light)]">
                  <label className="block text-sm text-[var(--color-accent-primary)] mb-2 font-medium">Fecha de caducidad</label>
                  <input
                    value={expiry}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9/]/g, '').slice(0, 5);
                      setExpiry(value);
                    }}
                    placeholder="MM/AA"
                    maxLength={5}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary-bg)] px-4 py-4 text-[var(--color-text-light)] focus:border-[var(--color-accent-secondary)] outline-none"
                  />
                </div>
                <div className="rounded-2xl p-6 bg-[var(--color-accent-light)]">
                  <label className="block text-sm text-[var(--color-accent-primary)] mb-2 font-medium">Código de seguridad</label>
                  <input
                    value={cvc}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                      setCvc(value);
                    }}
                    placeholder="123"
                    maxLength={3}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary-bg)] px-4 py-4 text-[var(--color-text-light)] focus:border-[var(--color-accent-secondary)] outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 text-sm text-[var(--color-text-light)]">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 rounded border-[var(--color-border)] bg-[var(--color-secondary-bg)] text-[var(--color-accent-secondary)]"
                />
                Acepto los términos y condiciones del servicio.
              </label>

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-300 text-red-700 p-4 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full rounded-full bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] px-6 py-4 text-white font-bold transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Procesando...' : 'Suscribirme'}
              </button>
            </div>
          </div>

          <div className="bg-[var(--color-secondary-bg)] rounded-3xl p-8 shadow-lg">
            <div className="rounded-2xl bg-[var(--color-accent-primary)] p-6 text-white mb-6">
              <h2 className="text-3xl font-bold">Plan Premium</h2>
              <p className="mt-3 text-[var(--color-accent-light)]">Funciones destacadas para tu portafolio.</p>
            </div>

            <ul className="space-y-4 text-[var(--color-text-light)]">
              <li className="flex gap-3 items-start">
                <span className="text-[var(--color-accent-secondary)] mt-1 font-bold">•</span>
                <span>Acceso a todas las funciones</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-[var(--color-accent-secondary)] mt-1 font-bold">•</span>
                <span>Más mensajes y cargas en tus portafolios</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-[var(--color-accent-secondary)] mt-1 font-bold">•</span>
                <span>Genera más análisis con mayor velocidad</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-[var(--color-accent-secondary)] mt-1 font-bold">•</span>
                <span>Memoria y contexto adicionales</span>
              </li>
                <li className="flex gap-3 items-start">
                <span className="text-[var(--color-accent-secondary)] mt-1 font-bold">•</span>
                <span>Soporte Premium 24/7</span>
              </li>
            </ul>

            <div className="mt-8 border-t border-[var(--color-border)] pt-6 text-[var(--color-text-light)]">
              <div className="flex items-center justify-between text-sm mb-2 text-[var(--color-text-muted)]">
                <span>Mensual suscripción</span>
                <span className="font-semibold">9,99 US$</span>
              </div>
              <div className="flex items-center justify-between text-sm mb-3 text-[var(--color-text-muted)]">
                <span>Impuesto estimado</span>
                <span>0,00 US$</span>
              </div>
              <div className="flex items-center justify-between text-lg font-bold text-[var(--color-accent-primary)]">
                <span>Importe a pagar hoy</span>
                <span>9,99 US$</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pago;

