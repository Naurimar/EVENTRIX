import { useState } from 'react'
import {
  CalendarDays, Users, Layers, BarChart3, Target, Gem, Heart, Zap,
  ShieldCheck, Star, Mail, Phone, MapPin, MessageCircle, Send, User,
  Play, ChevronDown, Eye, EyeOff, Lock, Check, LogIn, ArrowLeft,
} from 'lucide-react'
import logo from './assets/images/logo-eventrix.png'
import heroImage from './assets/images/hero-eventrix.jpg'
import aboutImage from './assets/images/about-eventrix.jpg'
import PanelAdmin from './components/layout/PanelAdmin'
import './App.css'

const API_URL = 'http://localhost:8080/api'

const Ola = ({ color, arriba }) => (
  <svg className={`ola${arriba ? ' ola-arriba' : ''}`} viewBox="0 0 1440 140" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0,70 C220,150 470,0 760,50 C1040,100 1230,110 1440,30 L1440,140 L0,140 Z" fill={color} />
    <path d="M0,70 C220,150 470,0 760,50 C1040,100 1230,110 1440,30" fill="none" stroke="#D4AF37" strokeWidth="2" opacity=".7" />
  </svg>
)

const Marca = () => <>EVENT<span>RIX</span></>

function App() {
  const [vista, setVista] = useState('inicio')
  const [activa, setActiva] = useState('inicio')
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [mostrarClave, setMostrarClave] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [sesion, setSesion] = useState(null)
  const [mensajeContacto, setMensajeContacto] = useState('')

  async function iniciarSesion(event) {
    event.preventDefault()
    setError('')
    setCargando(true)
    try {
      const respuesta = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, clave }),
      })
      const datos = await respuesta.json()
      if (!respuesta.ok) throw new Error(datos.error || 'Correo o contraseña incorrectos.')

      const token = datos.token
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
      const contenido = JSON.parse(
        decodeURIComponent(
          atob(payload).split('')
            .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
            .join('')
        )
      )
      sessionStorage.setItem('eventrix_token', token)
      setSesion({ correo: contenido.sub, rol: contenido.rol, token })
      setVista('panel')
      setClave('')
    } catch (err) {
      setError(
        err.message.includes('Failed to fetch')
          ? 'No se pudo conectar con el servidor. Verifica que el backend esté funcionando.'
          : err.message
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

  function irAInicio(seccion = 'inicio') {
    setVista('inicio')
    setActiva(seccion)
    setTimeout(() => {
      document.getElementById(seccion)?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  function enviarContacto(event) {
    event.preventDefault()
    setMensajeContacto('¡Gracias por contactarnos! Tu mensaje está preparado.')
    event.target.reset()
  }

  const enlaces = [
    ['inicio', 'Inicio'],
    ['nosotros', 'Sobre EVENTRIX'],
    ['funcionalidades', 'Funcionalidades'],
    ['beneficios', 'Beneficios'],
    ['contacto', 'Contacto'],
  ]

  const funciones = [
    [CalendarDays, 'Gestión de eventos'],
    [Users, 'Administración de clientes'],
    [Layers, 'Control de recursos'],
    [Users, 'Gestión de invitados'],
    [BarChart3, 'Reportes y analítica'],
  ]

  const beneficios = [
    [Zap, 'Mayor eficiencia', 'Automatiza procesos y reduce tiempos de gestión.'],
    [ShieldCheck, 'Información segura', 'Protege y centraliza tus datos.'],
    [Users, 'Mejor organización', 'Controla clientes, espacios y recursos en un solo lugar.'],
    [Star, 'Experiencia profesional', 'Ofrece eventos de calidad con una gestión integral.'],
  ]

  return (
    <div className="app">
      {/* NAVEGACIÓN */}
      <header className="navbar">
        <a className="marca" href="#inicio" onClick={() => irAInicio('inicio')}>
          <img src={logo} alt="EVENTRIX" />
          <span>
            <Marca />
            <small>GESTIÓN INTELIGENTE DE EVENTOS</small>
          </span>
        </a>

        <nav className="nav-links">
          {enlaces.map(([id, texto]) => (
            <a
              key={id}
              href={`#${id}`}
              className={vista === 'inicio' && activa === id ? 'activo' : ''}
              onClick={() => irAInicio(id)}
            >
              {texto}
            </a>
          ))}
        </nav>

        {sesion ? (
          <button className="btn-nav" onClick={cerrarSesion}>Cerrar sesión</button>
        ) : (
          <button className="btn-nav" onClick={() => setVista('login')}>
            <User size={16} /> Iniciar sesión
          </button>
        )}
      </header>

      {vista === 'inicio' && (
        <main>
          {/* PORTADA */}
          <section className="hero-section" id="inicio">
            <img className="hero-bg" src={heroImage} alt="Mesa elegante decorada para eventos" />
            <div className="hero-content">
              <h1><Marca /></h1>
              <h2><span className="linea-h" />Gestión Inteligente de Eventos</h2>
              <p>
                Una plataforma integral para planificar, organizar y
                administrar todo tipo de eventos de forma sencilla,
                segura y eficiente.
              </p>
              <div className="hero-buttons">
                <button className="btn-primary" onClick={() => irAInicio('nosotros')}>
                  <Play size={16} /> Conoce más
                </button>
                <button className="btn-secondary" onClick={() => setVista('login')}>
                  <User size={16} /> Iniciar sesión
                </button>
              </div>
            </div>
            <button className="scroll-down" onClick={() => irAInicio('nosotros')} aria-label="Bajar">
              <ChevronDown size={22} />
            </button>
            <Ola color="#F8EDFF" />
          </section>

          {/* SOBRE EVENTRIX */}
          <section className="about-section" id="nosotros">
            <div className="about-image">
              <img src={aboutImage} alt="Espacio decorado para eventos" />
            </div>

            <div className="about-content">
              <h2>Sobre <Marca /></h2>
              <div className="decorative-line" />
              <p>
                Somos una plataforma web diseñada para centralizar y facilitar
                la gestión integral de eventos, optimizando la planificación,
                organización y control de cada detalle.
              </p>
            </div>

            <div className="mission-list">
              <article>
                <Target size={40} strokeWidth={1.5} />
                <div>
                  <h3>Nuestra misión</h3>
                  <p>Facilitar la gestión de eventos mediante una solución tecnológica confiable y moderna.</p>
                </div>
              </article>
              <article>
                <Gem size={40} strokeWidth={1.5} />
                <div>
                  <h3>Nuestra visión</h3>
                  <p>Ser una plataforma de referencia en la gestión de eventos, reconocida por su innovación y calidad.</p>
                </div>
              </article>
              <article>
                <Heart size={40} strokeWidth={1.5} />
                <div>
                  <h3>Nuestros valores</h3>
                  <p>Organización, innovación, compromiso, calidad y trabajo en equipo.</p>
                </div>
              </article>
            </div>
            <Ola color="#F3E5FC" />
          </section>

          {/* FUNCIONALIDADES */}
          <section className="features-section" id="funcionalidades">
            <div className="section-heading">
              <h2>Funcionalidades de <Marca /></h2>
              <p>Conoce las principales herramientas que te ofrece la plataforma para gestionar tus eventos.</p>
            </div>
            <div className="feature-grid">
              {funciones.map(([Icono, titulo], i) => (
                <article className="feature-card" key={i}>
                  <Icono size={42} strokeWidth={1.5} />
                  <h3>{titulo}</h3>
                </article>
              ))}
            </div>
          </section>

          {/* BENEFICIOS */}
          <section className="benefits-section" id="beneficios">
            <img className="benefits-bg" src={heroImage} alt="" />
            <Ola color="#F7EEFD" arriba />
            <div className="benefits-content">
              <h2>Beneficios de <Marca /></h2>
              <p className="benefits-subtitle">
                Descubre las ventajas de gestionar tus eventos con nuestra plataforma.
              </p>
              <div className="benefits-grid">
                {beneficios.map(([Icono, titulo, texto], i) => (
                  <article key={i}>
                    <Icono size={42} strokeWidth={1.4} />
                    <h3>{titulo}</h3>
                    <p>{texto}</p>
                  </article>
                ))}
              </div>
            </div>
            <Ola color="#F6EBFC" />
          </section>

          {/* CONTACTO */}
          <section className="contact-section" id="contacto">
            <div className="contact-information">
              <h2>Contáctanos</h2>
              <div className="decorative-line" />
              <p>
                ¿Tienes preguntas, sugerencias o quieres más información
                sobre EVENTRIX? Estaremos encantados de ayudarte.
              </p>
              <div className="contact-detail">
                <Mail size={38} strokeWidth={1.5} />
                <div><strong>Correo electrónico</strong><p>soporte@eventrix.com</p></div>
              </div>
              <div className="contact-detail">
                <Phone size={38} strokeWidth={1.5} />
                <div><strong>Teléfono</strong><p>+57 300 123 4567</p></div>
              </div>
              <div className="contact-detail">
                <MapPin size={38} strokeWidth={1.5} />
                <div><strong>Ubicación</strong><p>Medellín, Antioquia – Colombia</p></div>
              </div>
            </div>

            <div className="contact-form-card">
              <h3><MessageCircle size={20} /> Envíanos un mensaje</h3>
              <form onSubmit={enviarContacto}>
                <div className="contact-fields">
                  <div>
                    <label>Nombre completo <b>*</b></label>
                    <input type="text" placeholder="Escribe tu nombre" required />
                  </div>
                  <div>
                    <label>Correo electrónico <b>*</b></label>
                    <input type="email" placeholder="correo@ejemplo.com" required />
                  </div>
                </div>
                <div>
                  <label>Asunto <b>*</b></label>
                  <select required defaultValue="">
                    <option value="" disabled>Selecciona un asunto</option>
                    <option>Información general</option>
                    <option>Soporte técnico</option>
                    <option>Servicios</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div>
                  <label>Mensaje <b>*</b></label>
                  <textarea placeholder="Escribe tu mensaje..." rows="4" required />
                </div>
                <button className="btn-send" type="submit">
                  <Send size={17} /> Enviar mensaje
                </button>
                {mensajeContacto && <p className="contact-success">{mensajeContacto}</p>}
              </form>
            </div>
          </section>
        </main>
      )}

      {/* INICIO DE SESIÓN */}
      {vista === 'login' && (
        <main className="login-section">
          <div className="login-photo">
            <img src={heroImage} alt="Decoración de eventos EVENTRIX" />
            <div className="login-features">
              <span><CalendarDays size={26} strokeWidth={1.5} /> Gestiona eventos</span>
              <span><Users size={26} strokeWidth={1.5} /> Administra clientes</span>
              <span><Layers size={26} strokeWidth={1.5} /> Controla espacios</span>
              <span><BarChart3 size={26} strokeWidth={1.5} /> Genera reportes</span>
            </div>
          </div>

          <div className="login-panel">
            <div className="login-fondo" />
            <svg className="login-curva" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#F3E6FB" />
                  <stop offset="1" stopColor="#F9F1FD" />
                </linearGradient>
              </defs>
              <path d="M100,0 L52,0 C30,25 92,38 72,62 C58,80 34,88 48,100 L100,100 Z" fill="#F3E6FB" />
              <path d="M52,0 C30,25 92,38 72,62 C58,80 34,88 48,100" fill="none" stroke="#D4AF37" strokeWidth="5" vectorEffect="non-scaling-stroke" />
            </svg>

            <div className="login-card">
              <img className="login-logo" src={logo} alt="" />
              <div className="login-marca"><Marca /></div>
              <div className="login-lema"><i />GESTIÓN INTELIGENTE DE EVENTOS<i /></div>

              {sesion ? (
                <div className="session-success">
                  <span className="success-icon"><Check size={30} /></span>
                  <h2>¡Bienvenido!</h2>
                  <p>Has iniciado sesión correctamente.</p>
                  <div className="session-info">
                    <p><strong>Correo:</strong> {sesion.correo}</p>
                    <p><strong>Rol:</strong> {sesion.rol}</p>
                  </div>
                  <button className="btn-login" onClick={() => irAInicio('inicio')}>Ir al inicio</button>
                  <button className="back-link" onClick={cerrarSesion}>Cerrar sesión</button>
                </div>
              ) : (
                <>
                  <h1>Bienvenido a <span>EVENTRIX</span></h1>
                  <p className="login-description">Inicia sesión para gestionar tus eventos</p>

                  <form onSubmit={iniciarSesion}>
                    <div className="campo">
                      <Mail size={22} strokeWidth={1.6} />
                      <input
                        id="correo" type="email" placeholder="Correo electrónico" aria-label="Correo electrónico"
                        value={correo} onChange={e => setCorreo(e.target.value)} required
                      />
                    </div>

                    <div className="campo">
                      <Lock size={22} strokeWidth={1.6} />
                      <input
                        id="clave" type={mostrarClave ? 'text' : 'password'} placeholder="Contraseña" aria-label="Contraseña"
                        value={clave} onChange={e => setClave(e.target.value)} required
                      />
                      <button type="button" className="show-password" onClick={() => setMostrarClave(!mostrarClave)} aria-label="Mostrar contraseña">
                        {mostrarClave ? <Eye size={22} strokeWidth={1.6} /> : <EyeOff size={22} strokeWidth={1.6} />}
                      </button>
                    </div>

                    <button
                      type="button" className="forgot-password"
                      onClick={() => setError('Contacta al administrador para recuperar tu contraseña.')}
                    >
                      ¿Olvidaste tu contraseña?
                    </button>

                    <button className="btn-login" type="submit" disabled={cargando}>
                      {cargando ? 'Verificando...' : <><LogIn size={22} strokeWidth={1.6} /> Iniciar sesión</>}
                    </button>
                  </form>

                  <div className="separador"><i /><span>o</span><i /></div>

                  <button
                    type="button" className="btn-google"
                    onClick={() => setError('El acceso con Google estará disponible próximamente.')}
                  >
                    <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
                      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.7 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.6 17.7 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
                      <path fill="#FBBC05" d="M10.4 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.9-4.7l-7.8-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.8-6.1z" />
                      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.7-4.1-13.6-9.8l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
                    </svg>
                    Continuar con Google
                  </button>

                  {error && <p className="error-message">{error}</p>}

                  <button className="back-link" onClick={() => { setVista('inicio'); setError('') }}>
                    <ArrowLeft size={14} /> Volver a EVENTRIX
                  </button>
                </>
              )}
            </div>
          </div>
        </main>
      )}
      {/* PANEL DE ADMINISTRACIÓN */}
{vista === 'panel' && sesion && (
  <PanelAdmin sesion={sesion} cerrarSesion={cerrarSesion} />
)}

      {/* PIE DE PÁGINA */}
      <footer className="footer">
        <img src={logo} alt="" />
        <span>EVENTRIX</span>
        <small>© {new Date().getFullYear()} EVENTRIX. Todos los derechos reservados.</small>
      </footer>
    </div>
  )
}

export default App