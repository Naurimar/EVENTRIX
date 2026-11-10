import {
  Search,
  Bell,
  ChevronDown,
  CalendarDays,
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

function Header({ activePage }) {
  const currentPage = pageInformation[activePage] || {
    title: 'EVENTRIX',
    subtitle: 'Gestión inteligente de eventos.',
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

        <button
          type="button"
          className="header-icon-button"
          aria-label="Buscar"
          title="Buscar"
        >
          <Search size={20} />
        </button>

        <button
          type="button"
          className="header-icon-button notification-button"
          aria-label="Notificaciones"
          title="Notificaciones"
        >
          <Bell size={20} />
          <span className="notification-dot" />
        </button>

        <div className="header-profile">
          <div className="profile-avatar">E</div>

          <div className="profile-information">
            <strong>EVENTRIX</strong>
            <span>Panel administrativo</span>
          </div>

          <ChevronDown size={17} />
        </div>
      </div>
    </header>
  );
}

export default Header;
