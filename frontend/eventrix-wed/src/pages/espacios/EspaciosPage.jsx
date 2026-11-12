import { useEffect, useMemo, useState } from 'react'
import {
  Layers3, Plus, Search, Eye, Pencil, Trash2, X, Save,
  ChevronLeft, ChevronRight, RefreshCw, AlertTriangle, MapPin
} from 'lucide-react'
import { espaciosApi, ubicacionesApi } from '../../services/api'
import './EspaciosPage.css'

const POR_PAGINA = 6
const nuevoFormulario = () => ({
  nombre: '', tipo: '', capacidad: '', ubicacion: '',
  tarifa: '', disponible: true, idDepartamento: '', idCiudad: ''
})

function dinero(valor) {
  if (valor == null || valor === '') return '—'
  const numero = Number(valor)
  return Number.isFinite(numero)
    ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(numero)
    : String(valor)
}

export default function EspaciosPage() {
  const [espacios, setEspacios] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [tipo, setTipo] = useState('')
  const [disponibilidad, setDisponibilidad] = useState('')
  const [pagina, setPagina] = useState(1)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [errorModal, setErrorModal] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [modal, setModal] = useState('')
  const [seleccionado, setSeleccionado] = useState(null)
  const [formulario, setFormulario] = useState(nuevoFormulario)
  const [departamentos, setDepartamentos] = useState([])
  const [catalogoCiudades, setCatalogoCiudades] = useState([])
  const [cargandoUbicaciones, setCargandoUbicaciones] = useState(true)
  const [errorUbicaciones, setErrorUbicaciones] = useState('')

  async function cargarUbicaciones() {
    setCargandoUbicaciones(true)
    setErrorUbicaciones('')
    try {
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
      setErrorUbicaciones(err.message || 'No fue posible consultar departamentos y ciudades.')
    } finally {
      setCargandoUbicaciones(false)
    }
  }

  async function cargarEspacios() {
    setCargando(true)
    setError('')
    try {
      const datos = await espaciosApi.listar()
      setEspacios(Array.isArray(datos) ? datos : [])
    } catch (err) {
      setError(err.message || 'No fue posible consultar los espacios.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    let activo = true
    espaciosApi.listar()
      .then(datos => { if (activo) setEspacios(Array.isArray(datos) ? datos : []) })
      .catch(err => { if (activo) setError(err.message || 'No se pudieron cargar los espacios.') })
      .finally(() => { if (activo) setCargando(false) })
    return () => { activo = false }
  }, [])

  useEffect(() => {
    cargarUbicaciones()
  }, [])

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
    return ciudadesPorId.get(String(id))?.nombreCiudad || `Ciudad no encontrada (ID ${id})`
  }

  function nombreDepartamento(id) {
    if (id == null || id === '') return '—'
    return departamentosPorId.get(String(id))?.nombreDepartamento || 'No disponible'
  }

  // El departamento solo se usa para seleccionar; el backend guarda idCiudad.
  // Al editar, se deduce del catálogo para conservar la ubicación actual.
  const departamentoSeleccionado = formulario.idDepartamento || String(
    ciudadesPorId.get(String(formulario.idCiudad))?.idDepartamento ?? ''
  )
  const ciudadesDelDepartamento = catalogoCiudades.filter(
    item => String(item.idDepartamento) === departamentoSeleccionado
  ).sort((a, b) => a.nombreCiudad.localeCompare(b.nombreCiudad, 'es'))

  const tipos = useMemo(() =>
    [...new Set(espacios.map(e => e.tipo).filter(Boolean))].sort(), [espacios]
  )

  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim()
    return espacios.filter(espacio => {
      const registroCiudad = ciudadesPorId.get(String(espacio.idCiudad))
      const nombreDepartamentoActual = registroCiudad
        ? departamentosPorId.get(String(registroCiudad.idDepartamento))?.nombreDepartamento
        : ''
      const contenido = [
        espacio.nombre, espacio.tipo, espacio.ubicacion,
        espacio.idCiudad, registroCiudad?.nombreCiudad, nombreDepartamentoActual
      ].join(' ').toLowerCase()
      return contenido.includes(q)
        && (!tipo || espacio.tipo === tipo)
        && (disponibilidad === '' || String(espacio.disponible) === disponibilidad)
    })
  }, [espacios, busqueda, tipo, disponibilidad, ciudadesPorId, departamentosPorId])

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA))
  const paginaActual = Math.min(pagina, totalPaginas)
  const visibles = filtrados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA)

  function abrirNuevo() {
    setFormulario(nuevoFormulario())
    setSeleccionado(null)
    setErrorModal('')
    setModal('nuevo')
  }

  function abrirEditar(espacio) {
    setSeleccionado(espacio)
    setFormulario({
      nombre: espacio.nombre ?? '',
      tipo: espacio.tipo ?? '',
      capacidad: espacio.capacidad ?? '',
      ubicacion: espacio.ubicacion ?? '',
      tarifa: espacio.tarifa ?? '',
      disponible: espacio.disponible === true,
      idDepartamento: String(
        ciudadesPorId.get(String(espacio.idCiudad))?.idDepartamento ?? ''
      ),
      idCiudad: String(espacio.idCiudad ?? '')
    })
    setErrorModal('')
    setModal('editar')
  }

  function abrirModal(tipoModal, espacio) {
    setSeleccionado(espacio)
    setErrorModal('')
    setModal(tipoModal)
  }

  function cerrarModal() {
    if (guardando) return
    setModal('')
    setSeleccionado(null)
    setErrorModal('')
  }

  function cambiar(campo, valor) {
    setFormulario(actual => ({ ...actual, [campo]: valor }))
  }

  function cambiarDepartamento(idDepartamento) {
    // No dejar seleccionada una ciudad del departamento anterior.
    setFormulario(actual => ({
      ...actual,
      idDepartamento,
      idCiudad: ''
    }))
  }

  async function guardar(evento) {
    evento.preventDefault()
    setErrorModal('')
    setMensaje('')

    const ciudadSeleccionada = ciudadesPorId.get(String(formulario.idCiudad))
    if (
      !ciudadSeleccionada ||
      String(ciudadSeleccionada.idDepartamento) !== departamentoSeleccionado
    ) {
      setErrorModal('Selecciona un departamento y una ciudad válidos.')
      return
    }

    setGuardando(true)
    const datos = {
      nombre: formulario.nombre.trim(),
      tipo: formulario.tipo.trim(),
      capacidad: Number(formulario.capacidad),
      ubicacion: formulario.ubicacion.trim(),
      tarifa: formulario.tarifa === '' ? null : Number(formulario.tarifa),
      disponible: formulario.disponible,
      idCiudad: Number(formulario.idCiudad)
    }

    try {
      if (modal === 'editar') {
        await espaciosApi.actualizar(seleccionado.idEspacio, datos)
        setMensaje('Espacio actualizado correctamente.')
      } else {
        await espaciosApi.crear(datos)
        setMensaje('Espacio registrado correctamente.')
      }
      setModal('')
      setSeleccionado(null)
      await cargarEspacios()
    } catch (err) {
      setErrorModal(err.message || 'No fue posible guardar el espacio.')
    } finally {
      setGuardando(false)
    }
  }

  async function eliminar() {
    if (!seleccionado) return
    setGuardando(true)
    setErrorModal('')
    setMensaje('')
    try {
      await espaciosApi.eliminar(seleccionado.idEspacio)
      setModal('')
      setSeleccionado(null)
      setMensaje('Espacio eliminado correctamente.')
      await cargarEspacios()
    } catch (err) {
      setErrorModal(err.message || 'No fue posible eliminar el espacio.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="espacios-page">
      <div className="espacios-cabecera">
        <div className="espacios-titulo">
          <Layers3 size={33} />
          <div>
            <h1>Gestión de espacios</h1>
            <p>Administra los espacios disponibles para tus eventos.</p>
          </div>
        </div>
        <button type="button" className="espacios-nuevo" onClick={abrirNuevo}>
          <Plus size={18} /> Nuevo espacio
        </button>
      </div>

      {mensaje && <div className="espacios-exito" role="status">{mensaje}<button type="button" onClick={() => setMensaje('')} aria-label="Cerrar mensaje"><X size={16} /></button></div>}
      {error && <p className="espacios-error" role="alert">{error}</p>}
      {errorUbicaciones && !modal && (
        <p className="espacios-error" role="alert">
          No se pudieron cargar las ubicaciones: {errorUbicaciones}{' '}
          <button type="button" onClick={cargarUbicaciones}>Reintentar</button>
        </p>
      )}

      <div className="espacios-filtros">
        <label className="espacios-busqueda">
          <Search size={19} />
          <input type="search" placeholder="Buscar espacio..." value={busqueda} onChange={e => { setBusqueda(e.target.value); setPagina(1) }} />
        </label>
        <select aria-label="Tipo de espacio" value={tipo} onChange={e => { setTipo(e.target.value); setPagina(1) }}>
          <option value="">Todos los tipos</option>
          {tipos.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select aria-label="Disponibilidad" value={disponibilidad} onChange={e => { setDisponibilidad(e.target.value); setPagina(1) }}>
          <option value="">Disponibilidad</option>
          <option value="true">Disponible</option>
          <option value="false">No disponible</option>
        </select>
        <button type="button" className="espacios-refrescar" title="Actualizar" aria-label="Actualizar espacios" onClick={() => { cargarEspacios(); cargarUbicaciones() }} disabled={cargando || cargandoUbicaciones}><RefreshCw size={19}/></button>
      </div>

      <div className="espacios-tabla-tarjeta">
        <div className="espacios-tabla-scroll">
          <table className="espacios-tabla">
            <thead><tr><th>#</th><th>Espacio</th><th>Tipo</th><th>Capacidad</th><th>Ubicación</th><th>Tarifa</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>
              {cargando ? <tr><td colSpan={8} className="espacios-vacio">Cargando espacios...</td></tr>
                : visibles.length ? visibles.map(espacio => (
                  <tr key={espacio.idEspacio}>
                    <td>ES-{String(espacio.idEspacio).padStart(3, '0')}</td>
                    <td className="espacios-nombre">{espacio.nombre}</td>
                    <td>{espacio.tipo}</td>
                    <td>{espacio.capacidad ?? '—'}</td>
                    <td>
                      <div>{espacio.ubicacion || '—'}</div>
                      <small style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4, color: '#756783' }}>
                        <MapPin size={13} aria-hidden="true" />
                        {nombreCiudad(espacio.idCiudad)}
                      </small>
                    </td>
                    <td>{dinero(espacio.tarifa)}</td>
                    <td><span className={`espacio-estado ${espacio.disponible ? 'disponible' : 'ocupado'}`}>{espacio.disponible ? 'Disponible' : 'No disponible'}</span></td>
                    <td><div className="espacios-acciones">
                      <button type="button" title="Consultar" aria-label={`Ver ${espacio.nombre}`} onClick={() => abrirModal('detalle', espacio)}><Eye size={17}/></button>
                      <button type="button" title="Editar" aria-label={`Editar ${espacio.nombre}`} onClick={() => abrirEditar(espacio)}><Pencil size={17}/></button>
                      <button type="button" title="Eliminar" aria-label={`Eliminar ${espacio.nombre}`} onClick={() => abrirModal('eliminar', espacio)}><Trash2 size={17}/></button>
                    </div></td>
                  </tr>
                )) : <tr><td colSpan={8} className="espacios-vacio">No se encontraron espacios.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="espacios-paginacion">
          <span>{filtrados.length ? `Mostrando ${(paginaActual - 1) * POR_PAGINA + 1}–${Math.min(paginaActual * POR_PAGINA, filtrados.length)} de ${filtrados.length}` : 'Mostrando 0 espacios'}</span>
          <div className="espacios-paginas">
            <button type="button" disabled={paginaActual === 1} onClick={() => setPagina(paginaActual - 1)} aria-label="Anterior"><ChevronLeft size={18}/></button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(n => <button type="button" key={n} className={n === paginaActual ? 'activo' : ''} onClick={() => setPagina(n)}>{n}</button>)}
            <button type="button" disabled={paginaActual === totalPaginas} onClick={() => setPagina(paginaActual + 1)} aria-label="Siguiente"><ChevronRight size={18}/></button>
          </div>
        </div>
      </div>

      {modal && <div className="espacios-modal-fondo" onMouseDown={e => { if (e.target === e.currentTarget) cerrarModal() }}>
        <div className="espacios-modal" role="dialog" aria-modal="true" aria-label="Gestión de espacio">
          <div className="espacios-modal-cabecera">
            <h2>{modal === 'nuevo' ? 'Nuevo espacio' : modal === 'editar' ? 'Editar espacio' : modal === 'detalle' ? 'Detalles del espacio' : 'Eliminar espacio'}</h2>
            <button type="button" aria-label="Cerrar" disabled={guardando} onClick={cerrarModal}><X size={22}/></button>
          </div>
          {errorModal && <p className="espacios-error" role="alert">{errorModal}</p>}
          {errorUbicaciones && (modal === 'nuevo' || modal === 'editar') && (
            <p className="espacios-error" role="alert">
              No se pudo cargar el catálogo: {errorUbicaciones}{' '}
              <button type="button" onClick={cargarUbicaciones}>Reintentar</button>
            </p>
          )}
          {(modal === 'nuevo' || modal === 'editar') && <form onSubmit={guardar}>
            <div className="espacios-campos">
              <label>Nombre del espacio *<input required maxLength={100} value={formulario.nombre} onChange={e => cambiar('nombre', e.target.value)}/></label>
              <label>Tipo de espacio *<input required maxLength={60} placeholder="Ej.: Salón, terraza, jardín" value={formulario.tipo} onChange={e => cambiar('tipo', e.target.value)}/></label>
              <label>Capacidad (personas) *<input required type="number" min="0" step="1" value={formulario.capacidad} onChange={e => cambiar('capacidad', e.target.value)}/></label>
              <label>Ubicación<input maxLength={100} value={formulario.ubicacion} onChange={e => cambiar('ubicacion', e.target.value)}/></label>
              <label>Tarifa (COP)<input type="number" min="0" step="0.01" value={formulario.tarifa} onChange={e => cambiar('tarifa', e.target.value)}/></label>
              <label>
                Departamento *
                <select
                  required
                  value={departamentoSeleccionado}
                  disabled={cargandoUbicaciones || !!errorUbicaciones}
                  onChange={e => cambiarDepartamento(e.target.value)}
                >
                  <option value="">Selecciona un departamento</option>
                  {[...departamentos]
                    .sort((a, b) => a.nombreDepartamento.localeCompare(b.nombreDepartamento, 'es'))
                    .map(departamento => (
                      <option key={departamento.idDepartamento} value={String(departamento.idDepartamento)}>
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
                  disabled={!departamentoSeleccionado || cargandoUbicaciones || !!errorUbicaciones}
                  onChange={e => cambiar('idCiudad', e.target.value)}
                >
                  <option value="">Selecciona una ciudad</option>
                  {ciudadesDelDepartamento.map(registro => (
                    <option key={registro.idCiudad} value={String(registro.idCiudad)}>
                      {registro.nombreCiudad}
                    </option>
                  ))}
                </select>
                <small>
                  {cargandoUbicaciones
                    ? 'Cargando ciudades...'
                    : !departamentoSeleccionado
                      ? 'Primero selecciona un departamento.'
                      : ciudadesDelDepartamento.length === 0
                        ? 'No hay ciudades disponibles para este departamento.'
                        : 'Se guardará automáticamente el ID de la ciudad seleccionada.'}
                </small>
              </label>
              <label>Disponibilidad<select value={String(formulario.disponible)} onChange={e => cambiar('disponible', e.target.value === 'true')}><option value="true">Disponible</option><option value="false">No disponible</option></select></label>
            </div>
            <div className="espacios-modal-botones"><button type="button" className="secundario" onClick={cerrarModal} disabled={guardando}>Cancelar</button><button type="submit" className="primario" disabled={guardando || cargandoUbicaciones || !!errorUbicaciones || !formulario.idCiudad}><Save size={17}/>{guardando ? 'Guardando...' : 'Guardar espacio'}</button></div>
          </form>}
          {modal === 'detalle' && seleccionado && <>
            <div className="espacios-detalle">
              <p><strong>Nombre</strong>{seleccionado.nombre}</p>
              <p><strong>Tipo</strong>{seleccionado.tipo}</p>
              <p><strong>Capacidad</strong>{seleccionado.capacidad} personas</p>
              <p><strong>Ubicación</strong>{seleccionado.ubicacion || '—'}</p>
              <p><strong>Tarifa</strong>{dinero(seleccionado.tarifa)}</p>
              <p><strong>Disponibilidad</strong>{seleccionado.disponible ? 'Disponible' : 'No disponible'}</p>
              <p>
                <strong>Ciudad</strong>
                <span>
                  <MapPin size={15} aria-hidden="true" />
                  {nombreCiudad(seleccionado.idCiudad)}
                  {ciudadesPorId.has(String(seleccionado.idCiudad))
                    ? ` — ${nombreDepartamento(ciudadesPorId.get(String(seleccionado.idCiudad)).idDepartamento)}`
                    : ''}
                </span>
              </p>
            </div>
            <div className="espacios-modal-botones"><button type="button" className="secundario" onClick={cerrarModal}>Cerrar</button></div>
          </>}
          {modal === 'eliminar' && seleccionado && <div className="espacios-confirmacion">
            <AlertTriangle size={40}/>
            <p>¿Seguro que deseas eliminar <strong>{seleccionado.nombre}</strong>?</p>
            <small>Esta acción no se puede deshacer. El backend podría impedirla si existen relaciones con otras entidades.</small>
            <div className="espacios-modal-botones"><button type="button" className="secundario" disabled={guardando} onClick={cerrarModal}>Cancelar</button><button type="button" className="peligro" disabled={guardando} onClick={eliminar}><Trash2 size={17}/>{guardando ? 'Eliminando...' : 'Eliminar'}</button></div>
          </div>}
        </div>
      </div>}
    </div>
  )
}
