import { useEffect, useState } from 'react';
import { adminFetchLogs } from '../../services/api';

const AdminUserLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = (pageToFetch = 1) => {
    setLoading(true);
    adminFetchLogs({ page: pageToFetch, page_size: pageSize, user_area: true })
      .then((res) => {
        setLogs(res.data.logs || []);
        setTotalPages(res.data.total_pages || 1);
        setError(null);
      })
      .catch(() => {
        setError('Error al cargar los registros de auditoría de usuarios');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

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
          onClick={() => fetchLogs(page)}
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
        <>
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

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm text-gray-400">
              Página {page} de {totalPages}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="px-3 py-2 rounded bg-[var(--color-secondary-bg)] text-[var(--color-text-light)] disabled:opacity-50"
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`px-3 py-2 rounded ${pageNumber === page ? 'bg-[var(--color-accent-primary)] text-white' : 'bg-[var(--color-secondary-bg)] text-[var(--color-text-light)]'}`}>
                  {pageNumber}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                className="px-3 py-2 rounded bg-[var(--color-secondary-bg)] text-[var(--color-text-light)] disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminUserLogs;