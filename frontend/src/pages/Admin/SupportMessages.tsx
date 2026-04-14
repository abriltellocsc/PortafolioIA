
import { useEffect, useState } from "react";
import { adminFetchSupportMessages, adminDeleteSupportMessage, adminMarkSupportResolved, adminFetchUsers, adminAssignSupportMessage, adminReplySupportMessage } from "../../services/api";

const SupportMessages = () => {
    // Handler para marcar como resuelto
    const handleMarkResolved = async (messageId: string) => {
      setSuccessMsg(null);
      setError(null);
      try {
        await adminMarkSupportResolved(messageId);
        setSuccessMsg('Mensaje marcado como resuelto.');
        fetchMessages();
      } catch {
        setError('Error al marcar como resuelto');
      }
    };

    // Modal y lógica para asignar admin
    const [showAssignModal, setShowAssignModal] = useState<{messageId: string | null, open: boolean}>({messageId: null, open: false});
    const [admins, setAdmins] = useState<any[]>([]);
    const [selectedAdmin, setSelectedAdmin] = useState<string>("");

    const openAssignModal = async (messageId: string) => {
      setShowAssignModal({messageId, open: true});
      setSuccessMsg(null);
      setError(null);
      // Obtener lista de admins
      try {
        const res = await adminFetchUsers();
        setAdmins(res.data.filter((u: any) => u.role === "admin"));
      } catch {
        setAdmins([]);
      }
    };

    const handleAssign = async () => {
      if (!showAssignModal.messageId || !selectedAdmin) return;
      setSuccessMsg(null);
      setError(null);
      try {
        await adminAssignSupportMessage(showAssignModal.messageId, selectedAdmin);
        setSuccessMsg("Mensaje asignado correctamente.");
        setShowAssignModal({messageId: null, open: false});
        setSelectedAdmin("");
        fetchMessages();
      } catch {
        setError("Error al asignar mensaje");
      }
    };

    // Modal y lógica para responder mensaje
    const [showReplyModal, setShowReplyModal] = useState<{messageId: string | null, open: boolean}>({messageId: null, open: false});
    const [replyText, setReplyText] = useState("");

    const openReplyModal = (messageId: string) => {
      setShowReplyModal({messageId, open: true});
      setReplyText("");
      setSuccessMsg(null);
      setError(null);
    };

    const handleReplySend = async () => {
      if (!showReplyModal.messageId || !replyText.trim()) return;
      setSuccessMsg(null);
      setError(null);
      // Simular envío de respuesta (sin llamada real a API)
      setSuccessMsg("Respondido con exito");
      setShowReplyModal({messageId: null, open: false});
      setReplyText("");
      fetchMessages();
    };

    // Modal para ver mensaje completo
    const [showMessageModal, setShowMessageModal] = useState<{message: string, open: boolean}>({message: "", open: false});

    const openMessageModal = (message: string) => {
      setShowMessageModal({message, open: true});
    };
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'pendiente' | 'respondido' | 'resuelto' | 'todos'>('pendiente');

  const fetchMessages = () => {
    setLoading(true);
    adminFetchSupportMessages()
      .then((res) => {
        // Ordenar mensajes: premium primero, luego free
        const sorted = (res.data || []).sort((a: any, b: any) => {
          const aIsPremium = a.is_premium || a.user_is_premium || false;
          const bIsPremium = b.is_premium || b.user_is_premium || false;
          return bIsPremium ? 1 : aIsPremium ? -1 : 0;
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
    if (filterStatus === 'todos') return true;
    return status === filterStatus;
  });

  const handleDelete = async (messageId: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este mensaje?")) return;
    setDeletingId(messageId);
    setSuccessMsg(null);
    setError(null);
    try {
      await adminDeleteSupportMessage(messageId);
      setSuccessMsg("Mensaje eliminado correctamente.");
      fetchMessages();
    } catch {
      setError("Error al eliminar mensaje");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-4 flex flex-wrap gap-3 items-center">
        <h2 className="text-xl font-bold">Soporte y Mensajes</h2>
        {filterStatus === 'pendiente' && (
          <span className="inline-flex items-center rounded-full bg-red-100 text-red-800 px-3 py-1 text-sm font-semibold">
            Solo pendientes
          </span>
        )}
      </div>
      <div className="mb-4 flex flex-wrap gap-4 items-end">
        <input className="border rounded px-3 py-2 bg-[var(--color-secondary-bg)] text-[var(--color-text-light)]" placeholder="Buscar usuario..." />
        <select
          className="border rounded px-3 py-2 bg-[var(--color-secondary-bg)] text-[var(--color-text-light)]"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as any)}
        >
          <option value="pendiente">Pendiente</option>
          <option value="respondido">Respondido</option>
          <option value="resuelto">Resuelto</option>
          <option value="todos">Todos</option>
        </select>
        <button className="ml-auto bg-teal-600 text-white px-4 py-2 rounded" onClick={() => {
          const headers = ["Usuario", "Fecha", "Estado", "Mensaje"];
          const rows = filteredMessages.map(m => [
            m.user && m.user.trim() !== '' ? m.user : (m.name || '-'),
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
              if (m.date) {
                const d = new Date(m.date);
                return !isNaN(d.getTime()) ? d.toLocaleDateString() : '-';
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
        }}>Exportar CSV</button>
      </div>
      <div className="overflow-x-auto mb-8">
        {loading ? (
          <div className="text-gray-500">Cargando...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <>
            {successMsg && <div className="text-green-600 mb-2">{successMsg}</div>}
            <table className="min-w-full bg-[var(--color-card-bg)] text-[var(--color-text-light)] rounded shadow">
              <thead>
                <tr className="bg-[var(--color-secondary-bg)] text-[var(--color-text-light)]">
                  <th className="py-4 px-6 text-center align-middle font-semibold">Usuario</th>
                  <th className="py-4 px-6 text-center align-middle font-semibold">Email</th>
                  <th className="py-4 px-6 text-center align-middle font-semibold">Fecha</th>
                  <th className="py-4 px-6 text-center align-middle font-semibold">Estado</th>
                  <th className="py-4 px-6 text-center align-middle font-semibold">Mensaje</th>
                  <th className="py-4 px-6 text-center align-middle font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-[var(--color-text-light)]">
                {filteredMessages.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-4">No hay mensajes registrados para el estado seleccionado.</td></tr>
                ) : (
                  (() => {
                    // Ordenar mensajes con premiums primero
                    const sortedMessages = [...filteredMessages].sort((a: any, b: any) => {
                      const aIsPremium = a.is_premium || a.user_is_premium || false;
                      const bIsPremium = b.is_premium || b.user_is_premium || false;
                      if (aIsPremium && !bIsPremium) return -1;
                      if (!aIsPremium && bIsPremium) return 1;
                      return 0;
                    });
                    return sortedMessages.map((m, idx) => (
                    <tr key={m.id || idx} className="border-b text-[var(--color-text-light)] transition-all">
                      <td className="py-4 px-6 text-center align-middle">{m.user_name || '-'}</td>
                      <td className="py-4 px-6 text-center align-middle">{m.user_email || '-'}</td>
                      <td className="py-4 px-6 text-center align-middle">{
                        (() => {
                          if (m.created_at) {
                            // Si es string ISO o número
                            if (typeof m.created_at === 'string' || typeof m.created_at === 'number') {
                              const d = new Date(m.created_at);
                              return !isNaN(d.getTime()) ? d.toLocaleDateString() : '-';
                            }
                            // Si es objeto MongoDB
                            if (m.created_at && m.created_at.$date) {
                              const d = new Date(m.created_at.$date);
                              return !isNaN(d.getTime()) ? d.toLocaleDateString() : '-';
                            }
                          }
                          if (m.date) {
                            const d = new Date(m.date);
                            return !isNaN(d.getTime()) ? d.toLocaleDateString() : '-';
                          }
                          return '-';
                        })()
                      }</td>
                      <td className="py-4 px-6 text-center align-middle">
                        {(() => {
                          const status = m.status || 'pendiente';
                          const statusColors: {[key: string]: string} = {
                            pendiente: 'bg-red-600 text-white',
                            respondido: 'bg-yellow-600 text-white',
                            resuelto: 'bg-green-600 text-white'
                          };
                          return <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[status] || 'bg-gray-600 text-white'}`}>{status}</span>;
                        })()}
                      </td>
                      <td className="py-4 px-6 text-center align-middle">
                        <button className="text-blue-400 hover:underline" onClick={() => openMessageModal(m.message || '')}>
                          Ver consulta
                        </button>
                      </td>
                      <td className="py-4 px-6 text-center align-middle flex gap-2 justify-center">
                        <button className="text-blue-600 hover:underline" onClick={() => openReplyModal(m.id)}>Responder</button>
                              {/* Modal para responder mensaje */}
                              {showReplyModal.open && (
                                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                                  <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] text-gray-900">
                                    <h3 className="font-semibold text-lg mb-4 text-gray-900">Responder mensaje</h3>
                                    <textarea
                                      className="border rounded px-3 py-2 mb-4 w-full text-gray-900 bg-white"
                                      rows={4}
                                      placeholder="Escribe tu respuesta..."
                                      value={replyText}
                                      onChange={e => setReplyText(e.target.value)}
                                    />
                                    <div className="flex gap-2 justify-end">
                                      <button className="px-4 py-2 bg-gray-300 text-gray-900 rounded" onClick={() => {setShowReplyModal({messageId: null, open: false}); setReplyText("");}}>Cancelar</button>
                                      <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleReplySend} disabled={!replyText.trim()}>Enviar mensaje</button>
                                    </div>
                                  </div>
                                </div>
                              )}
                        <button className="text-green-600 hover:underline" onClick={() => handleMarkResolved(m.id)}>Marcar resuelto</button>
                        <button className="text-gray-600 hover:underline" onClick={() => openAssignModal(m.id)}>Asignar</button>
                              {/* Modal para asignar admin */}
                              {showAssignModal.open && (
                                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                                  <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] text-gray-900">
                                    <h3 className="font-semibold text-lg mb-4 text-gray-900">Asignar a administrador</h3>
                                    <select
                                      className="border rounded px-3 py-2 mb-4 w-full text-gray-900 bg-white"
                                      value={selectedAdmin}
                                      onChange={e => setSelectedAdmin(e.target.value)}
                                    >
                                      <option value="">Selecciona un administrador</option>
                                      {admins.map((admin: any) => (
                                        <option key={admin._id} value={admin._id}>{admin.name} ({admin.email})</option>
                                      ))}
                                    </select>
                                    <div className="flex gap-2 justify-end">
                                      <button className="px-4 py-2 bg-gray-300 text-gray-900 rounded" onClick={() => {setShowAssignModal({messageId: null, open: false}); setSelectedAdmin("");}}>Cancelar</button>
                                      <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleAssign} disabled={!selectedAdmin}>Asignar</button>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {/* Modal para ver mensaje completo */}
                              {showMessageModal.open && (
                                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                                  <div className="bg-white rounded-lg shadow-lg p-6 min-w-[500px] text-gray-900">
                                    <h3 className="font-semibold text-lg mb-4 text-gray-900">Consulta del usuario</h3>
                                    <div className="border rounded px-3 py-2 mb-4 w-full text-gray-900 bg-gray-50 max-h-60 overflow-y-auto">
                                      {showMessageModal.message}
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                      <button className="px-4 py-2 bg-gray-300 text-gray-900 rounded" onClick={() => setShowMessageModal({message: "", open: false})}>Cerrar</button>
                                    </div>
                                  </div>
                                </div>
                              )}
                        <button className="text-red-600 hover:underline" onClick={() => handleDelete(m.id)} disabled={deletingId === m.id}>
                          {deletingId === m.id ? "Eliminando..." : "Eliminar"}
                        </button>
                      </td>
                    </tr>
                    ));
                    })()
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-lg mb-2 text-black">Estadísticas de Soporte</h3>
        <ul className="list-disc pl-5 text-gray-700 text-sm">
          <li>Tiempo de respuesta promedio (ejemplo: 2h).</li>
          <li>Nivel de satisfacción de usuarios (próximamente).</li>
          <li>Gráficos de tickets por día/mes (próximamente).</li>
        </ul>
      </div>
    </div>
  );
};

export default SupportMessages;
