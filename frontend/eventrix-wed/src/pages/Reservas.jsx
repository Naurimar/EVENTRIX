
import { useEffect, useState } from 'react';
import {
  CalendarPlus,
  CalendarDays,
  Search,
  Pencil,
  Trash2,
  X,
  Save,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

import './Reservas.css';

const STORAGE_KEY = 'eventrix_reservas';

const formularioInicial = {
  cliente: '',
  nombreEvento: '',
  fecha: '',
  hora: '',
  invitados: '',
  lugar: '',
  presupuesto: '',
  estado: 'Pendiente',
};

function cargarReservas() {
  try {
    const datosGuardados = localStorage.getItem(STORAGE_KEY);
    return datosGuardados ? JSON.parse(datosGuardados) : [];
  } catch {
    return [];
  }
}

function Reservas() {
  const [reservas, setReservas] = useState(cargarReservas);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [confirmacionEliminar, setConfirmacionEliminar] = useState(null);
  const [mensajeGeneral, setMensajeGeneral] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('exito');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservas));
  }, [reservas]);
  // OCULTAR NOTIFICACIONES AUTOMÁTICAMENTE
  useEffect(() => {
    if (!mensajeGeneral) return;

    const temporizador = setTimeout(() => {
      setMensajeGeneral('');
    }, 4000);

    return () => clearTimeout(temporizador);
  }, [mensajeGeneral]);

  const reservasFiltradas = reservas.filter((reserva) => {
    const texto = busqueda.toLowerCase();

    const coincideBusqueda =
      reserva.cliente.toLowerCase().includes(texto) ||
      reserva.nombreEvento.toLowerCase().includes(texto) ||
      reserva.lugar.toLowerCase().includes(texto);

    const coincideEstado =
      filtroEstado === 'Todos' || reserva.estado === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  const actualizarCampo = (evento) => {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  const limpiarFormulario = () => {
    setFormulario(formularioInicial);
    setEditandoId(null);
    setMostrarFormulario(false);
  };

  const guardarReserva = (evento) => {
    evento.preventDefault();

    const nuevaReserva = {
      ...formulario,
      invitados: Number(formulario.invitados),
      presupuesto: Number(formulario.presupuesto),
    };
    if (editandoId !== null) {
      setReservas((anteriores) =>
        anteriores.map((reserva) =>
          reserva.id === editandoId
            ? { ...nuevaReserva, id: editandoId }
            : reserva
        )
      );

      setTipoMensaje('exito');
      setMensajeGeneral('La reserva se actualizó correctamente.');

    } else {
      setReservas((anteriores) => [
        ...anteriores,
        {
          ...nuevaReserva,
          id: Date.now(),
        },
      ]);

      setTipoMensaje('exito');
      setMensajeGeneral('La reserva se registró correctamente.');
    }

    limpiarFormulario();


    limpiarFormulario();
  };

  const editarReserva = (reserva) => {
    setFormulario({
      cliente: reserva.cliente,
      nombreEvento: reserva.nombreEvento,
      fecha: reserva.fecha,
      hora: reserva.hora,
      invitados: String(reserva.invitados),
      lugar: reserva.lugar,
      presupuesto: String(reserva.presupuesto),
      estado: reserva.estado,
    });

    setEditandoId(reserva.id);
    setMostrarFormulario(true);
  };

  // ABRIR VENTANA DE CONFIRMACIÓN
  const eliminarReserva = (id) => {
    setConfirmacionEliminar(id);
  };

  // CONFIRMAR ELIMINACIÓN
  const confirmarEliminacion = () => {
    if (confirmacionEliminar === null) return;

    setReservas((anteriores) =>
      anteriores.filter((reserva) => reserva.id !== confirmacionEliminar)
    );

    setConfirmacionEliminar(null);
    setTipoMensaje('exito');
    setMensajeGeneral('La reserva se eliminó correctamente.');
  };

  const formatoMoneda = (valor) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(valor);

  const formatoFecha = (fecha) => {
    if (!fecha) return 'Sin fecha';

    return new Date(`${fecha}T00:00:00`).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const totalConfirmadas = reservas.filter(
    (reserva) => reserva.estado === 'Confirmada'
  ).length;

  const totalPendientes = reservas.filter(
    (reserva) => reserva.estado === 'Pendiente'
  ).length;

  const totalCanceladas = reservas.filter(
    (reserva) => reserva.estado === 'Cancelada'
  ).length;

  return (
    <section className="reservas-module">

      {/* NOTIFICACIONES EVENTRIX */}
      {mensajeGeneral && (
        <div
          className={`eventrix-toast ${tipoMensaje}`}
          role="status"
        >
          {tipoMensaje === 'exito' ? (
            <CheckCircle2 size={22} />
          ) : (
            <AlertCircle size={22} />
          )}

          <span>{mensajeGeneral}</span>

          <button
            type="button"
            onClick={() => setMensajeGeneral('')}
            aria-label="Cerrar notificación"
          >
            <X size={18} />
          </button>
        </div>
      )}
      <div className="reservas-heading">
        
        <div>
          <h2>Gestión de reservas</h2>
          <p>
            Registra, consulta y administra las reservas de tus eventos.
          </p>
        </div>

        <button
          type="button"
          className="reservas-primary-button"
          onClick={() => {
            setFormulario(formularioInicial);
            setEditandoId(null);
            setMostrarFormulario(true);
          }}
        >
          <CalendarPlus size={18} />
          Nueva reserva
        </button>
      </div>

      <div className="reservas-summary">
        <article className="reservas-summary-card">
          <span>Total de reservas</span>
          <strong>{reservas.length}</strong>
        </article>

        <article className="reservas-summary-card confirmadas">
          <span>Confirmadas</span>
          <strong>{totalConfirmadas}</strong>
        </article>

        <article className="reservas-summary-card pendientes">
          <span>Pendientes</span>
          <strong>{totalPendientes}</strong>
        </article>

        <article className="reservas-summary-card canceladas">
          <span>Canceladas</span>
          <strong>{totalCanceladas}</strong>
        </article>
      </div>

      {mostrarFormulario && (
        <section className="reservas-form-card">
          <div className="reservas-form-heading">
            <div>
              <h3>
                {editandoId !== null ? 'Editar reserva' : 'Registrar reserva'}
              </h3>
              <p>Completa la información solicitada.</p>
            </div>

            <button
              type="button"
              className="reservas-close-button"
              onClick={limpiarFormulario}
              aria-label="Cerrar formulario"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={guardarReserva}>
            <div className="reservas-form-grid">
              <label className="reservas-field">
                Nombre del cliente *
                <input
                  type="text"
                  name="cliente"
                  value={formulario.cliente}
                  onChange={actualizarCampo}
                  placeholder="Ej. María Rodríguez"
                  required
                />
              </label>

              <label className="reservas-field">
                Nombre del evento *
                <input
                  type="text"
                  name="nombreEvento"
                  value={formulario.nombreEvento}
                  onChange={actualizarCampo}
                  placeholder="Ej. Boda"
                  required
                />
              </label>

              <label className="reservas-field">
                Fecha del evento *
                <input
                  type="date"
                  name="fecha"
                  value={formulario.fecha}
                  onChange={actualizarCampo}
                  required
                />
              </label>

              <label className="reservas-field">
                Hora *
                <input
                  type="time"
                  name="hora"
                  value={formulario.hora}
                  onChange={actualizarCampo}
                  required
                />
              </label>

              <label className="reservas-field">
                Cantidad de invitados *
                <input
                  type="number"
                  name="invitados"
                  value={formulario.invitados}
                  onChange={actualizarCampo}
                  min="1"
                  placeholder="Ej. 100"
                  required
                />
              </label>

              <label className="reservas-field">
                Lugar del evento *
                <input
                  type="text"
                  name="lugar"
                  value={formulario.lugar}
                  onChange={actualizarCampo}
                  placeholder="Ej. Salón principal"
                  required
                />
              </label>

              <label className="reservas-field">
                Presupuesto (COP) *
                <input
                  type="number"
                  name="presupuesto"
                  value={formulario.presupuesto}
                  onChange={actualizarCampo}
                  min="0"
                  placeholder="Ej. 5000000"
                  required
                />
              </label>

              <label className="reservas-field">
                Estado de la reserva
                <select
                  name="estado"
                  value={formulario.estado}
                  onChange={actualizarCampo}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Confirmada">Confirmada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </label>
            </div>

            <div className="reservas-form-actions">
              <button
                type="button"
                className="reservas-secondary-button"
                onClick={limpiarFormulario}
              >
                Cancelar
              </button>

              <button type="submit" className="reservas-primary-button">
                <Save size={17} />
                {editandoId !== null ? 'Guardar cambios' : 'Guardar reserva'}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="reservas-list-card">
        <div className="reservas-list-heading">
          <div>
            <h3>Reservas registradas</h3>
            <p>Consulta y administra las reservas de EVENTRIX.</p>
          </div>

          <ClipboardList size={23} />
        </div>

        <div className="reservas-filters">
          <div className="reservas-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Buscar cliente, evento o lugar..."
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />
          </div>

          <select
            className="reservas-status-filter"
            value={filtroEstado}
            onChange={(evento) => setFiltroEstado(evento.target.value)}
            aria-label="Filtrar por estado"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Confirmada">Confirmada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>

        {reservasFiltradas.length > 0 ? (
          <div className="reservas-table-container">
            <table className="reservas-table">
              <thead>
                <tr>
                  <th>Cliente / Evento</th>
                  <th>Fecha y hora</th>
                  <th>Invitados</th>
                  <th>Presupuesto</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {reservasFiltradas.map((reserva) => (
                  <tr key={reserva.id}>
                    <td>
                      <div className="reservas-client-cell">
                        <strong>{reserva.cliente}</strong>
                        <span>{reserva.nombreEvento}</span>
                        <small>{reserva.lugar}</small>
                      </div>
                    </td>

                    <td>
                      <div className="reservas-date-cell">
                        <strong>{formatoFecha(reserva.fecha)}</strong>
                        <span>{reserva.hora}</span>
                      </div>
                    </td>

                    <td>{reserva.invitados}</td>

                    <td>{formatoMoneda(reserva.presupuesto)}</td>

                    <td>
                      <span
                        className={`reservas-status ${reserva.estado.toLowerCase()}`}
                      >
                        {reserva.estado}
                      </span>
                    </td>

                    <td>
                      <div className="reservas-actions">
                        <button
                          type="button"
                          className="reservas-edit-button"
                          onClick={() => editarReserva(reserva)}
                          aria-label="Editar reserva"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          className="reservas-delete-button"
                          onClick={() => eliminarReserva(reserva.id)}
                          aria-label="Eliminar reserva"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="reservas-empty">
            <div className="reservas-empty-icon">
              <CalendarDays size={32} />
            </div>

            <h3>
              {reservas.length === 0
                ? 'Todavía no hay reservas'
                : 'No se encontraron reservas'}
            </h3>

            <p>
              {reservas.length === 0
                ? 'Registra tu primera reserva para comenzar a organizar tus eventos.'
                : 'Prueba con otro término de búsqueda o cambia el filtro de estado.'}
            </p>
          </div>
        )}
      </section>
      {/* VENTANA DE CONFIRMACIÓN EVENTRIX */}
      {confirmacionEliminar !== null && (
        <div
          className="eventrix-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setConfirmacionEliminar(null);
            }
          }}
        >
          <div
            className="eventrix-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reservas-modal-titulo"
          >
            <div className="eventrix-modal-icono">
              <AlertTriangle size={30} />
            </div>

            <h2 id="reservas-modal-titulo">
              ¿Eliminar reserva?
            </h2>

            <p>
              ¿Estás segura de que deseas eliminar esta reserva?
            </p>

            <span className="eventrix-modal-detalle">
              Esta acción no se puede deshacer.
            </span>

            <div className="eventrix-modal-acciones">
              <button
                type="button"
                className="eventrix-modal-cancelar"
                onClick={() => setConfirmacionEliminar(null)}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="reservas-modal-eliminar"
                onClick={confirmarEliminacion}
              >
                <Trash2 size={16} />
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Reservas;
