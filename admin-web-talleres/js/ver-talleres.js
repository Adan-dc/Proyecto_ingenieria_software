const API_BASE = "http://localhost:8081/api";

let talleres = [];
let tallerSeleccionado = null;
let articulosActuales = [];

document.addEventListener("DOMContentLoaded", () => {
  cargarTalleres();
});

function cargarTalleres() {
  fetch(`${API_BASE}/talleres`)
    .then(response => {
      if (!response.ok) {
        throw new Error("No se pudieron cargar los talleres.");
      }

      return response.json();
    })
    .then(data => {
      talleres = data;
      mostrarTalleres(talleres);
    })
    .catch(error => {
      console.error(error);
      document.getElementById("listaTalleres").innerHTML = `
        <div class="p-6 text-red-600 font-bold">
          Error al cargar talleres. Revisa que Spring Boot esté encendido.
        </div>
      `;
    });
}

function mostrarTalleres(lista) {
  const contenedor = document.getElementById("listaTalleres");
  contenedor.innerHTML = "";

  if (lista.length === 0) {
    contenedor.innerHTML = `
      <div class="p-6 text-muted">
        No hay talleres creados todavía.
      </div>
    `;
    return;
  }

  lista.forEach(taller => {
    const estadoClase = obtenerClaseEstado(taller.estado);
    const cuposTotales = Number(taller.cuposTotales || 0);
    const cuposOcupados = Number(taller.cuposOcupados || 0);
    const cuposDisponibles = Math.max(cuposTotales - cuposOcupados, 0);

    const item = document.createElement("div");
    item.className = "p-5 hover:bg-surface-soft transition-colors";

    item.innerHTML = `
      <div class="flex flex-col md:flex-row gap-4">

        <div class="w-full md:w-28 h-32 md:h-24 rounded-xl bg-surface-soft overflow-hidden flex-shrink-0">
          ${taller.imagenUrl
            ? `<img src="${taller.imagenUrl}" class="w-full h-full object-cover">`
            : `<div class="w-full h-full flex items-center justify-center text-muted">
                <span class="material-symbols-outlined text-4xl">image</span>
               </div>`
          }
        </div>

        <div class="flex-1 min-w-0">

          <div class="flex items-start justify-between gap-3">
            <div>
              <span class="inline-block text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md mb-2">
                ${taller.etiqueta || "Sin etiqueta"}
              </span>

              <h4 class="text-lg font-extrabold text-text">
                ${taller.nombre || "Sin nombre"}
              </h4>
            </div>

            <span class="${estadoClase}">
              ${taller.estado || "ACTIVO"}
            </span>
          </div>

          <p class="text-sm text-muted mt-1 line-clamp-2">
            ${taller.descripcion || "Sin descripción"}
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 text-sm text-muted">
            <p>👤 ${taller.profesor || "Sin profesor"}</p>
            <p>📅 ${formatearFecha(taller.fecha)} | ${formatearHora(taller.horaInicio)} - ${formatearHora(taller.horaFin)}</p>
            <p>📍 ${taller.lugar || "Sin lugar"}</p>
            <p>👥 Cupos: ${cuposOcupados} / ${cuposTotales}</p>
            <p>✅ Disponibles: ${cuposDisponibles}</p>
          </div>

          <div class="mt-4 flex flex-col md:flex-row justify-end gap-2">
            <button onclick="editarTaller(${taller.id})"
              class="bg-[#6063ee] hover:bg-[#4648d4] text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-1">
              <span class="material-symbols-outlined text-[18px]">edit</span>
              Editar taller
            </button>

            <button onclick="eliminarTaller(${taller.id})"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-1">
              <span class="material-symbols-outlined text-[18px]">delete</span>
              Eliminar taller
            </button>

            <button onclick="seleccionarTaller(${taller.id})"
              class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-1">
              <span class="material-symbols-outlined text-[18px]">inventory_2</span>
              Ver / editar artículos
            </button>
          </div>

        </div>
      </div>
    `;

    contenedor.appendChild(item);
  });
}

