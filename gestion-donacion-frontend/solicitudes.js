const API_BASE_URL = 'http://localhost:8083/api/v1/gestion';

document.addEventListener('DOMContentLoaded', () => {
    cargarSolicitudes();
});

async function cargarSolicitudes() {
    const tabla = document.getElementById('tablaSolicitudes');

    if (!tabla) {
        console.error('No existe el tbody con id tablaSolicitudes');
        alert('No existe el tbody con id tablaSolicitudes');
        return;
    }

    tabla.innerHTML = `
        <tr>
            <td colspan="6" class="text-center py-6 text-gray-500">
                Cargando solicitudes...
            </td>
        </tr>
    `;

    try {
        const response = await fetch(`${API_BASE_URL}/solicitudes`);

        if (!response.ok) {
            const errorTexto = await response.text();
            throw new Error(`Error HTTP ${response.status}: ${errorTexto}`);
        }

        const solicitudes = await response.json();

        tabla.innerHTML = '';

        if (!solicitudes || solicitudes.length === 0) {
            tabla.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-6 text-gray-500">
                        No hay solicitudes pendientes
                    </td>
                </tr>
            `;
            return;
        }

        solicitudes.forEach(solicitud => {
            const fila = document.createElement('tr');
            fila.className = 'border-b hover:bg-gray-50';

            const rutDonante = solicitud.rutDonante || 'Sin RUT';

            const articulo =
                solicitud.objetoADonar ||
                solicitud.articulo ||
                solicitud.objeto ||
                'Sin artículo';

            const cantidad = solicitud.cantidad || 0;

            const descripcion =
                solicitud.descripcion ||
                solicitud.comentario ||
                'Sin descripción';

            fila.innerHTML = `
                <td class="px-6 py-4 text-gray-800 font-medium">
                    ${solicitud.id}
                </td>

                <td class="px-6 py-4 text-gray-700">
                    ${rutDonante}
                </td>

                <td class="px-6 py-4 text-gray-700 font-semibold">
                    ${articulo}
                </td>

                <td class="px-6 py-4 text-gray-700">
                    ${cantidad}
                </td>

                <td class="px-6 py-4 text-gray-700 max-w-xs">
                    <span class="block whitespace-normal break-words">
                        ${descripcion}
                    </span>
                </td>

                <td class="px-6 py-4">
                    <div class="flex gap-2">
                        <button
                            onclick="aceptarSolicitud(${solicitud.id})"
                            class="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-semibold">
                            Aceptar
                        </button>

                        <button
                            onclick="rechazarSolicitud(${solicitud.id})"
                            class="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-semibold">
                            Rechazar
                        </button>
                    </div>
                </td>
            `;

            tabla.appendChild(fila);
        });

    } catch (error) {
        console.error('Error al cargar solicitudes:', error);

        tabla.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-6 text-red-500">
                    Error al cargar solicitudes: ${error.message}
                </td>
            </tr>
        `;
    }
}

async function aceptarSolicitud(id) {
    const confirmar = confirm(
        '¿Seguro que deseas aceptar esta solicitud?\n\n' +
        'Ojo: al aceptar NO pasará al inventario todavía.\n' +
        'Primero quedará esperando confirmación en Punto de acopio.'
    );

    if (!confirmar) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${id}/revision`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                aceptar: true
            })
        });

        if (!response.ok) {
            const errorTexto = await response.text();
            throw new Error(`Error HTTP ${response.status}: ${errorTexto}`);
        }

        alert('Solicitud aceptada. Ahora queda pendiente en Punto de acopio.');
        cargarSolicitudes();

    } catch (error) {
        console.error('Error al aceptar:', error);
        alert(`No se pudo aceptar la solicitud.\n\n${error.message}`);
    }
}

async function rechazarSolicitud(id) {
    const confirmar = confirm('¿Seguro que deseas rechazar esta solicitud?');

    if (!confirmar) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${id}/revision`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                aceptar: false
            })
        });

        if (!response.ok) {
            const errorTexto = await response.text();
            throw new Error(`Error HTTP ${response.status}: ${errorTexto}`);
        }

        alert('Solicitud rechazada correctamente.');
        cargarSolicitudes();

    } catch (error) {
        console.error('Error al rechazar:', error);
        alert(`No se pudo rechazar la solicitud.\n\n${error.message}`);
    }
}