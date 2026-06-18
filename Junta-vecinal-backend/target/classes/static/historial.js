document.addEventListener('DOMContentLoaded', cargarHistorial);

async function cargarHistorial() {
  try {
    const tbody = document.getElementById('historial-table');
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Cargando usuarios...</td></tr>';

    const [resSubadmins, resVecinos] = await Promise.all([
      apiFetch('/api/subadmins'),
      apiFetch('/api/vecinos')
    ]);

    let html = '';

    if (resSubadmins.ok) {
      const subadmins = await resSubadmins.json();
      subadmins.forEach(sa => {
        const ini = sa.nombre.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
        const color = nextColor();
        const rol = sa.rol || 'Sub-Admin';
        const mainRole = rol.split(',')[0].trim();
        const rolBadge = { 'Sub-Admin': 'badge-purple', 'Administrador': 'badge-green', 'Vecino': 'badge-blue' }[mainRole] || 'badge-gray';
        const estado = sa.estado || 'ACTIVO';
        const bgEstado = estado === 'ACTIVO' ? '#d1fae5' : (estado === 'BLOQUEADO' ? '#fee2e2' : '#fef3c7');
        const colEstado = estado === 'ACTIVO' ? '#065f46' : (estado === 'BLOQUEADO' ? '#991b1b' : '#92400e');
        html += <tr data-id="${sa.id}" data-type="subadmin">
      <td><div class="user-row"><div class="avatar avatar-sm" style="background:${color}">${ini}</div><div><div class="user-name">${sa.nombre}</div><div class="user-email">${sa.correo}</div></div></div></td>
      <td><span class="badge ${rolBadge}"><span class="dot"></span>${rol}</span></td>
      <td style="font-size:12.5px;color:var(--text-secondary);">N/A</td>
      <td><span style="font-size:11px;font-weight:600;padding:4px 8px;border-radius:12px;background:${bgEstado};color:${colEstado};" class="estado-badge">${estado}</span></td>
      <td><button class="btn btn-sm btn-secondary" onclick="abrirAcciones(this)">Ver</button></td>
    </tr>;
      });
    }

    if (resVecinos.ok) {
      const vecinos = await resVecinos.json();
      vecinos.forEach(v => {
        const ini = v.nombre.substring(0, 2).toUpperCase();
        const color = nextColor();
        const rol = v.usuario ? v.usuario.rol : 'Vecino';
        const rolBadge = { 'Sub-Admin': 'badge-purple', 'Administrador': 'badge-green', 'Vecino': 'badge-blue' }[rol] || 'badge-blue';
        const estado = (v.usuario && v.usuario.estado) ? v.usuario.estado : 'ACTIVO';
        const bgEstado = estado === 'ACTIVO' ? '#d1fae5' : (estado === 'BLOQUEADO' ? '#fee2e2' : '#fef3c7');
        const colEstado = estado === 'ACTIVO' ? '#065f46' : (estado === 'BLOQUEADO' ? '#991b1b' : '#92400e');
        html += <tr data-id="${v.id}" data-type="vecino">
      <td><div class="user-row"><div class="avatar avatar-sm" style="background:${color}">${ini}</div><div><div class="user-name">${v.nombre} ${v.apellido}</div><div class="user-email">${v.correo}</div></div></div></td>
      <td><span class="badge ${rolBadge}"><span class="dot"></span>${rol}</span></td>
      <td style="font-size:12.5px;color:var(--text-secondary);">${v.direccion}</td>
      <td><span style="font-size:11px;font-weight:600;padding:4px 8px;border-radius:12px;background:${bgEstado};color:${colEstado};" class="estado-badge">${estado}</span></td>
      <td><button class="btn btn-sm btn-secondary" onclick="abrirAcciones(this)">Ver</button></td>
    </tr>;
      });
    }

    tbody.innerHTML = html || '<tr><td colspan="5" style="text-align:center;">No hay usuarios registrados</td></tr>';
  } catch (e) {
    console.error(e);
    document.getElementById('historial-table').innerHTML = '<tr><td colspan="5" style="text-align:center;color:red;">Error al cargar historial</td></tr>';
  }
}

// Acciones Modal
let accCurrentRow = null;
let accCurrentId = null;
let accCurrentType = null;

function abrirAcciones(btn) {
  const row = btn.closest('tr');
  accCurrentRow = row;
  accCurrentId = row.getAttribute('data-id');
  accCurrentType = row.getAttribute('data-type');
  const nombre = row.querySelector('.user-name').textContent;
  const iniciales = row.querySelector('.avatar').textContent;
  const color = row.querySelector('.avatar').style.background;
  const rol = row.querySelector('.badge').textContent;

  document.getElementById('ac-nombre').textContent = nombre;
  document.getElementById('ac-avatar').textContent = iniciales;
  document.getElementById('ac-avatar').style.background = color;
  document.getElementById('ac-avatar').style.color = '#fff';
  document.getElementById('ac-rol').textContent = rol;
  openModal('acciones-modal-overlay');
}

function accActivar() { cambiarEstadoBackend('ACTIVO'); }
function accBloquear() { cambiarEstadoBackend('BLOQUEADO'); }

async function cambiarEstadoBackend(nuevoEstado) {
  const nombre = document.getElementById('ac-nombre').textContent;
  if (!accCurrentId || !accCurrentType) {
    showToast('No se puede cambiar estado (usuario de prueba)', '⚠️');
    return;
  }
  const endpoint = accCurrentType === 'subadmin' ? /api/subadmins/${accCurrentId}/estado?estado=${nuevoEstado} : /api/vecinos/${accCurrentId}/estado?estado=${nuevoEstado};
  try {
    const res = await apiFetch(endpoint, { method: 'PUT' });
    if (res.ok) {
      showToast(Cuenta de ${nombre} cambiada a ${nuevoEstado}, '✅');
      if (accCurrentRow) {
         const badge = accCurrentRow.querySelector('.estado-badge');
         if (badge) {
            badge.textContent = nuevoEstado;
            badge.style.background = nuevoEstado === 'ACTIVO' ? '#d1fae5' : (nuevoEstado === 'BLOQUEADO' ? '#fee2e2' : '#fef3c7');
            badge.style.color = nuevoEstado === 'ACTIVO' ? '#065f46' : (nuevoEstado === 'BLOQUEADO' ? '#991b1b' : '#92400e');
         }
      }
      closeModal('acciones-modal-overlay');
    } else {
      showToast('Error al cambiar estado', '❌');
    }
  } catch (e) {
    showToast('Error de conexión', '❌');
  }
}

async function accEliminar() {
  const nombre = document.getElementById('ac-nombre').textContent;
  if (!accCurrentId || !accCurrentType) {
    showToast('No se puede eliminar (usuario de prueba)', '⚠️');
    return;
  }
  const endpoint = accCurrentType === 'subadmin' ? /api/subadmins/${accCurrentId} : /api/vecinos/${accCurrentId};
  try {
    const res = await apiFetch(endpoint, { method: 'DELETE' });
    if (res.ok) {
      if (accCurrentRow) {
        accCurrentRow.style.transition = 'opacity .3s';
        accCurrentRow.style.opacity = '0';
        setTimeout(() => { 
          accCurrentRow.remove(); 
          showToast(Cuenta de "${nombre}" eliminada, '🗑️'); 
        }, 300);
      }
      closeModal('acciones-modal-overlay');
    } else {
      showToast('Error al eliminar cuenta', '❌');
    }
  } catch (e) {
    showToast('Error de conexión', '❌');
  }
}
