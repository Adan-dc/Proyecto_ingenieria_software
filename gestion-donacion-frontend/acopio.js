const API_BASE_URL = 'http://localhost:8083/api/v1/gestion';

document.addEventListener('DOMContentLoaded', () => {
    cargarAcopio();
});

async function cargarAcopio() {
    const tabla = document.getElementById('tablaAcopio');

    if (!tabla) {
        console.error('No existe el tbody con id tablaAcopio');
        alert('No existe el tbody con id tablaAcopio');
        return;
    }

    tabla.innerHTML = `
        <tr>
            <td colspan="7" class="text-center py-6 text-gray-500">
                Cargando donaciones pendientes de llegada...
            </td>
        </tr>
    `;

    try {
        const response = await fetch(`${API_BASE_URL}/acopio/pendientes`);

        if (!response.ok) {
            const errorTexto = await response.text();
            throw new Error(`Error HTTP ${response.status}: ${errorTexto}`);
        }

        const donaciones = await response.json();

        tabla.innerHTML = '';

        if (!donaciones || donaciones.length === 0) {
            tabla.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-6 text-gray-500">
                        No hay donaciones pendientes en el punto de acopio.
                    </td>
                </tr>
            `;
            return;
        }

        donaciones.forEach(donacion => {
            const fila = document.createElement('tr');
            fila.className = 'border-b hover:bg-gray-50';

            const nombreDonante = donacion.nombreDonante || 'Sin nombre';
            const rutDonante = donacion.rutDonante || 'Sin RUT';

            const articulo =
                donacion.objetoADonar ||
                donacion.articulo ||
                donacion.objeto ||
                'Sin artículo';

            const cantidad = donacion.cantidad || 0;

            const descripcion =
                donacion.descripcion ||
                donacion.comentario ||
                'Sin descripción';

            fila.innerHTML = `
                <td class="px-6 py-4 text-gray-800 font-medium">
                    ${donacion.id}
                </td>

                <td class="px-6 py-4 text-gray-700 font-semibold">
                    ${nombreDonante}
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
                            onclick="confirmarLlegada(${donacion.id})"
                            class="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-semibold">
                            Llegó
                        </button>

                        <button
                            onclick="confirmarNoLlegada(${donacion.id})"
                            class="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-semibold">
                            No llegó
                        </button>
                    </div>
                </td>
            `;

            tabla.appendChild(fila);
        });

    } catch (error) {
        console.error('Error al cargar punto de acopio:', error);

        tabla.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-6 text-red-500">
                    Error al cargar punto de acopio: ${error.message}
                </td>
            </tr>
        `;
    }
}

async function confirmarLlegada(id) {
    const confirmar = confirm(
        '¿Confirmas que esta donación llegó al punto de acopio?\n\n' +
        'Si confirmas, pasará automáticamente al inventario.'
    );

    if (!confirmar) {
        return;
    }

    await procesarAcopio(id, true);
}

async function confirmarNoLlegada(id) {
    const confirmar = confirm(
        '¿Confirmas que esta donación NO llegó al punto de acopio?\n\n' +
        'No se agregará al inventario.'
    );

    if (!confirmar) {
        return;
    }

    await procesarAcopio(id, false);
}

async function procesarAcopio(id, llego) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}/acopio`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                llego: llego
            })
        });

        if (!response.ok) {
            const errorTexto = await response.text();
            throw new Error(`Error HTTP ${response.status}: ${errorTexto}`);
        }

        if (llego) {
            alert('Donación confirmada. Fue agregada al inventario.');
        } else {
            alert('Donación marcada como no llegada.');
        }

        cargarAcopio();

    } catch (error) {
        console.error('Error al confirmar punto de acopio:', error);
        alert(`No se pudo procesar la donación.\n\n${error.message}`);
    }
}