function showProfile(nombre, email, rut, casa) {
  document.getElementById('p-nombre').textContent = nombre;
  document.getElementById('p-email').textContent = email;
  document.getElementById('p-rut').textContent = rut;
  document.getElementById('p-casa').textContent = casa;
  openModal('profile-modal-overlay');
}
