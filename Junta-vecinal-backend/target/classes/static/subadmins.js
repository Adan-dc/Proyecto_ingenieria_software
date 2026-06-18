async function crearSubAdmin() {
  const nombre = document.getElementById('sa-nombre').value.trim();
  const rut = document.getElementById('sa-rut').value.trim();
  const correo = document.getElementById('sa-email').value.trim();
  const rolesChecked = Array.from(document.querySelectorAll('#sa-roles input:checked')).map(cb => cb.value);
  
  if (!nombre || !rut || !correo || rolesChecked.length === 0) { showToast('Completa todos los campos y selecciona al menos un rol', '⚠️'); return; }

  try {
    const response = await apiFetch('/api/subadmins/crear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, rut, correo, rol: rolesChecked.join(', ') })
    });

    if (response.ok) {
      const ini = nombre.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
      const color = nextColor();
      const mainRole = rolesChecked[0];
      const rolBadge = { 'Sub-Admin': 'badge-purple', 'Administrador': 'badge-green', 'Vecino': 'badge-blue' }[mainRole] || 'badge-gray';
      const tr = document.createElement('tr');
      tr.innerHTML = <td><div class="user-row"><div class="avatar avatar-sm" style="background:${color}"></div><div><div class="user-name"></div><div class="user-email"></div></div></div></td><td><span class="badge ${rolBadge}"></span></td><td style="font-size:12.5px;color:var(--text-secondary);">Ahora mismo</td><td><button class="btn btn-sm btn-danger" onclick="eliminarSubAdmin(this)">Eliminar</button></td>;
      document.getElementById('sa-table').prepend(tr);
      document.getElementById('sa-nombre').value = '';
      document.getElementById('sa-rut').value = '';
      document.getElementById('sa-email').value = '';
      document.querySelectorAll('#sa-roles input').forEach(cb => cb.checked = false);
      showToast(Sub-Admin "${nombre}" creado en la BD, '✅');
    } else {
      showToast('Error al crear el Sub-Admin', '❌');
    }
  } catch (error) {
    console.error("Error:", error);
    showToast('Error de conexión', '❌');
  }
}

function eliminarSubAdmin(btn) {
  const row = btn.closest('tr');
  const nombre = row.querySelector('.user-name').textContent;
  row.style.transition = 'opacity .3s';
  row.style.opacity = '0';
  setTimeout(() => { row.remove(); showToast("${nombre}" eliminado, '🗑️'); }, 300);
}
