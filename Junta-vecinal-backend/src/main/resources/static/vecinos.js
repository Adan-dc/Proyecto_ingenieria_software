async function registrarVecino() {
  const nombreCompleto = document.getElementById('v-nombre').value.trim();
  const rut = document.getElementById('v-rut').value.trim();
  const tel = document.getElementById('v-tel').value.trim();
  const casa = document.getElementById('v-casa').value.trim();
  if (!nombreCompleto || !rut || !casa) { showToast('Los campos marcados con * son obligatorios', '⚠️'); return; }
  const partes = nombreCompleto.split(' ');
  const nombre = partes[0];
  const apellido = partes.slice(1).join(' ') || 'Sin Apellido';
  const btn = document.querySelector('.btn-primary');
  const originalHTML = btn.innerHTML;
  btn.textContent = 'Registrando...';
  btn.disabled = true;
  try {
    const res = await apiFetch('/api/vecinos/registrar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rut: rut, nombre: nombre, apellido: apellido, correo: 'sin-correo@vecino.com', telefono: tel, direccion: casa, usuario: { rol: 'Vecino', activo: true } })
    });
    if (res.ok) {
      limpiarFormVecino();
      showToast(Vecino "${nombreCompleto}" guardado, '✅');
    } else {
      showToast('Error al guardar', '❌');
    }
  } catch (e) {
    showToast('Error de conexión', '❌');
  } finally {
    btn.innerHTML = originalHTML;
    btn.disabled = false;
  }
}

function limpiarFormVecino() {
  ['v-nombre', 'v-rut', 'v-tel', 'v-casa', 'v-contacto', 'v-tel-emerg'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}
