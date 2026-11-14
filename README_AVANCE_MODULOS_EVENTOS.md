# EVENTRIX
## README técnico — Desarrollo de Clientes, Eventos y Espacios

**Proyecto de grado — SENA**  
**Programa:** Tecnología en Análisis y Desarrollo de Software (ADSO)  
**Fecha de actualización:** 9 de noviembre de 2026  
**Repositorio:** https://github.com/Naurimar/EVENTRIX  
**Rama desarrollada:** `feature/eventos`

**Integrantes del equipo:**
- Naurimar González Herrera
- Lucciana Vergara Martínez
- Sofía Solórzano Pacheco

**Responsable de los módulos documentados:** Sofía Solórzano Pacheco.

---

# 1. DESCRIPCIÓN GENERAL DEL PROYECTO

EVENTRIX es una plataforma web diseñada para facilitar la planificación, organización y administración de eventos sociales.

El sistema está orientado principalmente a bodas y cumpleaños, incluyendo los quinceañeros como una modalidad de cumpleaños que requiere planificación avanzada.

La finalidad del proyecto es centralizar procesos como la gestión de clientes, eventos, espacios, reservas, proveedores, invitados y recursos, proporcionando una herramienta organizada para los administradores.

El proyecto se desarrolla mediante una arquitectura de frontend, backend y base de datos relacional.

Este documento describe los avances realizados en la rama `feature/eventos`, las funcionalidades implementadas, las pruebas ejecutadas, las configuraciones realizadas y los procedimientos necesarios para que los demás integrantes puedan comprender y continuar el desarrollo.

---

# 2. TECNOLOGÍAS UTILIZADAS

| Tecnología | Versión o uso | Descripción |
|---|---|---|
| Java | 25 | Lenguaje principal del backend |
| Spring Boot | 4.1.1 | Desarrollo de API REST |
| Spring Security | Autenticación | Protección de endpoints |
| JWT | Tokens | Autenticación de solicitudes |
| Spring Data JPA | Persistencia | Acceso a datos |
| Hibernate | ORM | Mapeo de entidades |
| MySQL | 9.7.0 local | Base de datos relacional |
| React | 19 | Desarrollo de interfaces |
| Vite | 8 | Servidor de desarrollo frontend |
| JavaScript | ES6+ | Lógica del frontend |
| HTML y CSS | Interfaces | Estructura y diseño |
| Maven Wrapper | Backend | Compilación y ejecución |
| Git | Versionamiento | Control de cambios |
| GitHub | Repositorio | Colaboración del equipo |
| VS Code | IDE | Desarrollo y depuración |

## Arquitectura utilizada

El sistema funciona mediante la siguiente estructura:

```text
                  USUARIO
                     |
                     v
              REACT + VITE
             localhost:5173
                     |
                     | HTTP / API REST
                     v
               SPRING BOOT
             localhost:8080
                     |
              SPRING SECURITY
                     |
                    JWT
                     |
              CONTROLADORES
                     |
                 SERVICIOS
                     |
               REPOSITORIOS
                     |
                 JPA / ORM
                     |
                    MYSQL
```

El frontend se encarga de presentar la información y permitir la interacción de los usuarios.

El backend procesa las solicitudes, ejecuta las operaciones correspondientes y aplica las reglas de seguridad.

MySQL almacena la información de los módulos.

---

# 3. ORGANIZACIÓN DEL PROYECTO

La estructura principal utilizada es:

```text
EVENTRIX/
|
|-- backend/
|   |
|   |-- eventrix-api/
|       |
|       |-- pom.xml
|       |-- mvnw
|       |-- mvnw.cmd
|       |
|       |-- src/main/java/
|       |   |
|       |   |-- eventrix_api/
|       |       |
|       |       |-- EventrixApiApplication.java
|       |       |-- Entidades
|       |       |-- Repositorios
|       |       |-- Servicios
|       |       |-- Controladores
|       |       |-- Seguridad
|       |
|       |-- src/main/resources/
|           |
|           |-- application.properties
|
|-- frontend/
|   |
|   |-- eventrix-wed/
|       |
|       |-- package.json
|       |-- src/
|           |
|           |-- App.jsx
|           |-- App.css
|           |-- index.css
|           |-- services/
|               |
|               |-- api.js
|
|-- database/
|
|-- README.md
```