function editarTaller(id) {
  tallerSeleccionado = talleres.find(taller => taller.id === id);

  if (!tallerSeleccionado) {
    alert("No se encontró el taller seleccionado.");
    return;
  }

  const panelEditar = document.getElementById("panelEditarTaller");
  const panelArticulos = document.getElementById("panelArticulosTaller");

  if (panelEditar) {
    panelEditar.classList.remove("hidden");
  }

  if (panelArticulos) {
    panelArticulos.classList.add("hidden");
  }

  const cuposTotales = Number(tallerSeleccionado.cuposTotales || 0);
  const cuposOcupados = Number(tallerSeleccionado.cuposOcupados || 0);
  const cuposDisponibles = Math.max(cuposTotales - cuposOcupados, 0);

  document.getElementById("nombreEditarTaller").innerText =
    `${tallerSeleccionado.nombre} — ID ${tallerSeleccionado.id}`;

  document.getElementById("editarFecha").value = tallerSeleccionado.fecha || "";

  document.getElementById("editarHoraInicio").value = tallerSeleccionado.horaInicio
    ? tallerSeleccionado.horaInicio.substring(0, 5)
    : "";

  document.getElementById("editarHoraFin").value = tallerSeleccionado.horaFin
    ? tallerSeleccionado.horaFin.substring(0, 5)
    : "";

  document.getElementById("editarCuposTotales").value = cuposTotales;
  document.getElementById("editarCuposDisponibles").value = cuposDisponibles;
  document.getElementById("editarEstado").value = tallerSeleccionado.estado || "ACTIVO";

  actualizarAyudaCuposEditar();
}

