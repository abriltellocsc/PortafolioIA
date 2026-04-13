
import React, { useEffect, useState } from "react";
import { adminFetchUsers, adminUpdateUser, adminResetPassword, adminUserActivity } from "../../services/api";

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("active");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [showHistory, setShowHistory] = useState<string | null>(null);
  const [userHistory, setUserHistory] = useState<any[]>([]);
  const [resettingId, setResettingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    adminFetchUsers({
      page: currentPage,
      page_size: 10,
      status: filterStatus,
      role: filterRole || undefined,
      search: search || undefined,
      desde: fromDate || undefined,
      hasta: toDate || undefined,
    })
      .then((res) => {
        setUsers(res.data.users || []);
        setTotalUsers(res.data.total || 0);
        setTotalPages(res.data.total_pages || 1);
        setError(null);
      })
      .catch(() => {
        setError("Error al cargar usuarios");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, filterStatus, filterRole, fromDate, toDate, search]);

  const handleStatusChange = async (userId: string, isActive: boolean) => {
    setSuccessMsg(null);
    setError(null);
    try {
      await adminUpdateUser(userId, { is_active: isActive });
      setSuccessMsg("Estado de usuario actualizado correctamente.");
      fetchUsers();
    } catch {
      setError("Error al actualizar el estado del usuario");
    }
  };

  // Editar usuario
  const handleEdit = (user: any) => {
    setEditingUser(user);
    setEditForm({ name: user.name, email: user.email, role: user.role });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    if (!editingUser) return;
    try {
      // Actualizar datos básicos del usuario si se modificaron
      const { name, email, role } = editForm;
      if (name !== editingUser.name || email !== editingUser.email || role !== editingUser.role) {
        await adminUpdateUser(editingUser.id, { name, email, role });
      }
      setSuccessMsg("Usuario actualizado correctamente.");
      setEditingUser(null);
      fetchUsers();
    } catch {
      setError("Error al actualizar usuario");
    }
  };

  // Resetear contraseña
  const handleReset = async (userId: string) => {
    setResettingId(userId);
    setSuccessMsg(null);
    setError(null);
    try {
      await adminResetPassword(userId);
      setSuccessMsg("Contraseña reseteada correctamente.");
    } catch {
      setError("Error al resetear contraseña");
    } finally {
      setResettingId(null);
    }
  };

  // Historial de usuario
  const handleHistory = async (userId: string) => {
    setShowHistory(userId);
    setUserHistory([]);
    try {
      const res = await adminUserActivity(userId);
      setUserHistory(res.data.activity || []);
    } catch {
      setUserHistory([]);
    }
  };

  const closeHistory = () => {
    setShowHistory(null);
    setUserHistory([]);
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-6">Gestión de Usuarios</h2>
      <div className="mb-4 flex flex-wrap gap-4 items-end">
        <input
          className="border rounded px-3 py-2 bg-[var(--color-secondary-bg)] text-[var(--color-text-light)]"
          placeholder="Buscar usuario..."
          value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
        />
        <select
          className="border rounded px-3 py-2 bg-[var(--color-secondary-bg)] text-[var(--color-text-light)]"
          value={filterStatus}
          onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
        >
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
          <option value="all">Todos</option>
        </select>
        <input
          type="date"
          className="border rounded px-3 py-2 bg-[var(--color-secondary-bg)] text-[var(--color-text-light)]"
          value={fromDate}
          onChange={e => { setFromDate(e.target.value); setCurrentPage(1); }}
        />
        <input
          type="date"
          className="border rounded px-3 py-2 bg-[var(--color-secondary-bg)] text-[var(--color-text-light)]"
          value={toDate}
          onChange={e => { setToDate(e.target.value); setCurrentPage(1); }}
        />
        <select
          className="border rounded px-3 py-2 bg-[var(--color-secondary-bg)] text-[var(--color-text-light)]"
          value={filterRole}
          onChange={e => { setFilterRole(e.target.value); setCurrentPage(1); }}
        >
          <option value="">Todos los roles</option>
          <option value="user">Usuario</option>
          <option value="admin">Admin</option>
        </select>
        <button
          className="bg-teal-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setCurrentPage(1);
            fetchUsers();
          }}
        >
          Aplicar filtros
        </button>
        <button className="ml-auto bg-teal-600 text-white px-4 py-2 rounded" onClick={() => {
          const headers = ["Nombre", "Email", "Rol", "Registro"];
          const rows = users.map(u => [
            u.name || u.full_name || u.username || '-',
            u.email,
            u.role,
            u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'
          ]);
          const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
          const blob = new Blob([csv], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'usuarios.csv';
          a.click();
          URL.revokeObjectURL(url);
        }}>Exportar CSV</button>
      </div>
      <div className="overflow-x-auto">
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
                  <th className="py-4 px-6 text-center align-middle font-semibold">Nombre</th>
                  <th className="py-4 px-6 text-center align-middle font-semibold">Email</th>
                  <th className="py-4 px-6 text-center align-middle font-semibold">Rol</th>
                  <th className="py-4 px-6 text-center align-middle font-semibold">Última conexión</th>
                  <th className="py-4 px-6 text-center align-middle font-semibold">Estado</th>
                  <th className="py-4 px-6 text-center align-middle font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-4">No hay usuarios registrados.</td></tr>
                ) : (
                  users.map((user, idx) => (
                    <tr key={user.id || idx} className="border-b border-[var(--color-secondary-bg)]">
                      <td className="py-4 px-6 text-center align-middle">{user.name || user.full_name || user.username || '-'}</td>
                      <td className="py-4 px-6 text-center align-middle">{user.email}</td>
                      <td className="py-4 px-6 text-center align-middle">{user.role}</td>
                      <td className="py-4 px-6 text-center align-middle">{user.updated_at ? new Date(user.updated_at).toLocaleDateString() : '-'}</td>
                      <td className="py-4 px-6 text-center align-middle">
                        <div className="flex flex-col items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {user.is_active ? 'Activo' : 'Inactivo'}
                          </span>
                          <button
                            onClick={() => handleStatusChange(user.id, !user.is_active)}
                            className="text-blue-600 hover:underline"
                          >
                            {user.is_active ? 'Desactivar' : 'Activar'}
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center align-middle flex gap-2 justify-center">
                        <button className="text-blue-600 hover:underline" onClick={() => handleEdit(user)}>Editar</button>
                        <button className="text-yellow-600 hover:underline" onClick={() => handleReset(user.id)} disabled={resettingId === user.id}>
                          {resettingId === user.id ? "Reseteando..." : "Resetear"}
                        </button>
                        <button className="text-gray-600 hover:underline" onClick={() => handleHistory(user.id)}>Historial</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-400">
                Mostrando página {currentPage} de {totalPages} — {totalUsers} usuarios totales
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className="px-3 py-2 rounded bg-[var(--color-secondary-bg)] text-[var(--color-text-light)] disabled:opacity-50"
                >
                  Anterior
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded ${page === currentPage ? 'bg-[var(--color-accent-primary)] text-white' : 'bg-[var(--color-secondary-bg)] text-[var(--color-text-light)]'}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  className="px-3 py-2 rounded bg-[var(--color-secondary-bg)] text-[var(--color-text-light)] disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    {/* Modal de edición de usuario */}
    {editingUser && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-[var(--color-card-bg)] p-6 rounded shadow-lg w-full max-w-md">
          <h3 className="text-lg font-bold mb-4">Editar Usuario</h3>
          <div className="mb-2">
            <label className="block mb-1">Nombre</label>
            <input name="name" value={editForm.name} onChange={handleEditChange} className="w-full border rounded px-3 py-2 bg-[var(--color-secondary-bg)] text-[var(--color-text-light)]" />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Email</label>
            <input name="email" value={editForm.email} onChange={handleEditChange} className="w-full border rounded px-3 py-2 bg-[var(--color-secondary-bg)] text-[var(--color-text-light)]" />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Rol</label>
            <select name="role" value={editForm.role} onChange={handleEditChange} className="w-full border rounded px-3 py-2 bg-[var(--color-secondary-bg)] text-[var(--color-text-light)]">
              <option value="user">Usuario</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="mb-2">
            {/* Estado eliminado del formulario de edición */}
          </div>
          <div className="flex gap-2 mt-4">
            <button className="bg-teal-600 text-white px-4 py-2 rounded" onClick={handleEditSave}>Guardar</button>
            <button className="bg-gray-600 text-white px-4 py-2 rounded" onClick={() => setEditingUser(null)}>Cancelar</button>
          </div>
        </div>
      </div>
    )}

    {/* Modal de historial de usuario */}
    {showHistory && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-[var(--color-card-bg)] p-6 rounded shadow-lg w-full max-w-md">
          <h3 className="text-lg font-bold mb-4">Historial de Usuario</h3>
          {userHistory.length === 0 ? (
            <div className="text-gray-400">No hay actividad registrada.</div>
          ) : (
            <ul className="list-disc pl-5">
              {userHistory.map((act, i) => {
                let actEs = act;
                if (act === "login") actEs = "Inicio de sesión";
                else if (act === "update profile") actEs = "Actualizó perfil";
                else if (act === "generate portfolio") actEs = "Generó portafolio";
                else if (act === "reset password") actEs = "Reseteó contraseña";
                else if (act === "block user") actEs = "Usuario bloqueado";
                else if (act === "unblock user") actEs = "Usuario desbloqueado";
                // Puedes agregar más traducciones aquí
                return <li key={i} className="mb-1 text-[var(--color-text-light)]">{actEs}</li>;
              })}
            </ul>
          )}
          <div className="flex gap-2 mt-4">
            <button className="bg-gray-600 text-white px-4 py-2 rounded" onClick={closeHistory}>Cerrar</button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default UserManagement;
