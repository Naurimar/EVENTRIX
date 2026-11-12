import {
  LayoutDashboard,
  Users,
  CalendarDays,
  UserRound,
  ChartNoAxesCombined,
  CalendarRange,
  ContactRound,
  Building2,
} from 'lucide-react';

const menuItems = [
  { id: 'inicio', label: 'Inicio', icon: LayoutDashboard },
  { id: 'eventos', label: 'Eventos', icon: CalendarRange },
  { id: 'clientes', label: 'Clientes', icon: ContactRound },
  { id: 'espacios', label: 'Espacios', icon: Building2 },
  { id: 'reservas', label: 'Reservas', icon: CalendarDays },
  { id: 'invitados', label: 'Invitados', icon: UserRound },
  { id: 'proveedores', label: 'Proveedores', icon: Users },
  { id: 'reportes', label: 'Reportes', icon: ChartNoAxesCombined },
];

function Sidebar({ activePage, onNavigate }) {
  return (
    <header className="top-navigation">
      <div className="sidebar-brand">
        <img
          src="/images/logo-eventrix.png"
          alt="EVENTRIX"
          className="logo-eventrix"
        />
      </div>

      <nav className="sidebar-navigation">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon size={17} strokeWidth={1.9} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="navigation-decoration">
        <span>EVENTRIX</span>
      </div>
    </header>
  );
}

export default Sidebar;
