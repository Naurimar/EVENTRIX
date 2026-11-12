import { useEffect, useMemo, useState } from 'react'
import {
  CalendarDays, Plus, Search, Eye, Pencil, Trash2, X, Save,
  ChevronLeft, ChevronRight, RefreshCw, CheckCircle2, Clock3,
  Hourglass, XCircle, AlertTriangle
} from 'lucide-react'
import { eventosApi, clientesApi } from '../../services/api'
import './EventosPage.css'

const POR_PAGINA = 6
const TIPOS = ['Boda', 'Cumpleaños', 'Quinceañeros']
const ESTADOS = ['Pendiente', 'En preparación', 'Confirmado', 'Cancelado']
const nuevoFormulario = () => ({
  nombre: '', tipo: 'Boda', fecha: '', horaInicio: '',
  presupuesto: '', estado: 'Pendiente', tematica: '',
  numInvitados: '', idUsuario: '', idCliente: ''
})

function nombreEstado(valor) {
  const texto = String(valor ?? '').trim().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/_/g, ' ')
  if (texto === 'confirmado' || texto === 'confirmada') return 'Confirmado'
  if (texto === 'en preparacion' || texto === 'preparacion') return 'En preparación'
  if (texto === 'cancelado' || texto === 'cancelada') return 'Cancelado'
  if (texto === 'pendiente') return 'Pendiente'
  return String(valor || 'Sin estado')
}

function Estado({ valor }) {
  const nombre = nombreEstado(valor)
  const iconos = {
    'Confirmado': CheckCircle2,
    'En preparación': Clock3,
    'Pendiente': Hourglass,
    'Cancelado': XCircle
  }
  const Icono = iconos[nombre] || Clock3
  const clase = {
    'Confirmado': 'confirmado',
    'En preparación': 'preparacion',
    'Pendiente': 'pendiente',
    'Cancelado': 'cancelado'
  }[nombre] || 'otro'
  return <span className={`evento-estado ${clase}`}><Icono size={14} />{nombre}</span>
}

function fechaLegible(fecha) {
  if (!fecha) return '—'
  const [anio, mes, dia] = String(fecha).slice(0, 10).split('-')
  return anio && mes && dia ? `${dia}/${mes}/${anio}` : String(fecha)
}

