document.addEventListener('DOMContentLoaded', () => {
    loadHistorial();
});

async function loadHistorial() {
    const tbody = document.getElementById('historialTableBody');
    tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-gray-500"><i class="fa-solid fa-spinner fa-spin mr-2"></i>Cargando...</td></tr>';
    
    try {
        const data = await apiCall('/historial');
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-gray-500">No hay registros de eliminaciones.</td></tr>';
            return;
        }

        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-50 transition-colors';
            
            const dateStr = new Date(item.fechaEliminacion).toLocaleString('es-ES', { 
                day: '2-digit', month: '2-digit', year: 'numeric', 
                hour: '2-digit', minute: '2-digit' 
            });

            tr.innerHTML = `
                <td class="py-3 px-6 text-sm text-gray-900 font-medium text-center">#${item.idDonacionOriginal}</td>
                <td class="py-3 px-6 text-sm text-gray-800 font-medium">${item.articulo}</td>
                <td class="py-3 px-6 text-sm text-gray-600">
                    <span class="bg-gray-100 text-gray-800 py-1 px-2 rounded-full text-xs font-semibold">
                        ${item.cantidad}
                    </span>
                </td>
                <td class="py-3 px-6 text-sm text-red-600 italic">"${item.motivoEliminacion}"</td>
                <td class="py-3 px-6 text-sm text-gray-500"><i class="fa-regular fa-calendar mr-1"></i>${dateStr}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-red-500">Error al cargar historial.</td></tr>';
    }
}
