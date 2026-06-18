-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 18-06-2026 a las 06:49:49
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `db_junta_vecinal`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `articulo_requerido`
--

CREATE TABLE `articulo_requerido` (
  `id` bigint(20) NOT NULL,
  `cantidad_necesaria` int(11) DEFAULT NULL,
  `cantidad_recibida` int(11) DEFAULT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `icono` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `taller_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `articulo_requerido`
--

INSERT INTO `articulo_requerido` (`id`, `cantidad_necesaria`, `cantidad_recibida`, `descripcion`, `estado`, `icono`, `nombre`, `taller_id`) VALUES
(1, 10, 3, 'Bandas elásticas de media resistencia', 'PARCIAL', '🏃🏻', 'Bandas elasticas', 1),
(2, 10, 1, 'En buen estado', 'PARCIAL', '🏋️', 'Mancuernas de 1 o 2 kilos', 1),
(3, 5, 0, 'Hola', 'PENDIENTE', '💪🏻', 'Nada', 2),
(4, 1, 0, 'prueba', 'PENDIENTE', '💪🏻', 'Prueba 1', 3),
(5, 3, 0, 'Fuerzas cabrera', 'PENDIENTE', '🛏️', 'Hola', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentario_taller`
--

CREATE TABLE `comentario_taller` (
  `id` bigint(20) NOT NULL,
  `comentario` varchar(1000) DEFAULT NULL,
  `email_voluntario` varchar(255) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `fecha_comentario` datetime(6) DEFAULT NULL,
  `nombre_voluntario` varchar(255) DEFAULT NULL,
  `taller_id` bigint(20) DEFAULT NULL,
  `fecha_actualizacion` datetime(6) DEFAULT NULL,
  `voluntario_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `comentario_taller`
--

INSERT INTO `comentario_taller` (`id`, `comentario`, `email_voluntario`, `estado`, `fecha_comentario`, `nombre_voluntario`, `taller_id`, `fecha_actualizacion`, `voluntario_id`) VALUES
(1, 'Muy buen taller, aprendí bastante.', 'gabriel@correo.cl', 'VISIBLE', '2026-06-08 17:43:27.000000', 'Gabriel González', 1, NULL, NULL),
(4, 'Hola', 'matiasncabrera54@gmail.com', 'VISIBLE', '2026-06-08 18:49:10.000000', 'Matías cabrera ', 3, '2026-06-08 18:49:10.000000', 2),
(6, 'Hola prueba 4', 'gabri.gonzalez@duoc.cl', 'VISIBLE', '2026-06-10 23:36:38.000000', 'Gabriel González ', 4, '2026-06-10 23:36:38.000000', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `donacion_eliminada`
--

CREATE TABLE `donacion_eliminada` (
  `id` bigint(20) NOT NULL,
  `articulo` varchar(255) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `fecha_eliminacion` datetime(6) DEFAULT NULL,
  `id_donacion_original` bigint(20) DEFAULT NULL,
  `motivo_eliminacion` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `donacion_eliminada`
--

INSERT INTO `donacion_eliminada` (`id`, `articulo`, `cantidad`, `fecha_eliminacion`, `id_donacion_original`, `motivo_eliminacion`) VALUES
(1, 'Mancuernas de 1 o 2 kilos', 1, '2026-05-31 22:15:48.000000', 4, 'Poque se sumo a la cantidad');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `donante`
--

CREATE TABLE `donante` (
  `rut` varchar(12) NOT NULL,
  `apellido` varchar(255) DEFAULT NULL,
  `correo` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `id_usuario` bigint(20) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `sector` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `donante`
--

INSERT INTO `donante` (`rut`, `apellido`, `correo`, `direccion`, `id_usuario`, `nombre`, `sector`, `telefono`) VALUES
('12345678-5', 'Gonzalez', 'gab.gonzalez@duoc.cl', 'Los Aramos', NULL, 'Gabriel', NULL, '987654321');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gestion_donacion`
--

CREATE TABLE `gestion_donacion` (
  `id` bigint(20) NOT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `codigo_taller` bigint(20) DEFAULT NULL,
  `correo_donante` varchar(255) DEFAULT NULL,
  `descripcion` varchar(1000) DEFAULT NULL,
  `destino` enum('INVENTARIO','TALLER') DEFAULT NULL,
  `direccion_donante` varchar(255) DEFAULT NULL,
  `estado_envio` enum('EN_CAMINO','LLEGO','NO_LLEGO') DEFAULT 'EN_CAMINO',
  `estado_revision` enum('PENDIENTE_REVISION','ACEPTADA','RECHAZADA') DEFAULT NULL,
  `fecha_creacion` datetime(6) DEFAULT NULL,
  `nombre_donante` varchar(255) DEFAULT NULL,
  `nombre_taller` varchar(255) DEFAULT NULL,
  `objetoadonar` varchar(255) DEFAULT NULL,
  `rut_donante` varchar(255) DEFAULT NULL,
  `sector_donante` varchar(255) DEFAULT NULL,
  `telefono_donante` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `gestion_donacion`
--

INSERT INTO `gestion_donacion` (`id`, `cantidad`, `codigo_taller`, `correo_donante`, `descripcion`, `destino`, `direccion_donante`, `estado_envio`, `estado_revision`, `fecha_creacion`, `nombre_donante`, `nombre_taller`, `objetoadonar`, `rut_donante`, `sector_donante`, `telefono_donante`) VALUES
(1, 1, 1, 'gabri.gonzalez@duoc.cl', 'Par de mancuernas de 1 kilo', 'TALLER', 'Los átomos 123', 'EN_CAMINO', 'ACEPTADA', '2026-05-31 22:05:04.000000', 'Gabriel González', 'Taller kinesiología', 'Mancuernas de 1 o 2 kilos', '12345678-9', 'Sector Norte', '987653212'),
(2, 1, 1, 'gabri.gonzalez@duoc.cl', 'En buen estado', 'TALLER', 'Los átomos 123', 'LLEGO', 'ACEPTADA', '2026-05-31 22:11:18.000000', 'Gabriel González', 'Taller kinesiología', 'Bandas elasticas', '12345678-9', 'Sector Norte', '987653212'),
(3, 1, 1, 'gabri.gonzalez@duoc.cl', 'Las maché de kaka', 'TALLER', 'Los átomos 123', 'EN_CAMINO', 'RECHAZADA', '2026-05-31 22:14:34.000000', 'Gabriel González', 'Taller kinesiología', 'Bandas elasticas', '12345678-9', 'Sector Norte', '987653212'),
(4, 1, 1, 'gabri.gonzalez@duoc.cl', 'Están en buen estado', 'TALLER', 'Los átomos 123', 'LLEGO', 'ACEPTADA', '2026-05-31 22:34:59.000000', 'Gabriel González', 'Taller kinesiología', 'Bandas elasticas', '12345678-9', 'Sector Norte', '987653212'),
(5, 1, 1, 'gab.gonzalez@duoc.cl', 'Están malas 😡', 'TALLER', 'Los Aramos', 'EN_CAMINO', 'RECHAZADA', '2026-06-03 23:10:04.000000', 'Gabriel Gonzalez', 'Taller kinesiología', 'Mancuernas de 1 o 2 kilos', '12345678-5', 'Sector Norte', '987654321'),
(6, 1, 1, 'gab.gonzalez@duoc.cl', 'Están en buen estado', 'TALLER', 'Los Aramos', 'LLEGO', 'ACEPTADA', '2026-06-03 23:25:02.000000', 'Gabriel Gonzalez', 'Taller kinesiología', 'Bandas elasticas', '12345678-5', 'Sector Norte', '987654321'),
(7, 1, 4, 'gab.gonzalez@duoc.cl', 'Prueba 1', 'TALLER', 'Los Aramos', 'NO_LLEGO', 'ACEPTADA', '2026-06-12 22:46:00.000000', 'Gabriel Gonzalez', 'Prueba 4', 'Hola', '12345678-5', NULL, '987654321'),
(8, 1, 4, 'gab.gonzalez@duoc.cl', 'Hola', 'TALLER', 'Los Aramos', 'LLEGO', 'ACEPTADA', '2026-06-12 23:00:01.000000', 'Gabriel Gonzalez', 'Prueba 4', 'Hola', '12345678-5', NULL, '987654321'),
(9, 1, 1, 'gab.gonzalez@duoc.cl', 'Prueba 3', 'TALLER', 'Los Aramos', 'EN_CAMINO', 'PENDIENTE_REVISION', '2026-06-12 23:04:09.000000', 'Gabriel Gonzalez', 'Taller kinesiología', 'Mancuernas de 1 o 2 kilos', '12345678-5', NULL, '987654321'),
(10, 1, 4, 'gab.gonzalez@duoc.cl', 'Prueba 5', 'TALLER', 'Los Aramos', 'NO_LLEGO', 'ACEPTADA', '2026-06-12 23:16:36.000000', 'Gabriel Gonzalez', 'Prueba 4', 'Hola', '12345678-5', NULL, '987654321'),
(11, 1, 1, 'gab.gonzalez@duoc.cl', 'estan en buen estado, sin ninguna imperfeccion', 'TALLER', 'Los Aramos', 'EN_CAMINO', 'PENDIENTE_REVISION', '2026-06-17 12:11:59.000000', 'Gabriel Gonzalez', 'Taller kinesiología', 'Mancuernas de 1 o 2 kilos', '12345678-5', NULL, '987654321');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inscripcion_voluntario`
--

CREATE TABLE `inscripcion_voluntario` (
  `id` bigint(20) NOT NULL,
  `fecha_inscripcion` datetime(6) DEFAULT NULL,
  `id_taller` bigint(20) DEFAULT NULL,
  `nombre_taller` varchar(255) DEFAULT NULL,
  `rut_voluntario` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inscripcion_voluntario`
--

INSERT INTO `inscripcion_voluntario` (`id`, `fecha_inscripcion`, `id_taller`, `nombre_taller`, `rut_voluntario`) VALUES
(1, '2026-05-31 22:01:35.000000', 1, 'Taller kinesiología', '12345678-9'),
(2, '2026-06-03 23:33:07.000000', 1, 'Taller kinesiología', '98765432-1'),
(3, '2026-06-06 21:55:28.000000', 2, 'Taller de Artes', '98765432-1'),
(4, '2026-06-06 22:38:42.000000', 2, 'Taller de Artes', '12345678-9'),
(5, '2026-06-08 18:25:44.000000', 3, 'Taller de prueba 3', '98765432-1'),
(6, '2026-06-10 23:22:45.000000', 3, 'Taller de prueba 3', '12345678-9'),
(7, '2026-06-10 23:35:54.000000', 4, 'Prueba 4', '12345678-9'),
(8, '2026-06-10 23:38:52.000000', 4, 'Prueba 4', '98765432-1'),
(9, '2026-06-10 23:39:58.000000', 4, 'Prueba 4', '1234555666-8');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario`
--

CREATE TABLE `inventario` (
  `id` bigint(20) NOT NULL,
  `objeto` varchar(255) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `codigo_taller` bigint(20) DEFAULT NULL,
  `correo_donante` varchar(255) DEFAULT NULL,
  `descripcion` varchar(1000) DEFAULT NULL,
  `direccion_donante` varchar(255) DEFAULT NULL,
  `estado_envio` enum('EN_CAMINO','LLEGO','NO_LLEGO') DEFAULT 'LLEGO',
  `fecha_ingreso` datetime(6) DEFAULT NULL,
  `nombre_donante` varchar(255) DEFAULT NULL,
  `nombre_taller` varchar(255) DEFAULT NULL,
  `rut_donante` varchar(255) DEFAULT NULL,
  `sector_donante` varchar(255) DEFAULT NULL,
  `telefono_donante` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inventario`
--

INSERT INTO `inventario` (`id`, `objeto`, `cantidad`, `codigo_taller`, `correo_donante`, `descripcion`, `direccion_donante`, `estado_envio`, `fecha_ingreso`, `nombre_donante`, `nombre_taller`, `rut_donante`, `sector_donante`, `telefono_donante`) VALUES
(5, 'Bandas elasticas', 1, 1, 'gabri.gonzalez@duoc.cl', 'Están en buen estado', 'Los átomos 123', 'LLEGO', '2026-05-31 22:59:47.000000', 'Gabriel González', 'Taller kinesiología', '12345678-9', 'Sector Norte', '987653212'),
(6, 'Bandas elasticas', 1, 1, 'gab.gonzalez@duoc.cl', 'Están en buen estado', 'Los Aramos', 'LLEGO', '2026-06-03 23:25:58.000000', 'Gabriel Gonzalez', 'Taller kinesiología', '12345678-5', 'Sector Norte', '987654321'),
(7, 'Bandas elasticas', 1, 1, 'gabri.gonzalez@duoc.cl', 'En buen estado', 'Los átomos 123', 'LLEGO', '2026-06-13 16:02:06.000000', 'Gabriel González', 'Taller kinesiología', '12345678-9', NULL, '987653212'),
(8, 'Hola', 1, 4, 'gab.gonzalez@duoc.cl', 'Hola', 'Los Aramos', 'LLEGO', '2026-06-13 16:04:44.000000', 'Gabriel Gonzalez', 'Prueba 4', '12345678-5', NULL, '987654321');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reportes`
--

CREATE TABLE `reportes` (
  `id` bigint(20) NOT NULL,
  `detalle` varchar(1000) NOT NULL,
  `estado` varchar(255) NOT NULL,
  `fecha_creacion` datetime(6) NOT NULL,
  `nombre_vecino` varchar(255) NOT NULL,
  `tipo_error` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reportes`
--

INSERT INTO `reportes` (`id`, `detalle`, `estado`, `fecha_creacion`, `nombre_vecino`, `tipo_error`) VALUES
(1, 'He intentado ingresar con mi correo pero dice que la contraseña es inválida. Ya pedí\n                        reinicio.', 'RESUELTO', '2026-05-31 21:06:24.000000', 'María Castro', 'No puede iniciar sesión');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sub_admins`
--

CREATE TABLE `sub_admins` (
  `id` bigint(20) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `estado` varchar(20) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `rol` varchar(255) NOT NULL,
  `rut` varchar(12) DEFAULT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sub_admins`
--

INSERT INTO `sub_admins` (`id`, `correo`, `estado`, `nombre`, `rol`, `rut`, `password`) VALUES
(1, 'Gestion@donacion.cl', 'ACTIVO', 'Matias Cabrera', 'GESTION_DONACIONES', '98765432-1', '1234'),
(2, 'taller@gestion.cl', 'ACTIVO', 'Nicolas Figueroa', 'GESTION_TALLERES', '222222222-2', '1234');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `taller`
--

CREATE TABLE `taller` (
  `id` bigint(20) NOT NULL,
  `cupos_ocupados` int(11) DEFAULT NULL,
  `cupos_totales` int(11) DEFAULT NULL,
  `descripcion` varchar(1000) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `etiqueta` varchar(255) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora_fin` time(6) DEFAULT NULL,
  `hora_inicio` time(6) DEFAULT NULL,
  `imagen_clase` varchar(255) DEFAULT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `lugar` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `profesor` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `taller`
--

INSERT INTO `taller` (`id`, `cupos_ocupados`, `cupos_totales`, `descripcion`, `direccion`, `estado`, `etiqueta`, `fecha`, `hora_fin`, `hora_inicio`, `imagen_clase`, `imagen_url`, `lugar`, `nombre`, `profesor`) VALUES
(1, 2, 6, 'El objetivo del taller es mejorar la salud articular de los vecinos a través de este taller con la Dra.Carolina', 'Pamela 1205, Maipú', 'FINALIZADO', '💪​ Salud y Movimiento', '2026-06-01', '11:45:00.000000', '10:30:00.000000', 'Kinesiología', 'https://images.pexels.com/photos/7339492/pexels-photo-7339492.jpeg?_gl=1*1ivhg06*_ga*MTExNjM3NzQ0OS4xNzgwMTAxNjE3*_ga_8JE65Q40S6*czE3ODAxMDE2MTckbzEkZzEkdDE3ODAxMDE2MzUkajQyJGwwJGgw', 'Sede junta de Vecinos', 'Taller kinesiología', 'Dra.Carolina'),
(2, 2, 5, 'hola prueba de comentario', 'Pamela 1205, Maipú', 'ACTIVO', 'Artes', '2026-06-06', '21:56:00.000000', '21:55:00.000000', 'Prueba 1', 'https://www.duoc.cl/wp-content/uploads/2020/02/sede_maipu-1.jpg', 'Sede junta de vecinos', 'Taller de Artes', 'Matias Cabrera'),
(3, 2, 4, 'Holaola', 'Pamela 1205, Maipú', 'ACTIVO', 'Hola', '2026-06-10', '23:23:00.000000', '23:20:00.000000', 'prueba', 'https://www.grupocibernos.com/hubfs/27-1.png', 'Sede junta vecinos', 'Taller de prueba 3', 'hola'),
(4, 2, 2, 'Hola prueba 4', 'Pamela 1205, Maipú', 'ACTIVO', '💪🏻 Hola', '2026-06-10', '23:59:00.000000', '23:30:00.000000', 'Prueba 4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8fBcKqm-N1CDVt1IL6941GPyAQwl_8E_rJg&s', 'Sede junta de vecinos', 'Prueba 4', 'Dra.Gabriela');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` varchar(255) NOT NULL,
  `clave` varchar(255) NOT NULL,
  `nombre_usuario` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` bigint(20) NOT NULL,
  `activo` bit(1) NOT NULL,
  `estado` varchar(20) DEFAULT NULL,
  `rol` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vecinos`
--

CREATE TABLE `vecinos` (
  `id` bigint(20) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `rut` varchar(255) NOT NULL,
  `telefono` varchar(255) NOT NULL,
  `id_usuario` bigint(20) DEFAULT NULL,
  `sector` varchar(255) DEFAULT NULL,
  `tipo_origen` varchar(255) DEFAULT NULL,
  `id_origen` bigint(20) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `vecinos`
--

INSERT INTO `vecinos` (`id`, `apellido`, `correo`, `direccion`, `nombre`, `rut`, `telefono`, `id_usuario`, `sector`, `tipo_origen`, `id_origen`, `estado`) VALUES
(1, 'Gonzalez', 'gab.gonzalez@duoc.cl', 'Los Aramos', 'Gabriel', '12345678-5', '987654321', NULL, 'Sector Norte', 'DONANTE', NULL, 'ACTIVO'),
(3, '', 'gabri.gonzalez@duoc.cl', '', 'Gabriel González ', '12345678-9', '987654321', NULL, '', 'VOLUNTARIO', 1, 'ACTIVO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `voluntario`
--

CREATE TABLE `voluntario` (
  `id` bigint(20) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `rut` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `voluntario`
--

INSERT INTO `voluntario` (`id`, `email`, `nombre`, `password`, `rut`, `telefono`) VALUES
(1, 'gabri.gonzalez@duoc.cl', 'Gabriel González ', '1234', '12345678-9', '987654321'),
(2, 'matiasncabrera54@gmail.com', 'Matías cabrera ', '1234', '98765432-1', '954236187'),
(3, 'nic.figuera@duocuc.cl', 'Nicolas Figueroa', '1234', '1234555666-8', '97398217');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `articulo_requerido`
--
ALTER TABLE `articulo_requerido`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKlyc6chcocc3axbvbvv85e6hr8` (`taller_id`);

--
-- Indices de la tabla `comentario_taller`
--
ALTER TABLE `comentario_taller`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK6lavfkh0f8woovn6hhe28xpmi` (`taller_id`);

--
-- Indices de la tabla `donacion_eliminada`
--
ALTER TABLE `donacion_eliminada`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `donante`
--
ALTER TABLE `donante`
  ADD PRIMARY KEY (`rut`);

--
-- Indices de la tabla `gestion_donacion`
--
ALTER TABLE `gestion_donacion`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `inscripcion_voluntario`
--
ALTER TABLE `inscripcion_voluntario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKifyuor3ua6jcjmc2xrl11obgf` (`rut_voluntario`,`id_taller`);

--
-- Indices de la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `reportes`
--
ALTER TABLE `reportes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `sub_admins`
--
ALTER TABLE `sub_admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKa5oxgbnv2c06ewbkm4slnf54b` (`correo`);

--
-- Indices de la tabla `taller`
--
ALTER TABLE `taller`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_puhr3k3l7bj71hb7hk7ktpxn0` (`nombre_usuario`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `vecinos`
--
ALTER TABLE `vecinos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKgex1x4cdbn6srwbnhqfg30vq1` (`id_usuario`);

--
-- Indices de la tabla `voluntario`
--
ALTER TABLE `voluntario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKp3wthv8hc5y0cxwfhxnux9leo` (`email`),
  ADD UNIQUE KEY `UKgng60ttr3g3h6434om74xyg4m` (`rut`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `articulo_requerido`
--
ALTER TABLE `articulo_requerido`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `comentario_taller`
--
ALTER TABLE `comentario_taller`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `donacion_eliminada`
--
ALTER TABLE `donacion_eliminada`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `gestion_donacion`
--
ALTER TABLE `gestion_donacion`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `inscripcion_voluntario`
--
ALTER TABLE `inscripcion_voluntario`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `inventario`
--
ALTER TABLE `inventario`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `reportes`
--
ALTER TABLE `reportes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `sub_admins`
--
ALTER TABLE `sub_admins`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `taller`
--
ALTER TABLE `taller`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `vecinos`
--
ALTER TABLE `vecinos`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `voluntario`
--
ALTER TABLE `voluntario`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `articulo_requerido`
--
ALTER TABLE `articulo_requerido`
  ADD CONSTRAINT `FKlyc6chcocc3axbvbvv85e6hr8` FOREIGN KEY (`taller_id`) REFERENCES `taller` (`id`);

--
-- Filtros para la tabla `comentario_taller`
--
ALTER TABLE `comentario_taller`
  ADD CONSTRAINT `FK6lavfkh0f8woovn6hhe28xpmi` FOREIGN KEY (`taller_id`) REFERENCES `taller` (`id`);

--
-- Filtros para la tabla `vecinos`
--
ALTER TABLE `vecinos`
  ADD CONSTRAINT `FK2bal6hl1krw8w8tuo7awrav2p` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
