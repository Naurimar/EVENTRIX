
import { useEffect, useState } from 'react';

import {
  CalendarDays,
  Users,
  BriefcaseBusiness,
  CalendarCheck,
  ArrowUpRight,
  Clock3,
  ChartNoAxesCombined,
} from 'lucide-react';

import Sidebar from './components/Sidebar';
import Header from './components/Header';

import Reservas from './pages/Reservas';
import Reportes from './pages/Reportes';
import Proveedores from './pages/Proveedores';
import Invitados from './pages/Invitados';

import './App.css';

const API_REPORTES = 'http://localhost:8080/api/reportes/resumen';

const pageContent = {
  inicio: {
    title: 'Te damos la bienvenida a EVENTRIX',
    description: 'Gestiona y organiza tus eventos desde un solo lugar.',
  },
  reservas: {
    title: 'Reservas',
    description: 'Consulta y realiza seguimiento a las reservas de eventos.',
  },
  invitados: {
    title: 'Invitados',
    description: 'Consulta los invitados asociados a tus eventos.',
  },
  proveedores: {
    title: 'Proveedores',
    description: 'Consulta los proveedores registrados y sus servicios.',
  },
  reportes: {
    title: 'Reportes y analítica',
    description: 'Visualiza los indicadores y análisis estadísticos de EVENTRIX.',
  },
};

// Leer las reservas guardadas en el navegador.
function obtenerReservas() {
  try {
    const datos = localStorage.getItem('eventrix_reservas');

    if (!datos) {
      return [];
    }

    const reservas = JSON.parse(datos);
    return Array.isArray(reservas) ? reservas : [];
  } catch (error) {
    console.error('Error al consultar las reservas:', error);
    return [];
  }
}

function Dashboard() {
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorAPI, setErrorAPI] = useState('');

  useEffect(() => {
    const consultarResumen = async () => {
      try {
        setCargando(true);
        setErrorAPI('');

        const respuesta = await fetch(API_REPORTES);

        if (!respuesta.ok) {
          throw new Error(`Error HTTP ${respuesta.status}`);
        }

        const datos = await respuesta.json();
        setResumen(datos);
      } catch (error) {
        console.error('Error al consultar el resumen:', error);
        setErrorAPI('No fue posible cargar los indicadores del servidor.');
      } finally {
        setCargando(false);
      }
    };

    consultarResumen();
  }, []);

  // Reservas locales: se conservan como estaban.
  const reservas = obtenerReservas();

  const totalReservas = reservas.length;

  const reservasConfirmadas = reservas.filter(
    (reserva) =>
      String(reserva.estado || '').toLowerCase() === 'confirmada'
  ).length;

  const reservasPendientes = reservas.filter(
    (reserva) =>
      String(reserva.estado || '').toLowerCase() === 'pendiente'
  ).length;

  const reservasCanceladas = reservas.filter(
    (reserva) =>
      String(reserva.estado || '').toLowerCase() === 'cancelada'
  ).length;

  const totalInvitadosReservas = reservas.reduce((total, reserva) => {
    return total + (Number(reserva.invitados) || 0);
  }, 0);

  const indicadores = resumen || {};

  const indicadoresTarjeta = [
    {
      title: 'Eventos',
      value: cargando ? '...' : (indicadores.totalEventos ?? 0),
      detail: 'Eventos registrados en la base de datos',
      icon: CalendarDays,
      color: 'gold',
    },
    {
      title: 'Reservas',
      value: totalReservas,
      detail: 'Reservas guardadas en este navegador',
      icon: CalendarCheck,
      color: 'purple',
    },
    {
      title: 'Invitados',
      value: cargando
        ? '...'
        : (indicadores.totalInvitados ?? totalInvitadosReservas),
      detail: 'Invitados registrados en el resumen',
      icon: Users,
      color: 'lavender',
    },
    {
      title: 'Presupuesto total',
      value: cargando
        ? '...'
        : `$ ${Number(indicadores.presupuestoTotal ?? 0).toLocaleString('es-CO')}`,
      detail: 'Presupuesto acumulado de eventos',
      icon: BriefcaseBusiness,
      color: 'gold',
    },
  ];

  const upcomingEvents = [];

  return (
    <>
      <section className="welcome-card">
        <span className="welcome-label">
          GESTIÓN INTELIGENTE DE EVENTOS
        </span>

        <h2>¡Te damos la bienvenida a EVENTRIX!</h2>

        <p>
          Gestiona, organiza y analiza tus eventos
          de forma inteligente desde una sola plataforma.
        </p>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>Resumen general</h2>
            <p>Indicadores principales de EVENTRIX</p>
          </div>

          <span className="period-label">Datos del sistema</span>
        </div>

        {errorAPI && (
          <p role="alert" className="api-error">
            {errorAPI}
          </p>
        )}

        <div className="indicators-grid">
          {indicadoresTarjeta.map((item) => {
            const Icon = item.icon;

            return (
              <article className="indicator-card" key={item.title}>
                <div className={`indicator-icon ${item.color}`}>
                  <Icon size={23} />
                </div>

                <div className="indicator-information">
                  <span>{item.title}</span>
                  <strong>{item.value}</strong>
                  <small>{item.detail}</small>
                </div>

                <ArrowUpRight className="indicator-arrow" size={17} />
              </article>
            );
          })}
        </div>

        {!cargando && resumen && (
          <div className="dashboard-panel" style={{ marginTop: '17px' }}>
            <div className="panel-heading">
              <div>
                <h3>Presupuesto promedio por evento</h3>
                <p>Promedio calculado por el módulo de analítica</p>
              </div>
              <ChartNoAxesCombined size={21} />
            </div>

            <strong>
              $ {Number(indicadores.presupuestoPromedio ?? 0).toLocaleString('es-CO')}
            </strong>
          </div>
        )}
      </section>

      <section className="dashboard-bottom">
        <article className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h3>Reservas por estado</h3>
              <p>Distribución de las reservas guardadas en este navegador</p>
            </div>

            <CalendarCheck size={21} />
          </div>

          {totalReservas === 0 ? (
            <div className="empty-chart">
              <div className="empty-chart-icon">
                <ChartNoAxesCombined size={34} />
              </div>

              <strong>Sin reservas registradas</strong>

              <p>
                Cuando se registren reservas, aquí podrás
                consultar su distribución por estado.
              </p>
            </div>
          ) : (
            <div className="reservation-status-summary">
              <div className="reservation-status-row">
                <span>Confirmadas</span>
                <strong>{reservasConfirmadas}</strong>
              </div>

              <div className="reservation-status-row">
                <span>Pendientes</span>
                <strong>{reservasPendientes}</strong>
              </div>

              <div className="reservation-status-row">
                <span>Canceladas</span>
                <strong>{reservasCanceladas}</strong>
              </div>

              <div className="reservation-status-total">
                <span>Total de reservas</span>
                <strong>{totalReservas}</strong>
              </div>
            </div>
          )}
        </article>

        <article className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h3>Próximos eventos</h3>
              <p>Eventos registrados en el sistema</p>
            </div>

            <CalendarDays size={21} />
          </div>

          <div className="empty-chart">
            <div className="empty-chart-icon">
              <CalendarDays size={34} />
            </div>

            <strong>Consulta de próximos eventos pendiente</strong>

            <p>
              Esta sección se conectará cuando tengamos disponible
              la consulta de eventos en la API.
            </p>
          </div>
        </article>
      </section>

      <section className="dashboard-panel quick-access-panel">
        <div className="panel-heading">
          <div>
            <h3>Accesos rápidos</h3>
            <p>Explora los módulos de EVENTRIX</p>
          </div>
        </div>

        <div className="quick-access-grid">
          <div className="quick-access-item">
            <BriefcaseBusiness size={27} />
            <strong>Proveedores</strong>
            <span>Consulta los servicios</span>
          </div>

          <div className="quick-access-item">
            <CalendarCheck size={27} />
            <strong>Reservas</strong>
            <span>Consulta las reservas</span>
          </div>

          <div className="quick-access-item">
            <Users size={27} />
            <strong>Invitados</strong>
            <span>Consulta los invitados</span>
          </div>

          <div className="quick-access-item">
            <ChartNoAxesCombined size={27} />
            <strong>Reportes y analítica</strong>
            <span>Consulta las estadísticas</span>
          </div>
        </div>
      </section>
    </>
  );
}

