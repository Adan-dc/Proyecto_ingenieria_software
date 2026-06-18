document.addEventListener('DOMContentLoaded', cargarVecinos);
async function cargarVecinos(){
  const tbody=document.getElementById('vecinos-table');
  tbody.innerHTML='<tr><td colspan="5" class="empty">Cargando vecinos...</td></tr>';
  try{
    const res=await apiFetch('/api/vecinos');
    if(!res.ok) throw new Error(await res.text());
    const vecinos=await res.json();
    if(!vecinos.length){ tbody.innerHTML='<tr><td colspan="5" class="empty">No hay vecinos registrados</td></tr>'; return; }
    tbody.innerHTML=vecinos.map(v=>`<tr><td><div class="user-row"><div class="avatar" style="background:${nextColor()}">${iniciales((v.nombre||'')+' '+(v.apellido||''))}</div><div><div class="user-name">${escapeHtml((v.nombre||'')+' '+(v.apellido||''))}</div><div class="user-email">${escapeHtml(v.correo||'Sin correo')}</div></div></div></td><td>${escapeHtml(v.rut||'')}</td><td>${escapeHtml(v.telefono||'')}</td><td>${escapeHtml(v.direccion||v.sector||'')}</td><td><button class="btn btn-secondary btn-sm" onclick="showToast('Perfil abierto')">Ver</button></td></tr>`).join('');
  }catch(e){ console.error(e); tbody.innerHTML='<tr><td colspan="5" class="empty" style="color:#dc2626">Error al cargar vecinos</td></tr>'; }
}
async function registrarVecino(){
  const nombreCompleto=document.getElementById('v-nombre').value.trim(); const rut=document.getElementById('v-rut').value.trim(); const correo=document.getElementById('v-email').value.trim(); const tel=document.getElementById('v-tel').value.trim(); const casa=document.getElementById('v-casa').value.trim();
  if(!nombreCompleto||!rut){ showToast('Nombre y RUT son obligatorios','⚠️'); return; }
  const partes=nombreCompleto.split(' '); const nombre=partes[0]; const apellido=partes.slice(1).join(' ')||'';
  try{
    const res=await apiFetch('/api/vecinos/registrar',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({rut,nombre,apellido,correo,telefono:tel,direccion:casa,usuario:{rol:'Vecino',activo:true}})});
    if(!res.ok) throw new Error(await res.text());
    ['v-nombre','v-rut','v-email','v-tel','v-casa'].forEach(id=>document.getElementById(id).value='');
    showToast('Vecino registrado correctamente','✅'); cargarVecinos();
    guardarVecinosCache(vecinos);
  }catch(e){ console.error(e); showToast('No se pudo registrar el vecino','❌'); }
}
async function sincronizarVecinos() {
  const confirmar = confirm(
    '¿Deseas sincronizar las cuentas de voluntarios y donantes hacia la tabla de vecinos?'
  );

  if (!confirmar) {
    return;
  }

  try {
    const response = await apiFetch('/api/sincronizacion/vecinos', {
      method: 'POST'
    });

    if (!response.ok) {
      const texto = await response.text();
      throw new Error(texto);
    }

    const mensaje = await response.text();

    showToast(mensaje || 'Sincronización completada correctamente', '✅');

    if (typeof cargarVecinos === 'function') {
      cargarVecinos();
    }

  } catch (error) {
    console.error('Error al sincronizar vecinos:', error);
    showToast('No se pudo sincronizar vecinos', '❌');
  }

  let vecinosCache = [];

  function guardarVecinosCache(vecinos) {
    vecinosCache = vecinos || [];
  }
  
  function abrirEditarVecino(rut) {
    const vecino = vecinosCache.find(v => String(v.rut) === String(rut));
  
    if (!vecino) {
      showToast('No se encontró el vecino seleccionado', '❌');
      return;
    }
  
    document.getElementById('edit-rut-original').value = vecino.rut || '';
    document.getElementById('edit-nombre').value = vecino.nombre || '';
    document.getElementById('edit-apellido').value = vecino.apellido || '';
    document.getElementById('edit-correo').value = vecino.correo || vecino.email || '';
    document.getElementById('edit-telefono').value = vecino.telefono || '';
    document.getElementById('edit-direccion').value = vecino.direccion || '';
    document.getElementById('edit-sector').value = vecino.sector || '';
  
    openModal('modal-editar-vecino');
  }
  
  async function guardarEdicionVecino() {
    const rut = document.getElementById('edit-rut-original').value.trim();
  
    if (!rut) {
      showToast('No se encontró el RUT del vecino', '❌');
      return;
    }
  
    const datos = {
      nombre: document.getElementById('edit-nombre').value.trim(),
      apellido: document.getElementById('edit-apellido').value.trim(),
      correo: document.getElementById('edit-correo').value.trim(),
      telefono: document.getElementById('edit-telefono').value.trim(),
      direccion: document.getElementById('edit-direccion').value.trim(),
      sector: document.getElementById('edit-sector').value.trim()
    };
  
    try {
      const response = await apiFetch(`/api/sincronizacion/vecinos/${encodeURIComponent(rut)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      });
  
      if (!response.ok) {
        const texto = await response.text();
        throw new Error(texto);
      }
  
      closeModal('modal-editar-vecino');
  
      showToast('Vecino actualizado correctamente', '✅');
  
      if (typeof cargarVecinos === 'function') {
        cargarVecinos();
      }
  
    } catch (error) {
      console.error('Error al actualizar vecino:', error);
      showToast('No se pudo actualizar el vecino', '❌');
    }
  }
}
