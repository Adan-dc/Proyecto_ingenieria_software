
// ---------------------------------------------------------------
// Carga dinámica de talleres desde la API
// ---------------------------------------------------------------
async function loadTalleres() {
    try {
        const talleres = await apiCall('/talleres');
        const select = document.getElementById('tallerSelect');
        if (!select) return;

        select.innerHTML = '<option value="">-- Seleccione un taller --</option>';
        talleres.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.codigo;
            opt.textContent = t.nombre;
            select.appendChild(opt);
        });
    } catch (e) {
        console.error('No se pudieron cargar los talleres:', e);
    }
}

// ---------------------------------------------------------------
// Mostrar/ocultar el select de taller según el Destino elegido
// ---------------------------------------------------------------
function setupDestinoToggle() {
    const destinoSelect = document.getElementById('addDestino');
    const tallerWrapper = document.getElementById('tallerSelectWrapper');
    if (!destinoSelect || !tallerWrapper) return;

    destinoSelect.addEventListener('change', () => {
        if (destinoSelect.value === 'TALLER') {
            tallerWrapper.classList.remove('hidden');
        } else {
            tallerWrapper.classList.add('hidden');
            document.getElementById('tallerSelect').value = '';
        }
    });
}

// ---------------------------------------------------------------
// Impide físicamente teclear más de 9 caracteres en el RUT
// ---------------------------------------------------------------
function setupRutValidation() {
    const rutInput = document.getElementById('addRut');
    if (rutInput) {
        rutInput.addEventListener('keypress', (e) => {
            if (rutInput.value.length >= 9 && e.key !== 'Backspace' && e.key !== 'Delete' && !e.ctrlKey) {
                e.preventDefault();
            }
        });
        
        rutInput.addEventListener('paste', (e) => {
            const pasteData = e.clipboardData.getData('text');
            if (rutInput.value.length + pasteData.length > 9) {
                e.preventDefault();
                rutInput.value = (rutInput.value + pasteData).substring(0, 9);
                updateProgressBar();
            }
        });
    }
}

// ---------------------------------------------------------------
// Barra de progreso interactiva
// ---------------------------------------------------------------
function setupProgressBar() {
    const requiredInputs = document.querySelectorAll('.progress-input');
    requiredInputs.forEach(input => {
        input.addEventListener('input', updateProgressBar);
        input.addEventListener('change', updateProgressBar);
    });
}

function updateProgressBar() {
    const requiredInputs = document.querySelectorAll('.progress-input');
    const totalFields = requiredInputs.length;
    let filledFields = 0;

    requiredInputs.forEach(input => {
        if (input.value && input.value.trim() !== '') {
            filledFields++;
        }
    });

    const percentage = (filledFields / totalFields) * 100;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = percentage + '%';
        if (percentage === 100) {
            progressBar.classList.remove('bg-blue-500');
            progressBar.classList.add('bg-green-500');
        } else {
            progressBar.classList.remove('bg-green-500');
            progressBar.classList.add('bg-blue-500');
        }
    }
}

// ---------------------------------------------------------------
// Lógica de Agregar Donación Manual
// ---------------------------------------------------------------
const btnSaveAdd = document.getElementById('btnSaveAdd');
if (btnSaveAdd) {
    btnSaveAdd.addEventListener('click', async () => {
        const rut        = document.getElementById('addRut').value.trim();
        const nombre     = document.getElementById('addNombre').value.trim();
        const telefono   = document.getElementById('addTelefono').value.trim();
        const cantidad   = document.getElementById('addCantidad').value.trim();
        const articulo   = document.getElementById('addArticulo').value.trim();
        const desc       = document.getElementById('addDesc').value.trim();
        const destino    = document.getElementById('addDestino').value;
        const estadoEnvio = document.getElementById('addEstado').value;
        const tallerCodigo = document.getElementById('tallerSelect')?.value || null;

        // Validar taller solo si el destino es TALLER
        const tallerRequerido = destino === 'TALLER' && !tallerCodigo;

        if (!rut || !nombre || !telefono || !cantidad || !articulo || !destino || !estadoEnvio || tallerRequerido) {
            openModal('errorModal');
            return;
        }

        // Construir URL con query params
        let url = `/inventario?destino=${destino}&estadoEnvio=${estadoEnvio}`;
        if (destino === 'TALLER' && tallerCodigo) {
            url += `&codigoTaller=${tallerCodigo}`;
        }

        try {
            await apiCall(url, 'POST', {
                rutDonante:      rut,
                nombreDonante:   nombre,
                telefonoDonante: telefono,
                objetoADonar:    articulo,
                cantidad:        parseInt(cantidad),
                descripcion:     desc
            });
            closeModal('addModal');
            document.getElementById('formAdd').reset();
            document.getElementById('tallerSelectWrapper').classList.add('hidden');
            updateProgressBar();
            window.location.href = 'inventario.html';
        } catch(e) {
            // Error manejado en apiCall
        }
    });
}