function ModulePlaceholder({ title, description }) {
  return (
    <section className="module-placeholder">
      <div className="module-placeholder-icon">
        <Clock3 size={32} />
      </div>

      <h2>{title}</h2>
      <p>{description}</p>
      <span>Sección en desarrollo</span>
    </section>
  );
}

function App() {
  const [activePage, setActivePage] = useState('inicio');

  const currentPage = pageContent[activePage] || {
    title: 'EVENTRIX',
    description: 'Gestión inteligente de eventos.',
  };

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <main className="main-content">
        <Header activePage={activePage} />

        <section className="page-content">
          {activePage === 'inicio' ? (
            <Dashboard />
          ) : activePage === 'reservas' ? (
            <>
              <section className="module-banner">
                <span className="welcome-label">
                  GESTIÓN INTELIGENTE DE EVENTOS
                </span>

                <h2>{currentPage.title}</h2>
                <p>{currentPage.description}</p>
              </section>

              <Reservas />
            </>
          ) : activePage === 'reportes' ? (
            <>
              <section className="module-banner">
                <span className="welcome-label">
                  ANÁLISIS Y ESTADÍSTICAS
                </span>

                <h2>{currentPage.title}</h2>
                <p>{currentPage.description}</p>
              </section>

              <Reportes />
            </>
          ) : activePage === 'proveedores' ? (
            <>
              <section className="module-banner">
                <span className="welcome-label">
                  GESTIÓN DE PROVEEDORES
                </span>

                <h2>{currentPage.title}</h2>
                <p>{currentPage.description}</p>
              </section>

              <Proveedores />
            </>
          ) : activePage === 'invitados' ? (
            <>
              <section className="module-banner">
                <span className="welcome-label">
                  GESTIÓN DE INVITADOS
                </span>

                <h2>{currentPage.title}</h2>
                <p>{currentPage.description}</p>
              </section>
              

              <Invitados />
            </>
          ) : (
            <>
              <section className="module-banner">
                <span className="welcome-label">
                  GESTIÓN INTELIGENTE DE EVENTOS
                </span>

                <h2>{currentPage.title}</h2>
                <p>{currentPage.description}</p>
              </section>

              <ModulePlaceholder
                title={currentPage.title}
                description={currentPage.description}
              />
            </>
          )}
        </section>

        <footer className="app-footer">
          <span>EVENTRIX © 2026</span>
          <span>Gestión inteligente de eventos.</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
