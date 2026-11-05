
import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Building2,
  Menu,
  X,
  LogOut
} from 'lucide-react'

import ClientesPage from '../../pages/clientes/ClientesPage'
import './PanelAdmin.css'

const opciones = [
  { id: 'resumen', nombre: 'Resumen', icono: LayoutDashboard },
  { id: 'clientes', nombre: 'Clientes', icono: Users },
  { id: 'eventos', nombre: 'Eventos', icono: CalendarDays },
  { id: 'espacios', nombre: 'Espacios', icono: Building2 },
]

export default function PanelAdmin({ sesion, cerrarSesion }) {
  const [seccion, setSeccion] = useState('resumen')
  const [menuAbierto, setMenuAbierto] = useState(false)

  function navegar(id) {
    setSeccion(id)
    setMenuAbierto(false)
  }

  return (
    <main className="panel-admin">

      {/* ENCABEZADO DEL PANEL */}
      <div className="panel-encabezado">
        <div>
          <span className="panel-etiqueta">
            EVENTRIX · ADMINISTRACIÓN
          </span>

          <h1>Panel de gestión</h1>

          <p>
            Organiza clientes, eventos y espacios desde un solo lugar.
          </p>
        </div>

        <div className="panel-usuario">
          <span>{sesion?.correo}</span>

          <button type="button" onClick={cerrarSesion}>
            <LogOut size={17} />
            Salir
          </button>
        </div>
      </div>

      {/* MENÚ RESPONSIVE PARA CELULARES */}
      <button
        type="button"
        className="panel-menu-movil"
        onClick={() => setMenuAbierto(!menuAbierto)}
        aria-expanded={menuAbierto}
        aria-controls="panel-navegacion"
      >
        {menuAbierto ? <X size={20} /> : <Menu size={20} />}
        Módulos de gestión
      </button>

      {/* NAVEGACIÓN DE MÓDULOS */}
      <nav
        id="panel-navegacion"
        className={`panel-navegacion ${menuAbierto ? 'abierta' : ''}`}
        aria-label="Módulos de administración"
      >
        {opciones.map(({ id, nombre, icono: Icono }) => (
          <button
            type="button"
            key={id}
            className={seccion === id ? 'seleccionado' : ''}
            onClick={() => navegar(id)}
            aria-current={seccion === id ? 'page' : undefined}
          >
            <Icono size={19} />
            {nombre}
          </button>
        ))}
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <section className="panel-contenido">

        {/* RESUMEN */}
        {seccion === 'resumen' ? (
          <>
            <h2>Bienvenido a EVENTRIX</h2>

            <p>
              Selecciona un módulo para administrar la información
              de tus clientes, eventos y espacios.
            </p>

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
          </>
        ) : seccion === 'clientes' ? (

          /* GESTIÓN DE CLIENTES */
          <ClientesPage />

        ) : seccion === 'eventos' ? (

          /* GESTIÓN DE EVENTOS */
          <>
            <h2>Gestión de eventos</h2>
            <p>
              Aquí integraremos el listado, registro, edición
              y eliminación de bodas, cumpleaños y quinceañeros.
            </p>
          </>

        ) : seccion === 'espacios' ? (

          /* GESTIÓN DE ESPACIOS */
          <>
            <h2>Gestión de espacios</h2>
            <p>
              Aquí integraremos los salones y espacios disponibles,
              con sus capacidades, tarifas y estados.
            </p>
          </>

        ) : null}

      </section>
    </main>
  )
}