function guardarCambiosTaller() {
  if (!tallerSeleccionado) {
    alert("Primero debes seleccionar un taller.");
    return;
  }

  const fecha = document.getElementById("editarFecha").value;
  const horaInicio = document.getElementById("editarHoraInicio").value;
  const horaFin = document.getElementById("editarHoraFin").value;

  const cuposTotales = parseInt(document.getElementById("editarCuposTotales").value);
  const cuposDisponibles = parseInt(document.getElementById("editarCuposDisponibles").value);

  const estado = document.getElementById("editarEstado").value;

  if (fecha === "") {
    alert("Debes seleccionar una fecha.");
    return;
  }

  if (horaInicio === "" || horaFin === "") {
    alert("Debes ingresar hora de inicio y hora de fin.");
    return;
  }

  if (horaFin <= horaInicio) {
    alert("La hora de fin debe ser mayor que la hora de inicio.");
    return;
  }

  if (isNaN(cuposTotales) || cuposTotales <= 0) {
    alert("Debes ingresar cupos totales válidos.");
    return;
  }

  if (isNaN(cuposDisponibles) || cuposDisponibles < 0) {
    alert("Debes ingresar cupos disponibles válidos.");
    return;
  }

  if (cuposDisponibles > cuposTotales) {
    alert("Los cupos disponibles no pueden ser mayores que los cupos totales.");
    return;
  }

  const cuposOcupados = cuposTotales - cuposDisponibles;

  const tallerActualizado = {
    ...tallerSeleccionado,
    fecha: fecha,
    horaInicio: horaInicio + ":00",
    horaFin: horaFin + ":00",
    cuposTotales: cuposTotales,
    cuposOcupados: cuposOcupados,
    estado: estado
  };

  fetch(`${API_BASE}/talleres/${tallerSeleccionado.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(tallerActualizado)
  })
    .then(response => {
      if (!response.ok) {
        return response.text().then(texto => {
          throw new Error(texto || "No se pudo actualizar el taller.");
        });
      }

      return response.json();
    })
    .then(data => {
      alert("Taller actualizado correctamente.");

      tallerSeleccionado = data;

      cargarTalleres();

      document.getElementById("nombreEditarTaller").innerText =
        `${data.nombre} — ID ${data.id}`;

      document.getElementById("editarCuposTotales").value = data.cuposTotales || 0;

      const disponiblesActualizados =
        Number(data.cuposTotales || 0) - Number(data.cuposOcupados || 0);

      document.getElementById("editarCuposDisponibles").value =
        Math.max(disponiblesActualizados, 0);

      actualizarAyudaCuposEditar();
    })
    .catch(error => {
      console.error(error);
      alert("Error al actualizar el taller.\n\n" + error.message);
    });
}


function eliminarTaller(id) {
  const taller = talleres.find(item => item.id === id);

  const nombreTaller = taller && taller.nombre ? taller.nombre : "este taller";

  const confirmar = confirm(
    `¿Seguro que deseas eliminar ${nombreTaller}? Esta acción no se puede deshacer.`
  );

  if (!confirmar) {
    return;
  }

  fetch(`${API_BASE}/talleres/${id}`, {
    method: "DELETE"
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`No se pudo eliminar el taller. Error HTTP ${response.status}`);
      }

      alert("Taller eliminado correctamente.");

      if (tallerSeleccionado && tallerSeleccionado.id === id) {
        tallerSeleccionado = null;

        const panelEditar = document.getElementById("panelEditarTaller");
        const panelArticulos = document.getElementById("panelArticulosTaller");

        if (panelEditar) {
          panelEditar.classList.add("hidden");
        }

        if (panelArticulos) {
          panelArticulos.classList.add("hidden");
        }
      }

      cargarTalleres();
    })
    .catch(error => {
      console.error("Error al eliminar taller:", error);
      alert("No se pudo eliminar el taller. Revisa que el backend tenga el método DELETE.");
    });
}

function seleccionarTaller(id) {
  tallerSeleccionado = talleres.find(taller => taller.id === id);

  if (!tallerSeleccionado) {
    alert("No se encontró el taller seleccionado.");
    return;
  }

  const panelArticulos = document.getElementById("panelArticulosTaller");
  const panelEditar = document.getElementById("panelEditarTaller");
  const panelArticuloForm = document.getElementById("panelArticuloForm");

  if (panelArticulos) {
    panelArticulos.classList.remove("hidden");
  }

  if (panelEditar) {
    panelEditar.classList.add("hidden");
  }

  if (panelArticuloForm) {
    panelArticuloForm.classList.remove("hidden");
  }

  document.getElementById("nombreTallerSeleccionado").innerText =
    `${tallerSeleccionado.nombre} — ID ${tallerSeleccionado.id}`;

  limpiarFormularioArticulo();
  cargarArticulosDelTaller(tallerSeleccionado.id);
}

function cargarArticulosDelTaller(tallerId) {
  fetch(`${API_BASE}/articulos-requeridos/taller/${tallerId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("No se pudieron cargar los artículos.");
      }

      return response.json();
    })
    .then(data => {
      articulosActuales = data;
      mostrarArticulos(data);
    })
    .catch(error => {
      console.error(error);
      document.getElementById("listaArticulos").innerHTML = `
        <li class="p-6 text-red-600 font-bold">
          Error al cargar artículos del taller.
        </li>
      `;
    });
}

