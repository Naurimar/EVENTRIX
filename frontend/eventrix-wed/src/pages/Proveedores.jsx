
import { useEffect, useState } from 'react';
import {
  Search,
  Users,
  Star,
  Phone,
  Mail,
  BriefcaseBusiness,
  RefreshCw,
  AlertCircle,
  Plus,
  X,
  Save,
  Pencil,
  Power,
  CheckCircle2,
  AlertTriangle,
  Trash2,
} from 'lucide-react';

import './Proveedores.css';

const API_PROVEEDORES = 'http://localhost:8080/api/proveedores';
const API_TIPOS_SERVICIO = `${API_PROVEEDORES}/tipos-servicio`;

const FORMULARIO_INICIAL = {
  nombre: '',
  telefono: '',
  correo: '',
  idTipo: '',
};

function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [tiposServicio, setTiposServicio] = useState([]);

  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [proveedorEditandoId, setProveedorEditandoId] = useState(null);

  const [cargandoTipos, setCargandoTipos] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [cambiandoEstadoId, setCambiandoEstadoId] = useState(null);

  const [errorFormulario, setErrorFormulario] = useState('');
  const [mensajeFormulario, setMensajeFormulario] = useState('');
  const [mensajeGeneral, setMensajeGeneral] = useState('');

  const [confirmacionEstado, setConfirmacionEstado] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState('exito');

  const [confirmacionEliminar, setConfirmacionEliminar] = useState(null);
  const [eliminandoId, setEliminandoId] = useState(null);

  // CONSULTAR PROVEEDORES

  const consultarProveedores = async () => {
    try {
      setCargando(true);
      setError('');

      const respuesta = await fetch(API_PROVEEDORES);

      if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
      }

      const datos = await respuesta.json();

      setProveedores(Array.isArray(datos) ? datos : []);
    } catch (err) {
      console.error('Error al consultar proveedores:', err);
      setError(
        'No fue posible cargar los proveedores. Verifica que el servidor esté funcionando.'
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    consultarProveedores();
  }, []);

  // OCULTAR NOTIFICACIONES AUTOMÁTICAMENTE
  useEffect(() => {
    if (!mensajeGeneral) return;

    const temporizador = setTimeout(() => {
      setMensajeGeneral('');
    }, 4000);

    return () => clearTimeout(temporizador);
  }, [mensajeGeneral]);

  // CONSULTAR TIPOS DE SERVICIO

  const consultarTiposServicio = async () => {
    try {
      setCargandoTipos(true);
      setErrorFormulario('');

      const respuesta = await fetch(API_TIPOS_SERVICIO);

      if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
      }

      const datos = await respuesta.json();

      setTiposServicio(Array.isArray(datos) ? datos : []);
    } catch (err) {
      console.error('Error al consultar tipos de servicio:', err);
      setErrorFormulario(
        'No fue posible cargar los tipos de servicio. Intenta nuevamente.'
      );
    } finally {
      setCargandoTipos(false);
    }
  };

  // LIMPIAR FORMULARIO

  const limpiarFormulario = () => {
    setFormulario(FORMULARIO_INICIAL);
    setProveedorEditandoId(null);
    setErrorFormulario('');
    setMensajeFormulario('');
  };

  // ABRIR FORMULARIO DE REGISTRO

  const abrirFormulario = () => {
    limpiarFormulario();
    setMostrarFormulario(true);
    setMensajeGeneral('');
    consultarTiposServicio();
  };

  // ABRIR FORMULARIO DE EDICIÓN

  const abrirEdicion = (proveedor) => {
    setFormulario({
      nombre: proveedor.nombre || '',
      telefono: proveedor.telefono || '',
      correo: proveedor.correo || '',
      idTipo: String(proveedor.idTipo || ''),
    });

    setProveedorEditandoId(proveedor.idProveedor);
    setErrorFormulario('');
    setMensajeFormulario('');
    setMensajeGeneral('');
    setMostrarFormulario(true);

    consultarTiposServicio();
  };

  // CERRAR FORMULARIO

  const cerrarFormulario = () => {
    if (guardando) return;

    setMostrarFormulario(false);
    limpiarFormulario();
  };

  // ACTUALIZAR CAMPOS

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    setErrorFormulario('');
    setMensajeFormulario('');
  };

  // REGISTRAR O ACTUALIZAR PROVEEDOR

  const guardarProveedor = async (e) => {
    e.preventDefault();

    setErrorFormulario('');
    setMensajeFormulario('');

    if (!formulario.nombre.trim()) {
      setErrorFormulario('El nombre del proveedor es obligatorio.');
      return;
    }

    if (!formulario.idTipo) {
      setErrorFormulario('Debes seleccionar un tipo de servicio.');
      return;
    }

    try {
      setGuardando(true);

      const datosProveedor = {
        nombre: formulario.nombre.trim(),
        telefono: formulario.telefono.trim() || null,
        correo: formulario.correo.trim() || null,
        idTipo: Number(formulario.idTipo),
      };

      const editando = proveedorEditandoId !== null;

      const respuesta = await fetch(
        editando
          ? `${API_PROVEEDORES}/${proveedorEditandoId}`
          : API_PROVEEDORES,
        {
          method: editando ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(datosProveedor),
        }
      );

      if (!respuesta.ok) {
        const detalle = await respuesta.text();
        throw new Error(
          detalle ||
          `No fue posible ${editando ? 'actualizar' : 'registrar'} el proveedor. HTTP ${respuesta.status}`
        );
      }


      setMostrarFormulario(false);
      limpiarFormulario();

      setTipoMensaje('exito');

      setMensajeGeneral(
        editando
          ? 'Proveedor actualizado correctamente.'
          : 'Proveedor registrado correctamente.'
      );

      await consultarProveedores();



    } catch (err) {
      console.error('Error al guardar proveedor:', err);
      setTipoMensaje('error');
      setErrorFormulario(
        err.message || 'Ocurrió un error al guardar el proveedor.'
      );
    } finally {
      setGuardando(false);
    }
  };


  // ABRIR CONFIRMACIÓN PERSONALIZADA
  const cambiarEstado = (proveedor) => {
    setConfirmacionEstado(proveedor);
  };

  // CONFIRMAR ACTIVACIÓN O DESACTIVACIÓN
  const confirmarCambioEstado = async () => {
    if (!confirmacionEstado) return;

    const proveedor = confirmacionEstado;
    const nuevoEstado = !proveedor.activo;

    try {
      setCambiandoEstadoId(proveedor.idProveedor);
      setConfirmacionEstado(null);
      setMensajeGeneral('');

      const respuesta = await fetch(
        `${API_PROVEEDORES}/${proveedor.idProveedor}/estado?activo=${nuevoEstado}`,
        {
          method: 'PATCH',
        }
      );

      if (!respuesta.ok) {
        const detalle = await respuesta.text();
        throw new Error(
          detalle || `No fue posible cambiar el estado. HTTP ${respuesta.status}`
        );
      }

      setTipoMensaje('exito');
      setMensajeGeneral(
        nuevoEstado
          ? 'Proveedor activado correctamente.'
          : 'Proveedor desactivado correctamente.'
      );

      await consultarProveedores();

    } catch (err) {
      console.error('Error al cambiar estado:', err);
      setTipoMensaje('error');
      setMensajeGeneral(
        err.message || 'No fue posible cambiar el estado del proveedor.'
      );
    } finally {
      setCambiandoEstadoId(null);
    }
  };

  // ABRIR CONFIRMACIÓN DE ELIMINACIÓN
  const abrirConfirmacionEliminar = (proveedor) => {
    setConfirmacionEliminar(proveedor);
  };

  // CONFIRMAR ELIMINACIÓN DEL PROVEEDOR
  const confirmarEliminacion = async () => {
    if (!confirmacionEliminar) return;

    const proveedor = confirmacionEliminar;

    try {
      setEliminandoId(proveedor.idProveedor);
      setConfirmacionEliminar(null);
      setMensajeGeneral('');

      const respuesta = await fetch(
        `${API_PROVEEDORES}/${proveedor.idProveedor}`,
        {
          method: 'DELETE',
        }
      );

      const resultado = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        throw new Error(
          resultado.mensaje ||
          `No fue posible eliminar el proveedor. HTTP ${respuesta.status}`
        );
      }

      setTipoMensaje('exito');
      setMensajeGeneral(
        resultado.mensaje || 'Proveedor eliminado correctamente.'
      );

      await consultarProveedores();

    } catch (err) {
      console.error('Error al eliminar proveedor:', err);
      setTipoMensaje('error');
      setMensajeGeneral(
        err.message || 'No fue posible eliminar el proveedor.'
      );
    } finally {
      setEliminandoId(null);
    }
  };

  // FILTRAR PROVEEDORES

  const proveedoresFiltrados = proveedores.filter((proveedor) => {
    const texto = busqueda.toLowerCase();

    const coincideBusqueda =
      String(proveedor.nombre || '').toLowerCase().includes(texto) ||
      String(proveedor.correo || '').toLowerCase().includes(texto) ||
      String(proveedor.nombreTipo || '').toLowerCase().includes(texto);

    const activo = proveedor.activo === true;

    const coincideEstado =
      filtroEstado === 'todos' ||
      (filtroEstado === 'activos' && activo) ||
      (filtroEstado === 'inactivos' && !activo);

    return coincideBusqueda && coincideEstado;
  });

  const totalActivos = proveedores.filter(
    (proveedor) => proveedor.activo === true
  ).length;

  const totalInactivos = proveedores.length - totalActivos;

  const formatearCalificacion = (calificacion) => {
    if (calificacion === null || calificacion === undefined) {
      return 'Sin calificación';
    }

    return Number(calificacion).toFixed(2);
  };

  return (
    <section className="proveedores-container">

      {/* RESUMEN */}

      <div className="proveedores-resumen">

        <article className="proveedor-resumen-card">
          <div className="proveedor-resumen-icon">
            <Users size={23} />
          </div>
          <div>
            <span>Total proveedores</span>
            <strong>{proveedores.length}</strong>
          </div>
        </article>

        <article className="proveedor-resumen-card">
          <div className="proveedor-resumen-icon activo">
            <BriefcaseBusiness size={23} />
          </div>
          <div>
            <span>Proveedores activos</span>
            <strong>{totalActivos}</strong>
          </div>
        </article>

        <article className="proveedor-resumen-card">
          <div className="proveedor-resumen-icon inactivo">
            <Users size={23} />
          </div>
          <div>
            <span>Proveedores inactivos</span>
            <strong>{totalInactivos}</strong>
          </div>
        </article>

      </div>

      {/* DIRECTORIO */}

      <div className="proveedores-panel">

        <div className="proveedores-panel-header">
          <div>
            <h2>Directorio de proveedores</h2>
            <p>Consulta los proveedores y sus servicios registrados.</p>
          </div>

          <div className="proveedores-acciones-header">

            <button
              type="button"
              className="proveedores-actualizar"
              onClick={consultarProveedores}
              disabled={cargando}
            >
              <RefreshCw size={17} />
              Actualizar
            </button>

            <button
              type="button"
              className="proveedores-actualizar"
              onClick={abrirFormulario}
            >
              <Plus size={17} />
              Nuevo proveedor
            </button>

          </div>
        </div>

        {/* MENSAJE GENERAL */}

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

        {/* FORMULARIO */}

        {mostrarFormulario && (
          <form
            className="proveedores-formulario"
            onSubmit={guardarProveedor}
          >

            <div className="proveedores-panel-header">
              <div>
                <h2>
                  {proveedorEditandoId !== null
                    ? 'Editar proveedor'
                    : 'Registrar proveedor'}
                </h2>

                <p>
                  {proveedorEditandoId !== null
                    ? 'Modifica la información del proveedor seleccionado.'
                    : 'Completa los datos del nuevo proveedor.'}
                </p>
              </div>

              <button
                type="button"
                className="proveedores-cerrar-formulario"
                onClick={cerrarFormulario}
                disabled={guardando}
                aria-label="Cerrar formulario"
              >
                <X size={19} />
              </button>
            </div>

            <div className="proveedores-form-grid">

              <label className="proveedores-campo">
                Nombre del proveedor *
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre completo o empresa"
                  value={formulario.nombre}
                  onChange={manejarCambio}
                  maxLength={150}
                  required
                />
              </label>

              <label className="proveedores-campo">
                Teléfono
                <input
                  type="tel"
                  name="telefono"
                  placeholder="Número de contacto"
                  value={formulario.telefono}
                  onChange={manejarCambio}
                  maxLength={30}
                />
              </label>

              <label className="proveedores-campo">
                Correo electrónico
                <input
                  type="email"
                  name="correo"
                  placeholder="correo@ejemplo.com"
                  value={formulario.correo}
                  onChange={manejarCambio}
                  maxLength={150}
                />
              </label>

              <label className="proveedores-campo">
                Tipo de servicio *
                <select
                  name="idTipo"
                  value={formulario.idTipo}
                  onChange={manejarCambio}
                  required
                  disabled={cargandoTipos}
                >
                  <option value="">
                    {cargandoTipos
                      ? 'Cargando tipos de servicio...'
                      : 'Selecciona un servicio'}
                  </option>

                  {tiposServicio.map((tipo) => (
                    <option key={tipo.idTipo} value={tipo.idTipo}>
                      {tipo.nombreTipo}
                    </option>
                  ))}
                </select>
              </label>

            </div>

            {errorFormulario && (
              <div className="proveedores-form-mensaje error">
                <AlertCircle size={17} />
                {errorFormulario}
              </div>
            )}

            <div className="proveedores-form-acciones">

              <button
                type="button"
                className="proveedores-btn-cancelar"
                onClick={cerrarFormulario}
                disabled={guardando}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="proveedores-btn-guardar"
                disabled={guardando || cargandoTipos || tiposServicio.length === 0}
              >
                <Save size={17} />
                {guardando
                  ? 'Guardando...'
                  : proveedorEditandoId !== null
                    ? 'Guardar cambios'
                    : 'Guardar proveedor'}
              </button>

            </div>

          </form>
        )}

        {/* BÚSQUEDA Y FILTROS */}

        <div className="proveedores-controles">

          <div className="proveedores-busqueda">
            <Search size={19} />

            <input
              type="text"
              placeholder="Buscar por nombre, correo o servicio..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            aria-label="Filtrar proveedores por estado"
          >
            <option value="todos">Todos los estados</option>
            <option value="activos">Activos</option>
            <option value="inactivos">Inactivos</option>
          </select>

        </div>

        {/* LISTADO */}

        {cargando ? (
          <div className="proveedores-mensaje">
            <RefreshCw size={30} className="proveedores-spinner" />
            <strong>Cargando proveedores...</strong>
          </div>

        ) : error ? (
          <div className="proveedores-mensaje error">
            <AlertCircle size={32} />
            <strong>{error}</strong>

            <button type="button" onClick={consultarProveedores}>
              Intentar nuevamente
            </button>
          </div>

        ) : proveedoresFiltrados.length === 0 ? (
          <div className="proveedores-mensaje">

            <div className="proveedores-vacio-icon">
              <BriefcaseBusiness size={35} />
            </div>

            <strong>
              {proveedores.length === 0
                ? 'No hay proveedores registrados'
                : 'No se encontraron proveedores'}
            </strong>

            <p>
              {proveedores.length === 0
                ? 'Cuando se registren proveedores en EVENTRIX, aparecerán aquí.'
                : 'Prueba con otro nombre, correo o filtro.'}
            </p>

          </div>

        ) : (
          <div className="proveedores-grid">

            {proveedoresFiltrados.map((proveedor) => (
              <article
                className="proveedor-card"
                key={proveedor.idProveedor}
              >

                <div className="proveedor-card-header">

                  <div className="proveedor-avatar">
                    {proveedor.nombre?.charAt(0).toUpperCase() || 'P'}
                  </div>

                  <span
                    className={`proveedor-estado ${proveedor.activo ? 'activo' : 'inactivo'
                      }`}
                  >
                    {proveedor.activo ? 'Activo' : 'Inactivo'}
                  </span>

                </div>

                <h3>{proveedor.nombre}</h3>

                <span className="proveedor-categoria">
                  {proveedor.nombreTipo || 'Tipo de servicio no disponible'}
                </span>

                <div className="proveedor-dato">
                  <Phone size={16} />
                  <span>{proveedor.telefono || 'Sin teléfono'}</span>
                </div>

                <div className="proveedor-dato">
                  <Mail size={16} />
                  <span>{proveedor.correo || 'Sin correo'}</span>
                </div>

                <div className="proveedor-calificacion">
                  <Star size={17} />
                  <span>
                    {formatearCalificacion(proveedor.calificacion)}
                  </span>
                </div>

                {/* ACCIONES DEL PROVEEDOR */}

                <div className="proveedor-acciones">

                  <button
                    type="button"
                    className="proveedor-editar-button"
                    onClick={() => abrirEdicion(proveedor)}
                    disabled={cambiandoEstadoId !== null}
                  >
                    <Pencil size={15} />
                    Editar
                  </button>

                  <button
                    type="button"
                    className={`proveedor-estado-button ${proveedor.activo ? 'desactivar' : 'activar'
                      }`}
                    onClick={() => cambiarEstado(proveedor)}
                    disabled={cambiandoEstadoId === proveedor.idProveedor}
                  >
                    <Power size={15} />
                    {cambiandoEstadoId === proveedor.idProveedor
                      ? 'Procesando...'
                      : proveedor.activo
                        ? 'Desactivar'
                        : 'Activar'}
                  </button>

                  <button
                    type="button"
                    className="proveedor-eliminar-button"
                    onClick={() => abrirConfirmacionEliminar(proveedor)}
                    disabled={
                      eliminandoId !== null ||
                      cambiandoEstadoId !== null
                    }
                  >
                    <Trash2 size={15} />
                    {eliminandoId === proveedor.idProveedor
                      ? 'Eliminando...'
                      : 'Eliminar'}
                  </button>

                </div>

              </article>
            ))}

          </div>
        )}

        {!cargando && !error && proveedores.length > 0 && (
          <div className="proveedores-pie">
            Mostrando {proveedoresFiltrados.length} de {proveedores.length} proveedores
          </div>
        )}

      </div>

      {/* VENTANA DE CONFIRMACIÓN EVENTRIX */}
      {confirmacionEstado && (
        <div
          className="eventrix-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setConfirmacionEstado(null);
            }
          }}
        >
          <div
            className="eventrix-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="eventrix-modal-titulo"
          >
            <div className="eventrix-modal-icono">
              <AlertTriangle size={30} />
            </div>

            <h2 id="eventrix-modal-titulo">
              {confirmacionEstado.activo
                ? '¿Desactivar proveedor?'
                : '¿Activar proveedor?'}
            </h2>

            <p>
              {confirmacionEstado.activo
                ? '¿Estás segura de que deseas desactivar a'
                : '¿Deseas volver a activar a'}{' '}
              <strong>{confirmacionEstado.nombre}</strong>?
            </p>

            <span className="eventrix-modal-detalle">
              {confirmacionEstado.activo
                ? 'El proveedor pasará a estar inactivo.'
                : 'El proveedor volverá a estar disponible como activo.'}
            </span>

            <div className="eventrix-modal-acciones">
              <button
                type="button"
                className="eventrix-modal-cancelar"
                onClick={() => setConfirmacionEstado(null)}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="eventrix-modal-confirmar"
                onClick={confirmarCambioEstado}
              >
                {confirmacionEstado.activo
                  ? 'Sí, desactivar'
                  : 'Sí, activar'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* VENTANA DE CONFIRMACIÓN DE ELIMINACIÓN */}
      {confirmacionEliminar && (
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
            aria-labelledby="eventrix-modal-eliminar-titulo"
          >
            <div className="eventrix-modal-icono">
              <AlertTriangle size={30} />
            </div>

            <h2 id="eventrix-modal-eliminar-titulo">
              ¿Eliminar proveedor?
            </h2>

            <p>
              ¿Estás segura de que deseas eliminar a{' '}
              <strong>{confirmacionEliminar.nombre}</strong>?
            </p>

            <span className="eventrix-modal-detalle">
              Esta acción no se puede deshacer. Si el proveedor tiene
              eventos asociados, el sistema impedirá su eliminación.
            </span>

            <div className="eventrix-modal-acciones">
              <button
                type="button"
                className="eventrix-modal-cancelar"
                onClick={() => setConfirmacionEliminar(null)}
                disabled={eliminandoId !== null}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="proveedor-eliminar-button"
                onClick={confirmarEliminacion}
                disabled={eliminandoId !== null}
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

export default Proveedores;
