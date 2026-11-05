
import { useState } from 'react'
import logo from './assets/logo-eventrix.png'
import './App.css'

const API_URL = 'http://localhost:8080/api'

function App() {
  const [vista, setVista] = useState('inicio')
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [mostrarClave, setMostrarClave] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [sesion, setSesion] = useState(null)

  async function iniciarSesion(event) {
    event.preventDefault()
    setError('')
    setCargando(true)

    try {
      const respuesta = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo, clave }),
      })

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.error || 'Correo o contraseña incorrectos.')
      }

      const token = datos.token
      const partes = token.split('.')
      const payload = partes[1].replace(/-/g, '+').replace(/_/g, '/')
      const contenido = JSON.parse(
        decodeURIComponent(
          atob(payload)
            .split('')
            .map((caracter) =>
              '%' + caracter.charCodeAt(0).toString(16).padStart(2, '0'),
            )
            .join(''),
        ),
      )

      const usuario = {
        correo: contenido.sub,
        rol: contenido.rol,
        token,
      }

      sessionStorage.setItem('eventrix_token', token)
      setSesion(usuario)
      setClave('')
    } catch (err) {
      setError(
        err.message.includes('Failed to fetch')
          ? 'No se pudo conectar con el servidor. Verifica que el backend esté funcionando.'
          : err.message,
      )
    } finally {
      setCargando(false)
    }
  }

  function cerrarSesion() {
    sessionStorage.removeItem('eventrix_token')
    setSesion(null)
    setCorreo('')
    setClave('')
    setVista('inicio')
    setError('')
  }

  return (
    <div className="app">
      <header className="navbar">
        <a className="marca" href="#inicio" onClick={() => setVista('inicio')}>
          <img src={logo} alt="Logo EVENTRIX" />
          <span>EVENTRIX</span>
        </a>

        <nav className="nav-links">
          <a href="#inicio" onClick={() => setVista('inicio')}>Inicio</a>
          <a href="#nosotros" onClick={() => setVista('inicio')}>Nosotros</a>
          <a href="#funcionalidades" onClick={() => setVista('inicio')}>Funcionalidades</a>
          <a href="#contacto" onClick={() => setVista('inicio')}>Contacto</a>
        </nav>

        {sesion ? (
          <button className="btn-nav" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        ) : (
          <button className="btn-nav" onClick={() => setVista('login')}>
            Iniciar sesión
          </button>
        )}
      </header>

      {vista === 'inicio' && (
        <main>
          <section className="hero-section" id="inicio">
            <div className="hero-content">
              <span className="etiqueta">GESTIÓN INTELIGENTE DE EVENTOS</span>
              <h1>
                Tus eventos,
                <span> nuestra pasión.</span>
              </h1>
              <p>
                Organiza, administra y transforma tus eventos desde un solo
                lugar. Con EVENTRIX, cada detalle cuenta y cada experiencia
                se convierte en algo extraordinario.
              </p>
              <div className="hero-buttons">
                <button className="btn-primary" onClick={() => setVista('login')}>
                  Comenzar ahora
                </button>
                <a className="btn-secondary" href="#funcionalidades">
                  Conocer más
                </a>
              </div>
            </div>

            <div className="hero-decoration">
              <div className="hero-card">
                <img src={logo} alt="EVENTRIX" />
                <span>EVENTRIX</span>
                <p>Gestión inteligente de eventos.</p>
                <div className="decorative-line" />
                <span className="gold-text">Cada evento, una experiencia.</span>
              </div>
            </div>
          </section>

          <section className="about-section" id="nosotros">
            <span className="section-label">CONÓCENOS</span>
            <h2>Todo lo que necesitas para crear eventos inolvidables</h2>
            <p>
              EVENTRIX es una plataforma diseñada para facilitar la
              organización y administración de eventos, centralizando
              procesos y permitiendo gestionar cada etapa de manera
              práctica, organizada e inteligente.
            </p>
          </section>

          <section className="features-section" id="funcionalidades">
            <span className="section-label">NUESTRAS FUNCIONALIDADES</span>
            <h2>Organización en un solo lugar</h2>

            <div className="feature-grid">
              <article className="feature-card">
                <span className="feature-icon">✦</span>
                <h3>Gestión de eventos</h3>
                <p>Administra la información y planificación de tus eventos.</p>
              </article>

              <article className="feature-card">
                <span className="feature-icon">◇</span>
                <h3>Clientes y espacios</h3>
                <p>Centraliza la información de clientes y lugares.</p>
              </article>

              <article className="feature-card">
                <span className="feature-icon">♧</span>
                <h3>Reservas y proveedores</h3>
                <p>Organiza recursos, proveedores y reservas.</p>
              </article>

              <article className="feature-card">
                <span className="feature-icon">◎</span>
                <h3>Control y reportes</h3>
                <p>Consulta información para dar seguimiento a tu gestión.</p>
              </article>
            </div>
          </section>

          <section className="benefits-section">
            <div>
              <span className="section-label">¿POR QUÉ EVENTRIX?</span>
              <h2>Más organización. Mejores experiencias.</h2>
            </div>
            <div className="benefits-list">
              <p>✓ Información centralizada.</p>
              <p>✓ Procesos organizados.</p>
              <p>✓ Gestión práctica y eficiente.</p>
              <p>✓ Acceso según el rol de cada usuario.</p>
            </div>
          </section>

          <section className="contact-section" id="contacto">
            <span className="section-label">ESTAMOS PARA AYUDARTE</span>
            <h2>Haz que cada evento sea extraordinario.</h2>
            <button className="btn-primary" onClick={() => setVista('login')}>
              Acceder a EVENTRIX
            </button>
          </section>
        </main>
      )}

      {vista === 'login' && (
        <main className="login-section">
          <div className="login-decoration">
            <img src={logo} alt="Logo EVENTRIX" />
            <h2>Bienvenido a EVENTRIX</h2>
            <p>Gestiona tus eventos. Crea experiencias inolvidables.</p>
          </div>

          <div className="login-card">
            {sesion ? (
              <div className="session-success">
                <span className="success-icon">✓</span>
                <h2>¡Bienvenido!</h2>
                <p>Has iniciado sesión correctamente.</p>
                <div className="session-info">
                  <p><strong>Correo:</strong> {sesion.correo}</p>
                  <p><strong>Rol:</strong> {sesion.rol}</p>
                </div>
                <button className="btn-primary full-width" onClick={() => setVista('inicio')}>
                  Ir al inicio
                </button>
                <button className="btn-secondary full-width" onClick={cerrarSesion}>
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <>
                <span className="section-label">TU ESPACIO DE GESTIÓN</span>
                <h1>Iniciar sesión</h1>
                <p className="login-description">
                  Ingresa tus credenciales para continuar.
                </p>

                <form onSubmit={iniciarSesion}>
                  <label htmlFor="correo">Correo electrónico</label>
                  <input
                    id="correo"
                    type="email"
                    placeholder="nombre@correo.com"
                    value={correo}
                    onChange={(event) => setCorreo(event.target.value)}
                    required
                  />

                  <label htmlFor="clave">Contraseña</label>
                  <div className="password-field">
                    <input
                      id="clave"
                      type={mostrarClave ? 'text' : 'password'}
                      placeholder="Ingresa tu contraseña"
                      value={clave}
                      onChange={(event) => setClave(event.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="show-password"
                      onClick={() => setMostrarClave(!mostrarClave)}
                    >
                      {mostrarClave ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>

                  {error && <p className="error-message">{error}</p>}

                  <button
                    className="btn-primary full-width"
                    type="submit"
                    disabled={cargando}
                  >
                    {cargando ? 'Verificando...' : 'Ingresar'}
                  </button>
                </form>

                <button className="back-link" onClick={() => setVista('inicio')}>
                  ← Volver al inicio
                </button>
              </>
            )}
          </div>
        </main>
      )}

      <footer className="footer">
        <span>EVENTRIX</span>
        <p>Gestión inteligente de eventos.</p>
        <small>© {new Date().getFullYear()} EVENTRIX. Todos los derechos reservados.</small>
      </footer>
    </div>
  )
}

export default App
