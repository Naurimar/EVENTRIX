
import { useState } from 'react'
import {
  House,
  Users,
  CalendarDays,
  Layers3,
  Bell,
  CircleUserRound,
  LogOut
} from 'lucide-react'

import ClientesPage from '../../pages/clientes/ClientesPage'
import EventosPage from '../../pages/eventos/EventosPage'
import EspaciosPage from '../../pages/espacios/EspaciosPage'

import logoEventrix from '../../assets/images/logo-eventrix.png'
import './PanelAdmin.css'

const opciones = [
  { id: 'resumen', nombre: 'Inicio', icono: House },
  { id: 'eventos', nombre: 'Eventos', icono: CalendarDays },
  { id: 'clientes', nombre: 'Clientes', icono: Users },
  { id: 'espacios', nombre: 'Espacios', icono: Layers3 }
]

export default function PanelAdmin({ sesion, cerrarSesion }) {
  const [seccion, setSeccion] = useState('resumen')

  function navegar(id) {
    setSeccion(id)
  }

  return (
    <main className="panel-admin">

      {/* BARRA SUPERIOR HORIZONTAL */}
      <header className="panel-barra-superior">
        <div className="panel-barra-interior">

          {/* LOGO ORIGINAL */}
          <button
            type="button"
            className="panel-marca"
            onClick={() => navegar('resumen')}
            aria-label="Ir al inicio de EVENTRIX"
          >
            <span className="panel-logo-recorte">
              <img
                src={logoEventrix}
                alt="Logo de EVENTRIX"
                className="panel-logo"
              />
            </span>

            <span className="panel-marca-textos">
              <strong>EVENTRIX</strong>
              <small>GESTIÓN INTELIGENTE DE EVENTOS</small>
            </span>
          </button>

          {/* NAVEGACIÓN HORIZONTAL */}
          <nav
            className="panel-navegacion"
            aria-label="Navegación principal"
          >
            {opciones.map(({ id, nombre, icono: Icono }) => (
              <button
                key={id}
                type="button"
                className={`panel-enlace ${
                  seccion === id ? 'seleccionado' : ''
                }`}
                onClick={() => navegar(id)}
                aria-current={
                  seccion === id ? 'page' : undefined
                }
              >
                <Icono size={17} />
                <span>{nombre}</span>
              </button>
            ))}
          </nav>

          {/* USUARIO Y CIERRE DE SESIÓN */}
          <div className="panel-barra-derecha">

            <span
              className="panel-notificaciones"
              title="Notificaciones: próximamente"
            >
              <Bell size={19} />
            </span>

            <div className="panel-perfil">
              <CircleUserRound size={29} />

              <span className="panel-perfil-datos">
                <strong>
                  {sesion?.nombre || 'Mi cuenta'}
                </strong>
                <small>
                  {sesion?.correo || 'Usuario'}
                </small>
              </span>
            </div>

            <button
              type="button"
              className="panel-salir"
              onClick={cerrarSesion}
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
            >
              <LogOut size={19} />
            </button>

          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <section className="panel-contenido">

        {seccion === 'resumen' ? (

          /* MÓDULO DE INICIO */
          <div className="panel-inicio">
            <div className="panel-titulo-seccion">
              <h1>Bienvenido a EVENTRIX</h1>
              <p>
                Gestiona tus clientes, eventos y espacios
                desde un solo lugar.
              </p>
            </div>

            <div className="panel-tarjetas">
              {opciones.slice(1).map(
                ({ id, nombre, icono: Icono }) => (
                  <button
                    type="button"
                    key={id}
                    className="panel-tarjeta"
                    onClick={() => navegar(id)}
                  >
                    <Icono size={30} />
                    <strong>{nombre}</strong>
                    <span>Gestionar módulo</span>
                  </button>
                )
              )}
            </div>
          </div>

        ) : seccion === 'clientes' ? (

          /* GESTIÓN DE CLIENTES */
          <ClientesPage />

        ) : seccion === 'eventos' ? (

          /* GESTIÓN DE EVENTOS */
          <EventosPage />

        ) : seccion === 'espacios' ? (

          /* GESTIÓN DE ESPACIOS */
          <EspaciosPage />

        ) : null}

      </section>

    </main>
  )
}