function mostrarArticulos(lista) {
  const contenedor = document.getElementById("listaArticulos");
  contenedor.innerHTML = "";

  if (lista.length === 0) {
    contenedor.innerHTML = `
      <li class="p-6 text-muted">
        Este taller todavía no tiene artículos requeridos.
      </li>
    `;
    return;
  }

  lista.forEach(articulo => {
    const item = document.createElement("li");
    item.className = "p-5 hover:bg-surface-soft transition-colors";

    item.innerHTML = `
      <div class="flex items-start justify-between gap-4">

        <div class="flex gap-3">
          <div class="w-10 h-10 rounded-lg bg-surface-soft flex items-center justify-center text-xl">
            ${articulo.icono || "📦"}
          </div>

          <div>
            <h4 class="font-extrabold text-text">${articulo.nombre || "Sin nombre"}</h4>
            <p class="text-sm text-muted">${articulo.descripcion || "Sin descripción"}</p>
            <p class="text-sm text-muted mt-1">
              Cantidad: <strong>${articulo.cantidadRecibida || 0}</strong> /
              <strong>${articulo.cantidadNecesaria || 0}</strong>
            </p>
            <p class="text-xs mt-1 font-bold ${obtenerTextoEstadoArticulo(articulo.estado)}">
              ${articulo.estado || "PENDIENTE"}
            </p>
          </div>
        </div>

        <div class="flex gap-1">
          <button onclick="editarArticulo(${articulo.id})"
            class="text-muted hover:text-primary p-2 rounded-full hover:bg-white">
            <span class="material-symbols-outlined text-[20px]">edit</span>
          </button>

          <button onclick="eliminarArticulo(${articulo.id})"
            class="text-muted hover:text-red-600 p-2 rounded-full hover:bg-red-50">
            <span class="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </div>

      </div>
    `;

    contenedor.appendChild(item);
  });
}

function guardarArticulo() {
  if (!tallerSeleccionado) {
    alert("Primero debes seleccionar un taller.");
    return;
  }

  const id = document.getElementById("articuloId").value;
  const nombre = document.getElementById("articuloNombre").value.trim();
  const descripcion = document.getElementById("articuloDescripcion").value.trim();
  const cantidadNecesaria = parseInt(document.getElementById("articuloCantidadNecesaria").value);
  const cantidadRecibida = parseInt(document.getElementById("articuloCantidadRecibida").value) || 0;
  const estado = document.getElementById("articuloEstado").value;
  const icono = document.getElementById("articuloIcono").value.trim();

  if (nombre === "") {
    alert("Debes ingresar el nombre del artículo.");
    return;
  }

  if (descripcion === "") {
    alert("Debes ingresar la descripción del artículo.");
    return;
  }

  if (isNaN(cantidadNecesaria) || cantidadNecesaria <= 0) {
    alert("Debes ingresar una cantidad necesaria válida.");
    return;
  }

  const articulo = {
    nombre,
    descripcion,
    cantidadNecesaria,
    cantidadRecibida,
    estado,
    icono
  };

  if (id) {
    actualizarArticulo(id, articulo);
  } else {
    crearArticulo(articulo);
  }
}

function crearArticulo(articulo) {
  fetch(`${API_BASE}/articulos-requeridos/taller/${tallerSeleccionado.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(articulo)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("No se pudo crear el artículo.");
      }

      return response.json();
    })
    .then(() => {
      alert("Artículo agregado correctamente.");
      limpiarFormularioArticulo();
      cargarArticulosDelTaller(tallerSeleccionado.id);
    })
    .catch(error => {
      console.error(error);
      alert("Error al crear el artículo.");
    });
}

function actualizarArticulo(id, articulo) {
  fetch(`${API_BASE}/articulos-requeridos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(articulo)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("No se pudo actualizar el artículo.");
      }

      return response.json();
    })
    .then(() => {
      alert("Artículo actualizado correctamente.");
      limpiarFormularioArticulo();
      cargarArticulosDelTaller(tallerSeleccionado.id);
    })
    .catch(error => {
      console.error(error);
      alert("Error al actualizar el artículo.");
    });
}

function editarArticulo(id) {
  const articulo = articulosActuales.find(item => item.id === id);

  if (!articulo) {
    alert("No se encontró el artículo.");
    return;
  }

  document.getElementById("articuloId").value = articulo.id;
  document.getElementById("articuloNombre").value = articulo.nombre || "";
  document.getElementById("articuloDescripcion").value = articulo.descripcion || "";
  document.getElementById("articuloCantidadNecesaria").value = articulo.cantidadNecesaria || 0;
  document.getElementById("articuloCantidadRecibida").value = articulo.cantidadRecibida || 0;
  document.getElementById("articuloEstado").value = articulo.estado || "PENDIENTE";
  document.getElementById("articuloIcono").value = articulo.icono || "";
}

