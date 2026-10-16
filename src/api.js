const API_URL = "https://api.jolpi.ca/ergast/f1";

/**
 * Obtiene la clasificación oficial de pilotos para la temporada especificada.
 * @param {string|number} temporada Año de la temporada de Fórmula 1
 * @returns {Promise<Array>} Lista de pilotos con sus posiciones y estadísticas
 */
export async function obtenerClasificacionPilotos(temporada) {
  const respuesta = await fetch(`${API_URL}/${temporada}/driverStandings.json`);

  if (!respuesta.ok) {
    throw new Error(
      `Error de comunicación (${respuesta.status}): No se pudo obtener la tabla de pilotos`
    );
  }

  const datos = await respuesta.json();
  const listas = datos?.MRData?.StandingsTable?.StandingsLists ?? [];
  return listas[0]?.DriverStandings ?? [];
}

/**
 * Obtiene la clasificación oficial de constructores para la temporada especificada.
 * @param {string|number} temporada Año de la temporada de Fórmula 1
 * @returns {Promise<Array>} Lista de constructores con sus posiciones y puntos
 */
export async function obtenerClasificacionConstructores(temporada) {
  const respuesta = await fetch(`${API_URL}/${temporada}/constructorStandings.json`);

  if (!respuesta.ok) {
    throw new Error(
      `Error de comunicación (${respuesta.status}): No se pudo obtener la tabla de constructores`
    );
  }

  const datos = await respuesta.json();
  const listas = datos?.MRData?.StandingsTable?.StandingsLists ?? [];
  return listas[0]?.ConstructorStandings ?? [];
}

/**
 * Carga de forma concurrente pilotos y constructores para una temporada.
 * @param {string|number} temporada
 */
export async function cargarDatosTemporada(temporada) {
  const [pilotos, constructores] = await Promise.all([
    obtenerClasificacionPilotos(temporada),
    obtenerClasificacionConstructores(temporada),
  ]);

  return { pilotos, constructores };
}