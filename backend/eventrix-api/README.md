# EVENTRIX - Backend API

## 1. Descripcion del proyecto

EVENTRIX es una plataforma orientada a la gestion inteligente de eventos, que permite conectar usuarios con proveedores de servicios y facilitar procesos relacionados con la organizacion de eventos.

Este repositorio contiene el backend de EVENTRIX, encargado de gestionar la autenticacion, usuarios, solicitudes de proveedores, documentos y comunicacion con el frontend.

## 2. Funcionalidades desarrolladas

### 2.1 Autenticacion y usuarios
- Registro de usuarios.
- Inicio de sesion.
- Autenticacion mediante JWT.
- Integracion de inicio de sesion con Google.
- Validacion de credenciales.
- Gestion de usuarios y roles.
- Proteccion de rutas mediante configuracion de seguridad.

### 2.2 Registro de proveedores
- Registro de personas naturales y juridicas.
- Captura de informacion personal y empresarial.
- Registro de datos del titular.
- Registro de informacion del representante legal.
- Validacion de los datos requeridos.
- Gestion de solicitudes de vinculacion de proveedores.

### 2.3 Gestion documental
- Recepcion de documentos de identificacion.
- Carga del Registro Unico Tributario (RUT).
- Recepcion del certificado de Camara de Comercio.
- Documentos del representante legal.
- Validacion de formatos y tamanos de archivos.
- Asociacion de documentos con las solicitudes de proveedores.

### 2.4 Verificacion de proveedores
- Recepcion y almacenamiento de solicitudes.
- Registro de documentos asociados.
- Estado pendiente de revision administrativa.
- Confirmacion de recepcion de solicitudes.
- Informacion sobre el tiempo estimado de revision de 24 horas.

### 2.5 Modulo de contacto
- Recepcion de mensajes desde el formulario de contacto.
- Validacion de la informacion enviada.
- Confirmacion de recepcion.
- Integracion con servicios de correo electronico.

## 3. Tecnologias utilizadas

- Java.
- Spring Boot.
- Spring Security.
- Spring Data JPA.
- Hibernate.
- MySQL.
- Maven.
- JSON.
- JWT.
- Google Authentication.

## 4. Arquitectura del backend

El backend utiliza una estructura organizada por responsabilidades:

- **controller:** recibe las solicitudes HTTP y entrega respuestas.
- **dto:** contiene objetos para recibir y responder informacion.
- **model:** representa las entidades del sistema.
- **repository:** gestiona el acceso a los datos.
- **security:** contiene componentes de autenticacion y seguridad.
- **service:** implementa la logica de negocio.
- **exception:** centraliza el manejo de excepciones.

## 5. Base de datos

El sistema utiliza MySQL con una base de datos denominada `eventrix`.

Entre las entidades y tablas principales se encuentran:

- usuario
- rol
- proveedor
- perfil_proveedor
- solicitud_proveedor
- documento_proveedor
- documento_solicitud_proveedor

La configuracion de caracteres de la base de datos utiliza UTF-8 mediante `utf8mb4`.

## 6. Requisitos para ejecutar el proyecto

- Java compatible con la version configurada en Maven.
- MySQL.
- Maven Wrapper incluido en el proyecto.
- Una instancia de base de datos llamada `eventrix`.

## 7. Configuracion

Antes de iniciar el backend:

1. Verificar que el servicio MySQL este activo.
2. Comprobar que exista la base de datos `eventrix`.
3. Revisar las credenciales y la URL de conexion en `src/main/resources/application.properties`.
4. Configurar las variables y credenciales necesarias para JWT, Google y correo electronico, segun los servicios habilitados.

No publicar contrasenas, claves privadas ni secretos en el repositorio.

## 8. Ejecucion del proyecto

Desde la carpeta principal del backend ejecutar:

```powershell
.\mvnw.cmd spring-boot:run
```

Para compilar el proyecto sin ejecutar las pruebas:

```powershell
.\mvnw.cmd -DskipTests compile
```

El backend utiliza el puerto 8080 en la configuracion local revisada.

## 9. Endpoint de comprobacion

Se dispone de un endpoint de estado del modulo de autenticacion:

`GET /api/auth/estado`

Respuesta esperada:

```json
{
  "mensaje": "El módulo de autenticación de EVENTRIX está funcionando."
}
```

## 10. Integracion con el frontend

El backend proporciona los servicios que consume el frontend de EVENTRIX para los procesos de autenticacion, registro, solicitudes de proveedores, documentos y contacto.

El frontend se encuentra en un proyecto independiente.

## 11. Estado del desarrollo

Los modulos documentados corresponden a funcionalidades implementadas en el proyecto.

La compilacion del backend ha sido ejecutada satisfactoriamente durante el desarrollo. La verificacion integral de todos los flujos depende de las respectivas pruebas funcionales.

---

**EVENTRIX**  
Gestion inteligente de eventos.