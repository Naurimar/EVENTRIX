-- MySQL dump 10.13  Distrib 9.7.0, for Win64 (x86_64)
--
-- Host: localhost    Database: eventrix
-- ------------------------------------------------------
-- Server version	9.7.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '02b161af-d398-11f1-a99f-e4a8dfb64b7b:1-60';

--
-- Current Database: `eventrix`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `eventrix` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `eventrix`;

--
-- Table structure for table `actividad`
--

DROP TABLE IF EXISTS `actividad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actividad` (
  `id_actividad` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `fecha_limite` date DEFAULT NULL,
  `responsable` varchar(100) DEFAULT NULL,
  `estado` varchar(30) NOT NULL,
  `id_evento` int NOT NULL,
  PRIMARY KEY (`id_actividad`),
  KEY `fk_actividad_evento` (`id_evento`),
  CONSTRAINT `fk_actividad_evento` FOREIGN KEY (`id_evento`) REFERENCES `evento` (`id_evento`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actividad`
--

LOCK TABLES `actividad` WRITE;
/*!40000 ALTER TABLE `actividad` DISABLE KEYS */;
/*!40000 ALTER TABLE `actividad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria_recurso`
--

DROP TABLE IF EXISTS `categoria_recurso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria_recurso` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `nombre_categoria` varchar(80) NOT NULL,
  `descripcion` text,
  PRIMARY KEY (`id_categoria`),
  UNIQUE KEY `nombre_categoria` (`nombre_categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria_recurso`
--

LOCK TABLES `categoria_recurso` WRITE;
/*!40000 ALTER TABLE `categoria_recurso` DISABLE KEYS */;
/*!40000 ALTER TABLE `categoria_recurso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ciudad`
--

DROP TABLE IF EXISTS `ciudad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ciudad` (
  `id_ciudad` int NOT NULL AUTO_INCREMENT,
  `nombre_ciudad` varchar(80) NOT NULL,
  `id_departamento` int NOT NULL,
  PRIMARY KEY (`id_ciudad`),
  UNIQUE KEY `nombre_ciudad` (`nombre_ciudad`),
  KEY `fk_ciudad_departamento` (`id_departamento`),
  CONSTRAINT `fk_ciudad_departamento` FOREIGN KEY (`id_departamento`) REFERENCES `departamento` (`id_departamento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ciudad`
--

LOCK TABLES `ciudad` WRITE;
/*!40000 ALTER TABLE `ciudad` DISABLE KEYS */;
/*!40000 ALTER TABLE `ciudad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
  `documento` varchar(30) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `correo` varchar(120) DEFAULT NULL,
  `id_ciudad` int NOT NULL,
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `documento` (`documento`),
  UNIQUE KEY `correo` (`correo`),
  KEY `fk_cliente_ciudad` (`id_ciudad`),
  CONSTRAINT `fk_cliente_ciudad` FOREIGN KEY (`id_ciudad`) REFERENCES `ciudad` (`id_ciudad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departamento`
--

DROP TABLE IF EXISTS `departamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departamento` (
  `id_departamento` int NOT NULL AUTO_INCREMENT,
  `nombre_departamento` varchar(80) NOT NULL,
  `pais` varchar(60) NOT NULL,
  PRIMARY KEY (`id_departamento`),
  UNIQUE KEY `nombre_departamento` (`nombre_departamento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departamento`
--

LOCK TABLES `departamento` WRITE;
/*!40000 ALTER TABLE `departamento` DISABLE KEYS */;
/*!40000 ALTER TABLE `departamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `espacio`
--

DROP TABLE IF EXISTS `espacio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `espacio` (
  `id_espacio` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `tipo` varchar(60) NOT NULL,
  `capacidad` int NOT NULL,
  `ubicacion` varchar(100) DEFAULT NULL,
  `tarifa` decimal(10,2) DEFAULT NULL,
  `disponible` tinyint(1) NOT NULL,
  `id_ciudad` int NOT NULL,
  PRIMARY KEY (`id_espacio`),
  KEY `fk_espacio_ciudad` (`id_ciudad`),
  CONSTRAINT `fk_espacio_ciudad` FOREIGN KEY (`id_ciudad`) REFERENCES `ciudad` (`id_ciudad`),
  CONSTRAINT `chk_espacio_capacidad` CHECK ((`capacidad` >= 0)),
  CONSTRAINT `chk_espacio_tarifa` CHECK (((`tarifa` is null) or (`tarifa` >= 0)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `espacio`
--

LOCK TABLES `espacio` WRITE;
/*!40000 ALTER TABLE `espacio` DISABLE KEYS */;
/*!40000 ALTER TABLE `espacio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evento`
--

DROP TABLE IF EXISTS `evento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evento` (
  `id_evento` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) NOT NULL,
  `tipo` varchar(60) NOT NULL,
  `fecha` date NOT NULL,
  `hora_inicio` time DEFAULT NULL,
  `presupuesto` decimal(12,2) NOT NULL,
  `estado` varchar(30) NOT NULL,
  `tematica` varchar(80) DEFAULT NULL,
  `num_invitados` int NOT NULL,
  `id_usuario` int NOT NULL,
  `id_cliente` int DEFAULT NULL,
  PRIMARY KEY (`id_evento`),
  KEY `fk_evento_usuario` (`id_usuario`),
  KEY `fk_evento_cliente` (`id_cliente`),
  CONSTRAINT `fk_evento_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`),
  CONSTRAINT `fk_evento_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `chk_evento_invitados` CHECK ((`num_invitados` >= 0)),
  CONSTRAINT `chk_evento_presupuesto` CHECK ((`presupuesto` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evento`
--

LOCK TABLES `evento` WRITE;
/*!40000 ALTER TABLE `evento` DISABLE KEYS */;
/*!40000 ALTER TABLE `evento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evento_invitado`
--

DROP TABLE IF EXISTS `evento_invitado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evento_invitado` (
  `id_evento` int NOT NULL,
  `id_invitado` int NOT NULL,
  `id_mesa` int DEFAULT NULL,
  `fecha_confirmacion` datetime DEFAULT NULL,
  `estado_rsvp` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id_evento`,`id_invitado`),
  KEY `fk_evinv_invitado` (`id_invitado`),
  KEY `fk_evinv_mesa` (`id_mesa`),
  CONSTRAINT `fk_evinv_evento` FOREIGN KEY (`id_evento`) REFERENCES `evento` (`id_evento`) ON DELETE RESTRICT,
  CONSTRAINT `fk_evinv_invitado` FOREIGN KEY (`id_invitado`) REFERENCES `invitado` (`id_invitado`),
  CONSTRAINT `fk_evinv_mesa` FOREIGN KEY (`id_mesa`) REFERENCES `mesa` (`id_mesa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evento_invitado`
--

LOCK TABLES `evento_invitado` WRITE;
/*!40000 ALTER TABLE `evento_invitado` DISABLE KEYS */;
/*!40000 ALTER TABLE `evento_invitado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evento_proveedor`
--

DROP TABLE IF EXISTS `evento_proveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evento_proveedor` (
  `id_evento` int NOT NULL,
  `id_proveedor` int NOT NULL,
  `cantidad` int NOT NULL,
  `costo_acordado` decimal(12,2) NOT NULL,
  `estado` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id_evento`,`id_proveedor`),
  KEY `fk_evprov_proveedor` (`id_proveedor`),
  CONSTRAINT `fk_evprov_evento` FOREIGN KEY (`id_evento`) REFERENCES `evento` (`id_evento`) ON DELETE RESTRICT,
  CONSTRAINT `fk_evprov_proveedor` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id_proveedor`),
  CONSTRAINT `chk_evprov_cantidad` CHECK ((`cantidad` >= 0)),
  CONSTRAINT `chk_evprov_costo` CHECK ((`costo_acordado` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evento_proveedor`
--

LOCK TABLES `evento_proveedor` WRITE;
/*!40000 ALTER TABLE `evento_proveedor` DISABLE KEYS */;
/*!40000 ALTER TABLE `evento_proveedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evento_recurso`
--

DROP TABLE IF EXISTS `evento_recurso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evento_recurso` (
  `id_evento` int NOT NULL,
  `id_recurso` int NOT NULL,
  `cantidad` int NOT NULL,
  PRIMARY KEY (`id_evento`,`id_recurso`),
  KEY `fk_evrec_recurso` (`id_recurso`),
  CONSTRAINT `fk_evrec_evento` FOREIGN KEY (`id_evento`) REFERENCES `evento` (`id_evento`) ON DELETE RESTRICT,
  CONSTRAINT `fk_evrec_recurso` FOREIGN KEY (`id_recurso`) REFERENCES `recurso` (`id_recurso`),
  CONSTRAINT `chk_evrec_cantidad` CHECK ((`cantidad` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evento_recurso`
--

LOCK TABLES `evento_recurso` WRITE;
/*!40000 ALTER TABLE `evento_recurso` DISABLE KEYS */;
/*!40000 ALTER TABLE `evento_recurso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invitado`
--

DROP TABLE IF EXISTS `invitado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invitado` (
  `id_invitado` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(150) DEFAULT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `restriccion_dietetica` varchar(100) DEFAULT NULL,
  `estado_rsvp` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id_invitado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invitado`
--

LOCK TABLES `invitado` WRITE;
/*!40000 ALTER TABLE `invitado` DISABLE KEYS */;
/*!40000 ALTER TABLE `invitado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mesa`
--

DROP TABLE IF EXISTS `mesa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mesa` (
  `id_mesa` int NOT NULL AUTO_INCREMENT,
  `numero` int NOT NULL,
  `capacidad` int NOT NULL,
  `ubicacion` varchar(100) DEFAULT NULL,
  `id_evento` int NOT NULL,
  PRIMARY KEY (`id_mesa`),
  KEY `fk_mesa_evento` (`id_evento`),
  CONSTRAINT `fk_mesa_evento` FOREIGN KEY (`id_evento`) REFERENCES `evento` (`id_evento`) ON DELETE RESTRICT,
  CONSTRAINT `chk_mesa_capacidad` CHECK ((`capacidad` >= 0)),
  CONSTRAINT `chk_mesa_numero` CHECK ((`numero` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mesa`
--

LOCK TABLES `mesa` WRITE;
/*!40000 ALTER TABLE `mesa` DISABLE KEYS */;
/*!40000 ALTER TABLE `mesa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partida_presupuesto`
--

DROP TABLE IF EXISTS `partida_presupuesto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partida_presupuesto` (
  `id_partida` int NOT NULL AUTO_INCREMENT,
  `concepto` varchar(100) NOT NULL,
  `monto` decimal(12,2) NOT NULL,
  `estado` varchar(30) NOT NULL,
  `id_evento` int NOT NULL,
  PRIMARY KEY (`id_partida`),
  KEY `fk_partida_evento` (`id_evento`),
  CONSTRAINT `fk_partida_evento` FOREIGN KEY (`id_evento`) REFERENCES `evento` (`id_evento`) ON DELETE RESTRICT,
  CONSTRAINT `chk_partida_monto` CHECK ((`monto` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partida_presupuesto`
--

LOCK TABLES `partida_presupuesto` WRITE;
/*!40000 ALTER TABLE `partida_presupuesto` DISABLE KEYS */;
/*!40000 ALTER TABLE `partida_presupuesto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedor`
--

DROP TABLE IF EXISTS `proveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedor` (
  `id_proveedor` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `correo` varchar(120) DEFAULT NULL,
  `calificacion` decimal(3,2) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL,
  `id_tipo` int NOT NULL,
  PRIMARY KEY (`id_proveedor`),
  UNIQUE KEY `correo` (`correo`),
  KEY `fk_proveedor_tipo` (`id_tipo`),
  CONSTRAINT `fk_proveedor_tipo` FOREIGN KEY (`id_tipo`) REFERENCES `tipo_servicio` (`id_tipo`),
  CONSTRAINT `chk_proveedor_calificacion` CHECK (((`calificacion` is null) or ((`calificacion` >= 0) and (`calificacion` <= 5))))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedor`
--

LOCK TABLES `proveedor` WRITE;
/*!40000 ALTER TABLE `proveedor` DISABLE KEYS */;
/*!40000 ALTER TABLE `proveedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recurso`
--

DROP TABLE IF EXISTS `recurso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recurso` (
  `id_recurso` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text,
  `cantidad_total` int NOT NULL,
  `cantidad_disponible` int DEFAULT NULL,
  `id_categoria` int NOT NULL,
  PRIMARY KEY (`id_recurso`),
  UNIQUE KEY `nombre` (`nombre`),
  KEY `fk_recurso_categoria` (`id_categoria`),
  CONSTRAINT `fk_recurso_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categoria_recurso` (`id_categoria`),
  CONSTRAINT `chk_recurso_cantidades` CHECK (((`cantidad_total` >= 0) and ((`cantidad_disponible` is null) or ((`cantidad_disponible` >= 0) and (`cantidad_disponible` <= `cantidad_total`)))))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recurso`
--

LOCK TABLES `recurso` WRITE;
/*!40000 ALTER TABLE `recurso` DISABLE KEYS */;
/*!40000 ALTER TABLE `recurso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reserva`
--

DROP TABLE IF EXISTS `reserva`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reserva` (
  `id_reserva` int NOT NULL AUTO_INCREMENT,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime NOT NULL,
  `estado` varchar(30) NOT NULL,
  `costo_total` decimal(12,2) DEFAULT NULL,
  `id_evento` int NOT NULL,
  `id_espacio` int NOT NULL,
  PRIMARY KEY (`id_reserva`),
  KEY `fk_reserva_espacio` (`id_espacio`),
  KEY `fk_reserva_evento` (`id_evento`),
  CONSTRAINT `fk_reserva_espacio` FOREIGN KEY (`id_espacio`) REFERENCES `espacio` (`id_espacio`),
  CONSTRAINT `fk_reserva_evento` FOREIGN KEY (`id_evento`) REFERENCES `evento` (`id_evento`) ON DELETE RESTRICT,
  CONSTRAINT `chk_reserva_costo` CHECK (((`costo_total` is null) or (`costo_total` >= 0))),
  CONSTRAINT `chk_reserva_fechas` CHECK ((`fecha_fin` > `fecha_inicio`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reserva`
--

LOCK TABLES `reserva` WRITE;
/*!40000 ALTER TABLE `reserva` DISABLE KEYS */;
/*!40000 ALTER TABLE `reserva` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre_rol` varchar(50) NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `nombre_rol` (`nombre_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'ADMINISTRADOR','Administra la configuración y los usuarios del sistema'),(2,'ORGANIZADOR','Gestiona eventos y sus recursos'),(3,'CLIENTE','Consulta y gestiona sus solicitudes y eventos');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_servicio`
--

DROP TABLE IF EXISTS `tipo_servicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_servicio` (
  `id_tipo` int NOT NULL AUTO_INCREMENT,
  `nombre_tipo` varchar(60) NOT NULL,
  `descripcion` varchar(120) DEFAULT NULL,
  PRIMARY KEY (`id_tipo`),
  UNIQUE KEY `nombre_tipo` (`nombre_tipo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_servicio`
--

LOCK TABLES `tipo_servicio` WRITE;
/*!40000 ALTER TABLE `tipo_servicio` DISABLE KEYS */;
/*!40000 ALTER TABLE `tipo_servicio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(150) NOT NULL,
  `clave` varchar(255) NOT NULL,
  `estado` tinyint(1) NOT NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `id_rol` int NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo` (`correo`),
  KEY `fk_usuario_rol` (`id_rol`),
  CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Administrador EVENTRIX','admin@eventrix.com','$2a$10$SDG.l54ezE1vUuwVsZN44uqsgYq8izIeuH65WyPv9mr8aJUbxyHOa',1,'2026-11-04 03:21:35',1),(2,'Usuario Prueba','prueba@eventrix.com','$2a$10$aQhCLrdMNOZzqpkLE8o9kefk3OToPERdON9Jqayfl2j8poWzJi.NC',1,NULL,3);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-04 14:35:33
