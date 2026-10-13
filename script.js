/* =========================================================
   INS-TEC | JavaScript del formulario y la interfaz
   ========================================================= */

"use strict";

// 1. Obtener los elementos HTML que vamos a controlar.
const formulario = document.getElementById("formPostulacion");
const areaMensajes = document.getElementById("areaMensajes");
const btnEnviar = document.getElementById("btnEnviar");
const grupoTurnos = document.getElementById("grupoTurnos");
const turnoError = document.getElementById("turnoError");
const acepto = document.getElementById("acepto");
const aceptoError = document.getElementById("aceptoError");
let restablecimientoPorEnvio = false;

// 2. Mantener los nombres de las carreras en un solo lugar.
const nombresCarreras = {
  software: "Desarrollo de Software",
  contabilidad: "Contabilidad y Finanzas",
  administracion: "Administración de Empresas",
  otro: "Otra / Por definir"
};

const nombresModalidad = {
  presencial: "Presencial",
  virtual: "Virtual"
};

// 3. Funciones auxiliares para mostrar y retirar errores.
function mostrarError(campo, mensaje) {
  campo.classList.add("is-invalid");
  campo.setAttribute("aria-invalid", "true");

  const idMensaje = campo.id + "Error";
  const elementoMensaje = document.getElementById(idMensaje);

  if (elementoMensaje) {
    elementoMensaje.textContent = mensaje;
  }
}

function limpiarError(campo) {
  campo.classList.remove("is-invalid");
  campo.removeAttribute("aria-invalid");

  const idMensaje = campo.id + "Error";
  const elementoMensaje = document.getElementById(idMensaje);

  if (elementoMensaje) {
    elementoMensaje.textContent = "";
  }
}

function limpiarMensajesDeValidacion() {
  formulario.querySelectorAll(".is-invalid").forEach((campo) => {
    campo.classList.remove("is-invalid");
    campo.removeAttribute("aria-invalid");
  });

  formulario.querySelectorAll(".invalid-feedback").forEach((mensaje) => {
    mensaje.textContent = "";
  });

  turnoError.textContent = "";
  aceptoError.textContent = "";
  grupoTurnos.classList.remove("grupo-invalido");
}

function mostrarResultado(tipo, titulo, lineas) {
  // Crear nodos y usar textContent evita interpretar datos del usuario como HTML.
  const contenedor = document.createElement("div");
  contenedor.className = "mensaje-resultado " + tipo;
  contenedor.setAttribute("role", tipo === "error" ? "alert" : "status");

  const encabezado = document.createElement("h3");
  encabezado.textContent = titulo;
  contenedor.appendChild(encabezado);

  lineas.forEach((linea) => {
    const parrafo = document.createElement("p");
    parrafo.textContent = linea;
    contenedor.appendChild(parrafo);
  });

  areaMensajes.replaceChildren(contenedor);
}

function obtenerCampo(id) {
  return document.getElementById(id);
}

// 4. Validar los datos antes de simular el envío.
function validarFormulario() {
  limpiarMensajesDeValidacion();
  let esValido = true;

  const nombre = obtenerCampo("nombre");
  const dni = obtenerCampo("dni");
  const celular = obtenerCampo("celular");
  const correo = obtenerCampo("correo");
  const carrera = obtenerCampo("carrera");

  if (nombre.value.trim().length < 5) {
    mostrarError(nombre, "Escribe tus nombres y apellidos (mínimo 5 caracteres).");
    esValido = false;
  }

  if (!/^[0-9]{8}$/.test(dni.value.trim())) {
    mostrarError(dni, "El DNI debe contener exactamente 8 dígitos.");
    esValido = false;
  }

  if (!/^9[0-9]{8}$/.test(celular.value.trim())) {
    mostrarError(celular, "Ingresa un celular peruano de 9 dígitos que empiece con 9.");
    esValido = false;
  }

  if (!correo.checkValidity() || correo.value.trim() === "") {
    mostrarError(correo, "Ingresa un correo electrónico válido.");
    esValido = false;
  }

  if (!carrera.value || !Object.hasOwn(nombresCarreras, carrera.value)) {
    mostrarError(carrera, "Selecciona una carrera de interés.");
    esValido = false;
  }

  const turnosElegidos = formulario.querySelectorAll('input[name="turnos"]:checked');
  if (turnosElegidos.length === 0) {
    turnoError.textContent = "Selecciona al menos un turno disponible.";
    grupoTurnos.classList.add("grupo-invalido");
    esValido = false;
  }

  if (!acepto.checked) {
    aceptoError.textContent = "Debes aceptar el uso de datos para continuar.";
    acepto.classList.add("is-invalid");
    acepto.setAttribute("aria-invalid", "true");
    esValido = false;
  }

  if (!esValido) {
    const primerCampoInvalido = formulario.querySelector(".is-invalid");
    if (primerCampoInvalido) {
      primerCampoInvalido.focus();
    } else if (turnoError.textContent) {
      grupoTurnos.querySelector("input").focus();
    }
  }

  return esValido;
}