Esta estructura es orientativa. La ubicación exacta de los controladores, servicios y componentes debe comprobarse en el código vigente del repositorio.

---

# 4. DESARROLLO REALIZADO EN LA RAMA FEATURE/EVENTOS

Durante el desarrollo de esta rama se trabajó principalmente en tres módulos:

1. Gestión de Clientes.
2. Gestión de Eventos.
3. Gestión de Espacios.

También se realizaron trabajos de integración entre frontend y backend, conexión con MySQL, autenticación, pruebas funcionales y adaptación responsive.

## 4.1. MÓDULO DE CLIENTES

Se desarrolló el CRUD para administrar los clientes registrados en EVENTRIX.

CRUD significa:

- Create: crear registros.
- Read: consultar registros.
- Update: actualizar registros.
- Delete: eliminar registros.

### Funcionalidades desarrolladas

**Registrar clientes**

Permite enviar información desde un formulario del frontend hacia el backend para almacenarla en MySQL.

**Consultar clientes**

Permite recuperar los clientes registrados mediante la API REST.

**Buscar clientes**

Se incorporó funcionalidad de búsqueda en la página de clientes para facilitar su localización.

**Actualizar clientes**

Permite modificar información de clientes existentes.

**Eliminar clientes**

Permite eliminar registros mediante la operación correspondiente del backend.

### Integración realizada

Se conectó la página de clientes de React con los servicios HTTP del backend.

El flujo general es:

```text
Formulario React
       |
       v
Solicitud HTTP
       |
       v
Controlador de clientes
       |
       v
Servicio / lógica
       |
       v
Repositorio JPA
       |
       v
Tabla cliente en MySQL
```

### Pruebas realizadas

Se ejecutaron pruebas manuales de operaciones CRUD utilizando autenticación JWT.

Las pruebas permitieron comprobar la comunicación entre la interfaz, la API y la base de datos local utilizada durante el desarrollo.

### Aspectos por verificar

- Validaciones de campos obligatorios.
- Mensajes de error.
- Comportamiento con datos duplicados.
- Integridad de relaciones.
- Permisos asociados a los roles.
- Compatibilidad completa con la copia oficial de MySQL.

---

## 4.2. MÓDULO DE EVENTOS

Se desarrolló el módulo encargado de registrar y administrar los eventos.

Este módulo representa una parte central de EVENTRIX porque relaciona la información de los clientes con los eventos organizados.

### Funcionalidades desarrolladas

**Registrar eventos**

Permite crear eventos a través de solicitudes enviadas desde React.

**Consultar eventos**

Permite recuperar los eventos existentes.

**Actualizar eventos**

Permite modificar la información de un evento registrado.

**Eliminar eventos**

Permite realizar la eliminación del registro correspondiente.

### Información del evento

Según el análisis funcional, se contemplan datos como:

- Nombre del evento.
- Tipo de evento.
- Fecha.
- Cantidad de asistentes.
- Temática.
- Estado.
- Cliente relacionado.
- Usuario relacionado.

Los campos definitivos y sus restricciones corresponden a las entidades implementadas en el código.

### Relación entre clientes y eventos

Se trabajó en la vinculación de los eventos con sus respectivos clientes.

Esta relación es importante porque permite identificar para quién se organiza un evento.

Ejemplo:

```text
CLIENTE
   |
   | Tiene eventos asociados
   |
   v
EVENTO
   |
   | Información del evento
   |
   v
Fecha, tipo, asistentes y estado
```

El backend utiliza identificadores relacionados con cliente y usuario.

### Pruebas realizadas

Se comprobaron operaciones de creación, consulta y manejo de eventos utilizando peticiones autenticadas.

También se trabajó la integración entre el formulario de eventos y los datos de clientes disponibles.

