# EVENTRIX – Desarrollo de módulos y operaciones

## 1. Descripción del proyecto

Eventrix es una plataforma web para la gestión y administración de eventos. Permite centralizar diferentes procesos relacionados con la organización de eventos, sus participantes, proveedores, reservas y generación de reportes.

Este documento describe las funcionalidades desarrolladas en la rama `feature/operaciones` y su integración con la arquitectura general del proyecto.

## 2. Funcionalidades desarrolladas

### 2.1. Gestión de proveedores

- Administración del catálogo de proveedores.
- Registro y consulta de proveedores.
- Organización de proveedores según sus tipos de servicio.
- Integración con la gestión de eventos.

### 2.2. Gestión de invitados

- Administración de invitados.
- Consulta y gestión de la información de los participantes.
- Asociación de invitados con eventos.

### 2.3. Gestión de reservas

- Administración de reservas.
- Registro y consulta de información relacionada con las reservas.
- Integración con los procesos de gestión de eventos.

### 2.4. Generación de reportes PDF

- Implementación de funcionalidades para la generación de reportes en PDF.
- Integración de la biblioteca Apache PDFBox.
- Organización de la información para su presentación en documentos.

### 2.5. Dashboard y analítica

- Desarrollo de funcionalidades de análisis de información.
- Preparación de datos para indicadores y visualización gráfica.
- Integración con MongoDB para el almacenamiento y consulta de información analítica.

### 2.6. Autenticación y seguridad

- Implementación de autenticación mediante JWT.
- Configuración de servicios de autenticación.
- Protección de rutas mediante filtros de seguridad.
- Gestión de usuarios y validación de credenciales.

### 2.7. Catálogo geográfico de Colombia

Se incorporó el catálogo geográfico basado en DIVIPOLA, con:

- 33 departamentos, incluida Bogotá D. C.
- 1.122 municipios.
- Códigos oficiales DIVIPOLA.
- Relaciones entre departamentos y municipios.
- Consultas mediante servicios REST.

**Archivo de datos:** `database/catalogo_divipola.sql`

**Servicios disponibles:**

| Método | Endpoint | Función |
|---|---|---|
| GET | `/api/v1/departamentos` | Consultar departamentos |
| GET | `/api/v1/ciudades?departamentoId={id}` | Consultar municipios por departamento |
| GET | `/api/v1/ciudades/{id}` | Consultar un municipio por identificador |

## 3. Tecnologías utilizadas

**Frontend**
- React
- JavaScript
- Vite
- CSS

**Backend**
- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- Maven
- JWT

**Bases de datos**
- MySQL
- MongoDB

**Otras herramientas**
- Apache PDFBox
- Git y GitHub
- Python para herramientas auxiliares de análisis.

## 4. Estructura del proyecto

```text
EVENTRIX/
├── analytics/
├── backend/
│   └── eventrix-api/
│       └── src/main/java/eventrix_api/
│           ├── config/
│           ├── controller/
│           ├── dto/
│           ├── model/
│           ├── repository/
│           ├── security/
│           └── service/
├── database/
│   └── catalogo_divipola.sql
└── frontend/
    └── eventrix-wed/
        └── src/
            ├── components/
            ├── pages/
            ├── services/
            └── styles/
```

## 5. Requisitos para ejecutar el proyecto

- Java y Maven Wrapper.
- Node.js y npm.
- MySQL.
- MongoDB para las funcionalidades analíticas.
- Variables de entorno configuradas.

## 6. Configuración y ejecución

### Backend

Desde PowerShell:

```powershell
cd backend/eventrix-api

$env:DB_PASSWORD = Read-Host "Contraseña de MySQL"
$env:MONGO_URI = Read-Host "URI de conexión de MongoDB"
$env:JWT_SECRET = Read-Host "Clave secreta JWT"

.\mvnw.cmd spring-boot:run
```

El backend se ejecuta en:

`http://localhost:8080`

### Frontend

En otra ventana de PowerShell:

```powershell
cd frontend/eventrix-wed

npm install
npm run dev
```

El frontend se ejecuta en:

`http://localhost:5173`

### Catálogo geográfico

Para incorporar los departamentos y municipios a la base de datos integrada, se debe importar:

`database/catalogo_divipola.sql`

La importación debe realizarse en las tablas `departamento` y `ciudad`, verificando previamente la estructura y los identificadores de la base de datos de destino.

## 7. Configuración de seguridad

Las credenciales y claves de conexión deben mantenerse en variables de entorno o archivos `.env` locales.

No se deben publicar contraseñas, tokens ni archivos de configuración con información sensible en GitHub.

## 8. Rama de desarrollo

- **Repositorio:** `Naurimar/EVENTRIX`
- **Rama:** `feature/operaciones`

La rama contiene los desarrollos correspondientes a los módulos de operaciones, autenticación, servicios de backend, funcionalidades de frontend y catálogo geográfico.

## 9. Estado del desarrollo

El backend y el frontend superaron sus respectivas comprobaciones de compilación.

La validación funcional completa, las pruebas de integración entre módulos y la verificación del despliegue deben realizarse sobre la versión consolidada del equipo.

---

**EVENTRIX – Plataforma de gestión de eventos.**