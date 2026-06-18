const API_BASE_URL = 'http://localhost:8083/api/v1/gestion';

document.addEventListener('DOMContentLoaded', () => {
    cargarInventario();

    const formulario = document.getElementById('formDonacionManual');

    if (formulario) {
        formulario.addEventListener('submit', guardarDonacionManual);
    }
});

// ===============================
// CARGAR INVENTARIO
// ===============================

async function cargarInventario() {
    const tabla = document.getElementById('tablaInventario');

    if (!tabla) {
        console.warn('No existe el tbody con id tablaInventario');
        return;
    }

    tabla.innerHTML = `
        <tr>
            <td colspan="8" class="text-center py-6 text-gray-500">
                Cargando inventario...
            </td>
        </tr>
    `;

    try {
        const response = await fetch(`${API_BASE_URL}/inventario`);

        if (!response.ok) {
            const errorTexto = await response.text();
            throw new Error(`Error HTTP ${response.status}: ${errorTexto}`);
        }

        const inventario = await response.json();

        tabla.innerHTML = '';

        if (!inventario || inventario.length === 0) {
            tabla.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center py-6 text-gray-500">
                        No hay donaciones en inventario
                    </td>
                </tr>
            `;
            return;
        }

        inventario.forEach(item => {
            const fila = document.createElement('tr');
            fila.className = 'border-b hover:bg-gray-50';

            const articulo = item.articulo || item.objeto || 'Sin objeto';
            const cantidad = item.cantidad || 0;
            const rut = item.rutDonante || 'Sin RUT';
            const nombre = item.nombreDonante || 'Sin nombre';
            const estado = item.estadoEnvio || 'LLEGO';
            const descripcion = item.descripcion || 'Sin descripción';

            fila.innerHTML = `
                <td class="px-6 py-4 font-medium text-gray-800">
                    ${item.id}
                </td>

                <td class="px-6 py-4 text-gray-700 font-semibold">
                    ${articulo}
                </td>

                <td class="px-6 py-4 text-gray-700">
                    ${cantidad}
                </td>

                <td class="px-6 py-4 text-gray-700">
                    ${rut}
                </td>

                <td class="px-6 py-4 text-gray-700">
                    ${nombre}
                </td>

                <td class="px-6 py-4 text-gray-700">
                    ${estado}
                </td>

                <td class="px-6 py-4 text-gray-700">
                    ${descripcion}
                </td>

                <td class="px-6 py-4">
                    <button
                        onclick="eliminarDonacionInventario(${item.id})"
                        class="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-semibold">
                        Eliminar
                    </button>
                </td>
            `;

            tabla.appendChild(fila);
        });

    } catch (error) {
        console.error('Error al cargar inventario:', error);

        tabla.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-6 text-red-500">
                    Error al cargar inventario: ${error.message}
                </td>
            </tr>
        `;
    }
}

// ===============================
// GUARDAR DONACIÓN MANUAL
// ===============================

async function guardarDonacionManual(event) {
    event.preventDefault();

    const rutDonante = obtenerValor('rutDonante', 'rut', 'rutManual');
    const nombreDonante = obtenerValor('nombreDonante', 'nombre', 'nombreManual');
    const telefonoDonante = obtenerValor('telefonoDonante', 'telefono', 'telefonoManual');

    const articulo = obtenerValor('articulo', 'objeto', 'objetoADonar', 'objetoManual');
    const cantidadTexto = obtenerValor('cantidad', 'cantidadManual');
    const descripcion = obtenerValor('descripcion', 'descripcionManual');

    const codigoTallerTexto = obtenerValor('codigoTaller');
    const nombreTaller = obtenerValor('nombreTaller');

    if (!rutDonante) {
        alert('Debes ingresar el RUT del donante.');
        return;
    }

    if (!nombreDonante) {
        alert('Debes ingresar el nombre del donante.');
        return;
    }

    if (!articulo) {
        alert('Debes ingresar el objeto o artículo donado.');
        return;
    }

    const cantidad = Number(cantidadTexto);

    if (!cantidad || cantidad <= 0) {
        alert('Debes ingresar una cantidad válida.');
        return;
    }

    const donacion = {
        rutDonante: rutDonante,
        nombreDonante: nombreDonante,
        telefonoDonante: telefonoDonante,

        articulo: articulo,
        objeto: articulo,

        cantidad: cantidad,
        descripcion: descripcion,

        correoDonante: '',
        direccionDonante: '',
        sectorDonante: '',

        codigoTaller: codigoTallerTexto ? Number(codigoTallerTexto) : null,
        nombreTaller: nombreTaller
    };

    console.log('Donación manual que se enviará:', donacion);

    try {
        const response = await fetch(`${API_BASE_URL}/inventario`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(donacion)
        });

        if (!response.ok) {
            const errorTexto = await response.text();
            throw new Error(`Error HTTP ${response.status}: ${errorTexto}`);
        }

        alert('Donación ingresada correctamente al inventario.');

        limpiarFormularioManual();
        cargarInventario();

    } catch (error) {
        console.error('Error al ingresar donación manual:', error);
        alert(`Error al ingresar donación al inventario.\n\n${error.message}`);
    }
}

// ===============================
// ELIMINAR DONACIÓN DEL INVENTARIO
// ===============================

async function eliminarDonacionInventario(id) {
    const confirmar = confirm(
        '¿Seguro que deseas eliminar esta donación del inventario? Esta acción quedará registrada en el historial.'
    );

    if (!confirmar) {
        return;
    }

    const motivo = prompt('Ingrese el motivo de eliminación:');

    if (!motivo || motivo.trim() === '') {
        alert('Debe ingresar un motivo para eliminar la donación.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/inventario/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                motivoEliminacion: motivo.trim()
            })
        });

        if (!response.ok) {
            const errorTexto = await response.text();
            throw new Error(`Error HTTP ${response.status}: ${errorTexto}`);
        }

        alert('Donación eliminada correctamente.');

        cargarInventario();

    } catch (error) {
        console.error('Error al eliminar donación:', error);
        alert(`No se pudo eliminar la donación.\n\n${error.message}`);
    }
}

// ===============================
// FUNCIONES AUXILIARES
// ===============================

function obtenerValor(...ids) {
    for (const id of ids) {
        const elemento = document.getElementById(id);

        if (elemento && elemento.value !== undefined) {
            return elemento.value.trim();
        }
    }

    return '';
}

function limpiarFormularioManual() {
    limpiarCampo('rutDonante', 'rut', 'rutManual');
    limpiarCampo('nombreDonante', 'nombre', 'nombreManual');
    limpiarCampo('telefonoDonante', 'telefono', 'telefonoManual');
    limpiarCampo('articulo', 'objeto', 'objetoADonar', 'objetoManual');
    limpiarCampo('cantidad', 'cantidadManual');
    limpiarCampo('descripcion', 'descripcionManual');
    limpiarCampo('codigoTaller', 'nombreTaller');
}

function limpiarCampo(...ids) {
    for (const id of ids) {
        const elemento = document.getElementById(id);

        if (elemento && elemento.value !== undefined) {
            elemento.value = '';
        }
    }
}