import { cargarDatosTemporada } from "./api.js";
import {
  renderCargando,
  renderError,
  renderResumen,
  renderTablaPilotos,
  renderTablaConstructores,
} from "./dom.js";

const estado = {
  temporada: localStorage.getItem("f1_temporada") ?? "2024",
  vista: localStorage.getItem("f1_vista") ?? "pilotos",
  soloGanadores: false,
  pilotos: [],
  constructores: [],
};

const selectTemporada = document.querySelector("#season-select");
const tabsNav = document.querySelector("#tabs-nav");
const btnGanadores = document.querySelector("#winners-btn");
const btnRecargar = document.querySelector("#reload-btn");

/**
 * Genera el listado cronológico de temporadas de Fórmula 1 (1950 a 2025).
 */
function inicializarSelectorTemporadas() {
  const anioActual = 2025;
  const temporadas = Array.from({ length: 76 }, (_, i) => String(anioActual - i));

  selectTemporada.innerHTML = temporadas
    .map(
      (anio) =>
        `<option value="${anio}" ${anio === estado.temporada ? "selected" : ""}>Temporada ${anio}</option>`
    )
    .join("");
}

/**
 * Sincroniza la apariencia de los botones de pestañas según el estado guardado.
 */
function sincronizarPestanias() {
  const botones = tabsNav.querySelectorAll(".tab-button");
  for (const btn of botones) {
    if (btn.getAttribute("data-tab") === estado.vista) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  }
}

/**
 * Realiza la petición asíncrona de datos y actualiza la interfaz.
 * @param {string} temporada
 */
async function cargarTemporada(temporada) {
  renderCargando(temporada);
  try {
    const { pilotos, constructores } = await cargarDatosTemporada(temporada);
    estado.pilotos = pilotos;
    estado.constructores = constructores;
    actualizarVista();
  } catch (error) {
    renderError(error.message);
  }
}

/**
 * Aplica los filtros de datos y renderiza la tabla y resumen correspondientes.
 */
function actualizarVista() {
  if (estado.vista === "pilotos") {
    const filtrados = estado.soloGanadores
      ? estado.pilotos.filter((item) => Number(item.wins ?? 0) > 0)
      : estado.pilotos;

    renderResumen(filtrados, "pilotos", estado.temporada);
    renderTablaPilotos(filtrados);
  } else {
    const filtrados = estado.soloGanadores
      ? estado.constructores.filter((item) => Number(item.wins ?? 0) > 0)
      : estado.constructores;

    renderResumen(filtrados, "constructores", estado.temporada);
    renderTablaConstructores(filtrados);
  }
}

// Eventos
selectTemporada.addEventListener("change", (event) => {
  estado.temporada = event.target.value;
  localStorage.setItem("f1_temporada", estado.temporada);
  cargarTemporada(estado.temporada);
});

tabsNav.addEventListener("click", (event) => {
  const boton = event.target.closest(".tab-button");
  if (!boton) return;

  const nuevaVista = boton.getAttribute("data-tab");
  if (!nuevaVista || nuevaVista === estado.vista) return;

  estado.vista = nuevaVista;
  localStorage.setItem("f1_vista", estado.vista);
  sincronizarPestanias();
  actualizarVista();
});

btnGanadores.addEventListener("click", () => {
  estado.soloGanadores = !estado.soloGanadores;
  btnGanadores.classList.toggle("active", estado.soloGanadores);
  actualizarVista();
});

btnRecargar.addEventListener("click", () => {
  cargarTemporada(estado.temporada);
});

// Inicialización de la aplicación
inicializarSelectorTemporadas();
sincronizarPestanias();
cargarTemporada(estado.temporada);