export default function EventosPage() {
  const [eventos, setEventos] = useState([])
  const [clientes, setClientes] = useState([])
  const [errorClientes, setErrorClientes] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [tipo, setTipo] = useState('')
  const [estado, setEstado] = useState('')
  const [fecha, setFecha] = useState('')
  const [pagina, setPagina] = useState(1)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [errorModal, setErrorModal] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [modal, setModal] = useState('')
  const [seleccionado, setSeleccionado] = useState(null)
  const [formulario, setFormulario] = useState(nuevoFormulario)

  async function cargarEventos() {
    setCargando(true)
    setError('')
    try {
      const datos = await eventosApi.listar()
      setEventos(Array.isArray(datos) ? datos : [])
    } catch (err) {
      setError(err.message || 'No fue posible consultar los eventos.')
    } finally {
      setCargando(false)
    }
  }

  async function cargarClientes() {
    try {
      const datos = await clientesApi.listar()
      setClientes(Array.isArray(datos) ? datos : [])
      setErrorClientes('')
    } catch (err) {
      setErrorClientes(err.message || 'No se pudieron cargar los clientes.')
    }
  }

  useEffect(() => {
    let activo = true
    clientesApi.listar()
      .then(datos => {
        if (activo) {
          setClientes(Array.isArray(datos) ? datos : [])
          setErrorClientes('')
        }
      })
      .catch(err => {
        if (activo) setErrorClientes(err.message || 'No se pudieron cargar los clientes.')
      })
    return () => { activo = false }
  }, [])

  useEffect(() => {
    let activo = true
    eventosApi.listar()
      .then(datos => { if (activo) setEventos(Array.isArray(datos) ? datos :[]) })
      .catch(err => { if (activo) setError(err.message || 'No se pudieron cargar los eventos.') })
      .finally(() => { if (activo) setCargando(false) })
    return () => { activo = false }
  }, [])

  const nombresClientes = useMemo(
    () => new Map(clientes.map(c => [String(c.idCliente), c.nombre])),
    [clientes]
  )

  function nombreCliente(id) {
    if (id === null || id === undefined || id === '') return 'Sin asignar'
    return nombresClientes.get(String(id)) || `Cliente ID ${id}`
  }

  const tiposDisponibles = useMemo(() => {
    return [...new Set([...TIPOS, ...eventos.map(e => e.tipo).filter(Boolean)])]
  }, [eventos])

  const eventosFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim()
    return eventos.filter(e => {
      const contenido = [e.idEvento, e.nombre, e.tipo, e.tematica, e.idCliente, nombreCliente(e.idCliente)]
        .join(' ').toLowerCase()
      return contenido.includes(q)
        && (!tipo || String(e.tipo).toLowerCase() === tipo.toLowerCase())
        && (!estado || nombreEstado(e.estado) === estado)
        && (!fecha || String(e.fecha || '').slice(0, 10) === fecha)
    })
  }, [eventos, busqueda, tipo, estado, fecha, nombresClientes])

  const totalPaginas = Math.max(1, Math.ceil(eventosFiltrados.length / POR_PAGINA))
  const paginaActual = Math.min(pagina, totalPaginas)
  const visibles = eventosFiltrados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA)

  function abrirNuevo() {
    setFormulario(nuevoFormulario())
    setSeleccionado(null)
    setErrorModal('')
    cargarClientes()
    setModal('nuevo')
  }

  function abrirEditar(e) {
    setSeleccionado(e)
    setErrorModal('')
    setFormulario({
      nombre: e.nombre ?? '', tipo: e.tipo ?? 'Boda',
      fecha: String(e.fecha ?? '').slice(0, 10),
      horaInicio: String(e.horaInicio ?? '').slice(0, 5),
      presupuesto: e.presupuesto ?? '',
      estado: nombreEstado(e.estado), tematica: e.tematica ?? '',
      numInvitados: e.numInvitados ?? '',
      idUsuario: e.idUsuario ?? '', idCliente: e.idCliente ?? ''
    })
    cargarClientes()
    setModal('editar')
  }

  function abrirModal(tipoModal, e) {
    setSeleccionado(e)
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
    setFormulario(prev => ({ ...prev, [campo]: valor }))
  }

  async function guardar(e) {
    e.preventDefault()
    setGuardando(true)
    setErrorModal('')
    setMensaje('')
    const datos = {
      nombre: formulario.nombre.trim(),
      tipo: formulario.tipo,
      fecha: formulario.fecha,
      horaInicio: formulario.horaInicio,
      presupuesto: formulario.presupuesto === '' ? null : Number(formulario.presupuesto),
      estado: formulario.estado,
      tematica: formulario.tematica.trim(),
      numInvitados: formulario.numInvitados === '' ? null : Number(formulario.numInvitados),
      idUsuario: Number(formulario.idUsuario),
      idCliente: formulario.idCliente === '' ? null : Number(formulario.idCliente)
    }
    try {
      if (modal === 'editar') {
        await eventosApi.actualizar(seleccionado.idEvento, datos)
        setMensaje('Evento actualizado correctamente.')
      } else {
        await eventosApi.crear(datos)
        setMensaje('Evento registrado correctamente.')
      }
      setModal('')
      setSeleccionado(null)
      await cargarEventos()
    } catch (err) {
      setErrorModal(err.message || 'No fue posible guardar el evento.')
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
      await eventosApi.eliminar(seleccionado.idEvento)
      setModal('')
      setSeleccionado(null)
      setMensaje('Evento eliminado correctamente.')
      await cargarEventos()
    } catch (err) {
      setErrorModal(err.message || 'No fue posible eliminar el evento.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="eventos-page">
      <div className="eventos-cabecera">
        <div className="eventos-titulo">
          <CalendarDays size={33} />
          <div><h1>Gestión de eventos</h1><p>Administra, consulta y controlalos eventos del sistema.</p></div>
        </div>
        <button type="button" className="eventos-nuevo" onClick={abrirNuevo}>
          <Plus size={18} /> Nuevo evento
        </button>
      </div>

      {mensaje && <div className="eventos-exito" role="status">{mensaje}<button type="button" onClick={() => setMensaje('')} aria-label="Cerrar"><X size={16}/></button></div>}
      {error && <p className="eventos-error" role="alert">{error}</p>}
      {errorClientes && <p className="eventos-error" role="alert">No se pudo actualizar la lista de clientes: {errorClientes}</p>}

      <div className="eventos-filtros">
        <label className="eventos-busqueda"><Search size={19}/><input type="search" placeholder="Buscar evento..." value={busqueda} onChange={e => {setBusqueda(e.target.value); setPagina(1)}}/></label>
        <select aria-label="Tipo de evento" value={tipo} onChange={e => {setTipo(e.target.value); setPagina(1)}}>
          <option value="">Tipo de evento</option>
          {tiposDisponibles.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select aria-label="Estado" value={estado} onChange={e => {setEstado(e.target.value); setPagina(1)}}>
          <option value="">Estado</option>
          {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
        <label className="eventos-fecha"><CalendarDays size={18}/><input aria-label="Filtrar por fecha" type="date" value={fecha} onChange={e => {setFecha(e.target.value); setPagina(1)}}/></label>
        <button type="button" className="eventos-refrescar" title="Actualizar" aria-label="Actualizar eventos" onClick={() => { cargarEventos(); cargarClientes() }} disabled={cargando}><RefreshCw size={19}/></button>
      </div>

      <div className="eventos-tabla-tarjeta">
        <div className="eventos-tabla-scroll">
          <table className="eventos-tabla">
            <thead><tr><th>#</th><th>Evento</th><th>Tipo</th><th>Cliente</th><th>Fecha</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>
              {cargando ? <tr><td colSpan={7} className="eventos-vacio">Cargando eventos...</td></tr>
                : visibles.length ? visibles.map(e => (
                  <tr key={e.idEvento}>
                    <td>EV-{String(e.idEvento).padStart(3, '0')}</td>
                    <td className="eventos-nombre">{e.nombre}</td>
                    <td>{e.tipo || '—'}</td>
                    <td>{nombreCliente(e.idCliente)}</td>
                    <td>{fechaLegible(e.fecha)}</td>
                    <td><Estado valor={e.estado}/></td>
                    <td><div className="eventos-acciones">
                      <button type="button" title="Consultar" aria-label={`Ver ${e.nombre}`} onClick={() => abrirModal('detalle', e)}><Eye size={17}/></button>
                      <button type="button" title="Editar" aria-label={`Editar ${e.nombre}`} onClick={() => abrirEditar(e)}><Pencil size={17}/></button>
                      <button type="button" title="Eliminar" aria-label={`Eliminar ${e.nombre}`} onClick={() => abrirModal('eliminar', e)}><Trash2 size={17}/></button>
                    </div></td>
                  </tr>
                )) : <tr><td colSpan={7} className="eventos-vacio">No se encontraron eventos.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="eventos-paginacion">
          <span>{eventosFiltrados.length ? `Mostrando ${(paginaActual - 1) *POR_PAGINA + 1}–${Math.min(paginaActual * POR_PAGINA, eventosFiltrados.length)} de ${eventosFiltrados.length}` : 'Mostrando 0 eventos'}</span>
          <div className="eventos-paginas">
            <button type="button" disabled={paginaActual === 1} onClick={() => setPagina(paginaActual - 1)} aria-label="Anterior"><ChevronLeft size={18}/></button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(n => <button type="button" key={n} className={n === paginaActual ? 'activo' : ''} onClick={() => setPagina(n)}>{n}</button>)}
            <button type="button" disabled={paginaActual === totalPaginas} onClick={() => setPagina(paginaActual + 1)} aria-label="Siguiente"><ChevronRight size={18}/></button>
          </div>
        </div>
      </div>

      {modal && <div className="eventos-modal-fondo" onMouseDown={e => {if (e.target === e.currentTarget) cerrarModal()}}>
        <div className="eventos-modal" role="dialog" aria-modal="true" aria-label="Gestión de evento">
          <div className="eventos-modal-cabecera"><h2>{modal === 'nuevo' ? 'Nuevo evento' : modal === 'editar' ? 'Editar evento' : modal === 'detalle' ? 'Detalles del evento' : 'Eliminar evento'}</h2><button type="button" aria-label="Cerrar" disabled={guardando} onClick={cerrarModal}><X size={22}/></button></div>
          {errorModal && <p className="eventos-error" role="alert">{errorModal}</p>}
          {(modal === 'nuevo' || modal === 'editar') && <form onSubmit={guardar}>
            <div className="eventos-campos">
              <label>Nombre del evento *<input required value={formulario.nombre} onChange={e => cambiar('nombre', e.target.value)}/></label>
              <label>Tipo *<select required value={formulario.tipo} onChange={e => cambiar('tipo', e.target.value)}>{[...new Set([...TIPOS, formulario.tipo])].map(t => <option key={t} value={t}>{t}</option>)}</select></label>
              <label>Fecha *<input required type="date" value={formulario.fecha} onChange={e => cambiar('fecha', e.target.value)}/></label>
              <label>Hora de inicio *<input required type="time" value={formulario.horaInicio} onChange={e => cambiar('horaInicio', e.target.value)}/></label>
              <label>Estado *<select required value={formulario.estado} onChange={e => cambiar('estado', e.target.value)}>{[...new Set([...ESTADOS, formulario.estado])].map(t => <option key={t} value={t}>{t}</option>)}</select></label>
              <label>Número de invitados<input type="number" min="0" value={formulario.numInvitados} onChange={e => cambiar('numInvitados', e.target.value)}/></label>
              <label>Presupuesto<input type="number" min="0" step="0.01" value={formulario.presupuesto} onChange={e => cambiar('presupuesto', e.target.value)}/></label>
              <label>Temática<input value={formulario.tematica} onChange={e => cambiar('tematica', e.target.value)}/></label>
              <label>ID del organizador *<input required type="number" min="1" value={formulario.idUsuario} onChange={e => cambiar('idUsuario', e.target.value)}/><small>Usa el ID de un usuario existente. El organizador de prueba tenía ID 3.</small></label>
                             <label>Cliente (opcional)
                 <select value={formulario.idCliente} onChange={e => cambiar('idCliente', e.target.value)}>
                   <option value="">Sin asignar</option>
                   {formulario.idCliente !== '' && !clientes.some(c => String(c.idCliente) === String(formulario.idCliente)) && (
                     <option value={formulario.idCliente}>Cliente ID {formulario.idCliente} (no disponible en la lista)</option>
                   )}
                   {clientes.map(c => (
                     <option key={c.idCliente} value={String(c.idCliente)}>{c.nombre} — {c.documento}</option>
                   ))}
                 </select>
                 <small>{clientes.length ? 'Selecciona un cliente registrado.' : 'No hay clientes cargados. Registra uno en Gestión de clientes o actualiza la lista.'}</small>
               </label>
            </div>
            <div className="eventos-modal-botones"><button type="button" className="secundario" onClick={cerrarModal} disabled={guardando}>Cancelar</button><button type="submit" className="primario" disabled={guardando}><Save size={17}/>{guardando ? 'Guardando...' : 'Guardar evento'}</button></div>
          </form>}
          {modal === 'detalle' && seleccionado && <><div className="eventos-detalle">
            <p><strong>Nombre:</strong> {seleccionado.nombre}</p><p><strong>Tipo:</strong> {seleccionado.tipo}</p>
            <p><strong>Fecha:</strong> {fechaLegible(seleccionado.fecha)}</p><p><strong>Hora:</strong> {seleccionado.horaInicio || '—'}</p>
            <p><strong>Estado:</strong> <Estado valor={seleccionado.estado}/></p><p><strong>Temática:</strong> {seleccionado.tematica || '—'}</p>
            <p><strong>Invitados:</strong> {seleccionado.numInvitados ?? '—'}</p><p><strong>Presupuesto:</strong> {seleccionado.presupuesto ?? '—'}</p>
            <p><strong>Cliente:</strong> {nombreCliente(seleccionado.idCliente)}</p><p><strong>ID de organizador:</strong> {seleccionado.idUsuario ?? '—'}</p>
          </div><div className="eventos-modal-botones"><button className="secundario" type="button" onClick={cerrarModal}>Cerrar</button></div></>}
          {modal === 'eliminar' && seleccionado && <div className="eventos-confirmacion"><AlertTriangle size={39}/><p>¿Seguro que deseas eliminar <strong>{seleccionado.nombre}</strong>?</p><small>Esta acción no se puede deshacer.</small><div className="eventos-modal-botones"><button type="button" className="secundario" disabled={guardando} onClick={cerrarModal}>Cancelar</button><button type="button" className="peligro" disabled={guardando} onClick={eliminar}><Trash2 size={17}/>{guardando ? 'Eliminando...' : 'Eliminar'}</button></div></div>}
        </div>
      </div>}
    </div>
  )
}
