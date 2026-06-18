document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  if (form) form.addEventListener('submit', doLogin);
});
async function doLogin(event){
  event.preventDefault();
  const correo=document.getElementById('login-email').value.trim();
  const password=document.getElementById('login-password').value.trim();
  if(!correo || !password){ showToast('Ingresa correo y contraseña','⚠️'); return; }
  try{
    const res=await apiFetch('/api/subadmins/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({correo,password})});
    if(!res.ok){ showToast('Correo o contraseña incorrectos','❌'); return; }
    const usuario=await res.json();
    guardarSesion(usuario);
    showToast('Inicio de sesión correcto','✅');
    setTimeout(()=>window.location.href='./dashboard.html',600);
  }catch(e){ console.error(e); showToast('No se pudo conectar con el backend','❌'); }
}
