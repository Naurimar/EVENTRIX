import { useEffect, useState } from 'react'
import {
  Users, Plus, Search, Pencil, Trash2, Eye,
  X, Save, ChevronLeft, ChevronRight,
  MapPin, RefreshCw, AlertTriangle
} from 'lucide-react'
import { clientesApi, departamentosApi, ciudadesApi } from '../../services/api'
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
  const [municipios, setMunicipios] = useState([])
  const [cargandoCiudades, setCargandoCiudades] = useState(false)

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

    departamentosApi.listar()
      .then(datos => {
        if (activo) {
          setDepartamentos(Array.isArray(datos) ? datos : [])
        }
      })
      .catch(err => {
        if (activo) {
          setError(err.message || 'No fue posible cargar los departamentos.')
        }
      })

    clientesApi.listar()
      .then(datos => {
        if (activo) {
          setClientes(Array.isArray(datos) ? datos : [])
        }
      })
      .catch(err => {
        if (activo) setError(err.message || 'Error al consultar clientes.')
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [])

  const clientesFiltrados = clientes.filter(cliente => {
    const texto = [
      cliente.nombre,
      cliente.documento,
      cliente.correo,
      cliente.telefono
    ].join(' ').toLowerCase()

    return (
      texto.includes(busqueda.toLowerCase()) &&
      (!ciudad || String(cliente.idCiudad) === ciudad)
    )
  })

  const ciudades = [
    ...new Set(
      clientes
        .map(cliente => cliente.idCiudad)
        .filter(id => id != null)
        .map(String)
    )
  ]

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
    setMunicipios([])
    setSeleccionado(null)
    setError('')
    setModal('nuevo')
  }

  async function abrirEditar(cliente) {
    setSeleccionado(cliente)
    setFormulario({
      documento: cliente.documento || '',
      nombre: cliente.nombre || '',
      telefono: cliente.telefono || '',
      correo: cliente.correo || '',
      idDepartamento: '',
      idCiudad: String(cliente.idCiudad ?? '')
    })
    setMunicipios([])
    setError('')
    setModal('editar')
    setCargandoCiudades(true)

    try {
      const ciudadActual = await ciudadesApi.buscar(cliente.idCiudad)
      const departamentoId = String(ciudadActual.idDepartamento)

      setFormulario(actual => ({
        ...actual,
        idDepartamento: departamentoId
      }))

      const datos = await ciudadesApi.listarPorDepartamento(departamentoId)
      setMunicipios(Array.isArray(datos) ? datos : [])
    } catch (err) {
      setError(err.message || 'No fue posible cargar la ubicación del cliente.')
    } finally {
      setCargandoCiudades(false)
    }
  }

  async function cambiarDepartamento(evento) {
    const departamentoId = evento.target.value

    setFormulario(actual => ({
      ...actual,
      idDepartamento: departamentoId,
      idCiudad: ''
    }))

    setMunicipios([])
    setError('')

    if (!departamentoId) return

    setCargandoCiudades(true)

    try {
      const datos = await ciudadesApi.listarPorDepartamento(departamentoId)
      setMunicipios(Array.isArray(datos) ? datos : [])
    } catch (err) {
      setError(err.message || 'No fue posible cargar los municipios.')
    } finally {
      setCargandoCiudades(false)
    }
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

    if (!formulario.idCiudad) {
      setError('Selecciona un departamento y un municipio.')
      return
    }

    setGuardando(true)
    setError('')
    setMensaje('')

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
            {ciudades.map(id => (
              <option key={id} value={id}>
                {id === '1' ? 'Medellín' : `Ciudad ${id}`}
              </option>
            ))}
          </select>
        </label>

        <button
          className="clientes-actualizar"
          type="button"
          onClick={cargarClientes}
          disabled={cargando}
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
                      value={formulario.idDepartamento}
                      onChange={cambiarDepartamento}
                    >
                      <option value="">
                        Selecciona un departamento
                      </option>

                      {departamentos.map(departamento => (
                        <option
                          key={departamento.idDepartamento}
                          value={departamento.idDepartamento}
                        >
                          {departamento.nombreDepartamento}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Municipio / ciudad *
                    <select
                      required
                      disabled={
                        !formulario.idDepartamento || cargandoCiudades
                      }
                      value={formulario.idCiudad}
                      onChange={e =>
                        cambiarCampo('idCiudad', e.target.value)
                      }
                    >
                      <option value="">
                        {cargandoCiudades
                          ? 'Cargando municipios...'
                          : 'Selecciona un municipio'}
                      </option>

                      {municipios.map(municipio => (
                        <option
                          key={municipio.idCiudad}
                          value={municipio.idCiudad}
                        >
                          {municipio.nombreCiudad}
                        </option>
                      ))}
                    </select>
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
                    disabled={guardando}
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
                  <strong>ID de ciudad:</strong>
                  {seleccionado.idCiudad ?? '—'}
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