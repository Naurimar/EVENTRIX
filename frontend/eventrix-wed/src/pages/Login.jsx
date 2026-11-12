import { useState } from 'react';
import { CalendarDays, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import '../styles/Login.css';

const API_AUTH = 'http://localhost:8080/api/auth/login';

function Login({ onLogin }) {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [mostrarClave, setMostrarClave] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  async function iniciarSesion(event) {
    event.preventDefault();
    setError('');

    if (!correo.trim() || !clave) {
      setError('Ingresa tu correo y contraseña.');
      return;
    }

    try {
      setCargando(true);

      const respuesta = await fetch(API_AUTH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: correo.trim(),
          clave,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || 'No fue posible iniciar sesión.');
      }

      if (!datos.token) {
        throw new Error('El servidor no devolvió un token de acceso.');
      }

      sessionStorage.setItem('eventrix_token', datos.token);
      onLogin(datos.token);
    } catch (err) {
      setError(err.message || 'Ocurrió un error al iniciar sesión.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <img
          className="login-logo"
          src="/images/logo-eventrix.png"
          alt="Logo de Eventrix"
        />

        <div className="login-heading">
          <CalendarDays size={30} />
          <h1>Bienvenido a EVENTRIX</h1>
          <p>Ingresa para gestionar tus eventos.</p>
        </div>

        <form onSubmit={iniciarSesion}>
          <label htmlFor="login-correo">Correo electrónico</label>
          <div className="login-input">
            <Mail size={19} />
            <input
              id="login-correo"
              type="email"
              placeholder="nombre@correo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <label htmlFor="login-clave">Contraseña</label>
          <div className="login-input">
            <LockKeyhole size={19} />
            <input
              id="login-clave"
              type={mostrarClave ? 'text' : 'password'}
              placeholder="Ingresa tu contraseña"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              className="login-toggle"
              type="button"
              onClick={() => setMostrarClave(!mostrarClave)}
              aria-label={mostrarClave ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {mostrarClave ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>

          {error && <p className="login-error" role="alert">{error}</p>}

          <button className="login-submit" type="submit" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="login-footer">
          EVENTRIX © 2026 · Gestión inteligente de eventos
        </p>
      </section>
    </main>
  );
}

export default Login;
