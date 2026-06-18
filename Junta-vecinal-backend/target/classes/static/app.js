const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#0ea5e9', '#ef4444', '#14b8a6'];
let colorIdx = 0;
function nextColor() { return colors[colorIdx++ % colors.length]; }

const API_BASE = 'http://localhost:8080';

async function apiFetch(url, options) {
  if (url.startsWith('/')) {
    url = API_BASE + url;
  }
  try {
    const res = await fetch(url, options);
    return res;
  } catch (e) {
    console.warn('Backend no disponible o error de red CORS para:', url);
    if (!options || options.method === 'GET') {
      if (url.includes('/api/subadmins')) {
        return { ok: true, json: async () => [{nombre: 'Admin Prueba (Mock)', correo: 'admin@prueba.com', rol: 'Administrador'}] };
      }
      if (url.includes('/api/vecinos')) {
        return { ok: true, json: async () => [{nombre: 'Vecino', apellido: 'Prueba (Mock)', correo: 'vecino@prueba.com', direccion: 'Casa X', usuario: {rol: 'Vecino'}}] };
      }
    }
    throw e;
  }
}

// Toast
let toastTimer;
function showToast(msg, icon = '✓') {
  const t = document.getElementById('toast');
  if(!t) return;
  const ti = t.querySelector('.toast-icon');
  document.getElementById('toast-msg').textContent = msg;
  ti.textContent = icon;
  clearTimeout(toastTimer);
  t.classList.add('show');
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

// Modals
function closeModal(id) { 
    if(id) {
        document.getElementById(id).classList.remove('open');
    } else {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
    }
}
function openModal(id) { document.getElementById(id).classList.add('open'); }

document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', function (e) { if (e.target === this) closeModal(this.id); });
});

function logout() {
    showToast('Sesión cerrada exitosamente', '👋');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Exportar a CSV (Compartido por subadmins e historial)
function exportTableToCSV(tbodyId, filename) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  
  const table = tbody.closest('table');
  if (!table) return;

  let csv = [];
  const rows = table.querySelectorAll('tr');
  
  for (let i = 0; i < rows.length; i++) {
    let row = [], cols = rows[i].querySelectorAll('td, th');
    
    for (let j = 0; j < cols.length; j++) {
      let text = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, " ").trim();
      if (text === 'Acción' || text === 'Acciones' || text.includes('Editar')) continue;
      row.push('"' + text.replace(/"/g, '""') + '"');
    }
    
    if(row.length > 0 && row.join('') !== '""') {
       csv.push(row.join(','));
    }
  }

  const csvFile = new Blob(["\uFEFF" + csv.join('\n')], {type: 'text/csv;charset=utf-8;'});
  const downloadLink = document.createElement('a');
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  showToast('Archivo descargado', '📥');
}
