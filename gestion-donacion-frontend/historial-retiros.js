const API_BASE_URL = 'http://localhost:8083/api/v1/gestion';

document.addEventListener('DOMContentLoaded', () => {
    cargarHistorialRetiros();
});

async function cargarHistorialRetiros() {
    const tabla = document.getElementById('tablaHistorialRetiros');

    if (!tabla) {
        console.error('No existe el tbody con id tablaHistorialRetiros');
        return;
    }

    tabla.innerHTML = `
        <tr>
            <td colspan="8" class="text-center py-6 text-gray-500">
                Cargando historial de retiros...
            </td>
        </tr>
    `;

    try {
        const response = await fetch(`${API_BASE_URL}/inventario/retiros`);

        if (!response.ok) {
            const errorTexto = await response.text();
            throw new Error(`Error HTTP ${response.status}: ${errorTexto}`);
        }

        const retiros = await response.json();

        tabla.innerHTML = '';

        if (!retiros || retiros.length === 0) {
            tabla.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center py-6 text-gray-500">
                        No hay retiros registrados.
                    </td>
                </tr>
            `;
            return;
        }

        retiros.forEach(retiro => {
            const fila = document.createElement('tr');
            fila.className = 'border-b hover:bg-gray-50';

            const idOriginal = retiro.idInventarioOriginal || '—';
            const articulo = retiro.articulo || 'Sin artículo';
            const cantidad = retiro.cantidad || 0;

            const nombreDonante = retiro.nombreDonante || 'Sin nombre';
            const rutDonante = retiro.rutDonante || 'Sin RUT';

            const retiradoPor = retiro.retiradoPor || 'Sin responsable';

            const destino =
                retiro.destinoRetiro ||
                retiro.nombreTaller ||
                'Sin destino';

            const justificacion =
                retiro.justificacionRetiro ||
                'Sin justificación';

            const fecha = formatearFecha(retiro.fechaRetiro);

            fila.innerHTML = `
                <td class="px-6 py-4 font-medium text-gray-800">
                    ${escapeHtml(idOriginal)}
                </td>

                <td class="px-6 py-4 text-gray-700 font-semibold">
                    ${escapeHtml(articulo)}
                </td>

                <td class="px-6 py-4 text-gray-700">
                    ${escapeHtml(cantidad)}
                </td>

                <td class="px-6 py-4 text-gray-700">
                    <strong class="block">${escapeHtml(nombreDonante)}</strong>
                    <span class="text-xs text-gray-500">${escapeHtml(rutDonante)}</span>
                </td>

                <td class="px-6 py-4 text-gray-700 font-semibold">
                    ${escapeHtml(retiradoPor)}
                </td>

                <td class="px-6 py-4 text-gray-700">
                    ${escapeHtml(destino)}
                </td>

                <td class="px-6 py-4 text-gray-700 max-w-xs">
                    <span class="block whitespace-normal break-words">
                        ${escapeHtml(justificacion)}
                    </span>
                </td>

                <td class="px-6 py-4 text-gray-700">
                    ${escapeHtml(fecha)}
                </td>
            `;

            tabla.appendChild(fila);
        });

    } catch (error) {
        console.error('Error al cargar historial de retiros:', error);

        tabla.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-6 text-red-500">
                    Error al cargar historial de retiros: ${escapeHtml(error.message)}
                </td>
            </tr>
        `;
    }
}

function formatearFecha(fecha) {
    if (!fecha) {
        return 'Sin fecha';
    }

    try {
        return new Date(fecha).toLocaleString('es-CL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return fecha;
    }
}

function escapeHtml(texto) {
    return String(texto)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}