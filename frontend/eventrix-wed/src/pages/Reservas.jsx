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

import { apiFetch } from '../services/api';
import '../styles/Reservas.css';

const API_RESERVAS = 'http://localhost:8080/api/reservas';
const API_EVENTOS = 'http://localhost:8080/api/v1/eventos';
const API_ESPACIOS = 'http://localhost:8080/api/v1/espacios';
const API_CLIENTES = 'http://localhost:8080/api/v1/clientes';

const formularioInicial = {
  idEvento: '',
  idEspacio: '',
  fechaInicio: '',
  fechaFin: '',
  estado: 'Pendiente',
  costoTotal: '',
};

function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [clientes, setClientes] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [confirmacionEliminar, setConfirmacionEliminar] = useState(null);
  const [mensajeGeneral, setMensajeGeneral] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('exito');

  // OCULTAR NOTIFICACIONES AUTOMÁTICAMENTE
  useEffect(() => {
    if (!mensajeGeneral) return;

    const temporizador = setTimeout(() => {
      setMensajeGeneral('');
    }, 4000);

    return () => clearTimeout(temporizador);
  }, [mensajeGeneral]);

  // CARGAR DATOS DESDE EL BACKEND
  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);

      try {
        const [
          respuestaReservas,
          respuestaEventos,
          respuestaEspacios,
          respuestaClientes,
        ] = await Promise.all([
          apiFetch(API_RESERVAS),
          apiFetch(API_EVENTOS),
          apiFetch(API_ESPACIOS),
          apiFetch(API_CLIENTES),
        ]);

        if (
          !respuestaReservas.ok ||
          !respuestaEventos.ok ||
          !respuestaEspacios.ok ||
          !respuestaClientes.ok
        ) {
          throw new Error('No fue posible consultar todos los datos.');
        }

        const [
          datosReservas,
          datosEventos,
          datosEspacios,
          datosClientes,
        ] = await Promise.all([
          respuestaReservas.json(),
          respuestaEventos.json(),
          respuestaEspacios.json(),
          respuestaClientes.json(),
        ]);

        setReservas(Array.isArray(datosReservas) ? datosReservas : []);
        setEventos(Array.isArray(datosEventos) ? datosEventos : []);
        setEspacios(Array.isArray(datosEspacios) ? datosEspacios : []);
        setClientes(Array.isArray(datosClientes) ? datosClientes : []);
      } catch (error) {
        console.error('Error al cargar los datos de reservas:', error);
        setMensajeGeneral('No fue posible cargar los datos del servidor.');
        setTipoMensaje('error');
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  // BUSCAR Y FILTRAR RESERVAS
  const reservasFiltradas = reservas.filter((reserva) => {
    const texto = busqueda.toLowerCase();

    const evento = eventos.find(
      (item) => Number(item.idEvento) === Number(reserva.idEvento)
    );

    const espacio = espacios.find(
      (item) => Number(item.idEspacio) === Number(reserva.idEspacio)
    );

    const cliente = clientes.find(
      (item) => Number(item.idCliente) === Number(evento?.idCliente)
    );

    const coincideBusqueda = [
      cliente?.nombre,
      evento?.nombre,
      espacio?.nombre,
    ].some((valor) =>
      String(valor || '').toLowerCase().includes(texto)
    );

    const coincideEstado =
      filtroEstado === 'Todos' || reserva.estado === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  // ACTUALIZAR CAMPOS DEL FORMULARIO
  const actualizarCampo = (evento) => {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  // LIMPIAR FORMULARIO
  const limpiarFormulario = () => {
    setFormulario(formularioInicial);
    setEditandoId(null);
    setMostrarFormulario(false);
  };

  // GUARDAR O ACTUALIZAR RESERVA EN EL BACKEND
  const guardarReserva = async (evento) => {
    evento.preventDefault();

    const eventoSeleccionado = eventos.find(
      (item) => Number(item.idEvento) === Number(formulario.idEvento)
    );

    const espacioSeleccionado = espacios.find(
      (item) => Number(item.idEspacio) === Number(formulario.idEspacio)
    );

    if (!eventoSeleccionado) {
      setTipoMensaje('error');
      setMensajeGeneral('Debes seleccionar un evento.');
      return;
    }

    if (!espacioSeleccionado || espacioSeleccionado.disponible !== true) {
      setTipoMensaje('error');
      setMensajeGeneral('Debes seleccionar un espacio disponible.');
      return;
    }

    if (
      !formulario.fechaInicio ||
      !formulario.fechaFin ||
      new Date(formulario.fechaFin) <= new Date(formulario.fechaInicio)
    ) {
      setTipoMensaje('error');
      setMensajeGeneral(
        'La fecha de finalización debe ser posterior al inicio.'
      );
      return;
    }

    const nuevaReserva = {
      idEvento: Number(formulario.idEvento),
      idEspacio: Number(formulario.idEspacio),
      fechaInicio: formulario.fechaInicio,
      fechaFin: formulario.fechaFin,
      estado: formulario.estado,
      costoTotal: espacioSeleccionado.tarifa ?? null,
    };

    try {
      const respuesta = await apiFetch(
        editandoId !== null
          ? `${API_RESERVAS}/${editandoId}`
          : API_RESERVAS,
        {
          method: editandoId !== null ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevaReserva),
        }
      );

      if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
      }

      const respuestaReservas = await apiFetch(API_RESERVAS);

      if (!respuestaReservas.ok) {
        throw new Error('No fue posible actualizar la lista de reservas.');
      }

      const datosReservas = await respuestaReservas.json();

      setReservas(Array.isArray(datosReservas) ? datosReservas : []);

      setTipoMensaje('exito');
      setMensajeGeneral(
        editandoId !== null
          ? 'La reserva se actualizó correctamente.'
          : 'La reserva se registró correctamente.'
      );

      limpiarFormulario();
    } catch (error) {
      console.error('Error al guardar la reserva:', error);
      setTipoMensaje('error');
      setMensajeGeneral(
        'No fue posible guardar la reserva en el servidor.'
      );
    }
  };

  // EDITAR RESERVA
  const editarReserva = (reserva) => {
    setFormulario({
      idEvento: String(reserva.idEvento ?? ''),
      idEspacio: String(reserva.idEspacio ?? ''),
      fechaInicio: reserva.fechaInicio
        ? reserva.fechaInicio.slice(0, 16)
        : '',
      fechaFin: reserva.fechaFin
        ? reserva.fechaFin.slice(0, 16)
        : '',
      estado: reserva.estado ?? 'Pendiente',
      costoTotal: reserva.costoTotal ?? '',
    });

    setEditandoId(reserva.idReserva);
    setMostrarFormulario(true);
  };

  // ABRIR VENTANA DE CONFIRMACIÓN
  const eliminarReserva = (id) => {
    setConfirmacionEliminar(id);
  };

  // CONFIRMAR ELIMINACIÓN EN EL BACKEND
  const confirmarEliminacion = async () => {
    if (confirmacionEliminar === null) return;

    try {
      const respuesta = await apiFetch(
        `${API_RESERVAS}/${confirmacionEliminar}`,
        {
          method: 'DELETE',
        }
      );

      if (!respuesta.ok) {
        if (respuesta.status === 409) {
          throw new Error(
            'No se puede eliminar esta reserva porque tiene información relacionada.'
          );
        }

        throw new Error(`Error HTTP ${respuesta.status}`);
      }

      const respuestaReservas = await apiFetch(API_RESERVAS);

      if (!respuestaReservas.ok) {
        throw new Error('No fue posible actualizar la lista de reservas.');
      }

      const datosReservas = await respuestaReservas.json();

      setReservas(Array.isArray(datosReservas) ? datosReservas : []);
      setConfirmacionEliminar(null);
      setTipoMensaje('exito');
      setMensajeGeneral('La reserva se eliminó correctamente.');
    } catch (error) {
      console.error('Error al eliminar la reserva:', error);
      setTipoMensaje('error');
      setMensajeGeneral(
        error.message || 'No fue posible eliminar la reserva.'
      );
    }
  };

  // FORMATO DE MONEDA
  const formatoMoneda = (valor) => {
    if (valor === null || valor === undefined || valor === '') {
      return 'Sin valor';
    }

    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(Number(valor));
  };

  // FORMATO DE FECHA Y HORA
  const formatoFechaHora = (fecha) => {
    if (!fecha) return 'Sin fecha';

    return new Date(fecha).toLocaleString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // CONTADORES
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

      {/* NOTIFICACIONES */}
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

      {/* ENCABEZADO */}
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

      {/* RESUMEN */}
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

      {/* FORMULARIO */}
      {mostrarFormulario && (
        <section className="reservas-form-card">
          <div className="reservas-form-heading">
            <div>
              <h3>
                {editandoId !== null
                  ? 'Editar reserva'
                  : 'Registrar reserva'}
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
                Evento *
                <select
                  name="idEvento"
                  value={formulario.idEvento}
                  onChange={actualizarCampo}
                  required
                >
                  <option value="">Selecciona un evento</option>

                  {eventos.map((evento) => (
                    <option
                      key={evento.idEvento}
                      value={evento.idEvento}
                    >
                      {evento.nombre}
                    </option>
                  ))}
                </select>
              </label>

              <label className="reservas-field">
                Cliente
                <input
                  type="text"
                  value={
                    clientes.find(
                      (cliente) =>
                        Number(cliente.idCliente) ===
                        Number(
                          eventos.find(
                            (evento) =>
                              Number(evento.idEvento) ===
                              Number(formulario.idEvento)
                          )?.idCliente
                        )
                    )?.nombre || ''
                  }
                  readOnly
                  placeholder="Se completa al seleccionar el evento"
                />
              </label>

              <label className="reservas-field">
                Cantidad de invitados
                <input
                  type="number"
                  value={
                    eventos.find(
                      (evento) =>
                        Number(evento.idEvento) ===
                        Number(formulario.idEvento)
                    )?.numInvitados ?? ''
                  }
                  readOnly
                  placeholder="Se completa automáticamente"
                />
              </label>

              <label className="reservas-field">
                Espacio disponible *
                <select
                  name="idEspacio"
                  value={formulario.idEspacio}
                  onChange={actualizarCampo}
                  required
                >
                  <option value="">Selecciona un espacio</option>

                  {espacios
                    .filter((espacio) => espacio.disponible === true)
                    .map((espacio) => (
                      <option
                        key={espacio.idEspacio}
                        value={espacio.idEspacio}
                      >
                        {espacio.nombre} - Capacidad: {espacio.capacidad}
                      </option>
                    ))}
                </select>
              </label>

              <label className="reservas-field">
                Fecha y hora de inicio *
                <input
                  type="datetime-local"
                  name="fechaInicio"
                  value={formulario.fechaInicio}
                  onChange={actualizarCampo}
                  required
                />
              </label>

              <label className="reservas-field">
                Fecha y hora de finalización *
                <input
                  type="datetime-local"
                  name="fechaFin"
                  value={formulario.fechaFin}
                  onChange={actualizarCampo}
                  required
                />
              </label>

              <label className="reservas-field">
                Costo total (COP)
                <input
                  type="number"
                  value={
                    espacios.find(
                      (espacio) =>
                        Number(espacio.idEspacio) ===
                        Number(formulario.idEspacio)
                    )?.tarifa ?? ''
                  }
                  readOnly
                  placeholder="Tarifa del espacio"
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

              <button
                type="submit"
                className="reservas-primary-button"
              >
                <Save size={17} />
                {editandoId !== null
                  ? 'Guardar cambios'
                  : 'Guardar reserva'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* LISTADO DE RESERVAS */}
      <section className="reservas-list-card">
        <div className="reservas-list-heading">
          <div>
            <h3>Reservas registradas</h3>
            <p>Consulta y administra las reservas de EVENTRIX.</p>
          </div>

          <ClipboardList size={23} />
        </div>

        {/* BÚSQUEDA Y FILTROS */}
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

        {/* CARGA */}
        {cargando ? (
          <div className="reservas-empty">
            <p>Cargando reservas...</p>
          </div>
        ) : reservasFiltradas.length > 0 ? (
          <div className="reservas-table-container">
            <table className="reservas-table">
              <thead>
                <tr>
                  <th>Cliente / Evento</th>
                  <th>Fecha y hora</th>
                  <th>Invitados</th>
                  <th>Costo total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {reservasFiltradas.map((reserva) => {
                  const evento = eventos.find(
                    (item) =>
                      Number(item.idEvento) === Number(reserva.idEvento)
                  );

                  const espacio = espacios.find(
                    (item) =>
                      Number(item.idEspacio) === Number(reserva.idEspacio)
                  );

                  const cliente = clientes.find(
                    (item) =>
                      Number(item.idCliente) === Number(evento?.idCliente)
                  );

                  return (
                    <tr key={reserva.idReserva}>
                      <td>
                        <div className="reservas-client-cell">
                          <strong>
                            {cliente?.nombre || 'Cliente no disponible'}
                          </strong>

                          <span>
                            {evento?.nombre || 'Evento no disponible'}
                          </span>

                          <small>
                            {espacio?.nombre || 'Espacio no disponible'}
                          </small>
                        </div>
                      </td>

                      <td>
                        <div className="reservas-date-cell">
                          <strong>
                            {formatoFechaHora(reserva.fechaInicio)}
                          </strong>

                          <span>
                            Hasta: {formatoFechaHora(reserva.fechaFin)}
                          </span>
                        </div>
                      </td>

                      <td>
                        {evento?.numInvitados ?? 'Sin dato'}
                      </td>

                      <td>
                        {formatoMoneda(reserva.costoTotal)}
                      </td>

                      <td>
                        <span
                          className={`reservas-status ${(reserva.estado || '').toLowerCase()}`}
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
                            onClick={() =>
                              eliminarReserva(reserva.idReserva)
                            }
                            aria-label="Eliminar reserva"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

      {/* VENTANA DE CONFIRMACIÓN */}
      {confirmacionEliminar !== null && (
        <div
          className="eventrix-modal-overlay"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) {
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