### Aspectos pendientes

- Validaciones completas de tipos y estados.
- Pruebas de integridad referencial.
- Verificación de relaciones con la estructura oficial.
- Reglas adicionales de planificación.
- Integración con reservas y otros módulos.

**Nota:** la planificación avanzada de quinceañeros forma parte del alcance general de EVENTRIX, pero no se declara terminada dentro de este avance.

---

## 4.3. MÓDULO DE ESPACIOS

Se desarrolló el módulo de gestión de espacios destinados a la organización de eventos.

### Funcionalidades desarrolladas

- Registro de espacios.
- Consulta de espacios disponibles en el sistema.
- Actualización de información.
- Eliminación de registros.
- Integración de la interfaz con el backend.

### Flujo del módulo

```text
Administrador
      |
      v
Página de Espacios
      |
      v
API REST
      |
      v
Spring Boot
      |
      v
Repositorio JPA
      |
      v
Tabla espacio
```

### Pruebas realizadas

Se efectuaron pruebas manuales de las operaciones CRUD básicas y de su integración con la aplicación.

### Aspectos por verificar

- Capacidad de espacios.
- Validación de disponibilidad.
- Relaciones con reservas.
- Conflictos entre fechas.
- Permisos de modificación y eliminación.

**Importante:** el CRUD de Espacios está desarrollado, pero eso no significa que todo el sistema avanzado de reservas esté implementado.

---

# 5. FRONTEND CON REACT

El frontend está desarrollado con React y Vite.

Su función consiste en proporcionar una interfaz visual para interactuar con las operaciones del backend.

## Trabajo realizado

Se avanzó en:

- Integración del panel administrativo.
- Implementación de la página de clientes.
- Integración de la gestión de eventos.
- Integración de la gestión de espacios.
- Comunicación mediante servicios HTTP.
- Manejo de datos enviados desde formularios.
- Presentación de información recuperada de la API.
- Ajustes visuales y responsive.

## Servicios HTTP

Se utilizó el archivo:

```text
frontend/eventrix-wed/src/services/api.js
```

Este archivo forma parte de la configuración de comunicación del frontend con el backend.

Centralizar las solicitudes facilita reutilizar la configuración de API y mantener organizada la comunicación.

## Navegación

Se conservó la estructura de navegación horizontal y la identidad visual acordada por el equipo.

El trabajo se orientó a integrar los nuevos módulos sin reemplazar innecesariamente el diseño existente.

---

# 6. DISEÑO RESPONSIVE

Se estableció como requisito que EVENTRIX se pueda utilizar desde:

- Teléfonos celulares.
- Tabletas.
- Computadores portátiles.
- Computadores de escritorio.

Se trabajaron ajustes en los módulos de Clientes, Eventos y Espacios, procurando conservar la identidad visual del sistema.

Durante el desarrollo se realizaron revisiones de comportamiento en resoluciones móviles, incluyendo pruebas alrededor de 401 píxeles de ancho.

### Objetivos del diseño responsive

- Evitar desbordamientos horizontales.
- Mantener formularios legibles.
- Facilitar el uso de botones.
- Adaptar tablas y componentes.
- Conservar navegación clara.
- Aprovechar adecuadamente el espacio disponible.

**Estado:** se realizaron ajustes y revisiones parciales. Todavía se requiere una matriz completa de pruebas en diferentes dispositivos.

---

# 7. BACKEND CON SPRING BOOT

El backend fue desarrollado en Java utilizando Spring Boot 4.1.1.

Se organizaron las operaciones mediante una arquitectura de API REST conectada a MySQL.

## Componentes principales

**Controladores**

Reciben las solicitudes HTTP provenientes del frontend.

**Servicios**

Contienen la lógica relacionada con las operaciones de los módulos.

**Repositorios**

Permiten consultar y modificar información mediante Spring Data JPA.

**Entidades**

Representan la información persistida en las tablas de MySQL.

**Seguridad**

Controla la autenticación mediante Spring Security y JWT.

## Ejemplo del funcionamiento

