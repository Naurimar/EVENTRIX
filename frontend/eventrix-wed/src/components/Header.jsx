import { useState } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  CalendarDays,
  LogOut,
  UserRound,
  X,
} from 'lucide-react';

const pageInformation = {
  inicio: {
    title: 'Te damos la bienvenida a EVENTRIX',
    subtitle: 'Gestiona y organiza tus eventos desde un solo lugar.',
  },
  proveedores: {
    title: 'Proveedores',
    subtitle: 'Consulta y administra la información de tus proveedores.',
  },
  reservas: {
    title: 'Reservas',
    subtitle: 'Consulta y realiza seguimiento a las reservas.',
  },
  invitados: {
    title: 'Invitados',
    subtitle: 'Consulta los invitados asociados a los eventos.',
  },
  reportes: {
    title: 'Reportes y analítica',
    subtitle: 'Visualiza los indicadores y estadísticas de EVENTRIX.',
  },
};

const opcionesBusqueda = [
  { id: 'inicio', nombre: 'Inicio' },
  { id: 'reservas', nombre: 'Reservas' },
  { id: 'invitados', nombre: 'Invitados' },
  { id: 'proveedores', nombre: 'Proveedores' },
  { id: 'reportes', nombre: 'Reportes y analítica' },
];

function Header({ activePage, onLogout, onNavigate }) {
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const currentPage = pageInformation[activePage] || {
    title: 'EVENTRIX',
    subtitle: 'Gestión inteligente de eventos.',
  };

  const resultados = opcionesBusqueda.filter((opcion) =>
    opcion.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const navegar = (pagina) => {
    onNavigate(pagina);
    setMostrarBusqueda(false);
    setMostrarNotificaciones(false);
    setMostrarPerfil(false);
    setBusqueda('');
  };

  return (
    <header className="header">
      <div className="header-title">
        <h1>{currentPage.title}</h1>
        <p>{currentPage.subtitle}</p>
      </div>

      <div className="header-actions">
        <div className="header-date">
          <CalendarDays size={17} />
          <span>Panel de gestión</span>
        </div>

        <div className="header-dropdown-container">
          <button
            type="button"
            className="header-icon-button"
            aria-label="Buscar"
            title="Buscar módulos"
            onClick={() => {
              setMostrarBusqueda(!mostrarBusqueda);
              setMostrarNotificaciones(false);
              setMostrarPerfil(false);
            }}
          >
            {mostrarBusqueda ? <X size={20} /> : <Search size={20} />}
          </button>

          {mostrarBusqueda && (
            <div className="header-dropdown search-dropdown">
              <input
                type="search"
                placeholder="Buscar un módulo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                autoFocus
              />

              <div className="dropdown-results">
                {resultados.length > 0 ? (
                  resultados.map((opcion) => (
                    <button
                      type="button"
                      key={opcion.id}
                      onClick={() => navegar(opcion.id)}
                    >
                      {opcion.nombre}
                    </button>
                  ))
                ) : (
                  <p>No se encontraron módulos.</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="header-dropdown-container">
          <button
            type="button"
            className="header-icon-button notification-button"
            aria-label="Notificaciones"
            title="Notificaciones"
            onClick={() => {
              setMostrarNotificaciones(!mostrarNotificaciones);
              setMostrarBusqueda(false);
              setMostrarPerfil(false);
            }}
          >
            <Bell size={20} />
            <span className="notification-dot" />
          </button>

          {mostrarNotificaciones && (
            <div className="header-dropdown notification-dropdown">
              <strong>Notificaciones</strong>
              <div className="notification-empty">
                <Bell size={25} />
                <p>No tienes notificaciones nuevas.</p>
              </div>
            </div>
          )}
        </div>

        <div className="header-dropdown-container profile-container">
          <button
            type="button"
            className="header-profile profile-trigger"
            onClick={() => {
              setMostrarPerfil(!mostrarPerfil);
              setMostrarBusqueda(false);
              setMostrarNotificaciones(false);
            }}
            aria-expanded={mostrarPerfil}
          >
            <div className="profile-avatar">E</div>

            <div className="profile-information">
              <strong>EVENTRIX</strong>
              <span>Panel administrativo</span>
            </div>

            <ChevronDown size={17} />
          </button>

          {mostrarPerfil && (
            <div className="header-dropdown profile-dropdown">
              <div className="profile-dropdown-heading">
                <UserRound size={20} />
                <div>
                  <strong>EVENTRIX</strong>
                  <span>Administrador</span>
                </div>
              </div>

              <button
                type="button"
                className="logout-option"
                onClick={onLogout}
              >
                <LogOut size={18} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
