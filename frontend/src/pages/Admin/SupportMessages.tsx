import { useEffect, useState } from "react";
import { adminFetchSupportMessages, adminDeleteSupportMessage, adminMarkSupportResolved } from "../../services/api";

const SupportMessages = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'pendiente' | 'resuelto'>('pendiente');
  const [showReplyModal, setShowReplyModal] = useState<{messageId: string | null, open: boolean}>({messageId: null, open: false});
  const [showMessageModal, setShowMessageModal] = useState<{message: string, open: boolean}>({message: "", open: false});
  const [replyText, setReplyText] = useState("");

  const fetchMessages = () => {
    setLoading(true);
    adminFetchSupportMessages()
      .then((res) => {
        const sorted = (res.data || []).sort((a: any, b: any) => {
          const aIsPremium = a.is_premium || a.user_is_premium || false;
          const bIsPremium = b.is_premium || b.user_is_premium || false;
          return aIsPremium ? -1 : bIsPremium ? 1 : 0;
        });
        setMessages(sorted);
        setError(null);
      })
      .catch(() => {
        setError("Error al cargar mensajes de soporte");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter((m: any) => {
    const status = (m.status || 'pendiente').toLowerCase();
    return status === filterStatus;
  });

  const handleReplySend = async () => {
    if (!showReplyModal.messageId || !replyText.trim()) return;
    setSuccessMsg(null);
    setError(null);
    try {
      await adminMarkSupportResolved(showReplyModal.messageId);
      setSuccessMsg("Respondido y marcado como resuelto");
      setShowReplyModal({messageId: null, open: false});
      setReplyText("");
      fetchMessages();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch {
      setError("Error al responder mensaje");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este mensaje?")) return;
    setDeletingId(messageId);
    setSuccessMsg(null);
    setError(null);
    try {
      await adminDeleteSupportMessage(messageId);
      setSuccessMsg("Mensaje eliminado correctamente.");
      fetchMessages();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch {
      setError("Error al eliminar mensaje");
      setTimeout(() => setError(null), 3000);
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Usuario", "Email", "Fecha", "Estado", "Mensaje"];
    const rows = filteredMessages.map(m => [
      m.user_name || '-',
      m.user_email || '-',
      (() => {
        if (m.created_at) {
          if (typeof m.created_at === 'string' || typeof m.created_at === 'number') {
            const d = new Date(m.created_at);
            return !isNaN(d.getTime()) ? d.toLocaleDateString() : '-';
          }
          if (m.created_at && m.created_at.$date) {
            const d = new Date(m.created_at.$date);
            return !isNaN(d.getTime()) ? d.toLocaleDateString() : '-';
          }
        }
        return '-';
      })(),
      m.status || 'pendiente',
      m.message || '-'
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mensajes_soporte.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Soporte y Mensajes</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMsg}
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pendiente">Pendiente</option>
              <option value="resuelto">Resuelto</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setFilterStatus('pendiente')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Aplicar filtros
          </button>
          <button
            onClick={handleExportCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mensaje</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                </td>
              </tr>
            ) : filteredMessages.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No hay mensajes para el estado seleccionado
                </td>
              </tr>
            ) : (
              filteredMessages.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{m.user_name || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{m.user_email || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(() => {
                      if (m.created_at) {
                        if (typeof m.created_at === 'string' || typeof m.created_at === 'number') {
                          const d = new Date(m.created_at);
                          return !isNaN(d.getTime()) ? d.toLocaleDateString() : '-';
                        }
                        if (m.created_at && m.created_at.$date) {
                          const d = new Date(m.created_at.$date);
                          return !isNaN(d.getTime()) ? d.toLocaleDateString() : '-';
                        }
                      }
                      return '-';
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      m.status === 'pendiente' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {m.status || 'pendiente'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 truncate max-w-xs">
                      {m.message || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => { setShowMessageModal({message: m.message || '', open: true}); }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <i className="fas fa-eye"></i> Ver
                    </button>
                    <button
                      onClick={() => { setShowReplyModal({messageId: m.id, open: true}); setReplyText(""); }}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <i className="fas fa-reply"></i> Responder
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      disabled={deletingId === m.id}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      <i className="fas fa-trash"></i> {deletingId === m.id ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para responder mensaje */}
      {showReplyModal.open && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Responder mensaje</h3>
              <textarea
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={4}
                placeholder="Escribe tu respuesta..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
              />
              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={() => {setShowReplyModal({messageId: null, open: false}); setReplyText("");}}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleReplySend}
                  disabled={!replyText.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver mensaje completo */}
      {showMessageModal.open && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Consulta del usuario</h3>
              <div className="border rounded px-3 py-2 mb-4 w-full text-gray-900 bg-gray-50 max-h-60 overflow-y-auto whitespace-pre-wrap">
                {showMessageModal.message}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowMessageModal({message: "", open: false})}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-lg mb-3 text-gray-900">Estadísticas de Soporte</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-md">
            <div className="text-2xl font-bold text-blue-600">{messages.filter(m => m.status === 'pendiente').length}</div>
            <div className="text-sm text-gray-600">Mensajes pendientes</div>
          </div>
          <div className="p-4 bg-green-50 rounded-md">
            <div className="text-2xl font-bold text-green-600">{messages.filter(m => m.status === 'resuelto').length}</div>
            <div className="text-sm text-gray-600">Mensajes resueltos</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-md">
            <div className="text-2xl font-bold text-purple-600">{messages.length}</div>
            <div className="text-sm text-gray-600">Total de mensajes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportMessages;
