const API_BASE_URL = 'http://localhost:8083/api/v1/gestion';

document.addEventListener('DOMContentLoaded', () => {
    cargarHistorial();
});

async function cargarHistorial() {
    const tabla = document.getElementById('tablaHistorial');

    if (!tabla) {
        console.error('No existe el tbody con id tablaHistorial');
        return;
    }

    tabla.innerHTML = `
        <tr>
            <td colspan="5" class="text-center py-6 text-gray-500">
                Cargando historial...
            </td>
        </tr>
    `;

    try {
        const response = await fetch(`${API_BASE_URL}/historial`);

        if (!response.ok) {
            const errorTexto = await response.text();
            throw new Error(`Error HTTP ${response.status}: ${errorTexto}`);
        }

        const historial = await response.json();

        tabla.innerHTML = '';

        if (!historial || historial.length === 0) {
            tabla.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-6 text-gray-500">
                        No hay donaciones eliminadas registradas.
                    </td>
                </tr>
            `;
            return;
        }

        historial.forEach(item => {
            const fila = document.createElement('tr');
            fila.className = 'border-b hover:bg-gray-50';

            const idOriginal =
                item.idDonacionOriginal ||
                item.id_donacion_original ||
                'Sin ID';

            const articulo =
                item.articulo ||
                item.objeto ||
                'Sin artículo';

            const cantidad =
                item.cantidad || 0;

            const motivo =
                item.motivoEliminacion ||
                item.motivo_eliminacion ||
                'Sin motivo registrado';

            const fecha =
                formatearFecha(item.fechaEliminacion || item.fecha_eliminacion);

            fila.innerHTML = `
                <td class="px-6 py-4 text-gray-800 font-medium">
                    ${idOriginal}
                </td>

                <td class="px-6 py-4 text-gray-700 font-semibold">
                    ${articulo}
                </td>

                <td class="px-6 py-4 text-gray-700">
                    ${cantidad}
                </td>

                <td class="px-6 py-4 text-gray-700">
                    ${motivo}
                </td>

                <td class="px-6 py-4 text-gray-700">
                    ${fecha}
                </td>
            `;

            tabla.appendChild(fila);
        });

    } catch (error) {
        console.error('Error al cargar historial:', error);

        tabla.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-6 text-red-500">
                    Error al cargar historial: ${error.message}
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
        const date = new Date(fecha);

        if (isNaN(date.getTime())) {
            return fecha;
        }

        return date.toLocaleString('es-CL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

    } catch (error) {
        return fecha;
    }
}