function eliminarArticulo(id) {
  const confirmar = confirm("¿Seguro que quieres eliminar este artículo?");

  if (!confirmar) {
    return;
  }

  fetch(`${API_BASE}/articulos-requeridos/${id}`, {
    method: "DELETE"
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("No se pudo eliminar el artículo.");
      }

      alert("Artículo eliminado correctamente.");
      cargarArticulosDelTaller(tallerSeleccionado.id);
    })
    .catch(error => {
      console.error(error);
      alert("Error al eliminar el artículo.");
    });
}

function limpiarFormularioArticulo() {
  document.getElementById("articuloId").value = "";
  document.getElementById("articuloNombre").value = "";
  document.getElementById("articuloDescripcion").value = "";
  document.getElementById("articuloCantidadNecesaria").value = "";
  document.getElementById("articuloCantidadRecibida").value = "0";
  document.getElementById("articuloEstado").value = "PENDIENTE";
  document.getElementById("articuloIcono").value = "";
}

function filtrarTalleres() {
  const texto = document.getElementById("buscador").value.toLowerCase();

  const filtrados = talleres.filter(taller => {
    return (
      (taller.nombre || "").toLowerCase().includes(texto) ||
      (taller.profesor || "").toLowerCase().includes(texto) ||
      (taller.etiqueta || "").toLowerCase().includes(texto)
    );
  });

  mostrarTalleres(filtrados);
}

function obtenerClaseEstado(estado) {
  if (estado === "FINALIZADO") {
    return "text-xs font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-600";
  }

  if (estado === "CANCELADO") {
    return "text-xs font-bold px-2 py-1 rounded-full bg-red-100 text-red-700";
  }

  return "text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700";
}

function obtenerTextoEstadoArticulo(estado) {
  if (estado === "COMPLETO") {
    return "text-green-700";
  }

  if (estado === "CANCELADO") {
    return "text-red-600";
  }

  return "text-orange-600";
}

function formatearFecha(fecha) {
  if (!fecha) {
    return "Sin fecha";
  }

  const partes = fecha.split("-");
  return `${partes[2]}-${partes[1]}-${partes[0]}`;
}

function formatearHora(hora) {
  if (!hora) {
    return "Sin hora";
  }

  return hora.substring(0, 5);
}
function actualizarAyudaCuposEditar() {
  const inputTotales = document.getElementById("editarCuposTotales");
  const inputDisponibles = document.getElementById("editarCuposDisponibles");
  const ayuda = document.getElementById("ayudaCuposEditar");

  if (!inputTotales || !inputDisponibles || !ayuda) {
    return;
  }

  const totales = Number(inputTotales.value || 0);
  const disponibles = Number(inputDisponibles.value || 0);

  if (totales <= 0 || disponibles < 0 || disponibles > totales) {
    ayuda.innerText = "Revisa los cupos. Los disponibles no pueden superar los totales.";
    ayuda.classList.remove("text-muted");
    ayuda.classList.add("text-red-600", "font-bold");
    return;
  }

  const ocupados = totales - disponibles;

  ayuda.innerText =
    `Cupos ocupados calculados: ${ocupados}. Cupos disponibles para la APK: ${disponibles}.`;

  ayuda.classList.add("text-muted");
  ayuda.classList.remove("text-red-600", "font-bold");
}

document.addEventListener("input", event => {
  if (
    event.target &&
    (
      event.target.id === "editarCuposTotales" ||
      event.target.id === "editarCuposDisponibles"
    )
  ) {
    actualizarAyudaCuposEditar();
  }
});

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