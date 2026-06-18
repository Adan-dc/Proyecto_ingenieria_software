package com.juntavecinal.service;

import com.juntavecinal.dto.ActualizarVecinoDTO;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class SincronizacionService {

    private final JdbcTemplate jdbcTemplate;

    public SincronizacionService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public String sincronizarVoluntariosYDonantes() {
        int voluntarios = sincronizarVoluntarios();
        int donantes = sincronizarDonantes();

        return "Sincronización completada. Voluntarios: " + voluntarios + ", Donantes: " + donantes;
    }

    private int sincronizarVoluntarios() {
        List<Map<String, Object>> voluntarios = jdbcTemplate.queryForList("SELECT * FROM voluntario");

        int contador = 0;

        for (Map<String, Object> row : voluntarios) {

            Long idOrigen = obtenerLong(obtenerValor(row, "id"));
            String rut = obtenerString(obtenerValor(row, "rut"));
            String nombre = obtenerString(obtenerValor(row, "nombre"));
            String correo = obtenerString(obtenerValor(row, "email"));
            String telefono = obtenerString(obtenerValor(row, "telefono"));

            if (idOrigen == null) {
                continue;
            }

            guardarOActualizarVecino(
                    rut,
                    nombre,
                    "",
                    correo,
                    telefono,
                    "",
                    "",
                    "VOLUNTARIO",
                    idOrigen
            );

            contador++;
        }

        return contador;
    }

    private int sincronizarDonantes() {
        List<Map<String, Object>> donantes = jdbcTemplate.queryForList("SELECT * FROM donante");

        int contador = 0;

        for (Map<String, Object> row : donantes) {

            Long idOrigen = obtenerLong(obtenerValor(row, "id"));
            String rut = obtenerString(obtenerValor(row, "rut"));
            String nombre = obtenerString(obtenerValor(row, "nombre"));
            String apellido = obtenerString(obtenerValor(row, "apellido"));
            String correo = obtenerString(obtenerValor(row, "correo"));
            String telefono = obtenerString(obtenerValor(row, "telefono"));
            String direccion = obtenerString(obtenerValor(row, "direccion"));
            String sector = obtenerString(obtenerValor(row, "sector"));

            if (idOrigen == null) {
                continue;
            }

            guardarOActualizarVecino(
                    rut,
                    nombre,
                    apellido,
                    correo,
                    telefono,
                    direccion,
                    sector,
                    "DONANTE",
                    idOrigen
            );

            contador++;
        }

        return contador;
    }

    private void guardarOActualizarVecino(
            String rut,
            String nombre,
            String apellido,
            String correo,
            String telefono,
            String direccion,
            String sector,
            String tipoOrigen,
            Long idOrigen
    ) {

        Integer existe = jdbcTemplate.queryForObject(
                """
                SELECT COUNT(*)
                FROM vecinos
                WHERE tipo_origen = ? AND id_origen = ?
                """,
                Integer.class,
                tipoOrigen,
                idOrigen
        );

        if (existe != null && existe > 0) {
            jdbcTemplate.update(
                    """
                    UPDATE vecinos
                    SET
                        rut = ?,
                        nombre = ?,
                        apellido = ?,
                        correo = ?,
                        telefono = ?,
                        direccion = ?,
                        sector = ?,
                        estado = ?
                    WHERE tipo_origen = ? AND id_origen = ?
                    """,
                    limpiar(rut),
                    limpiar(nombre),
                    limpiar(apellido),
                    limpiar(correo),
                    limpiar(telefono),
                    limpiar(direccion),
                    limpiar(sector),
                    "ACTIVO",
                    tipoOrigen,
                    idOrigen
            );
        } else {
            jdbcTemplate.update(
                    """
                    INSERT INTO vecinos (
                        rut,
                        nombre,
                        apellido,
                        correo,
                        telefono,
                        direccion,
                        sector,
                        tipo_origen,
                        id_origen,
                        estado
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    limpiar(rut),
                    limpiar(nombre),
                    limpiar(apellido),
                    limpiar(correo),
                    limpiar(telefono),
                    limpiar(direccion),
                    limpiar(sector),
                    tipoOrigen,
                    idOrigen,
                    "ACTIVO"
            );
        }
    }

    public String actualizarVecinoSeparado(Long idVecino, ActualizarVecinoDTO dto) {

        List<Map<String, Object>> vecinos = jdbcTemplate.queryForList(
                "SELECT * FROM vecinos WHERE id = ?",
                idVecino
        );

        if (vecinos.isEmpty()) {
            throw new RuntimeException("Vecino no encontrado");
        }

        Map<String, Object> vecino = vecinos.get(0);

        String tipoOrigen = obtenerString(obtenerValor(vecino, "tipo_origen"));
        Long idOrigen = obtenerLong(obtenerValor(vecino, "id_origen"));

        String rutNuevo = dto.getRut();

        if (rutNuevo == null || rutNuevo.isBlank()) {
            rutNuevo = obtenerString(obtenerValor(vecino, "rut"));
        }

        jdbcTemplate.update(
                """
                UPDATE vecinos
                SET
                    rut = ?,
                    nombre = ?,
                    apellido = ?,
                    correo = ?,
                    telefono = ?,
                    direccion = ?
                WHERE id = ?
                """,
                limpiar(rutNuevo),
                limpiar(dto.getNombre()),
                limpiar(dto.getApellido()),
                limpiar(dto.getCorreo()),
                limpiar(dto.getTelefono()),
                limpiar(dto.getDireccion()),
                idVecino
        );

        int actualizados = 0;

        if ("VOLUNTARIO".equalsIgnoreCase(tipoOrigen)) {
            actualizados = actualizarSoloVoluntario(idOrigen, dto, rutNuevo);
        }

        if ("DONANTE".equalsIgnoreCase(tipoOrigen)) {
            actualizados = actualizarSoloDonante(idOrigen, dto, rutNuevo);
        }

        return "Vecino actualizado correctamente. Origen actualizado: "
                + tipoOrigen
                + ". Registros actualizados: "
                + actualizados;
    }

    private int actualizarSoloVoluntario(Long idOrigen, ActualizarVecinoDTO dto, String rutNuevo) {
        if (idOrigen == null) {
            return 0;
        }

        return jdbcTemplate.update(
                """
                UPDATE voluntario
                SET
                    rut = ?,
                    nombre = ?,
                    telefono = ?,
                    email = ?
                WHERE id = ?
                """,
                limpiar(rutNuevo),
                limpiar(dto.getNombre()),
                limpiar(dto.getTelefono()),
                limpiar(dto.getCorreo()),
                idOrigen
        );
    }

    private int actualizarSoloDonante(Long idOrigen, ActualizarVecinoDTO dto, String rutNuevo) {
        if (idOrigen == null) {
            return 0;
        }

        return jdbcTemplate.update(
                """
                UPDATE donante
                SET
                    rut = ?,
                    nombre = ?,
                    apellido = ?,
                    correo = ?,
                    telefono = ?,
                    direccion = ?
                WHERE id = ?
                """,
                limpiar(rutNuevo),
                limpiar(dto.getNombre()),
                limpiar(dto.getApellido()),
                limpiar(dto.getCorreo()),
                limpiar(dto.getTelefono()),
                limpiar(dto.getDireccion()),
                idOrigen
        );
    }

    private Object obtenerValor(Map<String, Object> row, String nombre) {
        if (row.containsKey(nombre)) {
            return row.get(nombre);
        }

        if (row.containsKey(nombre.toUpperCase())) {
            return row.get(nombre.toUpperCase());
        }

        if (row.containsKey(nombre.toLowerCase())) {
            return row.get(nombre.toLowerCase());
        }

        return null;
    }

    private String obtenerString(Object valor) {
        return valor != null ? valor.toString() : "";
    }

    private String limpiar(String valor) {
        return valor != null ? valor : "";
    }

    private Long obtenerLong(Object valor) {
        if (valor == null) {
            return null;
        }

        try {
            return Long.valueOf(valor.toString());
        } catch (Exception error) {
            return null;
        }
    }
}