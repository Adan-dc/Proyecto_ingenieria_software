function resolverReporte(btn) {
  const row = btn.closest('tr');
  row.style.transition = 'opacity 0.3s';
  row.style.opacity = '0';
  setTimeout(() => {
    row.remove();
    showToast('Reporte marcado como resuelto', '✅');
  }, 300);
}
