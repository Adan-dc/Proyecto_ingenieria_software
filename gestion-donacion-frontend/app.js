const API_BASE_URL = 'http://localhost:8080/api/v1/gestion';

// Modal utility functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Global generic fetch wrapper
async function apiCall(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || 'Error en la petición');
        }
        // If 204 No Content, don't parse JSON
        if (response.status === 204) {
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error('API Call Error:', error);
        alert('Ocurrió un error: ' + error.message);
        throw error;
    }
}