```text
1. Usuario completa un formulario.

2. React recoge los datos.

3. React envía una solicitud HTTP.

4. Spring Boot recibe la solicitud.

5. El backend valida y procesa la operación.

6. JPA ejecuta la operación sobre MySQL.

7. El backend devuelve una respuesta.

8. React actualiza la interfaz.
```

---

# 8. AUTENTICACIÓN CON JWT

EVENTRIX utiliza autenticación mediante JSON Web Tokens (JWT).

El funcionamiento general consiste en:

1. El usuario introduce sus credenciales.
2. El backend consulta el usuario registrado.
3. Se valida la contraseña.
4. Si las credenciales son correctas, se genera un token.
5. El frontend utiliza el token para realizar solicitudes protegidas.

Durante las pruebas se trabajó con endpoints que requieren autenticación.

## Variable JWT_SECRET

La aplicación necesita una variable de entorno llamada:

```text
JWT_SECRET
```

Si no se encuentra configurada, Spring Boot puede mostrar:

```text
Could not resolve placeholder 'JWT_SECRET'
```

Para pruebas locales en Git Bash se puede generar así:

```bash
export JWT_SECRET=$(openssl rand -base64 32)
```

La clave no debe publicarse en el repositorio.

Cambiar esta clave invalida los tokens emitidos con la anterior.

---

# 9. BASES DE DATOS UTILIZADAS

Durante el desarrollo se trabajó con MySQL.

Posteriormente se recibió un respaldo de la estructura oficial del proyecto compartido por Naurimar.

Para evitar afectar la base original se utilizó una base independiente para realizar pruebas.

## 9.1. Base original

```text
eventrix
```

Fue utilizada durante el desarrollo inicial de los módulos CRUD.

## 9.2. Base oficial importada para pruebas

```text
eventrix_oficial_prueba
```

Esta base contiene una copia local del respaldo compartido por Naurimar.

La importación se realizó de forma separada para proteger los datos de la base original.

### Tablas importadas

Se verificaron las siguientes 19 tablas:

```text
actividad
categoria_recurso
ciudad
cliente
departamento
espacio
evento
evento_invitado
evento_proveedor
evento_recurso
invitado
mesa
partida_presupuesto
proveedor
recurso
reserva
rol
tipo_servicio
usuario
```

### Registros encontrados después de importar

| Tabla | Registros |
|---|---:|
| cliente | 0 |
| evento | 0 |
| espacio | 0 |
| usuario | 2 |

Estos valores corresponden al momento de la comprobación inicial.

### Usuarios existentes

Se verificaron los siguientes usuarios activos:

```text
admin@eventrix.com
prueba@eventrix.com
```

Los identificadores de rol eran 1 y 3, respectivamente.

No se documentan contraseñas ni hashes.

### Importante

La base `eventrix_oficial_prueba` es una copia local.

No se encuentra sincronizada automáticamente con la base del computador de Naurimar.

Si se modifica la base oficial posteriormente, será necesario acordar un nuevo procedimiento de sincronización o actualización.

---

# 10. IMPORTACIÓN DEL RESPALDO SQL

Para importar la base oficial se realizó el siguiente procedimiento:

1. Se comprobó la instalación de MySQL.
2. Se identificó el puerto de MySQL local.
3. Se creó una base de datos separada.
4. Se preparó un archivo SQL para importar únicamente en la base de prueba.
5. Se importó el archivo.
6. Se verificaron las tablas.
7. Se consultaron los registros principales.
8. Se conectó Spring Boot al esquema importado.

## Crear la base de prueba

Desde MySQL:

