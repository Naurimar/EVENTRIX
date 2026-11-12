import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';
import {
  CalendarDays,
  CalendarCheck,
  Users,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  RefreshCw,
  CircleDollarSign,
  UserCheck,
  FileDown,
} from 'lucide-react';

import '../styles/Reportes.css';

const API_REPORTES = 'http://localhost:8080/api/reportes/resumen';
const API_PDF = 'http://localhost:8080/api/reportes/pdf';

// ==========================================
// FORMATEAR DATOS
// ==========================================

function formatearNumero(valor) {
  return Number(valor || 0).toLocaleString('es-CO');
}

function formatearMoneda(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number(valor || 0));
}

// ==========================================
// TARJETA DE INDICADOR
// ==========================================

function TarjetaIndicador({ titulo, valor, detalle, icono: Icon }) {
  return (
    <article className="reporte-indicator-card">
      <div className="reporte-indicator-icon">
        <Icon size={24} />
      </div>

      <div className="reporte-indicator-info">
        <span>{titulo}</span>
        <strong>{valor}</strong>
        <small>{detalle}</small>
      </div>
    </article>
  );
}

// ==========================================
// PANEL DE DISTRIBUCIÓN
// ==========================================

function PanelDistribucion({ titulo, descripcion, datos }) {
  const elementos = Object.entries(datos || {}).filter(
    ([, valor]) => Number(valor) > 0
  );

  const valorMaximo = Math.max(
    ...elementos.map(([, valor]) => Number(valor)),
    1
  );

  return (
    <article className="reporte-panel">
      <div className="reporte-panel-heading">
        <div>
          <h3>{titulo}</h3>
          <p>{descripcion}</p>
        </div>

        <ChartNoAxesCombined size={22} />
      </div>

      {elementos.length === 0 ? (
        <div className="reporte-empty">
          <ChartNoAxesCombined size={32} />
          <strong>Sin datos disponibles</strong>
          <p>
            Cuando existan registros, aquí aparecerá la distribución.
          </p>
        </div>
      ) : (
        <div className="reporte-distribution">
          {elementos.map(([nombre, valor]) => (
            <div className="reporte-bar-item" key={nombre}>
              <div className="reporte-bar-label">
                <span>{nombre.replaceAll('_', ' ')}</span>
                <strong>{formatearNumero(valor)}</strong>
              </div>

              <div className="reporte-bar-background">
                <div
                  className="reporte-bar-fill"
                  style={{
                    width: `${(Number(valor) / valorMaximo) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

function Reportes() {
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [descargandoPdf, setDescargandoPdf] = useState(false);
  const [errorPdf, setErrorPdf] = useState('');

  // ==========================================
  // CONSULTAR REPORTES
  // ==========================================

  const consultarReportes = async () => {
    try {
      setCargando(true);
      setError('');

      const respuesta = await apiFetch(API_REPORTES);

      if (!respuesta.ok) {
        throw new Error(`Error del servidor: ${respuesta.status}`);
      }

      const datos = await respuesta.json();

      setResumen(datos);

    } catch (err) {
      console.error('Error al consultar los reportes:', err);

      setError(
        'No fue posible consultar los reportes. Verifica que el backend esté funcionando.'
      );

    } finally {
      setCargando(false);
    }
  };

  // ==========================================
  // DESCARGAR REPORTE PDF
  // ==========================================

  const descargarReportePdf = async () => {
    try {
      setDescargandoPdf(true);
      setErrorPdf('');

      const respuesta = await apiFetch(API_PDF);

      if (!respuesta.ok) {
        throw new Error(
          `No fue posible generar el PDF. Código: ${respuesta.status}`
        );
      }

      const tipoContenido = respuesta.headers.get('content-type') || '';

      if (!tipoContenido.includes('application/pdf')) {
        throw new Error('El servidor no devolvió un archivo PDF válido.');
      }

      const archivo = await respuesta.blob();

      if (archivo.size === 0) {
        throw new Error('El archivo PDF está vacío.');
      }

      const url = window.URL.createObjectURL(archivo);

      const enlace = document.createElement('a');

      enlace.href = url;
      enlace.download = 'reporte-eventrix.pdf';

      document.body.appendChild(enlace);
      enlace.click();
      enlace.remove();

      window.setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);

    } catch (err) {
      console.error('Error al descargar el PDF:', err);

      setErrorPdf(
        err.message || 'No fue posible descargar el reporte PDF.'
      );

    } finally {
      setDescargandoPdf(false);
    }
  };

  // ==========================================
  // CARGAR INFORMACIÓN
  // ==========================================

  useEffect(() => {
    consultarReportes();
  }, []);

  // ==========================================
  // ESTADO DE CARGA
  // ==========================================

  if (cargando) {
    return (
      <section className="reportes-container">
        <div className="reporte-message">
          <RefreshCw
            size={30}
            className="reporte-loading-icon"
          />

          <h3>Cargando reportes...</h3>

          <p>
            Estamos consultando los indicadores de EVENTRIX.
          </p>
        </div>
      </section>
    );
  }

  // ==========================================
  // ESTADO DE ERROR
  // ==========================================

  if (error) {
    return (
      <section className="reportes-container">
        <div className="reporte-message reporte-error">
          <ChartNoAxesCombined size={34} />

          <h3>No se pudieron cargar los reportes</h3>

          <p>{error}</p>

          <button
            onClick={consultarReportes}
            className="reporte-refresh-button"
          >
            <RefreshCw size={17} />
            Intentar nuevamente
          </button>
        </div>
      </section>
    );
  }

  // ==========================================
  // ORGANIZAR INFORMACIÓN
  // ==========================================

  const datos = resumen || {};

  const reservas = datos.reservas || {};
  const proveedores = datos.proveedores || {};
  const invitados = datos.invitados || {};

  // ==========================================
  // INTERFAZ
  // ==========================================

  return (
    <section className="reportes-container">

      {/* ENCABEZADO */}

      <div className="reportes-heading">

        <div>
          <h2>Resumen de analítica</h2>

          <p>
            Información general de eventos, reservas,
            proveedores e invitados.
          </p>
        </div>

        <div className="reportes-actions">

          <button
            onClick={consultarReportes}
            className="reporte-refresh-button"
          >
            <RefreshCw size={17} />
            Actualizar
          </button>

          <button
            className="reporte-pdf-button"
            onClick={descargarReportePdf}
            disabled={descargandoPdf}
          >
            <FileDown size={20} />
            {descargandoPdf ? "Generando PDF..." : "Descargar reporte PDF"}
          </button>

        </div>
      </div>

      {/* MENSAJE DE ERROR DEL PDF */}

      {errorPdf && (
        <div className="reporte-pdf-error">
          <strong>No se pudo descargar el PDF</strong>
          <p>{errorPdf}</p>
        </div>
      )}

      {/* INDICADORES PRINCIPALES */}

      <div className="reportes-section-title">
        <h3>Indicadores principales</h3>

        <span>Datos obtenidos del sistema</span>
      </div>

      <div className="reportes-indicators-grid">

        <TarjetaIndicador
          titulo="Total de eventos"
          valor={formatearNumero(datos.totalEventos)}
          detalle="Eventos registrados"
          icono={CalendarDays}
        />

        <TarjetaIndicador
          titulo="Total de reservas"
          valor={formatearNumero(reservas.totalReservas)}
          detalle="Reservas registradas"
          icono={CalendarCheck}
        />

        <TarjetaIndicador
          titulo="Total de invitados"
          valor={formatearNumero(datos.totalInvitados)}
          detalle="Invitados estimados en eventos"
          icono={Users}
        />

        <TarjetaIndicador
          titulo="Proveedores"
          valor={formatearNumero(proveedores.totalProveedores)}
          detalle="Proveedores registrados"
          icono={BriefcaseBusiness}
        />

        <TarjetaIndicador
          titulo="Presupuesto total"
          valor={formatearMoneda(datos.presupuestoTotal)}
          detalle="Presupuesto acumulado"
          icono={CircleDollarSign}
        />

        <TarjetaIndicador
          titulo="Presupuesto promedio"
          valor={formatearMoneda(datos.presupuestoPromedio)}
          detalle="Promedio por evento"
          icono={ChartNoAxesCombined}
        />

        <TarjetaIndicador
          titulo="Proveedores activos"
          valor={formatearNumero(proveedores.proveedoresActivos)}
          detalle="Proveedores disponibles"
          icono={UserCheck}
        />

        <TarjetaIndicador
          titulo="Invitados registrados"
          valor={formatearNumero(invitados.totalInvitadosRegistrados)}
          detalle="Registros de invitados"
          icono={Users}
        />

      </div>

      {/* DISTRIBUCIONES */}

      <div className="reportes-section-title">
        <h3>Distribución y estadísticas</h3>

        <span>Clasificación de los registros</span>
      </div>

      <div className="reportes-charts-grid">

        <PanelDistribucion
          titulo="Eventos por estado"
          descripcion="Cantidad de eventos según su estado"
          datos={datos.eventosPorEstado}
        />

        <PanelDistribucion
          titulo="Eventos por tipo"
          descripcion="Clasificación de los eventos registrados"
          datos={datos.eventosPorTipo}
        />

        <PanelDistribucion
          titulo="Eventos por mes"
          descripcion="Distribución mensual de eventos"
          datos={datos.eventosPorMes}
        />

        <PanelDistribucion
          titulo="Reservas por estado"
          descripcion="Cantidad de reservas según su estado"
          datos={reservas.reservasPorEstado}
        />

        <PanelDistribucion
          titulo="Proveedores por categoría"
          descripcion="Clasificación de proveedores"
          datos={proveedores.proveedoresPorCategoria}
        />

        <PanelDistribucion
          titulo="Invitados por estado"
          descripcion="Estado de los invitados registrados"
          datos={invitados.invitadosPorEstado}
        />

      </div>

      {/* INFORMACIÓN DE ACTUALIZACIÓN */}

      <div className="reporte-footer-info">

        <ChartNoAxesCombined size={19} />

        <div>
          <strong>Última actualización</strong>

          <p>
            {datos.fechaGeneracion
              ? new Date(datos.fechaGeneracion).toLocaleString('es-CO')
              : 'Fecha no disponible'}
          </p>
        </div>

      </div>

    </section>
  );
}

export default Reportes;
