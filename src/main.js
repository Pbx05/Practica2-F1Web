import { obtenerPilotos } from "./api.js";
import { renderCargando, renderError, renderPilotos } from "./dom.js";

let pilotosOriginales = [];

const inputBusqueda = document.querySelector("#search");
const botonRecargar = document.querySelector("#reload-btn");

async function cargar() {
  renderCargando();
  try {
    const datos = await obtenerPilotos();
    
    pilotosOriginales = datos.toSorted((a, b) => 
      a.familyName.localeCompare(b.familyName)
    );

    aplicarFiltro();
  } catch (error) {
    renderError(error.message);
  }
}

function aplicarFiltro() {
  const termino = inputBusqueda.value.trim().toLowerCase();

  const pilotosFiltrados = pilotosOriginales.filter((piloto) => {
    const nombreCompleto = `${piloto.givenName} ${piloto.familyName}`.toLowerCase();
    const pais = piloto.nationality.toLowerCase();
    
    return nombreCompleto.includes(termino) || pais.includes(termino);
  });

  renderPilotos(pilotosFiltrados);
}

inputBusqueda.addEventListener("input", () => {
  aplicarFiltro();
});

botonRecargar.addEventListener("click", () => {
  inputBusqueda.value = "";
  cargar();
});

cargar();