const API_LOGIN = 'http://localhost:8082/api/subadmins/login';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');

  if (form) {
    form.addEventListener('submit', iniciarSesion);
  }
});

async function iniciarSesion(event) {
  event.preventDefault();

  const correo = document.getElementById('correo').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorBox = document.getElementById('login-error');

  errorBox.style.display = 'none';

  if (!correo || !password) {
    errorBox.textContent = 'Debes ingresar correo y contraseña.';
    errorBox.style.display = 'block';
    return;
  }

  try {
    const response = await fetch(API_LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        correo,
        password
      })
    });

    if (!response.ok) {
      throw new Error('Credenciales incorrectas');
    }

    const usuario = await response.json();

    const rol = usuario.rol || '';

    const permitido =
      rol === 'ADMIN' ||
      rol === 'SUB_ADMIN' ||
      rol === 'GESTION_TALLERES';

    if (!permitido) {
      errorBox.textContent = 'Tu cuenta no tiene permiso para Gestión de Talleres.';
      errorBox.style.display = 'block';
      return;
    }

    localStorage.setItem('usuarioGestionTalleres', JSON.stringify(usuario));

    window.location.href = './taller.html';

  } catch (error) {
    console.error('Error login:', error);
    errorBox.textContent = 'Correo, contraseña o permisos incorrectos.';
    errorBox.style.display = 'block';
  }
}