import React, { useEffect, useState } from "react";
import { adminFetchEducation, adminCreateEducation, adminUpdateEducation, adminDeleteEducation } from "../../services/api";

const EducationManagement = () => {
  const [contents, setContents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterActive, setFilterActive] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContents, setTotalContents] = useState(0);
  const [editingContent, setEditingContent] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [creatingContent, setCreatingContent] = useState(false);
  const [createForm, setCreateForm] = useState({
    category: "",
    title: "",
    summary: "",
    tags: [] as string[],
    full_content: "",
    is_active: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const categories = ["Básico", "Intermedio", "Avanzado", "Estrategias", "Economía"];

  const fetchContents = () => {
    setLoading(true);
    adminFetchEducation({
      page: currentPage,
      page_size: 10,
      category: filterCategory || undefined,
      search: search || undefined,
      is_active: filterActive === "" ? undefined : filterActive === "true"
    })
      .then((res) => {
        setContents(res.data.contents || []);
        setTotalContents(res.data.total || 0);
        setTotalPages(res.data.total_pages || 1);
        setError(null);
      })
      .catch(() => {
        setError("Error al cargar contenido educativo");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchContents();
  }, [currentPage, filterCategory, filterActive, search]);

  const handleEdit = (content: any) => {
    setEditingContent(content);
    setEditForm({
      category: content.category,
      title: content.title,
      summary: content.summary,
      tags: content.tags.join(", "),
      full_content: content.full_content,
      is_active: content.is_active
    });
  };

  const handleSaveEdit = () => {
    if (!editingContent) return;

    const data = {
      ...editForm,
      tags: editForm.tags.split(",").map((tag: string) => tag.trim()).filter((tag: string) => tag)
    };

    adminUpdateEducation(editingContent.id.toString(), data)
      .then(() => {
        setSuccessMsg("Contenido actualizado exitosamente");
        setEditingContent(null);
        fetchContents();
        setTimeout(() => setSuccessMsg(null), 3000);
      })
      .catch(() => {
        setError("Error al actualizar contenido");
        setTimeout(() => setError(null), 3000);
      });
  };

  const handleCreate = () => {
    const data = {
      ...createForm,
      tags: createForm.tags
    };

    adminCreateEducation(data)
      .then(() => {
        setSuccessMsg("Contenido creado exitosamente");
        setCreatingContent(false);
        setCreateForm({
          category: "",
          title: "",
          summary: "",
          tags: [],
          full_content: "",
          is_active: true
        });
        fetchContents();
        setTimeout(() => setSuccessMsg(null), 3000);
      })
      .catch(() => {
        setError("Error al crear contenido");
        setTimeout(() => setError(null), 3000);
      });
  };

  const handleDelete = (contentId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este contenido?")) return;

    adminDeleteEducation(contentId)
      .then(() => {
        setSuccessMsg("Contenido eliminado exitosamente");
        fetchContents();
        setTimeout(() => setSuccessMsg(null), 3000);
      })
      .catch(() => {
        setError("Error al eliminar contenido");
        setTimeout(() => setError(null), 3000);
      });
  };

  const handleCreateFormChange = (field: string, value: any) => {
    if (field === "tags") {
      setCreateForm(prev => ({ ...prev, tags: value.split(",").map((tag: string) => tag.trim()).filter((tag: string) => tag) }));
    } else {
      setCreateForm(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Contenido Educativo</h2>
        <button
          onClick={() => setCreatingContent(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          <i className="fas fa-plus mr-2"></i>Crear Contenido
        </button>
      </div>

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Título o resumen..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearch("");
                setFilterCategory("");
                setFilterActive("");
                setCurrentPage(1);
              }}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                </td>
              </tr>
            ) : contents.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No se encontraron contenidos
                </td>
              </tr>
            ) : (
              contents.map((content) => (
                <tr key={content.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{content.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{content.summary}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {content.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      content.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {content.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(content.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(content)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <i className="fas fa-edit"></i> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(content.id.toString())}
                      className="text-red-600 hover:text-red-900"
                    >
                      <i className="fas fa-trash"></i> Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                  page === currentPage ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </nav>
        </div>
      )}

      {/* Modal de Edición */}
      {editingContent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Editar Contenido Educativo</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Categoría</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Título</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Resumen</label>
                  <textarea
                    value={editForm.summary}
                    onChange={(e) => setEditForm(prev => ({ ...prev, summary: e.target.value }))}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tags (separados por coma)</label>
                  <input
                    type="text"
                    value={editForm.tags}
                    onChange={(e) => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contenido Completo (HTML)</label>
                  <textarea
                    value={editForm.full_content}
                    onChange={(e) => setEditForm(prev => ({ ...prev, full_content: e.target.value }))}
                    rows={10}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editForm.is_active}
                      onChange={(e) => setEditForm(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="mr-2"
                    />
                    Activo
                  </label>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setEditingContent(null)}
                  className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Creación */}
      {creatingContent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Crear Contenido Educativo</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Categoría</label>
                  <select
                    value={createForm.category}
                    onChange={(e) => handleCreateFormChange("category", e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Título</label>
                  <input
                    type="text"
                    value={createForm.title}
                    onChange={(e) => handleCreateFormChange("title", e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Resumen</label>
                  <textarea
                    value={createForm.summary}
                    onChange={(e) => handleCreateFormChange("summary", e.target.value)}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tags (separados por coma)</label>
                  <input
                    type="text"
                    value={createForm.tags.join(", ")}
                    onChange={(e) => handleCreateFormChange("tags", e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contenido Completo (HTML)</label>
                  <textarea
                    value={createForm.full_content}
                    onChange={(e) => handleCreateFormChange("full_content", e.target.value)}
                    rows={10}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={createForm.is_active}
                      onChange={(e) => handleCreateFormChange("is_active", e.target.checked)}
                      className="mr-2"
                    />
                    Activo
                  </label>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setCreatingContent(false)}
                  className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreate}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Crear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationManagement;