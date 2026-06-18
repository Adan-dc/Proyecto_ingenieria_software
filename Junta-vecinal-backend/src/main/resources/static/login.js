// Login logic
function doLogin(event) {
  if (event) event.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value.trim();

  if (email === 'admin@juntavecinal.com' && pass === 'admin') {
    window.location.href = 'dashboard.html';
  } else {
    if (typeof showToast === 'function') {
      showToast('Error al iniciar sesión', '❌');
    } else {
      alert('Error al iniciar sesión');
    }
  }
}
