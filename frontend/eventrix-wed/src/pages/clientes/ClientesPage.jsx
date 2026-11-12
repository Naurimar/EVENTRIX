import { useEffect, useMemo, useState } from 'react'
import {
  Users, Plus, Search, Pencil, Trash2, Eye,
  X, Save, ChevronLeft, ChevronRight,
  MapPin, RefreshCw, AlertTriangle
} from 'lucide-react'
import { clientesApi, ubicacionesApi } from '../../services/api'
import './ClientesPage.css'

const formularioInicial = {
  documento: '',
  nombre: '',
  telefono: '',
  correo: '',
  idDepartamento: '',
  idCiudad: ''
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [pagina, setPagina] = useState(1)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [modal, setModal] = useState('')
  const [seleccionado, setSeleccionado] = useState(null)
  const [formulario, setFormulario] = useState(formularioInicial)
  const [departamentos, setDepartamentos] = useState([])
  const [catalogoCiudades, setCatalogoCiudades] = useState([])
  const [cargandoUbicaciones, setCargandoUbicaciones] = useState(true)
  const [errorUbicaciones, setErrorUbicaciones] = useState('')

  async function cargarUbicaciones() {
    setCargandoUbicaciones(true)
    setErrorUbicaciones('')

    try {
      // La API devuelve los nombres y sus IDs de MySQL.
      const [datosDepartamentos, datosCiudades] = await Promise.all([
        ubicacionesApi.listarDepartamentos(),
        ubicacionesApi.listarCiudades()
      ])

      if (!Array.isArray(datosDepartamentos) || !Array.isArray(datosCiudades)) {
        throw new Error('El catálogo de ubicaciones devolvió datos inesperados.')
      }

      setDepartamentos(datosDepartamentos)
      setCatalogoCiudades(datosCiudades)
    } catch (err) {
      setErrorUbicaciones(
        err.message || 'No fue posible consultar departamentos y ciudades.'
      )
    } finally {
      setCargandoUbicaciones(false)
    }
  }

  async function cargarClientes() {
    setCargando(true)

    try {
      const datos = await clientesApi.listar()
      setClientes(Array.isArray(datos) ? datos : [])
      setError('')
    } catch (err) {
      setError(err.message || 'Error al consultar clientes.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    let activo = true

    clientesApi.listar()
      .then(datos => {
        if (activo) {
          setClientes(Array.isArray(datos) ? datos : [])
        }
      })
      .catch(err => {
        if (activo) setError(err.message)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [])

  useEffect(() => {
    cargarUbicaciones()
  }, [])

  // Se usan cadenas para comparar los IDs recibidos de MySQL y React.
  const ciudadesPorId = useMemo(
    () => new Map(catalogoCiudades.map(item => [String(item.idCiudad), item])),
    [catalogoCiudades]
  )

  const departamentosPorId = useMemo(
    () => new Map(departamentos.map(item => [String(item.idDepartamento), item])),
    [departamentos]
  )

  function nombreCiudad(id) {
    if (id == null || id === '') return '—'
    const registro = ciudadesPorId.get(String(id))
    return registro?.nombreCiudad || `Ciudad no encontrada (ID ${id})`
  }

  function nombreDepartamento(id) {
    if (id == null || id === '') return '—'
    return departamentosPorId.get(String(id))?.nombreDepartamento || 'No disponible'
  }

  // El departamento es visual; el CRUD de Clientes sigue guardando idCiudad.
  const departamentoSeleccionado = formulario.idDepartamento || String(
    ciudadesPorId.get(String(formulario.idCiudad))?.idDepartamento ?? ''
  )

  const ciudadesDelDepartamento = catalogoCiudades.filter(
    item => String(item.idDepartamento) === departamentoSeleccionado
  )

  const clientesFiltrados = clientes.filter(cliente => {
    const texto = [
      cliente.nombre,
      cliente.documento,
      cliente.correo,
      cliente.telefono,
      nombreCiudad(cliente.idCiudad)
    ].join(' ').toLowerCase()

    return (
      texto.includes(busqueda.toLowerCase()) &&
      (!ciudad || String(cliente.idCiudad) === ciudad)
    )
  })

  // El filtro solo muestra ciudades que tienen clientes registrados.
  const ciudadesConClientes = [
    ...new Set(
      clientes
        .map(cliente => cliente.idCiudad)
        .filter(id => id != null)
        .map(String)
    )
  ].sort((a, b) => nombreCiudad(a).localeCompare(nombreCiudad(b), 'es'))

  const porPagina = 5
  const totalPaginas = Math.max(
    1,
    Math.ceil(clientesFiltrados.length / porPagina)
  )
  const paginaActual = Math.min(pagina, totalPaginas)
  const clientesVisibles = clientesFiltrados.slice(
    (paginaActual - 1) * porPagina,
    paginaActual * porPagina
  )

  function abrirNuevo() {
    setFormulario({ ...formularioInicial })
    setSeleccionado(null)
    setError('')
    setModal('nuevo')
  }

  function abrirEditar(cliente) {
    setSeleccionado(cliente)
    setFormulario({
      documento: cliente.documento || '',
      nombre: cliente.nombre || '',
      telefono: cliente.telefono || '',
      correo: cliente.correo || '',
      // Si el catálogo todavía está cargando, el departamento se
      // deducirá de la ciudad cuando la respuesta esté disponible.
      idDepartamento: String(
        ciudadesPorId.get(String(cliente.idCiudad))?.idDepartamento ?? ''
      ),
      idCiudad: String(cliente.idCiudad ?? '')
    })
    setError('')
    setModal('editar')
  }

  function abrirDetalle(cliente) {
    setSeleccionado(cliente)
    setModal('detalle')
  }

  function abrirEliminar(cliente) {
    setSeleccionado(cliente)
    setError('')
    setModal('eliminar')
  }

  function cerrarModal() {
    if (guardando) return
    setModal('')
    setSeleccionado(null)
    setError('')
  }

  function cambiarCampo(campo, valor) {
    setFormulario(actual => ({
      ...actual,
      [campo]: valor
    }))
  }

  async function guardarCliente(evento) {
    evento.preventDefault()
    setError('')
    setMensaje('')

    const ciudadSeleccionada = ciudadesPorId.get(String(formulario.idCiudad))
    if (
      !ciudadSeleccionada ||
      String(ciudadSeleccionada.idDepartamento) !== departamentoSeleccionado
    ) {
      setError('Selecciona un departamento y una ciudad válidos.')
      return
    }

    setGuardando(true)

    const datos = {
      documento: formulario.documento.trim(),
      nombre: formulario.nombre.trim(),
      telefono: formulario.telefono.trim(),
      correo: formulario.correo.trim(),
      idCiudad: Number(formulario.idCiudad)
    }

    try {
      if (modal === 'editar') {
        await clientesApi.actualizar(
          seleccionado.idCliente,
          datos
        )
        setMensaje('Cliente actualizado correctamente.')
      } else {
        await clientesApi.crear(datos)
        setMensaje('Cliente registrado correctamente.')
      }

      setModal('')
      setSeleccionado(null)
      await cargarClientes()
    } catch (err) {
      setError(err.message || 'No fue posible guardar.')
    } finally {
      setGuardando(false)
    }
  }

  async function eliminarCliente() {
    if (!seleccionado) return

    setGuardando(true)
    setError('')

    try {
      await clientesApi.eliminar(seleccionado.idCliente)
      setModal('')
      setSeleccionado(null)
      setMensaje('Cliente eliminado correctamente.')
      await cargarClientes()
    } catch (err) {
      setError(err.message || 'No fue posible eliminar.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="clientes-page">

      <div className="clientes-encabezado">
        <div className="clientes-titulo">
          <div className="clientes-icono-principal">
            <Users size={28} />
          </div>
          <div>
            <h1>Gestión de clientes</h1>
            <p>
              Administra la información de los clientes
              y sus eventos.
            </p>
          </div>
        </div>

        <button
          className="clientes-nuevo"
          type="button"
          onClick={abrirNuevo}
        >
          <Plus size={19} /> Nuevo cliente
        </button>
      </div>

      {mensaje && (
        <div className="clientes-exito" role="status">
          {mensaje}
          <button
            type="button"
            onClick={() => setMensaje('')}
            aria-label="Cerrar mensaje"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {error && !modal && (
        <p className="clientes-error" role="alert">
          {error}
        </p>
      )}

      {errorUbicaciones && (
        <p className="clientes-error" role="alert">
          No se pudieron cargar las ubicaciones: {errorUbicaciones}{' '}
          <button type="button" onClick={cargarUbicaciones}>
            Reintentar
          </button>
        </p>
      )}

      <div className="clientes-filtros">
        <label className="clientes-busqueda">
          <Search size={19} />
          <input
            type="search"
            placeholder="Buscar cliente..."
            value={busqueda}
            onChange={e => {
              setBusqueda(e.target.value)
              setPagina(1)
            }}
          />
        </label>

        <label className="clientes-select-contenedor">
          <MapPin size={18} />
          <select
            value={ciudad}
            aria-label="Filtrar por ciudad"
            onChange={e => {
              setCiudad(e.target.value)
              setPagina(1)
            }}
          >
            <option value="">Todas las ciudades</option>
            {ciudadesConClientes.map(id => {
              const registro = ciudadesPorId.get(id)
              const departamento = registro
                ? nombreDepartamento(registro.idDepartamento)
                : ''

              return (
                <option key={id} value={id}>
                  {nombreCiudad(id)}
                  {registro && departamento !== 'No disponible'
                    ? ` — ${departamento}`
                    : ''}
                </option>
              )
            })}
          </select>
        </label>

        <button
          className="clientes-actualizar"
          type="button"
          onClick={() => {
            cargarClientes()
            cargarUbicaciones()
          }}
          disabled={cargando || cargandoUbicaciones}
        >
          <RefreshCw size={18} />
          Actualizar
        </button>
      </div>

      <div className="clientes-tabla-tarjeta">
        <div className="clientes-tabla-contenedor">
          <table className="clientes-tabla">
            <thead>
              <tr>
                <th>Documento</th>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Correo electrónico</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan={5} className="clientes-vacio">
                    Cargando clientes...
                  </td>
                </tr>
              ) : clientesVisibles.length ? (
                clientesVisibles.map(cliente => (
                  <tr key={cliente.idCliente}>
                    <td>{cliente.documento}</td>
                    <td>
                      <span className="clientes-nombre">
                        {cliente.nombre}
                      </span>
                      <div className="clientes-ciudad-texto">
                        <MapPin size={13} aria-hidden="true" />
                        <span>{nombreCiudad(cliente.idCiudad)}</span>
                      </div>
                    </td>
                    <td>{cliente.telefono || '—'}</td>
                    <td>{cliente.correo || '—'}</td>
                    <td>
                      <div className="clientes-acciones">
                        <button
                          type="button"
                          className="accion-ver"
                          title="Ver"
                          onClick={() => abrirDetalle(cliente)}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          type="button"
                          className="accion-editar"
                          title="Editar"
                          onClick={() => abrirEditar(cliente)}
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          type="button"
                          className="accion-eliminar"
                          title="Eliminar"
                          onClick={() => abrirEliminar(cliente)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="clientes-vacio">
                    No se encontraron clientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="clientes-paginacion">
          <span>
            {clientesFiltrados.length} cliente(s) encontrados
          </span>

          <div className="clientes-paginas">
            <button
              type="button"
              disabled={paginaActual === 1}
              onClick={() => setPagina(paginaActual - 1)}
              aria-label="Anterior"
            >
              <ChevronLeft size={17} />
            </button>

            <button className="activo" type="button">
              {paginaActual} / {totalPaginas}
            </button>

            <button
              type="button"
              disabled={paginaActual === totalPaginas}
              onClick={() => setPagina(paginaActual + 1)}
              aria-label="Siguiente"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>

      {modal && (
        <div className="clientes-modal-fondo">
          <div
            className="clientes-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Gestión de cliente"
          >
            <div className="clientes-modal-cabecera">
              <h2>
                {modal === 'nuevo' && 'Nuevo cliente'}
                {modal === 'editar' && 'Editar cliente'}
                {modal === 'detalle' && 'Detalle del cliente'}
                {modal === 'eliminar' && 'Eliminar cliente'}
              </h2>

              <button
                type="button"
                onClick={cerrarModal}
                disabled={guardando}
                aria-label="Cerrar"
              >
                <X size={22} />
              </button>
            </div>

            {error && (
              <p className="clientes-error" role="alert">
                {error}
              </p>
            )}

            {errorUbicaciones && (modal === 'nuevo' || modal === 'editar') && (
              <p className="clientes-error" role="alert">
                No se pudo cargar el catálogo: {errorUbicaciones}{' '}
                <button type="button" onClick={cargarUbicaciones}>
                  Reintentar
                </button>
              </p>
            )}

            {(modal === 'nuevo' || modal === 'editar') && (
              <form
                className="clientes-formulario"
                onSubmit={guardarCliente}
              >
                <div className="clientes-campos">
                  <label>
                    Documento *
                    <input
                      required
                      value={formulario.documento}
                      onChange={e =>
                        cambiarCampo('documento', e.target.value)
                      }
                    />
                  </label>

                  <label>
                    Nombre completo *
                    <input
                      required
                      value={formulario.nombre}
                      onChange={e =>
                        cambiarCampo('nombre', e.target.value)
                      }
                    />
                  </label>

                  <label>
                    Teléfono
                    <input
                      type="tel"
                      value={formulario.telefono}
                      onChange={e =>
                        cambiarCampo('telefono', e.target.value)
                      }
                    />
                  </label>

                  <label>
                    Correo electrónico
                    <input
                      type="email"
                      value={formulario.correo}
                      onChange={e =>
                        cambiarCampo('correo', e.target.value)
                      }
                    />
                  </label>

                  <label>
                    Departamento *
                    <select
                      required
                      value={departamentoSeleccionado}
                      disabled={cargandoUbicaciones || !departamentos.length}
                      onChange={e => setFormulario(actual => ({
                        ...actual,
                        idDepartamento: e.target.value,
                        idCiudad: ''
                      }))}
                    >
                      <option value="">
                        {cargandoUbicaciones
                          ? 'Cargando departamentos...'
                          : 'Selecciona un departamento'}
                      </option>
                      {departamentos.map(departamento => (
                        <option
                          key={departamento.idDepartamento}
                          value={String(departamento.idDepartamento)}
                        >
                          {departamento.nombreDepartamento}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Ciudad *
                    <select
                      required
                      value={formulario.idCiudad}
                      disabled={cargandoUbicaciones || !departamentoSeleccionado}
                      onChange={e => cambiarCampo('idCiudad', e.target.value)}
                    >
                      <option value="">
                        {!departamentoSeleccionado
                          ? 'Selecciona primero un departamento'
                          : 'Selecciona una ciudad'}
                      </option>
                      {ciudadesDelDepartamento.map(item => (
                        <option key={item.idCiudad} value={String(item.idCiudad)}>
                          {item.nombreCiudad}
                        </option>
                      ))}
                    </select>
                    {departamentoSeleccionado && !ciudadesDelDepartamento.length &&
                      !cargandoUbicaciones && (
                        <small>No hay ciudades registradas para este departamento.</small>
                      )}
                    {modal === 'editar' && formulario.idCiudad &&
                      !ciudadesPorId.has(String(formulario.idCiudad)) &&
                      !cargandoUbicaciones && (
                        <small>
                          La ciudad guardada no está en el catálogo actual.
                          Verifica los datos antes de guardar.
                        </small>
                      )}
                  </label>
                </div>

                <div className="clientes-modal-botones">
                  <button
                    type="button"
                    className="clientes-cancelar"
                    onClick={cerrarModal}
                    disabled={guardando}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="clientes-guardar"
                    disabled={guardando || cargandoUbicaciones || !catalogoCiudades.length}
                  >
                    <Save size={17} />
                    {guardando ? 'Guardando...' : 'Guardar cliente'}
                  </button>
                </div>
              </form>
            )}

            {modal === 'detalle' && seleccionado && (
              <div className="clientes-detalle">
                <p>
                  <strong>Documento:</strong>
                  {seleccionado.documento}
                </p>
                <p>
                  <strong>Nombre:</strong>
                  {seleccionado.nombre}
                </p>
                <p>
                  <strong>Teléfono:</strong>
                  {seleccionado.telefono || '—'}
                </p>
                <p>
                  <strong>Correo:</strong>
                  {seleccionado.correo || '—'}
                </p>
                <p>
                  <strong>Departamento:</strong>
                  {nombreDepartamento(
                    ciudadesPorId.get(String(seleccionado.idCiudad))?.idDepartamento
                  )}
                </p>
                <p>
                  <strong>Ciudad:</strong>
                  {nombreCiudad(seleccionado.idCiudad)}
                </p>

                <div className="clientes-modal-botones">
                  <button
                    type="button"
                    className="clientes-cancelar"
                    onClick={cerrarModal}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}

            {modal === 'eliminar' && seleccionado && (
              <div className="clientes-confirmacion">
                <AlertTriangle size={38} />

                <p>
                  ¿Deseas eliminar a
                  <strong> {seleccionado.nombre}</strong>?
                </p>

                <small>
                  Esta acción podría estar restringida
                  si el cliente tiene eventos asociados.
                </small>

                <div className="clientes-modal-botones">
                  <button
                    type="button"
                    className="clientes-cancelar"
                    onClick={cerrarModal}
                    disabled={guardando}
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    className="clientes-eliminar-confirmar"
                    onClick={eliminarCliente}
                    disabled={guardando}
                  >
                    <Trash2 size={17} />
                    {guardando ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
