import { useEffect, useState } from 'react';
import {
    Search,
    Users,
    UserPlus,
    RefreshCw,
    AlertCircle,
    Plus,
    X,
    Save,
    Pencil,
    Trash2,
    Mail,
    Phone,
    CalendarDays,
    CheckCircle2,
    AlertTriangle,
    Armchair,
    UserRound,
    ClipboardList,
} from 'lucide-react';

import './Invitados.css';

const API_INVITADOS = 'http://localhost:8080/api/invitados';

const FORMULARIO_INICIAL = {
    nombre: '',
    correo: '',
    telefono: '',
    restriccionDietetica: '',
    idEvento: '',
    idMesa: '',
    estadoRsvp: 'Pendiente',
};

function Invitados() {
    const [invitados, setInvitados] = useState([]);
    const [eventos, setEventos] = useState([]);
    const [mesasFormulario, setMesasFormulario] = useState([]);
    const [mesasEvento, setMesasEvento] = useState([]);
    const [invitadosEvento, setInvitadosEvento] = useState([]);

    const [eventoSeleccionado, setEventoSeleccionado] = useState('');
    const [invitadoSeleccionado, setInvitadoSeleccionado] = useState('');

    const [busqueda, setBusqueda] = useState('');
    const [cargando, setCargando] = useState(true);
    const [cargandoEventos, setCargandoEventos] = useState(false);
    const [cargandoEvento, setCargandoEvento] = useState(false);

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
    const [invitadoEditandoId, setInvitadoEditandoId] = useState(null);

    const [guardando, setGuardando] = useState(false);
    const [errorFormulario, setErrorFormulario] = useState('');
    const [mensajeGeneral, setMensajeGeneral] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState('exito');

    const [confirmacionEliminar, setConfirmacionEliminar] = useState(null);
    const [confirmacionRetirar, setConfirmacionRetirar] = useState(null);
    const [eliminandoId, setEliminandoId] = useState(null);

    const [procesandoAsociacion, setProcesandoAsociacion] = useState(false);

    // LEER RESPUESTAS DEL BACKEND
    const leerRespuesta = async (respuesta) => {
        const texto = await respuesta.text();

        let resultado = {};

        if (texto) {
            try {
                resultado = JSON.parse(texto);
            } catch {
                resultado = { mensaje: texto };
            }
        }

        if (!respuesta.ok) {
            throw new Error(
                resultado.mensaje ||
                resultado.error ||
                `Error del servidor: HTTP ${respuesta.status}`
            );
        }

        return resultado;
    };

    // CONSULTAR INVITADOS
    const consultarInvitados = async () => {
        try {
            setCargando(true);

            const respuesta = await fetch(API_INVITADOS);
            const datos = await leerRespuesta(respuesta);

            setInvitados(Array.isArray(datos) ? datos : []);
        } catch (err) {
            console.error('Error al consultar invitados:', err);
            mostrarMensaje(
                err.message || 'No fue posible cargar los invitados.',
                'error'
            );
        } finally {
            setCargando(false);
        }
    };

    // CONSULTAR EVENTOS
    const consultarEventos = async () => {
        try {
            setCargandoEventos(true);

            const respuesta = await fetch(`${API_INVITADOS}/eventos`);
            const datos = await leerRespuesta(respuesta);

            setEventos(Array.isArray(datos) ? datos : []);
        } catch (err) {
            console.error('Error al consultar eventos:', err);
            setEventos([]);
            mostrarMensaje(
                err.message || 'No fue posible cargar los eventos.',
                'error'
            );
        } finally {
            setCargandoEventos(false);
        }
    };

    // CONSULTAR MESAS DE UN EVENTO
    const consultarMesas = async (idEvento, destino = 'evento') => {
        if (!idEvento) {
            if (destino === 'formulario') {
                setMesasFormulario([]);
            } else {
                setMesasEvento([]);
            }
            return;
        }

        try {
            const respuesta = await fetch(
                `${API_INVITADOS}/eventos/${idEvento}/mesas`
            );

            const datos = await leerRespuesta(respuesta);
            const lista = Array.isArray(datos) ? datos : [];

            if (destino === 'formulario') {
                setMesasFormulario(lista);
            } else {
                setMesasEvento(lista);
            }
        } catch (err) {
            console.error('Error al consultar mesas:', err);

            if (destino === 'formulario') {
                setMesasFormulario([]);
            } else {
                setMesasEvento([]);
            }

            mostrarMensaje(
                err.message || 'No fue posible cargar las mesas.',
                'error'
            );
        }
    };

    // CONSULTAR INVITADOS DE UN EVENTO
    const consultarInvitadosEvento = async (idEvento) => {
        if (!idEvento) {
            setInvitadosEvento([]);
            setMesasEvento([]);
            return;
        }

        try {
            setCargandoEvento(true);

            const respuesta = await fetch(
                `${API_INVITADOS}/eventos/${idEvento}/invitados`
            );

            const datos = await leerRespuesta(respuesta);

            setInvitadosEvento(Array.isArray(datos) ? datos : []);

            await consultarMesas(idEvento, 'evento');
        } catch (err) {
            console.error('Error al consultar invitados del evento:', err);

            setInvitadosEvento([]);
            mostrarMensaje(
                err.message || 'No fue posible cargar los invitados del evento.',
                'error'
            );
        } finally {
            setCargandoEvento(false);
        }
    };

    // CARGA INICIAL
    useEffect(() => {
        consultarInvitados();
        consultarEventos();
    }, []);

    // NOTIFICACIONES
    useEffect(() => {
        if (!mensajeGeneral) return;

        const temporizador = setTimeout(() => {
            setMensajeGeneral('');
        }, 4500);

        return () => clearTimeout(temporizador);
    }, [mensajeGeneral]);

    // MOSTRAR MENSAJE
    const mostrarMensaje = (mensaje, tipo = 'exito') => {
        setTipoMensaje(tipo);
        setMensajeGeneral(mensaje);
    };

    // CAMBIAR EVENTO SELECCIONADO
    const cambiarEventoSeleccionado = async (idEvento) => {
        setEventoSeleccionado(idEvento);
        setInvitadoSeleccionado('');
        await consultarInvitadosEvento(idEvento);
    };

    // LIMPIAR FORMULARIO
    const limpiarFormulario = () => {
        setFormulario(FORMULARIO_INICIAL);
        setInvitadoEditandoId(null);
        setMesasFormulario([]);
        setErrorFormulario('');
    };

    // ABRIR REGISTRO
    const abrirFormulario = () => {
        limpiarFormulario();
        setMostrarFormulario(true);
        setMensajeGeneral('');
    };

    // ABRIR EDICIÓN
    const abrirEdicion = (invitado) => {
        setFormulario({
            nombre: invitado.nombre || '',
            correo: invitado.correo || '',
            telefono: invitado.telefono || '',
            restriccionDietetica: invitado.restriccionDietetica || '',
            idEvento: '',
            idMesa: '',
            estadoRsvp: 'Pendiente',
        });

        setInvitadoEditandoId(invitado.idInvitado);
        setErrorFormulario('');
        setMostrarFormulario(true);
        setMensajeGeneral('');
        setMesasFormulario([]);
    };

    // CERRAR FORMULARIO
    const cerrarFormulario = () => {
        if (guardando) return;

        setMostrarFormulario(false);
        limpiarFormulario();
    };

    // CAMBIAR CAMPOS
    const manejarCambio = async (e) => {
        const { name, value } = e.target;

        setFormulario((anterior) => ({
            ...anterior,
            [name]: value,
        }));

        setErrorFormulario('');

        if (name === 'idEvento') {
            setFormulario((anterior) => ({
                ...anterior,
                idEvento: value,
                idMesa: '',
            }));

            await consultarMesas(value, 'formulario');
        }
    };

    // REGISTRAR O ACTUALIZAR INVITADO
    const guardarInvitado = async (e) => {
        e.preventDefault();

        setErrorFormulario('');

        if (!formulario.nombre.trim()) {
            setErrorFormulario('El nombre del invitado es obligatorio.');
            return;
        }

        let invitadoRegistrado = false;
        let idNuevoInvitado = null;

        try {
            setGuardando(true);

            const datosInvitado = {
                nombre: formulario.nombre.trim(),
                correo: formulario.correo.trim() || null,
                telefono: formulario.telefono.trim() || null,
                restriccionDietetica:
                    formulario.restriccionDietetica.trim() || null,
                estadoRsvp: null,
            };

            const editando = invitadoEditandoId !== null;

            const respuesta = await fetch(
                editando
                    ? `${API_INVITADOS}/${invitadoEditandoId}`
                    : API_INVITADOS,
                {
                    method: editando ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(datosInvitado),
                }
            );

            const resultado = await leerRespuesta(respuesta);

            if (!editando) {
                invitadoRegistrado = true;
                idNuevoInvitado = resultado.idInvitado;
            }

            // SI ES NUEVO, OBTENER SU ID PARA ASOCIARLO
            if (!editando && formulario.idEvento) {
                const idInvitado = resultado.idInvitado;

                if (!idInvitado) {
                    throw new Error(
                        'El invitado se registró, pero el servidor no devolvió su ID.'
                    );
                }

                const respuestaAsociacion = await fetch(
                    `${API_INVITADOS}/asociar`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            idEvento: Number(formulario.idEvento),
                            idInvitado: Number(idInvitado),
                            idMesa: formulario.idMesa
                                ? Number(formulario.idMesa)
                                : null,
                            estadoRsvp: formulario.estadoRsvp,
                        }),
                    }
                );

                await leerRespuesta(respuestaAsociacion);
            }

            setMostrarFormulario(false);
            limpiarFormulario();

            await consultarInvitados();

            if (eventoSeleccionado) {
                await consultarInvitadosEvento(eventoSeleccionado);
            }

            mostrarMensaje(
                editando
                    ? 'Invitado actualizado correctamente.'
                    : formulario.idEvento
                        ? 'Invitado registrado y asociado al evento correctamente.'
                        : 'Invitado registrado correctamente.'
            );

        } catch (err) {
            console.error('Error al guardar invitado:', err);

            if (invitadoRegistrado) {
                await consultarInvitados();

                setMostrarFormulario(false);
                limpiarFormulario();

                mostrarMensaje(
                    formulario.idEvento
                        ? `El invitado se registró, pero no se pudo completar su asociación al evento: ${err.message}`
                        : 'El invitado se registró correctamente.'
                );
            } else {
                setErrorFormulario(
                    err.message || 'No fue posible guardar el invitado.'
                );

                await consultarInvitados();
            }
        } finally {

            setGuardando(false);
        }
    };

    // ASOCIAR INVITADO EXISTENTE A UN EVENTO
    const asociarInvitado = async () => {
        if (!eventoSeleccionado || !invitadoSeleccionado) {
            mostrarMensaje(
                'Selecciona un invitado y un evento para continuar.',
                'error'
            );
            return;
        }

        try {
            setProcesandoAsociacion(true);

            const respuesta = await fetch(`${API_INVITADOS}/asociar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idEvento: Number(eventoSeleccionado),
                    idInvitado: Number(invitadoSeleccionado),
                    idMesa: null,
                    estadoRsvp: 'Pendiente',
                }),
            });

            await leerRespuesta(respuesta);

            setInvitadoSeleccionado('');

            await consultarInvitadosEvento(eventoSeleccionado);

            mostrarMensaje('Invitado asociado al evento correctamente.');
        } catch (err) {
            console.error('Error al asociar invitado:', err);

            mostrarMensaje(
                err.message || 'No fue posible asociar al invitado.',
                'error'
            );
        } finally {
            setProcesandoAsociacion(false);
        }
    };

    // ACTUALIZAR RSVP
    const actualizarRsvp = async (idInvitado, estadoRsvp) => {
        try {
            const respuesta = await fetch(
                `${API_INVITADOS}/eventos/${eventoSeleccionado}/invitados/${idInvitado}/rsvp`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ estadoRsvp }),
                }
            );

            await leerRespuesta(respuesta);

            await consultarInvitadosEvento(eventoSeleccionado);

            mostrarMensaje('Estado de confirmación actualizado.');
        } catch (err) {
            console.error('Error al actualizar RSVP:', err);

            mostrarMensaje(
                err.message || 'No fue posible actualizar la confirmación.',
                'error'
            );
        }
    };

    // ACTUALIZAR MESA
    const actualizarMesa = async (idInvitado, idMesa) => {
        try {
            const respuesta = await fetch(
                `${API_INVITADOS}/eventos/${eventoSeleccionado}/invitados/${idInvitado}/mesa`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        idMesa: idMesa ? Number(idMesa) : null,
                    }),
                }
            );

            await leerRespuesta(respuesta);

            await consultarInvitadosEvento(eventoSeleccionado);

            mostrarMensaje('Asignación de mesa actualizada correctamente.');
        } catch (err) {
            console.error('Error al actualizar mesa:', err);

            mostrarMensaje(
                err.message || 'No fue posible actualizar la mesa.',
                'error'
            );

            await consultarInvitadosEvento(eventoSeleccionado);
        }
    };

    // RETIRAR INVITADO DEL EVENTO
    const retirarInvitado = async () => {
        if (!confirmacionRetirar) return;

        const invitado = confirmacionRetirar;

        try {
            const respuesta = await fetch(
                `${API_INVITADOS}/eventos/${eventoSeleccionado}/invitados/${invitado.id_invitado}`,
                {
                    method: 'DELETE',
                }
            );

            await leerRespuesta(respuesta);

            setConfirmacionRetirar(null);

            await consultarInvitadosEvento(eventoSeleccionado);

            mostrarMensaje(
                'Invitado retirado del evento. Sus datos personales se conservaron.'
            );
        } catch (err) {
            console.error('Error al retirar invitado:', err);

            mostrarMensaje(
                err.message || 'No fue posible retirar al invitado.',
                'error'
            );
        }
    };

    // ELIMINAR INVITADO DEL DIRECTORIO
    const eliminarInvitado = async () => {
        if (!confirmacionEliminar) return;

        const invitado = confirmacionEliminar;

        try {
            setEliminandoId(invitado.idInvitado);

            const respuesta = await fetch(
                `${API_INVITADOS}/${invitado.idInvitado}`,
                {
                    method: 'DELETE',
                }
            );

            await leerRespuesta(respuesta);

            setConfirmacionEliminar(null);

            await consultarInvitados();

            if (eventoSeleccionado) {
                await consultarInvitadosEvento(eventoSeleccionado);
            }

            mostrarMensaje('Invitado eliminado correctamente.');
        } catch (err) {
            console.error('Error al eliminar invitado:', err);

            mostrarMensaje(
                err.message ||
                'No fue posible eliminar al invitado. Puede tener eventos asociados.',
                'error'
            );
        } finally {
            setEliminandoId(null);
        }
    };

    // FILTRAR INVITADOS
    const invitadosFiltrados = invitados.filter((invitado) => {
        const texto = busqueda.toLowerCase();

        return (
            String(invitado.nombre || '').toLowerCase().includes(texto) ||
            String(invitado.correo || '').toLowerCase().includes(texto) ||
            String(invitado.telefono || '').toLowerCase().includes(texto)
        );
    });

    const totalConfirmados = invitadosEvento.filter(
        (invitado) =>
            String(invitado.estado_rsvp || '').toLowerCase() === 'confirmado'
    ).length;

    const totalPendientes = invitadosEvento.filter(
        (invitado) =>
            String(invitado.estado_rsvp || '').toLowerCase() === 'pendiente'
    ).length;

    const totalRechazados = invitadosEvento.filter(
        (invitado) =>
            String(invitado.estado_rsvp || '').toLowerCase() === 'rechazado'
    ).length;

    return (
        <section className="invitados-container">

            {/* RESUMEN */}

            <div className="invitados-resumen">

                <article className="invitado-resumen-card">
                    <div className="invitado-resumen-icon">
                        <Users size={23} />
                    </div>
                    <div>
                        <span>Total invitados</span>
                        <strong>{invitados.length}</strong>
                    </div>
                </article>

                <article className="invitado-resumen-card">
                    <div className="invitado-resumen-icon confirmado">
                        <CheckCircle2 size={23} />
                    </div>
                    <div>
                        <span>Confirmados en el evento</span>
                        <strong>{totalConfirmados}</strong>
                    </div>
                </article>

                <article className="invitado-resumen-card">
                    <div className="invitado-resumen-icon pendiente">
                        <CalendarDays size={23} />
                    </div>
                    <div>
                        <span>Pendientes de respuesta</span>
                        <strong>{totalPendientes}</strong>
                    </div>
                </article>

            </div>

            {/* NOTIFICACIÓN */}

            {mensajeGeneral && (
                <div className={`eventrix-toast ${tipoMensaje}`} role="status">
                    {tipoMensaje === 'exito'
                        ? <CheckCircle2 size={22} />
                        : <AlertCircle size={22} />}

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

            {/* DIRECTORIO */}

            <div className="invitados-panel">

                <div className="invitados-panel-header">
                    <div>
                        <h2>Directorio de invitados</h2>
                        <p>Registra y administra los invitados de EVENTRIX.</p>
                    </div>

                    <div className="invitados-acciones-header">
                        <button
                            type="button"
                            className="invitados-btn-secundario"
                            onClick={() => {
                                consultarInvitados();
                                consultarEventos();
                            }}
                            disabled={cargando}
                        >
                            <RefreshCw size={17} />
                            Actualizar
                        </button>

                        <button
                            type="button"
                            className="invitados-btn-principal"
                            onClick={abrirFormulario}
                        >
                            <Plus size={17} />
                            Nuevo invitado
                        </button>
                    </div>
                </div>

                {/* FORMULARIO */}

                {mostrarFormulario && (
                    <form
                        className="invitados-formulario"
                        onSubmit={guardarInvitado}
                    >
                        <div className="invitados-panel-header">
                            <div>
                                <h2>
                                    {invitadoEditandoId !== null
                                        ? 'Editar invitado'
                                        : 'Registrar invitado'}
                                </h2>

                                <p>
                                    Completa los datos personales del invitado.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="invitados-cerrar-formulario"
                                onClick={cerrarFormulario}
                                disabled={guardando}
                                aria-label="Cerrar formulario"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <div className="invitados-form-grid">

                            <label className="invitados-campo">
                                Nombre completo *
                                <input
                                    type="text"
                                    name="nombre"
                                    placeholder="Nombre del invitado"
                                    value={formulario.nombre}
                                    onChange={manejarCambio}
                                    maxLength={100}
                                    required
                                />
                            </label>

                            <label className="invitados-campo">
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

                            <label className="invitados-campo">
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

                            <label className="invitados-campo">
                                Restricción dietética
                                <input
                                    type="text"
                                    name="restriccionDietetica"
                                    placeholder="Ej. vegetariano, sin gluten..."
                                    value={formulario.restriccionDietetica}
                                    onChange={manejarCambio}
                                    maxLength={100}
                                />
                            </label>

                            {invitadoEditandoId === null && (
                                <>
                                    <label className="invitados-campo">
                                        Asociar a un evento (opcional)
                                        <select
                                            name="idEvento"
                                            value={formulario.idEvento}
                                            onChange={manejarCambio}
                                            disabled={cargandoEventos}
                                        >
                                            <option value="">Registrar sin asociar</option>

                                            {eventos.map((evento) => (
                                                <option
                                                    key={evento.id_evento}
                                                    value={evento.id_evento}
                                                >
                                                    {evento.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    <label className="invitados-campo">
                                        Mesa (opcional)
                                        <select
                                            name="idMesa"
                                            value={formulario.idMesa}
                                            onChange={manejarCambio}
                                            disabled={!formulario.idEvento}
                                        >
                                            <option value="">Sin mesa asignada</option>

                                            {mesasFormulario.map((mesa) => (
                                                <option
                                                    key={mesa.id_mesa}
                                                    value={mesa.id_mesa}
                                                >
                                                    Mesa {mesa.numero} · Capacidad {mesa.capacidad}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    {formulario.idEvento && (
                                        <label className="invitados-campo">
                                            Estado de confirmación
                                            <select
                                                name="estadoRsvp"
                                                value={formulario.estadoRsvp}
                                                onChange={manejarCambio}
                                            >
                                                <option value="Pendiente">Pendiente</option>
                                                <option value="Confirmado">Confirmado</option>
                                                <option value="Rechazado">Rechazado</option>
                                            </select>
                                        </label>
                                    )}
                                </>
                            )}

                        </div>

                        {errorFormulario && (
                            <div className="invitados-form-mensaje error">
                                <AlertCircle size={17} />
                                {errorFormulario}
                            </div>
                        )}

                        <div className="invitados-form-acciones">
                            <button
                                type="button"
                                className="invitados-btn-cancelar"
                                onClick={cerrarFormulario}
                                disabled={guardando}
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="invitados-btn-guardar"
                                disabled={guardando}
                            >
                                <Save size={17} />
                                {guardando
                                    ? 'Guardando...'
                                    : invitadoEditandoId !== null
                                        ? 'Guardar cambios'
                                        : 'Guardar invitado'}
                            </button>
                        </div>

                    </form>
                )}

                {/* BÚSQUEDA */}

                <div className="invitados-controles">
                    <div className="invitados-busqueda">
                        <Search size={19} />

                        <input
                            type="text"
                            placeholder="Buscar por nombre, correo o teléfono..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                </div>

                {/* LISTADO */}

                {cargando ? (
                    <div className="invitados-mensaje">
                        <RefreshCw size={30} className="invitados-spinner" />
                        <strong>Cargando invitados...</strong>
                    </div>

                ) : invitadosFiltrados.length === 0 ? (
                    <div className="invitados-mensaje">
                        <div className="invitados-vacio-icon">
                            <UserRound size={35} />
                        </div>

                        <strong>
                            {invitados.length === 0
                                ? 'No hay invitados registrados'
                                : 'No se encontraron invitados'}
                        </strong>

                        <p>
                            {invitados.length === 0
                                ? 'Cuando registres invitados en EVENTRIX, aparecerán aquí.'
                                : 'Prueba con otro nombre, correo o teléfono.'}
                        </p>
                    </div>

                ) : (
                    <div className="invitados-grid">

                        {invitadosFiltrados.map((invitado) => (
                            <article
                                className="invitado-card"
                                key={invitado.idInvitado}
                            >
                                <div className="invitado-card-header">
                                    <div className="invitado-avatar">
                                        {invitado.nombre?.charAt(0).toUpperCase() || 'I'}
                                    </div>

                                    <span className="invitado-etiqueta">
                                        Invitado
                                    </span>
                                </div>

                                <h3>{invitado.nombre}</h3>

                                <div className="invitado-dato">
                                    <Mail size={16} />
                                    <span>{invitado.correo || 'Sin correo'}</span>
                                </div>

                                <div className="invitado-dato">
                                    <Phone size={16} />
                                    <span>{invitado.telefono || 'Sin teléfono'}</span>
                                </div>

                                <div className="invitado-dato">
                                    <ClipboardList size={16} />
                                    <span>
                                        {invitado.restriccionDietetica ||
                                            'Sin restricciones dietéticas registradas'}
                                    </span>
                                </div>

                                <div className="invitado-acciones">
                                    <button
                                        type="button"
                                        className="invitado-editar-button"
                                        onClick={() => abrirEdicion(invitado)}
                                    >
                                        <Pencil size={15} />
                                        Editar
                                    </button>

                                    <button
                                        type="button"
                                        className="invitado-eliminar-button"
                                        onClick={() => setConfirmacionEliminar(invitado)}
                                        disabled={eliminandoId === invitado.idInvitado}
                                    >
                                        <Trash2 size={15} />
                                        Eliminar
                                    </button>
                                </div>
                            </article>
                        ))}

                    </div>
                )}

                {!cargando && invitados.length > 0 && (
                    <div className="invitados-pie">
                        Mostrando {invitadosFiltrados.length} de {invitados.length} invitados
                    </div>
                )}

            </div>

            {/* GESTIÓN POR EVENTO */}

            <div className="invitados-panel">

                <div className="invitados-panel-header">
                    <div>
                        <h2>Invitados por evento</h2>
                        <p>Administra las asociaciones, confirmaciones y mesas.</p>
                    </div>

                    <CalendarDays size={25} className="invitados-header-icon" />
                </div>

                <div className="invitados-asociacion-controles">

                    <label className="invitados-campo">
                        Seleccionar evento
                        <select
                            value={eventoSeleccionado}
                            onChange={(e) => cambiarEventoSeleccionado(e.target.value)}
                            disabled={cargandoEventos}
                        >
                            <option value="">Selecciona un evento</option>

                            {eventos.map((evento) => (
                                <option
                                    key={evento.id_evento}
                                    value={evento.id_evento}
                                >
                                    {evento.nombre}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="invitados-campo">
                        Seleccionar invitado para asociar
                        <select
                            value={invitadoSeleccionado}
                            onChange={(e) => setInvitadoSeleccionado(e.target.value)}
                            disabled={!eventoSeleccionado || invitados.length === 0}
                        >
                            <option value="">Selecciona un invitado</option>

                            {invitados.map((invitado) => (
                                <option
                                    key={invitado.idInvitado}
                                    value={invitado.idInvitado}
                                    disabled={invitadosEvento.some(
                                        (asociado) =>
                                            Number(asociado.id_invitado) ===
                                            Number(invitado.idInvitado)
                                    )}
                                >
                                    {invitado.nombre}
                                </option>
                            ))}
                        </select>
                    </label>

                    <button
                        type="button"
                        className="invitados-btn-principal invitados-btn-asociar"
                        onClick={asociarInvitado}
                        disabled={
                            !eventoSeleccionado ||
                            !invitadoSeleccionado ||
                            procesandoAsociacion
                        }
                    >
                        <UserPlus size={17} />
                        {procesandoAsociacion ? 'Asociando...' : 'Asociar invitado'}
                    </button>

                </div>

                {!eventoSeleccionado ? (
                    <div className="invitados-mensaje">
                        <div className="invitados-vacio-icon">
                            <CalendarDays size={35} />
                        </div>

                        <strong>Selecciona un evento</strong>
                        <p>
                            Aquí podrás administrar los invitados y sus confirmaciones
                            para cada evento.
                        </p>
                    </div>

                ) : cargandoEvento ? (
                    <div className="invitados-mensaje">
                        <RefreshCw size={30} className="invitados-spinner" />
                        <strong>Cargando invitados del evento...</strong>
                    </div>

                ) : (
                    <>
                        <div className="invitados-estadisticas-evento">
                            <div>
                                <span>Total asociados</span>
                                <strong>{invitadosEvento.length}</strong>
                            </div>

                            <div>
                                <span>Confirmados</span>
                                <strong>{totalConfirmados}</strong>
                            </div>

                            <div>
                                <span>Pendientes</span>
                                <strong>{totalPendientes}</strong>
                            </div>

                            <div>
                                <span>Rechazados</span>
                                <strong>{totalRechazados}</strong>
                            </div>
                        </div>

                        {invitadosEvento.length === 0 ? (
                            <div className="invitados-mensaje">
                                <div className="invitados-vacio-icon">
                                    <Users size={35} />
                                </div>

                                <strong>Este evento todavía no tiene invitados</strong>
                                <p>
                                    Selecciona un invitado arriba para asociarlo a este evento.
                                </p>
                            </div>
                        ) : (
                            <div className="invitados-tabla-contenedor">
                                <table className="invitados-tabla">
                                    <thead>
                                        <tr>
                                            <th>Invitado</th>
                                            <th>Confirmación</th>
                                            <th>Mesa</th>
                                            <th>Acción</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {invitadosEvento.map((invitado) => (
                                            <tr key={invitado.id_invitado}>
                                                <td>
                                                    <div className="invitados-tabla-persona">
                                                        <div className="invitados-tabla-avatar">
                                                            {invitado.nombre?.charAt(0).toUpperCase() || 'I'}
                                                        </div>

                                                        <div>
                                                            <strong>{invitado.nombre}</strong>
                                                            <span>{invitado.correo || 'Sin correo'}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <select
                                                        className={`invitados-rsvp-select ${String(invitado.estado_rsvp || 'Pendiente')
                                                            .toLowerCase()
                                                            }`}
                                                        value={invitado.estado_rsvp || 'Pendiente'}
                                                        onChange={(e) =>
                                                            actualizarRsvp(
                                                                invitado.id_invitado,
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="Pendiente">Pendiente</option>
                                                        <option value="Confirmado">Confirmado</option>
                                                        <option value="Rechazado">Rechazado</option>
                                                    </select>
                                                </td>

                                                <td>
                                                    <div className="invitados-mesa-control">
                                                        <Armchair size={16} />

                                                        <select
                                                            value={invitado.id_mesa ?? ''}
                                                            onChange={(e) =>
                                                                actualizarMesa(
                                                                    invitado.id_invitado,
                                                                    e.target.value
                                                                )
                                                            }
                                                        >
                                                            <option value="">Sin mesa</option>

                                                            {mesasEvento.map((mesa) => (
                                                                <option
                                                                    key={mesa.id_mesa}
                                                                    value={mesa.id_mesa}
                                                                >
                                                                    Mesa {mesa.numero}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </td>

                                                <td>
                                                    <button
                                                        type="button"
                                                        className="invitados-retirar-button"
                                                        onClick={() =>
                                                            setConfirmacionRetirar(invitado)
                                                        }
                                                        title="Retirar invitado del evento"
                                                    >
                                                        <X size={16} />
                                                        Retirar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {invitadosEvento.length > 0 && (
                            <div className="invitados-pie">
                                Total de invitados asociados: {invitadosEvento.length}
                            </div>
                        )}
                    </>
                )}

            </div>

            {/* CONFIRMACIÓN DE ELIMINACIÓN */}

            {confirmacionEliminar && (
                <div
                    className="invitados-modal-overlay"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            setConfirmacionEliminar(null);
                        }
                    }}
                >
                    <div
                        className="invitados-modal"
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="invitados-modal-icono">
                            <AlertTriangle size={30} />
                        </div>

                        <h2>¿Eliminar invitado?</h2>

                        <p>
                            ¿Estás segura de que deseas eliminar a{' '}
                            <strong>{confirmacionEliminar.nombre}</strong>?
                        </p>

                        <span className="invitados-modal-detalle">
                            Si el invitado tiene eventos asociados, el sistema impedirá
                            su eliminación.
                        </span>

                        <div className="invitados-modal-acciones">
                            <button
                                type="button"
                                className="invitados-btn-cancelar"
                                onClick={() => setConfirmacionEliminar(null)}
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                className="invitados-eliminar-button"
                                onClick={eliminarInvitado}
                                disabled={eliminandoId !== null}
                            >
                                <Trash2 size={16} />
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CONFIRMACIÓN PARA RETIRAR DE EVENTO */}

            {confirmacionRetirar && (
                <div
                    className="invitados-modal-overlay"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            setConfirmacionRetirar(null);
                        }
                    }}
                >
                    <div
                        className="invitados-modal"
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="invitados-modal-icono">
                            <AlertTriangle size={30} />
                        </div>

                        <h2>¿Retirar del evento?</h2>

                        <p>
                            ¿Deseas retirar a{' '}
                            <strong>{confirmacionRetirar.nombre}</strong> de este evento?
                        </p>

                        <span className="invitados-modal-detalle">
                            Sus datos personales permanecerán guardados en el directorio
                            de EVENTRIX.
                        </span>

                        <div className="invitados-modal-acciones">
                            <button
                                type="button"
                                className="invitados-btn-cancelar"
                                onClick={() => setConfirmacionRetirar(null)}
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                className="invitados-eliminar-button"
                                onClick={retirarInvitado}
                            >
                                <X size={16} />
                                Sí, retirar
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </section>
    );
}

export default Invitados;
