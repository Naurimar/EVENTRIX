export async function apiFetch(url, options = {}) {
  const token = sessionStorage.getItem('eventrix_token');

  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

const API_BASE = 'http://localhost:8080/api/v1';

async function apiRequest(ruta, opciones = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...opciones.headers,
  };

  const respuesta = await apiFetch(`${API_BASE}${ruta}`, {
    ...opciones,
    headers,
  });

  if (respuesta.status === 401) {
    throw new Error('Tu sesión expiró. Inicia sesión nuevamente.');
  }

  if (respuesta.status === 204) {
    return null;
  }

  const texto = await respuesta.text();
  let datos = null;

  if (texto) {
    try {
      datos = JSON.parse(texto);
    } catch {
      datos = texto;
    }
  }

  if (!respuesta.ok) {
    throw new Error(
      datos?.message ||
      datos?.error ||
      `Error del servidor (${respuesta.status})`
    );
  }

  return datos;
}

function crearApi(recurso) {
  return {
    listar: () => apiRequest(`/${recurso}`),

    buscar: (id) => apiRequest(`/${recurso}/${id}`),

    crear: (datos) =>
      apiRequest(`/${recurso}`, {
        method: 'POST',
        body: JSON.stringify(datos),
      }),

    actualizar: (id, datos) =>
      apiRequest(`/${recurso}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(datos),
      }),

    eliminar: (id) =>
      apiRequest(`/${recurso}/${id}`, {
        method: 'DELETE',
      }),
  };
}

export const eventosApi = crearApi('eventos');
export const clientesApi = crearApi('clientes');
export const espaciosApi = crearApi('espacios');

export const departamentosApi = {
  listar: () => apiRequest('/departamentos'),
};

export const ciudadesApi = {
  listarPorDepartamento: (departamentoId) =>
    apiRequest(`/ciudades?departamentoId=${encodeURIComponent(departamentoId)}`),

  buscar: (id) => apiRequest(`/ciudades/${id}`),
};