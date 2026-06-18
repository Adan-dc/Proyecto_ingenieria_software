function obtenerUsuarioGestionDonaciones() {
    const data = localStorage.getItem('usuarioGestionDonaciones');
  
    if (!data) {
      return null;
    }
  
    try {
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }
  
  function validarSesionGestionDonaciones() {
    const usuario = obtenerUsuarioGestionDonaciones();
  
    if (!usuario) {
      window.location.href = './login.html';
      return;
    }
  
    const rol = usuario.rol || '';
  
    const permitido =
      rol === 'ADMIN' ||
      rol === 'SUB_ADMIN' ||
      rol === 'GESTION_DONACIONES';
  
    if (!permitido) {
      localStorage.removeItem('usuarioGestionDonaciones');
      window.location.href = './login.html';
    }
  }
  
  function cerrarSesionGestionDonaciones() {
    localStorage.removeItem('usuarioGestionDonaciones');
    window.location.href = './login.html';
  }
  
  function mostrarUsuarioGestionDonaciones() {
    const usuario = obtenerUsuarioGestionDonaciones();
  
    if (!usuario) {
      return;
    }
  
    const contenedor = document.getElementById('usuario-logueado');
  
    if (contenedor) {
      contenedor.textContent = `${usuario.nombre || 'Usuario'} | ${usuario.rol || 'Sin rol'}`;
    }
  }