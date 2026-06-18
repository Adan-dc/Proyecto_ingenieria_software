const API_URL = "http://localhost:8081/api/talleres/con-articulos";

let articulos = [];

function agregarArticulo() {
  const nombre = document.getElementById("articuloNombre").value.trim();
  const descripcion = document.getElementById("articuloDescripcion").value.trim();
  const cantidadNecesaria = parseInt(document.getElementById("articuloCantidad").value);
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
    alert("Debes ingresar una cantidad válida.");
    return;
  }

  const articulo = {
    nombre,
    descripcion,
    cantidadNecesaria,
    icono
  };

  articulos.push(articulo);

  limpiarFormularioArticulo();
  mostrarArticulos();
}

function mostrarArticulos() {
  const lista = document.getElementById("listaArticulos");
  lista.innerHTML = "";

  if (articulos.length === 0) {
    lista.innerHTML = `
      <li class="p-5 text-muted text-sm">
        Aún no has agregado artículos.
      </li>
    `;
    return;
  }

  articulos.forEach((articulo, index) => {
    const item = document.createElement("li");

    item.className = "p-4 flex items-center justify-between gap-3 hover:bg-surface-soft transition-colors";

    item.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-lg bg-surface-soft flex items-center justify-center text-xl">
          ${articulo.icono || "📦"}
        </div>

        <div>
          <p class="font-bold text-text">${articulo.nombre}</p>
          <p class="text-sm text-muted">${articulo.descripcion}</p>
          <p class="text-xs text-muted mt-1">
            Cantidad necesaria: <strong>${articulo.cantidadNecesaria}</strong>
          </p>
        </div>
      </div>

      <button type="button" onclick="eliminarArticulo(${index})"
        class="text-muted hover:text-red-600 p-2 rounded-full hover:bg-red-50">
        <span class="material-symbols-outlined text-[20px]">close</span>
      </button>
    `;

    lista.appendChild(item);
  });
}

function eliminarArticulo(index) {
  articulos.splice(index, 1);
  mostrarArticulos();
}

function limpiarFormularioArticulo() {
  document.getElementById("articuloNombre").value = "";
  document.getElementById("articuloDescripcion").value = "";
  document.getElementById("articuloCantidad").value = "";
  document.getElementById("articuloIcono").value = "";
}

function actualizarPreviewImagen() {
  const imagenUrl = document.getElementById("imagenUrl").value.trim();
  const preview = document.getElementById("previewImagen");
  const placeholder = document.getElementById("placeholderImagen");

  if (imagenUrl === "") {
    preview.classList.add("hidden");
    placeholder.classList.remove("hidden");
    return;
  }

  preview.src = imagenUrl;
  preview.classList.remove("hidden");
  placeholder.classList.add("hidden");

  preview.onerror = function () {
    preview.classList.add("hidden");
    placeholder.classList.remove("hidden");
  };
}

function guardarTaller() {
  const nombre = document.getElementById("nombre").value.trim();
  const etiqueta = document.getElementById("etiqueta").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const profesor = document.getElementById("profesor").value.trim();

  const fecha = document.getElementById("fecha").value;
  const horaInicio = document.getElementById("horaInicio").value;
  const horaFin = document.getElementById("horaFin").value;

  const lugar = document.getElementById("lugar").value.trim();
  const direccion = document.getElementById("direccion").value.trim();

  const cuposTotales = parseInt(document.getElementById("cuposTotales").value);
  const cuposOcupados = parseInt(document.getElementById("cuposOcupados").value) || 0;

  const imagenUrl = document.getElementById("imagenUrl").value.trim();
  const imagenClase = document.getElementById("imagenClase").value.trim();
  const estado = document.getElementById("estado").value;

  if (nombre === "") {
    alert("Debes ingresar el nombre del taller.");
    return;
  }

  if (etiqueta === "") {
    alert("Debes ingresar una etiqueta para el taller.");
    return;
  }

  if (descripcion === "") {
    alert("Debes ingresar la descripción del taller.");
    return;
  }

  if (profesor === "") {
    alert("Debes ingresar el profesor o encargado del taller.");
    return;
  }

  if (fecha === "") {
    alert("Debes seleccionar la fecha del taller.");
    return;
  }

  if (horaInicio === "") {
    alert("Debes ingresar la hora de inicio.");
    return;
  }

  if (horaFin === "") {
    alert("Debes ingresar la hora de término.");
    return;
  }

  if (horaFin <= horaInicio) {
    alert("La hora de término debe ser mayor que la hora de inicio.");
    return;
  }

  if (lugar === "") {
    alert("Debes ingresar el lugar del taller.");
    return;
  }

  if (direccion === "") {
    alert("Debes ingresar la dirección del taller.");
    return;
  }

  if (isNaN(cuposTotales) || cuposTotales <= 0) {
    alert("Debes ingresar cupos totales válidos.");
    return;
  }

  if (articulos.length === 0) {
    alert("Debes agregar al menos un artículo requerido.");
    return;
  }

  const taller = {
    nombre,
    etiqueta,
    descripcion,
    profesor,
    fecha,
    horaInicio: horaInicio + ":00",
    horaFin: horaFin + ":00",
    lugar,
    direccion,
    cuposTotales,
    cuposOcupados,
    imagenUrl,
    imagenClase,
    estado,
    articulos
  };

  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(taller)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Error al guardar el taller.");
      }

      return response.json();
    })
    .then(data => {
      alert("Taller creado correctamente. ID: " + data.id);
      limpiarFormularioCompleto();
    })
    .catch(error => {
      console.error(error);
      alert("No se pudo guardar el taller. Revisa que Spring Boot esté encendido y que la ruta sea correcta.");
    });
}

function limpiarFormularioCompleto() {
  document.getElementById("nombre").value = "";
  document.getElementById("etiqueta").value = "";
  document.getElementById("descripcion").value = "";
  document.getElementById("profesor").value = "";

  document.getElementById("fecha").value = "";
  document.getElementById("horaInicio").value = "";
  document.getElementById("horaFin").value = "";

  document.getElementById("lugar").value = "";
  document.getElementById("direccion").value = "";

  document.getElementById("cuposTotales").value = "";
  document.getElementById("cuposOcupados").value = "0";

  document.getElementById("imagenUrl").value = "";
  document.getElementById("imagenClase").value = "";
  document.getElementById("estado").value = "ACTIVO";

  articulos = [];
  mostrarArticulos();
  actualizarPreviewImagen();
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