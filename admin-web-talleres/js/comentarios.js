const API_COMENTARIOS = "http://localhost:8081/api/comentarios";

let comentarios = [];

document.addEventListener("DOMContentLoaded", () => {
  cargarComentarios();
});

function cargarComentarios() {
  fetch(API_COMENTARIOS)
    .then(response => {
      if (!response.ok) {
        throw new Error("No se pudieron cargar los comentarios.");
      }

      return response.json();
    })
    .then(data => {
      comentarios = data;
      actualizarResumen();
      mostrarComentarios(comentarios);
    })
    .catch(error => {
      console.error(error);

      document.getElementById("listaComentarios").innerHTML = `
        <div class="p-6 text-red-600 font-bold">
          Error al cargar comentarios. Revisa que Spring Boot esté encendido.
        </div>
      `;
    });
}

function mostrarComentarios(lista) {
  const contenedor = document.getElementById("listaComentarios");
  contenedor.innerHTML = "";

  if (lista.length === 0) {
    contenedor.innerHTML = `
      <div class="p-6 text-muted">
        No hay comentarios para mostrar.
      </div>
    `;
    return;
  }

  lista.forEach(comentario => {
    const estadoClase = obtenerClaseEstado(comentario.estado);

    const item = document.createElement("div");
    item.className = "comentario-item p-6 hover:bg-surface-soft transition-colors";

    item.innerHTML = `
      <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-4">

        <div class="flex-1">

          <div class="flex flex-wrap items-center gap-2 mb-3">
            <span class="${estadoClase}">
              ${comentario.estado || "VISIBLE"}
            </span>

            <span class="text-sm text-muted">
              ${formatearFechaHora(comentario.fechaComentario)}
            </span>
          </div>

          <h4 class="text-lg font-extrabold text-text">
            ${comentario.nombreVoluntario || "Voluntario sin nombre"}
          </h4>

          <p class="text-sm text-muted mb-2">
            ${comentario.emailVoluntario || "Sin email"}
          </p>

          <p class="comentario-caja text-base leading-relaxed border rounded-lg p-4">
            ${comentario.comentario || "Sin comentario"}
          </p>

          <div class="mt-3 text-sm text-muted">
            <p><strong>Taller:</strong> ${comentario.taller?.nombre || "Sin taller"}</p>
            <p><strong>ID Taller:</strong> ${comentario.taller?.id || "N/A"}</p>
          </div>

        </div>

        <div class="flex lg:flex-col gap-2">

          <button onclick="cambiarEstadoComentario(${comentario.id}, 'REVISADO')"
            class="px-3 py-2 rounded-lg bg-[#6063ee] text-white font-bold text-sm hover:bg-[#4648d4]">
            Revisado
          </button>

          <button onclick="cambiarEstadoComentario(${comentario.id}, 'OCULTO')"
            class="px-3 py-2 rounded-lg bg-slate-600 text-white font-bold text-sm hover:bg-slate-700">
            Ocultar
          </button>

          <button onclick="eliminarComentario(${comentario.id})"
            class="px-3 py-2 rounded-lg bg-red-600 text-white font-bold text-sm hover:bg-red-700">
            Eliminar
          </button>

        </div>

      </div>
    `;

    contenedor.appendChild(item);
  });
}

function cambiarEstadoComentario(id, estado) {
  fetch(`${API_COMENTARIOS}/${id}/estado?estado=${estado}`, {
    method: "PUT"
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("No se pudo cambiar el estado.");
      }

      return response.json();
    })
    .then(() => {
      cargarComentarios();
    })
    .catch(error => {
      console.error(error);
      alert("No se pudo cambiar el estado del comentario.");
    });
}

function eliminarComentario(id) {
  const confirmar = confirm("¿Seguro que quieres eliminar este comentario?");

  if (!confirmar) {
    return;
  }

  fetch(`${API_COMENTARIOS}/${id}`, {
    method: "DELETE"
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("No se pudo eliminar el comentario.");
      }

      cargarComentarios();
    })
    .catch(error => {
      console.error(error);
      alert("No se pudo eliminar el comentario.");
    });
}

function filtrarComentarios() {
  const texto = document.getElementById("buscador").value.toLowerCase();
  const estado = document.getElementById("filtroEstado").value;

  const filtrados = comentarios.filter(item => {
    const coincideTexto =
      (item.nombreVoluntario || "").toLowerCase().includes(texto) ||
      (item.emailVoluntario || "").toLowerCase().includes(texto) ||
      (item.comentario || "").toLowerCase().includes(texto) ||
      (item.taller?.nombre || "").toLowerCase().includes(texto);

    const coincideEstado =
      estado === "TODOS" || item.estado === estado;

    return coincideTexto && coincideEstado;
  });

  mostrarComentarios(filtrados);
}

function actualizarResumen() {
  const total = comentarios.length;
  const visibles = comentarios.filter(c => c.estado === "VISIBLE").length;
  const revisados = comentarios.filter(c => c.estado === "REVISADO").length;

  document.getElementById("totalComentarios").innerText = total;
  document.getElementById("totalVisibles").innerText = visibles;
  document.getElementById("totalRevisados").innerText = revisados;
}

function obtenerClaseEstado(estado) {
  if (estado === "REVISADO") {
    return "text-xs font-bold px-2 py-1 rounded-full bg-indigo-100 text-indigo-700";
  }

  if (estado === "OCULTO") {
    return "text-xs font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-700";
  }

  return "text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700";
}

function formatearFechaHora(fecha) {
  if (!fecha) {
    return "Sin fecha";
  }

  const date = new Date(fecha);

  if (isNaN(date.getTime())) {
    return fecha;
  }

  return date.toLocaleString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function toggleModoOscuro() {
    document.body.classList.toggle("modo-oscuro");
  
    if (document.body.classList.contains("modo-oscuro")) {
      localStorage.setItem("modoOscuro", "true");
    } else {
      localStorage.setItem("modoOscuro", "false");
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("modoOscuro") === "true") {
      document.body.classList.add("modo-oscuro");
    }
  });