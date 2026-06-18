const API_BASE = 'http://localhost:8082';
const colors = ['#6366f1','#ec4899','#10b981','#f59e0b','#8b5cf6','#0ea5e9','#ef4444','#14b8a6'];
let colorIdx = 0;
function nextColor(){ return colors[colorIdx++ % colors.length]; }
async function apiFetch(url, options = {}) { if (url.startsWith('/')) url = API_BASE + url; return fetch(url, options); }
let toastTimer;
function showToast(msg, icon = '✓') { const t=document.getElementById('toast'); if(!t){alert(msg);return;} const ti=t.querySelector('.toast-icon'); const tm=document.getElementById('toast-msg'); if(ti)ti.textContent=icon; if(tm)tm.textContent=msg; clearTimeout(toastTimer); t.classList.add('show'); toastTimer=setTimeout(()=>t.classList.remove('show'),2800); }
function guardarSesion(usuario){ localStorage.setItem('usuarioAdminActual', JSON.stringify(usuario)); }
function obtenerSesion(){ try { return JSON.parse(localStorage.getItem('usuarioAdminActual') || 'null'); } catch { return null; } }
function validarSesion(){ if(!obtenerSesion()) window.location.href='./index.html'; }
function logout(){ localStorage.removeItem('usuarioAdminActual'); window.location.href='./index.html'; }
function openModal(id){ const el=document.getElementById(id); if(el) el.classList.add('open'); }
function closeModal(id){ if(id){ const el=document.getElementById(id); if(el) el.classList.remove('open'); } else document.querySelectorAll('.modal-overlay').forEach(m=>m.classList.remove('open')); }
document.addEventListener('click', e => { if(e.target.classList && e.target.classList.contains('modal-overlay')) e.target.classList.remove('open'); });
function iniciales(nombre){ return (nombre||'NA').split(' ').filter(Boolean).map(p=>p[0]).join('').substring(0,2).toUpperCase(); }
function escapeHtml(text){ return String(text ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function exportTableToCSV(tbodyId, filename){ const tbody=document.getElementById(tbodyId); if(!tbody) return; const table=tbody.closest('table'); let csv=[]; table.querySelectorAll('tr').forEach(row=>{let cols=[...row.querySelectorAll('td,th')].map(c=>'"'+c.innerText.replace(/"/g,'""').trim()+'"'); if(cols.length) csv.push(cols.join(','));}); const blob=new Blob(['\uFEFF'+csv.join('\n')],{type:'text/csv;charset=utf-8;'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=filename; a.click(); showToast('Archivo descargado','📥'); }