```sql
CREATE DATABASE IF NOT EXISTS eventrix_oficial_prueba
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

## Comprobar bases de datos

```sql
SHOW DATABASES;
```

## Verificar las tablas

Desde Git Bash:

```bash
"/c/Program Files/MySQL/MySQL Server 9.7/bin/mysql.exe" -h 127.0.0.1 -P 3307 -u root -p -e "SHOW TABLES FROM eventrix_oficial_prueba;"
```

## Verificar usuarios sin mostrar contraseñas

```bash
"/c/Program Files/MySQL/MySQL Server 9.7/bin/mysql.exe" -h 127.0.0.1 -P 3307 -u root -p -D eventrix_oficial_prueba -e "SELECT id_usuario, nombre, correo, estado, id_rol FROM usuario;"
```

**Precaución:** nunca se debe importar directamente un respaldo con instrucciones destructivas sobre una base que contenga información que se desea conservar.

Antes de importar, revisar especialmente instrucciones como `USE`, `DROP TABLE`, `DROP DATABASE` y referencias explícitas al nombre de la base.

---

# 11. CONEXIÓN DE SPRING BOOT CON MYSQL

Durante las pruebas se utilizó la siguiente URL JDBC:

```properties
spring.datasource.url=jdbc:mysql://localhost:3307/eventrix_oficial_prueba
```

Esta configuración corresponde al equipo local donde se realizaron las pruebas.

Cada integrante debe utilizar el puerto, usuario y nombre de base apropiados para su entorno.

## Configuración con variables de entorno

Ejemplo:

```properties
spring.datasource.url=jdbc:mysql://localhost:3307/eventrix_oficial_prueba
spring.datasource.username=root
spring.datasource.password=${DB_PASSWORD}

jwt.secret=${JWT_SECRET}
```

Los nombres definitivos de propiedades deben contrastarse con el archivo vigente del proyecto.

## Comprobación de conexión

Se obtuvo el siguiente resultado:

```text
HikariPool-1 - Start completed.

