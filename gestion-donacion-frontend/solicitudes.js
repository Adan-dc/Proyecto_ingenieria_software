document.addEventListener('DOMContentLoaded', () => {
    loadSolicitudes();
});

let currentDonacionId = null;

async function loadSolicitudes() {
    const tbody = document.getElementById('solicitudesTableBody');
    tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-gray-500"><i class="fa-solid fa-spinner fa-spin mr-2"></i>Cargando...</td></tr>';
    
    try {
        const data = await apiCall('/solicitudes');
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-gray-500">No hay solicitudes pendientes.</td></tr>';
            return;
        }

        data.forEach(donacion => {
            const donante = donacion.donante || {};
            const nombreCompleto = `${donante.nombre || ''} ${donante.apellido || ''}`.trim();
            const rut = donante.rut || 'Sin RUT';

            const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-50 transition-colors';
            tr.innerHTML = `
                <td class="py-3 px-6 text-sm text-gray-900 font-medium">#${donacion.id}</td>
                <td class="py-3 px-6 text-sm text-gray-600">
                    <span class="font-medium text-gray-800">${nombreCompleto}</span>
                    <span class="block text-xs text-gray-400">${rut}</span>
                </td>
                <td class="py-3 px-6 text-sm text-gray-800 font-medium">${donacion.objetoADonar}</td>
                <td class="py-3 px-6 text-sm text-gray-600">
                    <span class="bg-gray-100 text-gray-800 py-1 px-2 rounded-full text-xs font-semibold">
                        ${donacion.cantidad}
                    </span>
                </td>
                <td class="py-3 px-6 text-sm text-center">
                    <button onclick='verDetalle(${JSON.stringify(donacion)})' class="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 py-1 px-3 rounded-md transition-colors text-xs font-medium">
                        Ver Detalle
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-red-500">Error al cargar solicitudes.</td></tr>';
    }
}

function verDetalle(donacion) {
    currentDonacionId = donacion.id;
    
    const donante = donacion.donante || {};
    const nombreCompleto = `${donante.nombre || ''} ${donante.apellido || ''}`.trim();
    const tallerTexto = donacion.taller ? donacion.taller.nombre : 'No especificado (Donación general)';

    const content = document.getElementById('detalleContent');
    content.innerHTML = `
        <div class="grid grid-cols-2 gap-4 mb-2">
            <div><span class="block text-xs font-semibold text-gray-500 uppercase">ID</span><span class="text-sm font-medium text-gray-900">#${donacion.id}</span></div>
            <div><span class="block text-xs font-semibold text-gray-500 uppercase">RUT Donante</span><span class="text-sm text-gray-800">${donante.rut || 'Sin RUT'}</span></div>
            <div><span class="block text-xs font-semibold text-gray-500 uppercase">Nombre Donante</span><span class="text-sm font-medium text-gray-900">${nombreCompleto || 'Sin nombre'}</span></div>
            <div><span class="block text-xs font-semibold text-gray-500 uppercase">Teléfono</span><span class="text-sm text-gray-800">${donante.telefono || '—'}</span></div>
            <div><span class="block text-xs font-semibold text-gray-500 uppercase">Artículo</span><span class="text-sm font-medium text-gray-900">${donacion.objetoADonar}</span></div>
            <div><span class="block text-xs font-semibold text-gray-500 uppercase">Cantidad</span><span class="text-sm text-gray-800">${donacion.cantidad}</span></div>
            <div class="col-span-2"><span class="block text-xs font-semibold text-gray-500 uppercase">Taller de Destino</span><span class="text-sm font-medium text-indigo-700 bg-indigo-50 px-2 py-1 rounded inline-block mt-1">${tallerTexto}</span></div>
        </div>
        <div>
            <span class="block text-xs font-semibold text-gray-500 uppercase">Descripción</span>
            <p class="text-sm text-gray-700 bg-gray-50 p-3 rounded-md mt-1 border border-gray-100">${donacion.descripcion || 'Sin descripción'}</p>
        </div>
    `;

    // Reset state
    document.getElementById('acceptForm').classList.add('hidden');
    document.getElementById('modalActions').classList.remove('hidden');

    openModal('detalleModal');
}

document.getElementById('btnAccept').addEventListener('click', () => {
    document.getElementById('modalActions').classList.add('hidden');
    document.getElementById('acceptForm').classList.remove('hidden');
});

document.getElementById('btnReject').addEventListener('click', async () => {
    if(confirm('¿Seguro que deseas rechazar esta solicitud?')) {
        try {
            await apiCall(`/${currentDonacionId}/revision`, 'POST', {
                aceptar: false
            });
            closeModal('detalleModal');
            loadSolicitudes();
        } catch(e) {}
    }
});

document.getElementById('btnConfirmAccept').addEventListener('click', async () => {
    const destino = document.getElementById('selectDestino').value;
    const estadoEnvio = document.getElementById('selectEstadoEnvio').value;

    try {
        await apiCall(`/${currentDonacionId}/revision`, 'POST', {
            aceptar: true,
            destino: destino,
            estadoEnvio: estadoEnvio
        });
        closeModal('detalleModal');
        loadSolicitudes();
    } catch(e) {}
});
