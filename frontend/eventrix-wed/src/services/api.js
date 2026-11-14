
const API_BASE = 'http://localhost:8080/api/v1'

// ==========================================
// FUNCIÓN GENERAL PARA PETICIONES HTTP
// ==========================================

export async function apiRequest(ruta, opciones = {}) {
  const token = sessionStorage.getItem('eventrix_token')

  const headers = {
    'Content-Type': 'application/json',
    ...opciones.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const respuesta = await fetch(`${API_BASE}${ruta}`, {
    ...opciones,
    headers,
  })

  if (respuesta.status === 401) {
    throw new Error('Tu sesión expiró. Inicia sesión nuevamente.')
  }

  if (respuesta.status === 204) {
    return null
  }

  const texto = await respuesta.text()
  const datos = texto ? JSON.parse(texto) : null

  if (!respuesta.ok) {
    throw new Error(
      datos?.message ||
      datos?.error ||
      `Error del servidor (${respuesta.status})`
    )
  }

  return datos
}

// ==========================================
// MÓDULO DE CLIENTES
// ==========================================

export const clientesApi = {
  listar: () => apiRequest('/clientes'),

  buscar: (id) => apiRequest(`/clientes/${id}`),

  crear: (datos) =>
    apiRequest('/clientes', {
      method: 'POST',
      body: JSON.stringify(datos),
    }),

  actualizar: (id, datos) =>
    apiRequest(`/clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(datos),
    }),

  eliminar: (id) =>
    apiRequest(`/clientes/${id}`, {
      method: 'DELETE',
    }),
}

// ==========================================
// MÓDULO DE EVENTOS
// ==========================================

export const eventosApi = {
  listar: () => apiRequest('/eventos'),

  buscar: (id) => apiRequest(`/eventos/${id}`),

  crear: (datos) =>
    apiRequest('/eventos', {
      method: 'POST',
      body: JSON.stringify(datos),
    }),

  actualizar: (id, datos) =>
    apiRequest(`/eventos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(datos),
    }),

  eliminar: (id) =>
    apiRequest(`/eventos/${id}`, {
      method: 'DELETE',
    }),
}

// ==========================================
// MÓDULO DE ESPACIOS
// ==========================================

export const espaciosApi = {
  listar: () => apiRequest('/espacios'),

  buscar: (id) => apiRequest(`/espacios/${id}`),

  crear: (datos) =>
    apiRequest('/espacios', {
      method: 'POST',
      body: JSON.stringify(datos),
    }),

  actualizar: (id, datos) =>
    apiRequest(`/espacios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(datos),
    }),

  eliminar: (id) =>
    apiRequest(`/espacios/${id}`, {
      method: 'DELETE',
    }),
}

// ==========================================
// MÓDULO DE UBICACIONES
// DEPARTAMENTOS Y CIUDADES
// ==========================================

export const ubicacionesApi = {

  // Consultar todos los departamentos
  listarDepartamentos: () =>
    apiRequest('/ubicaciones/departamentos'),

  // Consultar todas las ciudades o filtrarlas
  // por el ID del departamento seleccionado
  listarCiudades: (idDepartamento = null) => {
    const filtro =
      idDepartamento !== null &&
      idDepartamento !== undefined &&
      idDepartamento !== ''

    const ruta = filtro
      ? `/ubicaciones/ciudades?idDepartamento=${encodeURIComponent(idDepartamento)}`
      : '/ubicaciones/ciudades'

    return apiRequest(ruta)
  },
}
