import { useEffect, useState } from 'react';
import { adminFetchLogs } from '../../services/api';

const AdminUserLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = () => {
    setLoading(true);
    adminFetchLogs()
      .then((res) => {
        // Filtrar logs relevantes para auditoría de usuarios y suscripciones
        const userLogs = res.data.filter((log: any) =>
          log.accion.includes('USER') ||
          log.accion.includes('PREMIUM') ||
          log.accion.includes('AUTH')
        );
        setLogs(userLogs);
        setError(null);
      })
      .catch(() => {
        setError('Error al cargar los registros de auditoría de usuarios');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Auditoría de Usuarios</h2>
          <p className="text-sm text-gray-400 max-w-2xl">
            Aquí se registran todas las acciones relacionadas con usuarios y suscripciones: eliminación, actualización, bloqueo, desbloqueo, reset de contraseña, upgrade/cancelación de Premium, etc.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="self-start bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-500 transition"
        >
          Actualizar registros
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400">Cargando auditoría...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[var(--color-card-bg)] text-[var(--color-text-light)] rounded shadow-sm">
            <thead>
              <tr className="bg-[var(--color-secondary-bg)] text-left text-sm text-[var(--color-accent-teal)]">
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Admin</th>
                <th className="px-5 py-3">Acción</th>
                <th className="px-5 py-3">Detalle</th>
                <th className="px-5 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-center text-gray-400">
                    No hay registros de auditoría de usuarios disponibles.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-t border-[var(--color-secondary-bg)] hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                    <td className="px-5 py-4 text-sm">{log.id}</td>
                    <td className="px-5 py-4 text-sm">{log.usuario_nombre || log.usuario_id}</td>
                    <td className="px-5 py-4 text-sm font-medium">{log.accion}</td>
                    <td className="px-5 py-4 text-sm">{log.detalle || '-'}</td>
                    <td className="px-5 py-4 text-sm">{log.fecha ? new Date(log.fecha).toLocaleString() : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUserLogs;