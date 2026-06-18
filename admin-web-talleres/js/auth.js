function obtenerUsuarioGestionTalleres() {
    const data = localStorage.getItem('usuarioGestionTalleres');
  
    if (!data) {
      return null;
    }
  
    try {
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }
  
  function validarSesionGestionTalleres() {
    const usuario = obtenerUsuarioGestionTalleres();
  
    if (!usuario) {
      window.location.href = './login.html';
      return;
    }
  
    const rol = usuario.rol || '';
  
    const permitido =
      rol === 'ADMIN' ||
      rol === 'SUB_ADMIN' ||
      rol === 'GESTION_TALLERES';
  
    if (!permitido) {
      localStorage.removeItem('usuarioGestionTalleres');
      window.location.href = './login.html';
    }
  }
  
  function cerrarSesionGestionTalleres() {
    localStorage.removeItem('usuarioGestionTalleres');
    window.location.href = './login.html';
  }
  
  function mostrarUsuarioGestionTalleres() {
    const usuario = obtenerUsuarioGestionTalleres();
  
    if (!usuario) {
      return;
    }
  
    const contenedor = document.getElementById('usuario-logueado');
  
    if (contenedor) {
      contenedor.textContent = `${usuario.nombre || 'Usuario'} | ${usuario.rol || 'Sin rol'}`;
    }
  }