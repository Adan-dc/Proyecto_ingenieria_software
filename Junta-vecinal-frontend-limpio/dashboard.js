document.addEventListener('DOMContentLoaded', cargarDashboard);
async function cargarDashboard(){
  try{
    const [resV,resS]=await Promise.all([apiFetch('/api/vecinos'),apiFetch('/api/subadmins')]);
    const vecinos=resV.ok?await resV.json():[]; const subs=resS.ok?await resS.json():[];
    document.getElementById('stat-vecinos').textContent=vecinos.length;
    document.getElementById('stat-subadmins').textContent=subs.length;
    const tbody=document.getElementById('dashboard-users');
    const rows=[];
    vecinos.slice(0,3).forEach(v=>rows.push({tipo:'Vecino',nombre:`${v.nombre||''} ${v.apellido||''}`.trim(),correo:v.correo||'',info:v.direccion||v.sector||'Sin dirección',badge:'role-vecino'}));
    subs.slice(0,3).forEach(s=>rows.push({tipo:'Sub-Admin',nombre:s.nombre,correo:s.correo,info:s.rol||'SUB_ADMIN',badge:'role-admin'}));
    if(!rows.length){ tbody.innerHTML='<tr><td colspan="4" class="empty">No hay usuarios registrados</td></tr>'; return; }
    tbody.innerHTML=rows.slice(0,5).map(u=>`<tr><td><div class="user-row"><div class="avatar" style="background:${nextColor()}">${iniciales(u.nombre)}</div><div><div class="user-name">${escapeHtml(u.nombre)}</div><div class="user-email">${escapeHtml(u.correo)}</div></div></div></td><td><span class="role ${u.badge}">${u.tipo}</span></td><td>${escapeHtml(u.info)}</td><td><button class="btn btn-secondary btn-sm" onclick="showToast('Perfil de ${escapeHtml(u.nombre)}')">Ver perfil</button></td></tr>`).join('');
  }catch(e){ console.error(e); }
}