// 5. Simular una petición POST. No hay servidor ni almacenamiento real.
async function enviarDatos() {
  const datosFormulario = new FormData(formulario);
  const datos = Object.fromEntries(datosFormulario.entries());

  // FormData entrega un solo valor por clave con entries(); reunimos los turnos por separado.
  datos.turnos = Array.from(
    formulario.querySelectorAll('input[name="turnos"]:checked')
  ).map((turno) => turno.value);

  datos.nombre = String(datos.nombre || "").trim();
  datos.correo = String(datos.correo || "").trim();
  datos.carreraNombre = nombresCarreras[datos.carrera];
  datos.modalidadNombre = nombresModalidad[datos.modalidad];

  // Evidencia académica de los datos que se enviarían en el cuerpo de una petición POST.
  console.log("Método simulado: POST");
  console.log("Tipo de contenido esperado: application/x-www-form-urlencoded o multipart/form-data");
  console.log("Datos preparados para enviar:", datos);
  console.log("GET suele utilizarse para consultas; sus parámetros pueden aparecer en la URL.");

  btnEnviar.disabled = true;
  btnEnviar.textContent = "Procesando solicitud...";
  areaMensajes.replaceChildren();

  try {
    // Demora artificial para representar el tiempo de respuesta de un servidor.
    await new Promise((resolver) => window.setTimeout(resolver, 700));

    mostrarResultado("exito", "¡Solicitud registrada en la demostración!", [
      "Gracias, " + datos.nombre + ".",
      "Carrera de interés: " + datos.carreraNombre + ".",
      "Modalidad: " + datos.modalidadNombre + ".",
      "Turnos: " + datos.turnos.join(", ") + ".",
      "En un sistema real, el servidor recibiría estos datos y podría contactar al postulante. Esta práctica no almacena ni transmite la información."
    ]);

    restablecimientoPorEnvio = true;
    formulario.reset();
    limpiarMensajesDeValidacion();
  } catch (error) {
    console.error("Error durante la simulación:", error);
    mostrarResultado("error", "No se pudo completar la simulación", [
      "Intenta nuevamente. No se guardó información en un servidor."
    ]);
  } finally {
    btnEnviar.disabled = false;
    btnEnviar.innerHTML = 'Enviar solicitud <span aria-hidden="true">→</span>';
  }
}

// 6. Evento submit: evitar la recarga y validar antes de continuar.
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  if (validarFormulario()) {
    enviarDatos();
  } else {
    areaMensajes.replaceChildren();
  }
});

// 7. Retirar el error de un campo cuando el usuario lo corrige.
["nombre", "dni", "celular", "correo", "carrera"].forEach((id) => {
  const campo = obtenerCampo(id);
  campo.addEventListener("input", () => limpiarError(campo));
  campo.addEventListener("change", () => limpiarError(campo));
});

formulario.querySelectorAll('input[name="turnos"]').forEach((turno) => {
  turno.addEventListener("change", () => {
    if (formulario.querySelector('input[name="turnos"]:checked')) {
      turnoError.textContent = "";
      grupoTurnos.classList.remove("grupo-invalido");
    }
  });
});

acepto.addEventListener("change", () => {
  aceptoError.textContent = "";
  acepto.classList.remove("is-invalid");
  acepto.removeAttribute("aria-invalid");
});

// 8. Los botones de las tarjetas seleccionan la carrera y llevan al formulario.
document.querySelectorAll(".elegir-carrera").forEach((boton) => {
  boton.addEventListener("click", () => {
    const carreraSeleccionada = boton.dataset.carrera;
    obtenerCampo("carrera").value = carreraSeleccionada;
    limpiarError(obtenerCampo("carrera"));
    obtenerCampo("registro").scrollIntoView({ behavior: "smooth" });
    obtenerCampo("nombre").focus({ preventScroll: true });
  });
});

// 9. Limpiar mensajes también al usar el botón reset.
formulario.addEventListener("reset", () => {
  window.setTimeout(() => {
    limpiarMensajesDeValidacion();
    if (!restablecimientoPorEnvio) {
      areaMensajes.replaceChildren();
    }
    restablecimientoPorEnvio = false;
  }, 0);
});

// 10. Actualizar el año del pie de página automáticamente.
document.getElementById("anioActual").textContent = new Date().getFullYear();