Database JDBC URL
[jdbc:mysql://localhost:3307/eventrix_oficial_prueba]

Tomcat started on port 8080 (http)

Started EventrixApiApplication
```

Este resultado demuestra que Spring Boot pudo conectarse e iniciar utilizando la copia oficial.

**La conexión exitosa no garantiza, por sí sola, que todos los CRUD estén completamente validados sobre esta nueva base.**

---

# 12. INSTALACIÓN Y EJECUCIÓN DEL PROYECTO

## Requisitos

Antes de ejecutar EVENTRIX se recomienda disponer de:

- Java 25.
- Node.js 22 o una versión compatible con el proyecto.
- npm.
- Git.
- MySQL.
- Visual Studio Code.
- Acceso al repositorio.
- Variables de entorno necesarias.

## Paso 1. Clonar el repositorio

```bash
git clone https://github.com/Naurimar/EVENTRIX.git
```

Ingresar a la carpeta:

```bash
cd EVENTRIX
```

## Paso 2. Actualizar referencias remotas

```bash
git fetch origin
```

## Paso 3. Abrir la rama de Eventos

```bash
git switch feature/eventos
```

Si la rama aún no existe localmente:

```bash
git switch --track origin/feature/eventos
```

## Paso 4. Configurar MySQL

Comprobar:

- Que el servidor MySQL esté ejecutándose.
- Que exista la base de datos correspondiente.
- Que el puerto coincida con la configuración.
- Que el usuario tenga permisos.
- Que la contraseña esté configurada de forma segura.

## Paso 5. Ejecutar el backend

Entrar a:

```bash
cd backend/eventrix-api
```

Configurar las variables en Git Bash:

```bash
export JWT_SECRET=$(openssl rand -base64 32)

read -s -p "Contraseña de MySQL: " DB_PASSWORD
echo
export DB_PASSWORD
```

Iniciar Spring Boot:

```bash
./mvnw spring-boot:run
```

El backend debe iniciar normalmente en:

```text
http://localhost:8080
```

La terminal debe permanecer abierta.

## Paso 6. Ejecutar el frontend

Abrir otra terminal.

Entrar a:

```bash
cd frontend/eventrix-wed
```

Instalar las dependencias:

```bash
npm ci
```

Ejecutar:

```bash
npm run dev
```

Abrir en el navegador:

```text
http://localhost:5173/
```

## Paso 7. Iniciar sesión

Se debe utilizar una cuenta válida registrada en la base de datos que esté conectada al backend.

Si la base cambia, los usuarios disponibles también pueden cambiar.

No se deben compartir contraseñas directamente en el README.

---

# 13. PRUEBAS FUNCIONALES REALIZADAS

Durante el desarrollo se realizaron pruebas manuales de los módulos utilizando el backend y frontend.

| Elemento | Resultado documentado |
|---|---|
| CRUD Clientes | Implementado y probado localmente |
| CRUD Eventos | Implementado y probado localmente |
| CRUD Espacios | Implementado y probado localmente |
| Relación Cliente–Evento | Trabajada y probada localmente |
| API REST | Comunicación funcional durante el desarrollo |
| Autenticación JWT | Utilizada en pruebas |
| React y Vite | Interfaz ejecutada localmente |
| Diseño responsive | Ajustes y revisiones parciales |
| MySQL oficial de prueba | Importación completada |
| Tablas oficiales | 19 tablas verificadas |
| Spring Boot con copia oficial | Inicio exitoso |
| Inicio de sesión con copia oficial | Se identificó la diferencia de usuarios entre bases |

## Pruebas pendientes con la base oficial

Aunque los CRUD se habían probado previamente, todavía corresponde registrar una ronda completa de pruebas sobre `eventrix_oficial_prueba`.

| Prueba | Resultado esperado | Estado |
|---|---|---|
| Iniciar sesión | Acceso autorizado | Por documentar |
| Consultar clientes | Listado correcto | Pendiente |
| Crear cliente | Registro almacenado | Pendiente |
| Actualizar cliente | Cambios persistidos | Pendiente |
| Eliminar cliente | Registro eliminado correctamente | Pendiente |
| Crear evento | Evento asociado al cliente | Pendiente |
| Consultar eventos | Información recuperada | Pendiente |
| Actualizar evento | Cambios guardados | Pendiente |
| Eliminar evento | Eliminación controlada | Pendiente |
| CRUD Espacios | Operaciones correctas | Pendiente |
| Validaciones | Respuestas apropiadas | Pendiente |
| Responsive completo | Adaptación correcta | Parcial |

Las pruebas que alteren datos deben realizarse con registros de prueba autorizados.

---

# 14. PROBLEMAS ENCONTRADOS Y SOLUCIONES

Durante el desarrollo e integración se encontraron diferentes errores.

## 14.1. Comando MySQL no reconocido

**Problema:** Git Bash no reconocía directamente el comando `mysql`.

**Solución:** utilizar la ruta completa del cliente instalado.

```bash
"/c/Program Files/MySQL/MySQL Server 9.7/bin/mysql.exe" --version
```

## 14.2. Diferencia entre puertos MySQL

Se trabajó con el servidor MySQL local en el puerto `3307`.

Se comprobó que cambiar una conexión a `localhost:3306` no significa conectarse automáticamente a la base del computador de otra integrante.

**Solución:** trabajar temporalmente con una copia del respaldo oficial en el MySQL local.

## 14.3. Archivo SQL no encontrado

**Problema:**

```text
No such file or directory
```

**Solución:**

```bash
find ~/Downloads ~/Desktop -iname "*eventrix*sql" 2>/dev/null
```

Esto permitió encontrar el respaldo en la carpeta correspondiente.

## 14.4. Riesgo de sobrescribir la base original

El respaldo SQL podía contener instrucciones para seleccionar una base específica y reemplazar tablas.

**Solución:** preparar una copia destinada a `eventrix_oficial_prueba` y mantener separada la base original.

## 14.5. Error JWT_SECRET

**Problema:**

```text
Could not resolve placeholder 'JWT_SECRET'
```

**Causa:** Spring Boot no encontraba la variable de entorno necesaria.

**Solución:**

```bash
export JWT_SECRET=$(openssl rand -base64 32)
```

La variable debe configurarse en la misma terminal donde se ejecuta Spring Boot.

## 14.6. Puerto 8080 ocupado

**Problema:**

```text
Port 8080 was already in use
```

**Causa:** existía un proceso Java escuchando en ese puerto.

**Diagnóstico:**

```bash
netstat -ano | grep ':8080'
```

Para identificar el proceso:

```bash
tasklist //FI "PID eq 43340"
```

Después de confirmar que se trataba del proceso correspondiente, se liberó el puerto.

En situaciones similares se recomienda detener primero el servidor desde su propia terminal con `Ctrl + C`.

## 14.7. Credenciales rechazadas después de cambiar de base

**Problema:** una cuenta que funcionaba anteriormente comenzó a mostrar un mensaje de credenciales incorrectas.

**Causa identificada:** el correo utilizado antes no estaba registrado en `eventrix_oficial_prueba`.

**Solución:** consultar los usuarios de la nueva base y utilizar credenciales autorizadas correspondientes a ella.

**Aprendizaje:** cambiar de esquema de base de datos también puede cambiar los usuarios y contraseñas disponibles.

---

# 15. CONTROL DE VERSIONES CON GIT

El desarrollo de los módulos se trabajó en:

```text
feature/eventos
```

El proyecto utiliza un repositorio compartido con ramas de desarrollo por funcionalidades.

Durante el trabajo se realizaron operaciones como:

- Consultar el estado del repositorio.
- Descargar referencias remotas.
- Cambiar de rama.
- Integrar cambios del frontend y backend.
- Preparar commits.
- Subir avances a GitHub.
- Documentar el progreso.

## Comandos utilizados

Verificar rama:

```bash
git branch --show-current
```

Verificar cambios:

```bash
git status
```

Actualizar referencias:

```bash
git fetch origin
```

Consultar último commit:

```bash
git log -1 --oneline
```

Subir cambios confirmados:

```bash
git push origin feature/eventos
```

En el seguimiento del desarrollo se registraron los commits `8c36c4a` y `0459efc`, correspondientes a avances de la rama. El último commit real debe comprobarse en GitHub antes de integrar.

## Recomendaciones importantes

No ejecutar `git add .` sin revisar previamente los archivos modificados.

No subir al repositorio:

- Contraseñas.
- Tokens JWT.
- Archivos con respuestas de autenticación.
- Secretos de configuración.
- Respaldos no autorizados.
- Archivos locales innecesarios.

Antes de cada commit:

```bash
git status
git diff
```

La configuración local de MySQL puede variar entre integrantes, por lo que no deben imponerse rutas, puertos o contraseñas personales en la configuración compartida.

---

# 16. TRABAJO PENDIENTE PARA LA INTEGRACIÓN

## Prioridad alta

- [ ] Ejecutar los CRUD sobre la copia oficial.
- [ ] Comprobar correspondencia entre entidades Java y tablas SQL.
- [ ] Validar claves foráneas y relaciones.
- [ ] Comprobar permisos según roles.
- [ ] Documentar las respuestas reales de la API.
- [ ] Revisar posibles diferencias de estructura entre las bases.
- [ ] Coordinar la integración con la rama `develop`.

## Prioridad media

- [ ] Completar las pruebas responsive.
- [ ] Mejorar las validaciones de formularios.
- [ ] Incorporar manejo claro de errores.
- [ ] Agregar pruebas automatizadas cuando corresponda.
- [ ] Actualizar la documentación de endpoints.
- [ ] Revisar estrategia de migraciones de base de datos.

## Funcionalidades del alcance general

- [ ] Planificación avanzada de quinceañeros.
- [ ] Integración completa de invitados.
- [ ] Integración completa de proveedores.
- [ ] Gestión avanzada de recursos.
- [ ] Reservas con verificación de disponibilidad.
- [ ] Validación de conflictos de fechas y espacios.

Estas funcionalidades pertenecen al proyecto global y deben coordinarse según la distribución del trabajo del equipo.

---

# 17. GUÍA PARA QUE LAS COMPAÑERAS ESTUDIEN EL CÓDIGO

Para comprender los avances se recomienda seguir este orden:

### 1. Revisar el frontend

Abrir:

```text
frontend/eventrix-wed/src/App.jsx
```

Comprender cómo se organiza la navegación y se muestran los módulos.

### 2. Revisar la comunicación HTTP

Abrir:

```text
frontend/eventrix-wed/src/services/api.js
```

Identificar cómo el frontend envía solicitudes al backend.

### 3. Revisar el backend

Localizar los controladores, servicios, entidades y repositorios de Clientes, Eventos y Espacios.

Comprender qué responsabilidad tiene cada capa.

### 4. Comprender el flujo CRUD

Seguir una operación desde:

```text
React
  |
  v
API REST
  |
  v
Controlador
  |
  v
Servicio
  |
  v
Repositorio JPA
  |
  v
MySQL
```

### 5. Revisar la autenticación

Comprender:

```text
Login
  |
  v
Validación del usuario
  |
  v
Generación de JWT
  |
  v
Solicitud autenticada
  |
  v
Endpoint protegido
```

### 6. Realizar pruebas

Crear, consultar, editar y eliminar datos exclusivamente en un entorno de prueba autorizado.

Comparar los resultados del navegador con los registros almacenados en MySQL.

### 7. Revisar la integración

Comprobar el funcionamiento con la estructura de datos oficial antes de fusionar definitivamente los cambios con otras ramas.

---

# 18. CONCEPTOS IMPORTANTES PARA LA SUSTENTACIÓN

**CRUD:** operaciones para crear, consultar, actualizar y eliminar registros.

**API REST:** mecanismo de comunicación entre frontend y backend utilizando solicitudes HTTP.

**React:** biblioteca de JavaScript para construir interfaces de usuario.

**Vite:** herramienta utilizada para ejecutar y desarrollar el frontend.

**Spring Boot:** framework utilizado para desarrollar el backend Java.

**JPA:** especificación que permite trabajar con persistencia de información mediante entidades Java.

**Hibernate:** implementación ORM que facilita la relación entre objetos Java y tablas SQL.

**JWT:** token empleado para autenticar solicitudes a endpoints protegidos.

**MySQL:** sistema de gestión de bases de datos relacionales.

**Responsive:** capacidad de adaptar la interfaz a distintos tamaños de pantalla.

**Git:** herramienta de control de versiones.

**GitHub:** plataforma utilizada para compartir y organizar el código del equipo.

**Rama de Git:** línea de desarrollo independiente que permite implementar funcionalidades antes de integrarlas.

---

# 19. CONCLUSIONES

Durante el desarrollo de la rama `feature/eventos` se implementaron y conectaron los módulos de Clientes, Eventos y Espacios de EVENTRIX.

Estos avances incluyeron:

- Desarrollo de operaciones CRUD en el backend.
- Integración de páginas React con los servicios HTTP.
- Trabajo sobre relaciones entre clientes y eventos.
- Uso de autenticación JWT para las pruebas.
- Integración con MySQL.
- Ajustes de diseño responsive.
- Pruebas manuales de funcionalidades.
- Organización del trabajo mediante Git y GitHub.
- Documentación de avances para facilitar la colaboración.

Posteriormente, se logró importar una copia del respaldo oficial de MySQL compartido por Naurimar, verificar sus 19 tablas y conectar correctamente Spring Boot con la base `eventrix_oficial_prueba`.

El backend inició satisfactoriamente en el puerto 8080 utilizando dicha copia.

**Estado actual:** los módulos desarrollados cuentan con pruebas funcionales locales previas y la conexión a la base oficial de prueba ha sido comprobada. La validación integral de todos los CRUD, relaciones y permisos sobre la copia oficial continúa como actividad pendiente de integración.

Esta documentación permite a los demás integrantes revisar los avances, comprender las decisiones técnicas y continuar el desarrollo de EVENTRIX de manera organizada.

---

**Documento elaborado por:** Sofía Solórzano Pacheco  
**Proyecto:** EVENTRIX  
**Programa:** Tecnología en Análisis y Desarrollo de Software — SENA  
**Rama:** `feature/eventos`  
**Última actualización:** 9 de noviembre de 2026
