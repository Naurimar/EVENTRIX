# EVENTRIX
## Avance de desarrollo — Módulos de Clientes, Eventos y Espacios

**Proyecto:** EVENTRIX — Gestión inteligente de eventos
**Programa:** Tecnología en Análisis y Desarrollo de Software
**Institución:** Servicio Nacional de Aprendizaje — SENA
**Responsable de estos módulos:** Sofía Solórzano Pacheco
**Rama de desarrollo:** `feature/eventos`
**Estado:** Entrega parcial para integración
**Fecha:** Noviembre de 2026

---

## 1. Descripción del avance

Este documento describe el trabajo realizado en los módulos de
Clientes, Eventos y Espacios del sistema EVENTRIX.

El objetivo es compartir con el equipo los avances funcionales,
la organización del código, las pruebas realizadas y las tareas
que todavía están pendientes.

Este README es provisional. Se actualizará conforme finalice
el desarrollo del frontend y se realicen las pruebas integrales.

## 2. Tecnologías utilizadas

### Backend
- Java 25
- Spring Boot
- Spring Data JPA
- Hibernate
- Spring Security
- Autenticación JWT
- Maven
- MySQL

### Frontend
- React
- Vite
- JavaScript
- CSS
- Lucide React
- Fetch API

### Control de versiones
- Git
- GitHub
- Rama `feature/eventos`

## 3. Módulos desarrollados en el backend

Se implementaron los módulos de Clientes, Eventos y Espacios
mediante una arquitectura organizada por capas:

- Model: entidades relacionadas con MySQL.
- Repository: acceso y persistencia de información.
- Service: operaciones de gestión de datos.
- Controller: exposición de endpoints REST.

### 3.1. Gestión de clientes

Permite registrar y administrar información de clientes.

Campos disponibles:

- ID del cliente
- Documento
- Nombre
- Teléfono
- Correo electrónico
- ID de ciudad

Endpoints implementados:

| Método | Endpoint | Función |
|---|---|---|
| GET | `/api/v1/clientes` | Listar clientes |
| GET | `/api/v1/clientes/{id}` | Consultar cliente |
| POST | `/api/v1/clientes` | Crear cliente |
| PUT | `/api/v1/clientes/{id}` | Actualizar cliente |
| DELETE | `/api/v1/clientes/{id}` | Eliminar cliente |

Se comprobaron las consultas y la creación y actualización
de registros mediante solicitudes HTTP.

Pendiente de mejora:
- Validaciones adicionales de datos.
- Manejo de errores y restricciones de unicidad.
- Permitir actualizar el campo de ciudad desde PUT.
- Pruebas automatizadas.

### 3.2. Gestión de eventos

Permite administrar eventos como bodas y cumpleaños,
incluyendo quinceañeros como modalidad de cumpleaños.

Campos disponibles:

- ID del evento
- Nombre
- Tipo
- Fecha
- Hora de inicio
- Presupuesto
- Estado
- Temática
- Número de invitados
- ID del usuario responsable
- ID del cliente

Endpoints implementados:

| Método | Endpoint | Función |
|---|---|---|
| GET | `/api/v1/eventos` | Listar eventos |
| GET | `/api/v1/eventos/{id}` | Consultar evento |
| POST | `/api/v1/eventos` | Crear evento |
| PUT | `/api/v1/eventos/{id}` | Actualizar evento |
| DELETE | `/api/v1/eventos/{id}` | Eliminar evento |

Se comprobaron las consultas y la creación y actualización
de un evento de prueba asociado a un usuario existente.

Pendiente de mejora:
- Validaciones de fechas y estados.
- Reglas de negocio para tipos de evento.
- Verificación de relaciones entre clientes y usuarios.
- Planificación avanzada de quinceañeros.
- Pruebas automatizadas.

### 3.3. Gestión de espacios

Permite administrar los espacios destinados a eventos.

Campos disponibles:

- ID del espacio
- Nombre
- Tipo
- Capacidad
- Ubicación
- Tarifa
- Disponibilidad
- ID de ciudad

Endpoints implementados:

| Método | Endpoint | Función |
|---|---|---|
| GET | `/api/v1/espacios` | Listar espacios |
| GET | `/api/v1/espacios/{id}` | Consultar espacio |
| POST | `/api/v1/espacios` | Crear espacio |
| PUT | `/api/v1/espacios/{id}` | Actualizar espacio |
| DELETE | `/api/v1/espacios/{id}` | Eliminar espacio |

Se comprobaron las consultas y la creación y actualización
de un espacio de prueba.

Pendiente de mejora:
- Validación de capacidad y tarifa.
- Reglas de disponibilidad y reservas.
- Gestión de fotografías, si se incorpora al alcance.
- Pruebas automatizadas.

## 4. Integración con autenticación JWT

Se integraron los módulos desarrollados con el trabajo
de autenticación existente en la rama `feature/auth`.

La autenticación utiliza Spring Security y JWT.

Endpoint de inicio de sesión:

POST `/api/auth/login`

Ejemplo de solicitud:

```json
{
  "correo": "usuario@ejemplo.com",
  "clave": "CONTRASENA_DEL_USUARIO"
}
```

El servidor devuelve un token JWT cuando las credenciales
son válidas.

Para acceder a los endpoints protegidos se utiliza:

`Authorization: Bearer <TOKEN_JWT>`

Se verificó el inicio de sesión y se obtuvieron respuestas
HTTP 200 al consultar los tres módulos con un JWT válido.

**Importante:** la autenticación y la administración de
usuarios son componentes compartidos con el equipo.
La integración no representa autoría individual de esos
módulos.

## 5. Trabajo realizado en el frontend

Se comenzó la integración de los módulos con React.

### 5.1. Panel de administración

Se creó el componente `PanelAdmin`, que incorpora:

