document.addEventListener('DOMContentLoaded', cargarHistorial);
let accCurrentId=null, accCurrentType=null;
async function cargarHistorial(){
  const tbody=document.getElementById('historial-table'); tbody.innerHTML='<tr><td colspan="5" class="empty">Cargando historial...</td></tr>';
  try{
    const [resS,resV]=await Promise.all([apiFetch('/api/subadmins'),apiFetch('/api/vecinos')]);
    const subs=resS.ok?await resS.json():[]; const vecinos=resV.ok?await resV.json():[];
    const rows=[];
    subs.forEach(s=>rows.push({id:s.id,type:'subadmin',nombre:s.nombre,correo:s.correo,tipo:s.rol||'SUB_ADMIN',info:'Administración',estado:s.estado||'ACTIVO',badge:'badge-purple'}));
    vecinos.forEach(v=>rows.push({id:v.id,type:'vecino',nombre:`${v.nombre||''} ${v.apellido||''}`.trim(),correo:v.correo||'',tipo:'Vecino',info:v.direccion||v.sector||'Sin dirección',estado:(v.usuario&&v.usuario.estado)||'ACTIVO',badge:'badge-blue'}));
    if(!rows.length){ tbody.innerHTML='<tr><td colspan="5" class="empty">No hay usuarios registrados</td></tr>'; return; }
    tbody.innerHTML=rows.map(u=>`<tr data-id="${u.id}" data-type="${u.type}"><td><div class="user-row"><div class="avatar" style="background:${nextColor()}">${iniciales(u.nombre)}</div><div><div class="user-name">${escapeHtml(u.nombre)}</div><div class="user-email">${escapeHtml(u.correo)}</div></div></div></td><td><span class="badge ${u.badge}">${escapeHtml(u.tipo)}</span></td><td>${escapeHtml(u.info)}</td><td><span class="badge ${u.estado==='BLOQUEADO'?'badge-red':'badge-green'}">${escapeHtml(u.estado)}</span></td><td><button class="btn btn-secondary btn-sm" onclick="abrirAcciones(this)">Gestionar</button></td></tr>`).join('');
  }catch(e){ console.error(e); tbody.innerHTML='<tr><td colspan="5" class="empty" style="color:#dc2626">Error al cargar historial</td></tr>'; }
}
function abrirAcciones(btn){ const row=btn.closest('tr'); accCurrentId=row.dataset.id; accCurrentType=row.dataset.type; document.getElementById('ac-nombre').textContent=row.querySelector('.user-name').textContent; openModal('acciones-modal-overlay'); }
function accActivar(){ cambiarEstadoBackend('ACTIVO'); }
function accBloquear(){ cambiarEstadoBackend('BLOQUEADO'); }
async function cambiarEstadoBackend(estado){ if(!accCurrentId||!accCurrentType)return; const endpoint=accCurrentType==='subadmin'?`/api/subadmins/${accCurrentId}/estado?estado=${estado}`:`/api/vecinos/${accCurrentId}/estado?estado=${estado}`; try{ const res=await apiFetch(endpoint,{method:'PUT'}); if(!res.ok) throw new Error(await res.text()); closeModal('acciones-modal-overlay'); showToast('Estado actualizado','✅'); cargarHistorial(); }catch(e){ showToast('No se pudo actualizar','❌'); } }
async function accEliminar(){ if(!confirm('¿Eliminar este usuario?')) return; const endpoint=accCurrentType==='subadmin'?`/api/subadmins/${accCurrentId}`:`/api/vecinos/${accCurrentId}`; try{ const res=await apiFetch(endpoint,{method:'DELETE'}); if(!res.ok) throw new Error(await res.text()); closeModal('acciones-modal-overlay'); showToast('Usuario eliminado','🗑️'); cargarHistorial(); }catch(e){ showToast('No se pudo eliminar','❌'); } }
