
import { useState, useEffect, useRef } from 'react'
import {
  CalendarDays, Users, Layers, BarChart3, Target, Gem, Heart, Zap,
  ShieldCheck, Star, Mail, Phone, MapPin, MessageCircle, Send, User,
  Play, ChevronDown, Eye, EyeOff, Lock, Check, LogIn, ArrowLeft,
} from 'lucide-react'
import logo from './assets/images/logo-eventrix.png'
import heroImage from './assets/images/hero-eventrix.jpg'
import aboutImage from './assets/images/about-eventrix.jpg'
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
  const [nombreRegistro, setNombreRegistro] = useState('')
  const [correoRegistro, setCorreoRegistro] = useState('')
  const [claveRegistro, setClaveRegistro] = useState('')
  const [confirmarClave, setConfirmarClave] = useState('')
  const [tipoCuentaRegistro, setTipoCuentaRegistro] = useState('CLIENTE')

  // Datos de la solicitud de proveedor
  const [tipoPersona, setTipoPersona] = useState('NATURAL')
  const [telefonoProveedor, setTelefonoProveedor] = useState('')
  const [nombreCompletoProveedor, setNombreCompletoProveedor] = useState('')
  const [tipoDocumentoTitular, setTipoDocumentoTitular] = useState('CC')
  const [numeroDocumentoTitular, setNumeroDocumentoTitular] = useState('')
  const [nitProveedor, setNitProveedor] = useState('')
  const [digitoVerificacion, setDigitoVerificacion] = useState('')
  const [razonSocial, setRazonSocial] = useState('')
  const [nombreRepresentante, setNombreRepresentante] = useState('')
  const [tipoDocumentoRepresentante, setTipoDocumentoRepresentante] = useState('CC')
  const [numeroDocumentoRepresentante, setNumeroDocumentoRepresentante] = useState('')
  const [documentoCedulaTitular, setDocumentoCedulaTitular] = useState(null)
  const [documentoRut, setDocumentoRut] = useState(null)
  const [documentoCamaraComercio, setDocumentoCamaraComercio] = useState(null)
  const [documentoCedulaRepresentante, setDocumentoCedulaRepresentante] = useState(null)
  const [mensajeRegistroProveedor, setMensajeRegistroProveedor] = useState('')
  const [pasoRegistroProveedor, setPasoRegistroProveedor] = useState(1)
  const [mostrarClave, setMostrarClave] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [googleDisponible, setGoogleDisponible] = useState(false)
  const [sesion, setSesion] = useState(null)
  const [mensajeContacto, setMensajeContacto] = useState('')
  const [cargandoContacto, setCargandoContacto] = useState(false)
  const [errorContacto, setErrorContacto] = useState('')

  const vistaActual = useRef(vista)
  vistaActual.current = vista

  const tipoCuentaActual = useRef(tipoCuentaRegistro)
  tipoCuentaActual.current = tipoCuentaRegistro

  // INICIO DE SESIÓN TRADICIONAL
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

      if (!respuesta.ok) {
        throw new Error(datos.error || 'Correo o contraseña incorrectos.')
      }

      const token = datos.token

      const payload = token.split('.')[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/')

      const contenido = JSON.parse(
        decodeURIComponent(
          atob(payload).split('')
            .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
            .join('')
        )
      )

      sessionStorage.setItem('eventrix_token', token)

      setSesion({
        correo: contenido.sub,
        rol: contenido.rol,
        token,
      })

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


// REGISTRO TRADICIONAL
  async function registrarUsuario(event) {
    event.preventDefault()
    setError('')
    setMensajeRegistroProveedor('')

    if (tipoCuentaRegistro === 'CLIENTE' && claveRegistro !== confirmarClave) {
      setError('Las contraseñas no coinciden.')
      return
    }

    if (tipoCuentaRegistro === 'PROVEEDOR') {
      if (!telefonoProveedor.trim()) {
        setError('Ingresa un teléfono de contacto.')
        return
      }

      if (tipoPersona === 'NATURAL' &&
          (!nombreCompletoProveedor.trim() || !numeroDocumentoTitular.trim())) {
        setError('Completa los datos de identificación del titular.')
        return
      }

      if (tipoPersona === 'JURIDICA' &&
          (!nitProveedor.trim() || !digitoVerificacion.trim() ||
           !razonSocial.trim() || !nombreRepresentante.trim() ||
           !numeroDocumentoRepresentante.trim())) {
        setError('Completa todos los datos de la empresa y su representante.')
        return
      }

      const documentosRequeridos = tipoPersona === 'NATURAL'
        ? [
            ['Cedula del titular', documentoCedulaTitular],
            ['RUT', documentoRut],
          ]
        : [
            ['RUT', documentoRut],
            ['Camara de Comercio', documentoCamaraComercio],
            ['Cedula del representante', documentoCedulaRepresentante],
          ]

      const documentoFaltante = documentosRequeridos.find(([, archivo]) => !archivo)

      if (documentoFaltante) {
        setError(`Adjunta el documento requerido: ${documentoFaltante[0]}.`)
        return
      }

      const documentoPesado = documentosRequeridos.find(
        ([, archivo]) => archivo.size > 10 * 1024 * 1024
      )

      if (documentoPesado) {
        setError(`${documentoPesado[0]} supera el limite de 10 MB.`)
        return
      }
    }

    setCargando(true)

    try {
      if (tipoCuentaRegistro === 'PROVEEDOR') {
        const solicitud = {
          correo: correoRegistro.trim(),
          tipoPersona,
          telefonoContacto: telefonoProveedor.trim(),
          ...(tipoPersona === 'NATURAL'
            ? {
                nombreCompleto: nombreCompletoProveedor.trim(),
                tipoDocumentoTitular,
                numeroDocumentoTitular: numeroDocumentoTitular.trim(),
              }
            : {
                nit: nitProveedor.trim(),
                digitoVerificacion: digitoVerificacion.trim(),
                razonSocial: razonSocial.trim(),
                nombreRepresentante: nombreRepresentante.trim(),
                tipoDocumentoRepresentante,
                numeroDocumentoRepresentante: numeroDocumentoRepresentante.trim(),
              }),
        }

        const formulario = new FormData()

        formulario.append(
          'solicitud',
          new Blob([JSON.stringify(solicitud)], {
            type: 'application/json',
          })
        )

        if (tipoPersona === 'NATURAL') {
          formulario.append('tipos', 'CEDULA_TITULAR')
          formulario.append('documentos', documentoCedulaTitular)
          formulario.append('tipos', 'RUT')
          formulario.append('documentos', documentoRut)
        } else {
          formulario.append('tipos', 'RUT')
          formulario.append('documentos', documentoRut)
          formulario.append('tipos', 'CAMARA_COMERCIO')
          formulario.append('documentos', documentoCamaraComercio)
          formulario.append('tipos', 'CEDULA_REPRESENTANTE')
          formulario.append('documentos', documentoCedulaRepresentante)
        }

        const respuesta = await fetch(`${API_URL}/solicitudes-proveedor`, {
          method: 'POST',
          body: formulario,
        })
        const datos = await respuesta.json().catch(() => ({}))

        if (!respuesta.ok) {
          throw new Error(datos.error || 'No fue posible enviar la solicitud.')
        }

        setMensajeRegistroProveedor(
          'Solicitud enviada correctamente. Recibimos tus datos y documentos. Tu solicitud quedo pendiente de revision administrativa. El proceso de respuesta puede tardar hasta 24 horas.'
        )
        setPasoRegistroProveedor(1)
        setDocumentoCedulaTitular(null)
        setDocumentoRut(null)
        setDocumentoCamaraComercio(null)
        setDocumentoCedulaRepresentante(null)

        setCorreoRegistro('')
        setTelefonoProveedor('')
        setNombreCompletoProveedor('')
        setNumeroDocumentoTitular('')
        setNitProveedor('')
        setDigitoVerificacion('')
        setRazonSocial('')
        setNombreRepresentante('')
        setNumeroDocumentoRepresentante('')
        return
      }

      const respuesta = await fetch(`${API_URL}/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombreRegistro.trim(),
          correo: correoRegistro.trim(),
          clave: claveRegistro,
          tipoCuenta: 'CLIENTE',
        }),
      })

      const datos = await respuesta.json().catch(() => ({}))

      if (!respuesta.ok) {
        throw new Error(datos.error || 'No fue posible crear tu cuenta.')
      }

      if (!datos.token) {
        throw new Error('El servidor no devolvió un token de acceso.')
      }

      const payload = datos.token.split('.')[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/')

      const contenido = JSON.parse(
        decodeURIComponent(
          atob(payload).split('')
            .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
            .join('')
        )
      )

      sessionStorage.setItem('eventrix_token', datos.token)

      setSesion({
        correo: contenido.sub,
        rol: contenido.rol,
        token: datos.token,
      })

      setNombreRegistro('')
      setCorreoRegistro('')
      setClaveRegistro('')
      setConfirmarClave('')
    } catch (err) {
      setError(
        err.message.includes('Failed to fetch') ||
        err.message.includes('Load failed')
          ? 'No se pudo conectar con el servidor. Verifica que el backend esté funcionando.'
          : err.message
      )
    } finally {
      setCargando(false)
    }
  }
  // INICIO DE SESIÓN CON GOOGLE
  async function iniciarSesionConGoogle(credential, tipoCuenta = null) {
    setError('')
    setCargando(true)

    try {
      const respuesta = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tipoCuenta ? { credential, tipoCuenta } : { credential }),
      })

      const datos = await respuesta.json().catch(() => ({}))

      if (!respuesta.ok) {
        throw new Error(
          datos.error || 'No fue posible iniciar sesión con Google.'
        )
      }

      const token = datos.token

      if (!token) {
        throw new Error('El servidor no devolvió un token de acceso.')
      }

      const payload = token.split('.')[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/')

      const contenido = JSON.parse(
        decodeURIComponent(
          atob(payload).split('')
            .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
            .join('')
        )
      )

      sessionStorage.setItem('eventrix_token', token)

      setSesion({
        correo: contenido.sub,
        rol: contenido.rol,
        token,
      })

      setClave('')
    } catch (err) {
      setError(
        err.message.includes('Failed to fetch') ||
        err.message.includes('Load failed')
          ? 'No se pudo conectar con el servidor. Verifica que el backend esté funcionando.'
          : err.message
      )
    } finally {
      setCargando(false)
    }
  }

  
  // CARGAR E INICIALIZAR GOOGLE IDENTITY SERVICES
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

    if (!clientId) {
      console.error('No se encontró VITE_GOOGLE_CLIENT_ID')
      return
    }

    const inicializarGoogle = () => {
      if (!window.google?.accounts?.id) {
        return
      }

      window.google.accounts.id.initialize({
        client_id: clientId,

        callback: (respuesta) => {
          if (respuesta.credential) {
            iniciarSesionConGoogle(respuesta.credential, vistaActual.current === 'registro' ? tipoCuentaActual.current : null)
          } else {
            setError('Google no devolvió una credencial válida.')
          }
        },
      })

      setGoogleDisponible(true)
    }

    if (window.google?.accounts?.id) {
      inicializarGoogle()
      return
    }

    const scriptExistente = document.querySelector(
      'script[data-google-identity="true"]'
    )

    if (scriptExistente) {
      scriptExistente.addEventListener('load', inicializarGoogle)

      return () => {
        scriptExistente.removeEventListener('load', inicializarGoogle)
      }
    }

    const script = document.createElement('script')

    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.dataset.googleIdentity = 'true'

    script.addEventListener('load', inicializarGoogle, { once: true })

    script.addEventListener(
      'error',
      () => setError('No se pudo cargar el servicio de Google.'),
      { once: true }
    )

    document.head.appendChild(script)

    return () => {
      script.removeEventListener('load', inicializarGoogle)
    }
  }, [])


  // CERRAR SESIÓN
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
      document.getElementById(seccion)?.scrollIntoView({
        behavior: 'smooth',
      })
    }, 50)
  }

  // FORMULARIO DE CONTACTO
  async function enviarContacto(event) {
    event.preventDefault()
    setMensajeContacto('')
    setErrorContacto('')
    setCargandoContacto(true)

    const formulario = event.currentTarget
    const campos = new FormData(formulario)

    const contacto = {
      nombre: campos.get('nombre'),
      correo: campos.get('correo'),
      asunto: campos.get('asunto'),
      mensaje: campos.get('mensaje'),
    }

    try {
      const respuesta = await fetch(`${API_URL}/contacto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contacto),
      })

      const datos = await respuesta.json().catch(() => ({}))

      if (!respuesta.ok) {
        throw new Error(
          datos.message || datos.error || 'No fue posible enviar el mensaje.'
        )
      }

      setMensajeContacto(
        datos.mensaje || 'Tu mensaje fue enviado correctamente. Revisa tu correo.'
      )

      formulario.reset()
    } catch (err) {
      setErrorContacto(
        err.message.includes('Failed to fetch')
          ? 'No se pudo conectar con el servidor. Intenta nuevamente.'
          : err.message
      )
    } finally {
      setCargandoContacto(false)
    }
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
          <button className="btn-nav" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        ) : (
          <>
            <button className="btn-nav" onClick={() => {
              setError('')
              setVista('registro')
            }}>
              Crear cuenta
            </button>
            <button className="btn-nav" onClick={() => {
              setError('')
              setVista('login')
            }}>
              <User size={16} /> Iniciar sesión
            </button>
          </>
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

                <button className="btn-secondary" onClick={() => {
                  setError('')
                  setVista('login')
                }}>
                  <User size={16} /> Iniciar sesión
                </button>

                <button className="btn-primary" onClick={() => {
                  setError('')
                  setVista('registro')
                }}>
                  Crear cuenta
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
                <div>
                  <strong>Correo electrónico</strong>
                  <p>soporte@eventrix.com</p>
                </div>
              </div>

              <div className="contact-detail">
                <Phone size={38} strokeWidth={1.5} />
                <div>
                  <strong>Teléfono</strong>
                  <p>+57 300 123 4567</p>
                </div>
              </div>

              <div className="contact-detail">
                <MapPin size={38} strokeWidth={1.5} />
                <div>
                  <strong>Ubicación</strong>
                  <p>Medellín, Antioquia – Colombia</p>
                </div>
              </div>
            </div>

            <div className="contact-form-card">
              <h3><MessageCircle size={20} /> Envíanos un mensaje</h3>

              <form onSubmit={enviarContacto}>
                <div className="contact-fields">
                  <div>
                    <label>Nombre completo <b>*</b></label>
                    <input type="text" name="nombre" placeholder="Escribe tu nombre" maxLength={100} required />
                  </div>

                  <div>
                    <label>Correo electrónico <b>*</b></label>
                    <input type="email" name="correo" placeholder="correo@ejemplo.com" maxLength={150} required />
                  </div>
                </div>

                <div>
                  <label>Asunto <b>*</b></label>
                  <select name="asunto" required defaultValue="">
                    <option value="" disabled>Selecciona un asunto</option>
                    <option>Información general</option>
                    <option>Soporte técnico</option>
                    <option>Servicios</option>
                    <option>Otro</option>
                  </select>
                </div>

                <div>
                  <label>Mensaje <b>*</b></label>
                  <textarea name="mensaje" placeholder="Escribe tu mensaje..." rows="4" maxLength={3000} required />
                </div>

                <button className="btn-send" type="submit" disabled={cargandoContacto}>
                  <Send size={17} />
                  {cargandoContacto ? 'Enviando...' : 'Enviar mensaje'}
                </button>

                {mensajeContacto && (
                  <p className="contact-success">{mensajeContacto}</p>
                )}

                {errorContacto && (
                  <p className="contact-error">{errorContacto}</p>
                )}
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

                  <button className="btn-login" onClick={() => irAInicio('inicio')}>
                    Ir al inicio
                  </button>

                  <button className="back-link" onClick={cerrarSesion}>
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <>
                  <h1>Bienvenido a <span>EVENTRIX</span></h1>
                  <p className="login-description">Inicia sesión para gestionar tus eventos</p>

                  <form onSubmit={iniciarSesion}>
                    <div className="campo">
                      <Mail size={22} strokeWidth={1.6} />

                      <input
                        id="correo"
                        type="email"
                        placeholder="Correo electrónico"
                        aria-label="Correo electrónico"
                        value={correo}
                        onChange={e => setCorreo(e.target.value)}
                        required
                      />
                    </div>

                    <div className="campo">
                      <Lock size={22} strokeWidth={1.6} />

                      <input
                        id="clave"
                        type={mostrarClave ? 'text' : 'password'}
                        placeholder="Contraseña"
                        aria-label="Contraseña"
                        value={clave}
                        onChange={e => setClave(e.target.value)}
                        required
                      />

                      <button
                        type="button"
                        className="show-password"
                        onClick={() => setMostrarClave(!mostrarClave)}
                        aria-label="Mostrar contraseña"
                      >
                        {mostrarClave
                          ? <Eye size={22} strokeWidth={1.6} />
                          : <EyeOff size={22} strokeWidth={1.6} />
                        }
                      </button>
                    </div>

                    <button
                      type="button"
                      className="forgot-password"
                      onClick={() => setError('Contacta al administrador para recuperar tu contraseña.')}
                    >
                      ¿Olvidaste tu contraseña?
                    </button>

                    <button className="btn-login" type="submit" disabled={cargando}>
                      {cargando
                        ? 'Verificando...'
                        : <><LogIn size={22} strokeWidth={1.6} /> Iniciar sesión</>
                      }
                    </button>
                  </form>

                  <div className="separador"><i /><span>o</span><i /></div>

                  {/* BOTÓN DE INICIO DE SESIÓN CON GOOGLE */}
                  <button
                    type="button"
                    className="btn-google"
                    disabled={cargando || !googleDisponible}
                    onClick={() => {
                      setError('')

                      if (!googleDisponible || !window.google?.accounts?.id) {
                        setError('Google todavía está cargando. Intenta nuevamente.')
                        return
                      }

                      window.google.accounts.id.prompt((notificacion) => {
                        if (notificacion.isNotDisplayed?.()) {
                          setError(
                            'Google no pudo mostrar la ventana de acceso. Intenta nuevamente.'
                          )
                        }
                      })
                    }}
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

                  <p className="registro-enlace">
                    ¿Todavía no tienes cuenta?
                    <button type="button" onClick={() => {
                      setError('')
                      setVista('registro')
                    }}>
                      Regístrate aquí
                    </button>
                  </p>

                  <button
                    className="back-link"
                    onClick={() => {
                      setVista('inicio')
                      setError('')
                    }}
                  >
                    <ArrowLeft size={14} /> Volver a EVENTRIX
                  </button>
                </>
              )}
            </div>
          </div>
        </main>
      )}

      {/* REGISTRO DE USUARIOS */}
      {vista === 'registro' && (
        <main className="login-section registro-section">
          <div className="login-photo">
            <img src={heroImage} alt="Decoración de eventos EVENTRIX" />

            <div className="login-features">
              <span><CalendarDays size={26} /> Organiza tus eventos</span>
              <span><Users size={26} /> Conecta con proveedores</span>
              <span><Layers size={26} /> Encuentra servicios</span>
              <span><ShieldCheck size={26} /> Construye confianza</span>
            </div>
          </div>

          <div className="login-panel">
            <div className="login-fondo" />

            <svg className="login-curva" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="registroGradiente" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#F3E6FB" />
                  <stop offset="1" stopColor="#F9F1FD" />
                </linearGradient>
              </defs>
              <path d="M100,0 L52,0 C30,25 92,38 72,62 C58,80 34,88 48,100 L100,100 Z" fill="#F3E6FB" />
              <path d="M52,0 C30,25 92,38 72,62 C58,80 34,88 48,100" fill="none" stroke="#D4AF37" strokeWidth="5" vectorEffect="non-scaling-stroke" />
            </svg>

            <div className="login-card registro-card">
              <img className="login-logo" src={logo} alt="EVENTRIX" />
              <div className="login-marca"><Marca /></div>
              <div className="login-lema"><i />GESTIÓN INTELIGENTE DE EVENTOS<i /></div>

              {sesion ? (
                <div className="session-success">
                  <span className="success-icon"><Check size={30} /></span>
                  <h2>¡Cuenta creada!</h2>
                  <p>Tu cuenta de EVENTRIX está lista.</p>
                  <div className="session-info">
                    <p><strong>Correo:</strong> {sesion.correo}</p>
                    <p><strong>Rol:</strong> {sesion.rol}</p>
                  </div>
                  {sesion.rol === 'ROLE_PROVEEDOR' && (
                    <p className="registro-aviso">
                      Para ofrecer servicios deberás completar tu perfil y el proceso de verificación empresarial.
                    </p>
                  )}
                  <button className="btn-login" onClick={() => irAInicio('inicio')}>
                    Ir al inicio
                  </button>
                  <button className="back-link" onClick={cerrarSesion}>
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <>
                  <h1>Crear cuenta en <span>EVENTRIX</span></h1>
                  <p className="login-description">
                    Elige cómo deseas formar parte de nuestra comunidad.
                  </p>

                  <form onSubmit={registrarUsuario}>
                    <div className="tipo-cuenta-selector">
                      <button
                        type="button"
                        className={`tipo-cuenta-opcion ${tipoCuentaRegistro === 'CLIENTE' ? 'seleccionado' : ''}`}
                        onClick={() => {
                          setTipoCuentaRegistro('CLIENTE')
                          setError('')
                          setMensajeRegistroProveedor('')
                        }}
                        aria-pressed={tipoCuentaRegistro === 'CLIENTE'}
                      >
                        <User size={25} />
                        <strong>CLIENTE</strong>
                        <span>Quiero organizar eventos y contratar servicios.</span>
                      </button>

                      <button
                        type="button"
                        className={`tipo-cuenta-opcion ${tipoCuentaRegistro === 'PROVEEDOR' ? 'seleccionado' : ''}`}
                        onClick={() => {
                          setTipoCuentaRegistro('PROVEEDOR')
                          setError('')
                          setMensajeRegistroProveedor('')
                        }}
                        aria-pressed={tipoCuentaRegistro === 'PROVEEDOR'}
                      >
                        <Layers size={25} />
                        <strong>PROVEEDOR</strong>
                        <span>Quiero ofrecer servicios para eventos.</span>
                      </button>
                    </div>

                    {tipoCuentaRegistro === 'PROVEEDOR' ? (
                      <>
                        <div className="proveedor-progreso">
                          <div className={`proveedor-progreso-paso ${pasoRegistroProveedor === 1 ? 'activo' : 'completado'}`}>
                            <span>{pasoRegistroProveedor === 1 ? '1' : '✓'}</span>
                            <div><strong>Datos principales</strong><small>Información del proveedor</small></div>
                          </div>
                          <div className={`proveedor-progreso-paso ${pasoRegistroProveedor === 2 ? 'activo' : ''}`}>
                            <span>2</span>
                            <div><strong>Documentos</strong><small>Archivos de verificación</small></div>
                          </div>
                        </div>

                        {pasoRegistroProveedor === 1 ? (
                          <>
                            <p className="registro-aviso">
                              Cuéntanos quién eres y qué datos de contacto utilizaremos para tu solicitud de proveedor.
                            </p>

                            <div className="campo">
                              <Mail size={22} strokeWidth={1.6} />
                              <input type="email" placeholder="Correo electrónico" aria-label="Correo electrónico"
                                value={correoRegistro} onChange={e => setCorreoRegistro(e.target.value)}
                                maxLength={150} required />
                            </div>

                            <div className="campo">
                              <Phone size={22} strokeWidth={1.6} />
                              <input type="tel" placeholder="Teléfono de contacto" aria-label="Teléfono de contacto"
                                value={telefonoProveedor} onChange={e => setTelefonoProveedor(e.target.value)}
                                maxLength={30} required />
                            </div>

                            <div className="campo">
                              <select value={tipoPersona} onChange={e => setTipoPersona(e.target.value)}
                                aria-label="Tipo de persona" required>
                                <option value="NATURAL">Persona natural</option>
                                <option value="JURIDICA">Persona jurídica</option>
                              </select>
                            </div>

                            {tipoPersona === 'NATURAL' ? (
                              <>
                                <div className="campo">
                                  <User size={22} strokeWidth={1.6} />
                                  <input type="text" placeholder="Nombre completo del titular"
                                    aria-label="Nombre completo del titular"
                                    value={nombreCompletoProveedor}
                                    onChange={e => setNombreCompletoProveedor(e.target.value)}
                                    maxLength={150} required />
                                </div>
                                <div className="campo">
                                  <select value={tipoDocumentoTitular}
                                    onChange={e => setTipoDocumentoTitular(e.target.value)}
                                    aria-label="Tipo de documento del titular" required>
                                    <option value="CC">Cédula de ciudadanía</option>
                                    <option value="CE">Cédula de extranjería</option>
                                    <option value="PPT">Permiso por Protección Temporal</option>
                                  </select>
                                </div>
                                <div className="campo">
                                  <input type="text" placeholder="Número de documento"
                                    aria-label="Número de documento"
                                    value={numeroDocumentoTitular}
                                    onChange={e => setNumeroDocumentoTitular(e.target.value)}
                                    maxLength={30} required />
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="campo">
                                  <input type="text" placeholder="NIT (sin dígito de verificación)"
                                    aria-label="NIT" value={nitProveedor}
                                    onChange={e => setNitProveedor(e.target.value)}
                                    maxLength={30} required />
                                </div>
                                <div className="campo">
                                  <input type="text" placeholder="Dígito de verificación"
                                    aria-label="Dígito de verificación" value={digitoVerificacion}
                                    onChange={e => setDigitoVerificacion(e.target.value)}
                                    maxLength={1} required />
                                </div>
                                <div className="campo">
                                  <input type="text" placeholder="Razón social" aria-label="Razón social"
                                    value={razonSocial} onChange={e => setRazonSocial(e.target.value)}
                                    maxLength={200} required />
                                </div>
                                <div className="campo">
                                  <User size={22} strokeWidth={1.6} />
                                  <input type="text" placeholder="Nombre del representante legal"
                                    aria-label="Nombre del representante legal"
                                    value={nombreRepresentante}
                                    onChange={e => setNombreRepresentante(e.target.value)}
                                    maxLength={150} required />
                                </div>
                                <div className="campo">
                                  <select value={tipoDocumentoRepresentante}
                                    onChange={e => setTipoDocumentoRepresentante(e.target.value)}
                                    aria-label="Tipo de documento del representante" required>
                                    <option value="CC">Cédula de ciudadanía</option>
                                    <option value="CE">Cédula de extranjería</option>
                                    <option value="PPT">Permiso por Protección Temporal</option>
                                  </select>
                                </div>
                                <div className="campo">
                                  <input type="text" placeholder="Documento del representante"
                                    aria-label="Documento del representante"
                                    value={numeroDocumentoRepresentante}
                                    onChange={e => setNumeroDocumentoRepresentante(e.target.value)}
                                    maxLength={30} required />
                                </div>
                              </>
                            )}

                            <button className="btn-login" type="button" disabled={cargando}
                              onClick={event => {
                                const formulario = event.currentTarget.form
                                if (!formulario.checkValidity()) {
                                  formulario.reportValidity()
                                  return
                                }
                                setError('')
                                setPasoRegistroProveedor(2)
                              }}>
                              Siguiente <span aria-hidden="true">→</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <p className="registro-aviso">
                              Ya casi terminamos. Adjunta los documentos solicitados para verificar tu información.
                            </p>
                            <div className="documentos-proveedor">
                              <div className="documentos-encabezado">
                                <div className="documentos-icono-principal">▤</div>
                                <div>
                                  <h3>Documentación requerida</h3>
                                  <p>Adjunta los archivos necesarios para verificar tu solicitud.</p>
                                </div>
                              </div>

                              <div className="documentos-indicaciones">
                                <span>✓ Formatos PDF, JPG, JPEG y PNG</span>
                                <span>✓ Máximo 10 MB por archivo</span>
                              </div>

                              {tipoPersona === 'NATURAL' ? (
                                <div className="documentos-lista">
                                  <label className="documento-tarjeta">
                                    <span className="documento-numero">01</span>
                                    <span className="documento-contenido">
                                      <strong>Cédula del titular</strong>
                                      <small>Documento de identidad por ambas caras, si aplica.</small>
                                      <span className="documento-selector">
                                        <span className="documento-selector-icono">↑</span>
                                        Seleccionar documento
                                      </span>
                                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" required
                                        onChange={e => setDocumentoCedulaTitular(e.target.files?.[0] || null)} />
                                      <small className="documento-archivo">
                                        {documentoCedulaTitular ? '✓ ' + documentoCedulaTitular.name : 'Ningún archivo seleccionado'}
                                      </small>
                                    </span>
                                  </label>

                                  <label className="documento-tarjeta">
                                    <span className="documento-numero">02</span>
                                    <span className="documento-contenido">
                                      <strong>Registro Único Tributario (RUT)</strong>
                                      <small>Adjunta tu RUT actualizado y legible.</small>
                                      <span className="documento-selector">
                                        <span className="documento-selector-icono">↑</span>
                                        Seleccionar documento
                                      </span>
                                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" required
                                        onChange={e => setDocumentoRut(e.target.files?.[0] || null)} />
                                      <small className="documento-archivo">
                                        {documentoRut ? '✓ ' + documentoRut.name : 'Ningún archivo seleccionado'}
                                      </small>
                                    </span>
                                  </label>
                                </div>
                              ) : (
                                <div className="documentos-lista">
                                  <label className="documento-tarjeta">
                                    <span className="documento-numero">01</span>
                                    <span className="documento-contenido">
                                      <strong>Registro Único Tributario (RUT)</strong>
                                      <small>Adjunta el RUT actualizado de la empresa.</small>
                                      <span className="documento-selector">
                                        <span className="documento-selector-icono">↑</span>
                                        Seleccionar documento
                                      </span>
                                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" required
                                        onChange={e => setDocumentoRut(e.target.files?.[0] || null)} />
                                      <small className="documento-archivo">
                                        {documentoRut ? '✓ ' + documentoRut.name : 'Ningún archivo seleccionado'}
                                      </small>
                                    </span>
                                  </label>

                                  <label className="documento-tarjeta">
                                    <span className="documento-numero">02</span>
                                    <span className="documento-contenido">
                                      <strong>Cámara de Comercio</strong>
                                      <small>Certificado de existencia y representación legal.</small>
                                      <span className="documento-selector">
                                        <span className="documento-selector-icono">↑</span>
                                        Seleccionar documento
                                      </span>
                                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" required
                                        onChange={e => setDocumentoCamaraComercio(e.target.files?.[0] || null)} />
                                      <small className="documento-archivo">
                                        {documentoCamaraComercio ? '✓ ' + documentoCamaraComercio.name : 'Ningún archivo seleccionado'}
                                      </small>
                                    </span>
                                  </label>

                                  <label className="documento-tarjeta">
                                    <span className="documento-numero">03</span>
                                    <span className="documento-contenido">
                                      <strong>Cédula del representante</strong>
                                      <small>Documento de identidad del representante legal.</small>
                                      <span className="documento-selector">
                                        <span className="documento-selector-icono">↑</span>
                                        Seleccionar documento
                                      </span>
                                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" required
                                        onChange={e => setDocumentoCedulaRepresentante(e.target.files?.[0] || null)} />
                                      <small className="documento-archivo">
                                        {documentoCedulaRepresentante ? '✓ ' + documentoCedulaRepresentante.name : 'Ningún archivo seleccionado'}
                                      </small>
                                    </span>
                                  </label>
                                </div>
                              )}

                              <div className="documentos-privacidad">
                                <span>♢</span>
                                <p>Tu documentación será utilizada exclusivamente para el proceso de verificación de EVENTRIX.</p>
                              </div>
                            </div>
                            <div className="proveedor-acciones">
                              <button className="proveedor-btn-atras" type="button"
                                onClick={() => setPasoRegistroProveedor(1)}>
                                ← Atrás
                              </button>
                              <button className="btn-login" type="submit" disabled={cargando}>
                                {cargando ? 'Enviando solicitud...' : 'Enviar solicitud'}
                              </button>
                            </div>
                          </>
                        )}
                      </>                    ) : (
                      <>
                        <div className="campo">
                          <User size={22} strokeWidth={1.6} />
                          <input
                            type="text"
                            placeholder="Nombre completo"
                            aria-label="Nombre completo"
                            value={nombreRegistro}
                            onChange={e => setNombreRegistro(e.target.value)}
                            maxLength={100}
                            required
                          />
                        </div>

                        <div className="campo">
                          <Mail size={22} strokeWidth={1.6} />
                          <input
                            type="email"
                            placeholder="Correo electrónico"
                            aria-label="Correo electrónico"
                            value={correoRegistro}
                            onChange={e => setCorreoRegistro(e.target.value)}
                            maxLength={150}
                            required
                          />
                        </div>

                        <div className="campo">
                          <Lock size={22} strokeWidth={1.6} />
                          <input
                            type={mostrarClave ? 'text' : 'password'}
                            placeholder="Contraseña (mínimo 8 caracteres)"
                            aria-label="Contraseña"
                            value={claveRegistro}
                            onChange={e => setClaveRegistro(e.target.value)}
                            minLength={8}
                            maxLength={100}
                            required
                          />
                          <button
                            type="button"
                            className="show-password"
                            onClick={() => setMostrarClave(!mostrarClave)}
                            aria-label={mostrarClave ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                          >
                            {mostrarClave ? <Eye size={22} /> : <EyeOff size={22} />}
                          </button>
                        </div>

                        <div className="campo">
                          <Lock size={22} strokeWidth={1.6} />
                          <input
                            type={mostrarClave ? 'text' : 'password'}
                            placeholder="Confirmar contraseña"
                            aria-label="Confirmar contraseña"
                            value={confirmarClave}
                            onChange={e => setConfirmarClave(e.target.value)}
                            minLength={8}
                            maxLength={100}
                            required
                          />
                        </div>
                      </>
                    )}

                    <button className="btn-login" type="submit" disabled={cargando}>
                      {cargando
                        ? (tipoCuentaRegistro === 'PROVEEDOR' ? 'Enviando solicitud...' : 'Creando cuenta...')
                        : (tipoCuentaRegistro === 'PROVEEDOR' ? 'Enviar solicitud de proveedor' : 'Crear mi cuenta')}
                    </button>                  </form>

                  {tipoCuentaRegistro === 'CLIENTE' && (
                    <>
                      <div className="separador"><i /><span>o regístrate con</span><i /></div>

                  <button
                    type="button"
                    className="btn-google"
                    disabled={cargando || !googleDisponible}
                    onClick={() => {
                      setError('')

                      if (!googleDisponible || !window.google?.accounts?.id) {
                        setError('Google todavía está cargando. Intenta nuevamente.')
                        return
                      }

                      window.google.accounts.id.prompt((notificacion) => {
                        if (notificacion.isNotDisplayed?.()) {
                          setError('Google no pudo mostrar la ventana de acceso. Intenta nuevamente.')
                        }
                      })
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
                      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.7 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.6 17.7 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
                      <path fill="#FBBC05" d="M10.4 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.9-4.7l-7.8-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.8-6.1z" />
                      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.7-4.1-13.6-9.8l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
                    </svg>
                    Continuar con Google
                  </button>
                    </>
                  )}

                  {error && <p className="error-message">{error}</p>}

                  <p className="registro-enlace">
                    ¿Ya tienes una cuenta?
                    <button type="button" onClick={() => {
                      setError('')
                      setVista('login')
                    }}>
                      Inicia sesión
                    </button>
                  </p>

                  <button className="back-link" onClick={() => irAInicio('inicio')}>
                    <ArrowLeft size={14} /> Volver a EVENTRIX
                  </button>
                </>
              )}
            </div>
          </div>
        </main>
      )}
      {mensajeRegistroProveedor && (
        <div className="proveedor-modal-fondo" role="presentation">
          <section className="proveedor-modal" role="alertdialog"
            aria-modal="true" aria-labelledby="proveedor-modal-titulo">
            <div className="proveedor-modal-icono">✓</div>
            <span className="proveedor-modal-etiqueta">EVENTRIX · SOLICITUD RECIBIDA</span>
            <h2 id="proveedor-modal-titulo">¡Solicitud enviada!</h2>
            <p>{mensajeRegistroProveedor}</p>
            <div className="proveedor-modal-tiempo">
              <span>24 h</span>
              <div>
                <strong>Tiempo de revisión</strong>
                <small>El equipo administrativo revisará tu solicitud.</small>
              </div>
            </div>
            <button className="btn-login" type="button"
              onClick={() => setMensajeRegistroProveedor('')}>
              Entendido
            </button>
          </section>
        </div>
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