- Pantalla de bienvenida.
- Navegación entre módulos.
- Acceso a Clientes, Eventos y Espacios.
- Información básica de la sesión.
- Acción para cerrar sesión.
- Menú adaptable a dispositivos móviles.

### 5.2. Servicio de conexión a la API

Se creó `src/services/api.js`.

Este servicio centraliza las solicitudes HTTP y permite:

- Consultar registros.
- Buscar registros por ID.
- Crear registros.
- Actualizar registros.
- Eliminar registros.
- Incorporar el JWT a las solicitudes autenticadas.

Se definieron:

- `clientesApi`
- `eventosApi`
- `espaciosApi`

### 5.3. Pantalla de clientes

Se creó una primera versión de `ClientesPage`.

Funcionalidades implementadas:

- Consulta del listado desde la API.
- Visualización en una tabla.
- Búsqueda de clientes.
- Mensajes de carga y error.
- Estilos iniciales adaptables.

Los botones para crear, consultar individualmente,
editar y eliminar todavía requieren integración visual
con sus formularios.

### 5.4. Eventos y espacios

Los módulos tienen acceso desde el panel y servicios
API preparados.

Sus pantallas completas en React siguen pendientes.

## 6. Identidad visual

Se acordó la siguiente identidad visual para EVENTRIX:

| Elemento | Color |
|---|---|
| Morado noche | `#2B0E4F` |
| Violeta | `#7A3EF0` |
| Lavanda | `#C8A6FF` |
| Dorado | `#D4AF37` |
| Lila claro | `#F3E8FF` |
| Blanco | `#FFFFFF` |

Tipografías previstas:

- Playfair Display: títulos especiales.
- Poppins: encabezados y módulos.
- Inter: formularios, tablas y textos.

El diseño definitivo se implementará posteriormente,
respetando el logo original y los bocetos del equipo.

## 7. Estructura de archivos

### Backend

Dentro de:

`backend/eventrix-api/src/main/java/eventrix_api/`

Se encuentran los paquetes:

- `model/`
- `repository/`
- `service/`
- `controller/`

Estos contienen las clases correspondientes a
Cliente, Evento y Espacio.

### Frontend

Dentro de `frontend/eventrix-wed/src/`:

```text
src/
├── components/
│   └── layout/
│       ├── PanelAdmin.jsx
│       └── PanelAdmin.css
├── pages/
│   ├── clientes/
│   │   ├── ClientesPage.jsx
│   │   └── ClientesPage.css
│   ├── eventos/
│   └── espacios/
├── services/
│   └── api.js
├── App.jsx
└── App.css
```

Los módulos de eventos y espacios aún no tienen
sus pantallas completas.

## 8. Ejecución local

### Requisitos

- Java 25
- Node.js y npm compatibles con el proyecto
- MySQL
- Base de datos EVENTRIX del equipo

### Backend

Desde:

`backend/eventrix-api`

Ejecutar:

```bash
./mvnw spring-boot:run
```

El servidor se utiliza localmente en:

`http://localhost:8080`

La configuración de MySQL, las contraseñas y la clave
JWT deben establecerse mediante la configuración
correspondiente al entorno de cada integrante.

No se deben subir contraseñas, tokens ni archivos
de configuración con información sensible.

### Frontend

Desde:

`frontend/eventrix-wed`

Ejecutar:

```bash
npm install
npm run dev
```

Abrir la URL local que indique Vite, normalmente:

`http://localhost:5173`

Para verificar la compilación:

```bash
npm run build
```

### Consideraciones de integración

- La base de datos debe contener las tablas y relaciones
  esperadas por las entidades.
- Los usuarios deben tener credenciales válidas.
- Los endpoints de gestión requieren autenticación JWT.
- La dirección de la API está configurada actualmente
  para desarrollo local.
- Cada integrante debe usar su propia configuración
  de conexión a MySQL.

## 9. Pruebas realizadas

Durante el desarrollo se efectuaron pruebas manuales
con solicitudes HTTP.

Resultados confirmados:

- Compilación del backend con Maven.
- Inicio del backend conectado a MySQL local.
- Inicio de sesión JWT con respuesta HTTP 200.
- GET autenticado de clientes: HTTP 200.
- GET autenticado de eventos: HTTP 200.
- GET autenticado de espacios: HTTP 200.
- Creación y actualización de registros de prueba.
- Compilación del frontend mediante Vite.

Las operaciones DELETE están implementadas.
Se recomienda verificar y documentar sus códigos de
respuesta finales como parte de la integración.

Estas pruebas no sustituyen una suite automatizada
ni una validación integral del sistema.

## 10. Pendientes para próximas entregas

1. Completar los formularios de clientes en React.
2. Desarrollar las pantallas de gestión de eventos.
3. Desarrollar las pantallas de gestión de espacios.
4. Conectar las acciones CRUD desde la interfaz.
5. Incorporar validaciones y mensajes de error.
6. Revisar permisos según los roles.
7. Implementar reglas de negocio adicionales.
8. Completar el diseño responsive.
9. Revisar la integración con el trabajo del equipo.
10. Realizar pruebas funcionales y automatizadas.
11. Actualizar la documentación definitiva.

## 11. Observaciones para el equipo

Esta entrega busca facilitar la revisión e integración
de los módulos desarrollados en `feature/eventos`.

El backend y el frontend deben revisarse conjuntamente
antes de incorporar cambios a la rama principal.

Se recomienda verificar las entidades frente al esquema
SQL compartido y coordinar las nuevas funcionalidades
para evitar cambios incompatibles.

El trabajo visual y funcional del frontend continuará
en commits posteriores.

---

**Estado del documento:** Provisional — avance de integración.

**Responsable:** Sofía Solórzano Pacheco.
