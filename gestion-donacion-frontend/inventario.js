document.addEventListener('DOMContentLoaded', () => {
    loadInventario();
});

let currentEditId = null;
let currentDeleteId = null;

async function loadInventario() {
    const tbody = document.getElementById('inventarioTableBody');
    tbody.innerHTML = '<tr><td colspan="7" class="text-center py-8 text-gray-500"><i class="fa-solid fa-spinner fa-spin mr-2"></i>Cargando...</td></tr>';
    
    try {
        const data = await apiCall('/inventario');
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center py-8 text-gray-500">No hay donaciones aceptadas ni inventario.</td></tr>';
            updateKPIs(data);
            return;
        }

        updateKPIs(data);

        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-50 transition-colors';
            
            let donanteTexto = 'Donante Anónimo';
            if (item.donante && item.donante.nombre) {
                donanteTexto = item.donante.nombre;
            }

            const tallerNombre = item.taller ? item.taller.nombre : 'General';
            const destinoBadge = item.destino === 'INVENTARIO' 
                ? '<span class="bg-blue-100 text-blue-800 py-1 px-2 rounded-md text-xs font-semibold"><i class="fa-solid fa-boxes-stacked mr-1"></i>Inventario</span>'
                : `<span class="bg-orange-100 text-orange-800 py-1 px-2 rounded-md text-xs font-semibold" title="Asignado al taller: ${tallerNombre}"><i class="fa-solid fa-wrench mr-1"></i>Taller: ${tallerNombre}</span>`;
                
            const estadoBadge = item.estadoEnvio === 'LLEGO'
                ? '<span class="bg-green-100 text-green-800 py-1 px-2 rounded-full text-xs font-medium"><i class="fa-solid fa-check mr-1"></i>Llegó</span>'
                : '<span class="bg-yellow-100 text-yellow-800 py-1 px-2 rounded-full text-xs font-medium"><i class="fa-solid fa-truck-fast mr-1"></i>En Camino</span>';

            tr.innerHTML = `
                <td class="py-3 px-6 text-sm text-gray-900 font-medium">#${item.id}</td>
                <td class="py-3 px-6 text-sm text-gray-800">${donanteTexto}</td>
                <td class="py-3 px-6 text-sm text-gray-800">${item.objetoADonar}</td>
                <td class="py-3 px-6 text-sm text-gray-900 font-bold">${item.cantidad}</td>
                <td class="py-3 px-6 text-sm">${destinoBadge}</td>
                <td class="py-3 px-6 text-sm">${estadoBadge}</td>
                <td class="py-3 px-6 text-sm text-center">
                    <div class="flex items-center justify-center gap-2">
                        <button onclick='openEdit(${JSON.stringify(item)})' class="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 w-8 h-8 rounded-md transition-colors flex items-center justify-center" title="Editar">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button onclick='openDelete(${item.id})' class="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 w-8 h-8 rounded-md transition-colors flex items-center justify-center" title="Eliminar">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-8 text-red-500">Error al cargar inventario.</td></tr>';
    }
}

function updateKPIs(data) {
    document.getElementById('kpiTotal').innerText = data.length;
    document.getElementById('kpiInventario').innerText = data.filter(d => d.destino === 'INVENTARIO').length;
    document.getElementById('kpiTaller').innerText = data.filter(d => d.destino === 'TALLER').length;
    document.getElementById('kpiEnCamino').innerText = data.filter(d => d.estadoEnvio === 'EN_CAMINO').length;
}

// Edit logic
function openEdit(item) {
    currentEditId = item.id;
    document.getElementById('editIdDisplay').innerText = item.id;
    document.getElementById('editCantidad').value = item.cantidad;
    document.getElementById('editEstado').value = item.estadoEnvio;
    openModal('editModal');
}

document.getElementById('btnSaveEdit').addEventListener('click', async () => {
    const cantidad = document.getElementById('editCantidad').value;
    const estadoEnvio = document.getElementById('editEstado').value;
    
    try {
        await apiCall(`/${currentEditId}/inventario`, 'PUT', {
            cantidad: parseInt(cantidad),
            estadoEnvio: estadoEnvio
        });
        closeModal('editModal');
        loadInventario();
    } catch(e) {}
});

// Delete logic
function openDelete(id) {
    currentDeleteId = id;
    document.getElementById('deleteIdDisplay').innerText = id;
    document.getElementById('deleteJustificacion').value = '';
    openModal('deleteModal');
}

document.getElementById('btnConfirmDelete').addEventListener('click', async () => {
    const justificacion = document.getElementById('deleteJustificacion').value;
    if(!justificacion.trim()) {
        alert("La justificación es obligatoria");
        return;
    }

    try {
        await apiCall(`/${currentDeleteId}`, 'DELETE', {
            justificacion: justificacion
        });
        closeModal('deleteModal');
        loadInventario();
    } catch(e) {}
});
