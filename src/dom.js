const app = document.querySelector("#app");
const summaryBar = document.querySelector("#summary-bar");

/**
 * Muestra el estado de carga con estilo de telemetría técnica.
 * @param {string|number} temporada
 */
export function renderCargando(temporada) {
  summaryBar.innerHTML = "";
  app.innerHTML = `
    <div class="telemetry-state loading">
      <div class="telemetry-scan-bar" aria-hidden="true"></div>
      <p class="state-message">Sincronizando telemetría de la temporada ${temporada}</p>
    </div>
  `;
}

/**
 * Muestra un mensaje de error sobrio y profesional.
 * @param {string} mensaje
 */
export function renderError(mensaje) {
  summaryBar.innerHTML = "";
  app.innerHTML = `
    <div class="telemetry-state error">
      <div class="error-badge">Aviso del sistema</div>
      <h2 class="state-title">Interrupción en la recepción de datos</h2>
      <p class="state-message">${mensaje}</p>
    </div>
  `;
}

/**
 * Muestra una franja horizontal compacta con las métricas clave de la temporada.
 * @param {Array} lista Datos filtrados actuales
 * @param {"pilotos"|"constructores"} vista
 * @param {string} temporada
 */
export function renderResumen(lista, vista, temporada) {
  if (!lista || lista.length === 0) {
    summaryBar.innerHTML = "";
    return;
  }

  const lider = lista[0];
  const nombreLider =
    vista === "pilotos"
      ? `${lider?.Driver?.givenName ?? ""} ${lider?.Driver?.familyName ?? ""}`
      : lider?.Constructor?.name ?? "Sin datos";

  const totalVictorias = lista.reduce((acc, item) => acc + Number(item.wins ?? 0), 0);
  const totalPuntos = lista.reduce((acc, item) => acc + Number(item.points ?? 0), 0);

  summaryBar.innerHTML = `
    <div class="summary-metric">
      <span class="metric-caption">Líder provisional · ${temporada}</span>
      <strong class="metric-value highlight">${nombreLider}</strong>
    </div>
    <div class="summary-metric">
      <span class="metric-caption">Carreras disputadas</span>
      <strong class="metric-value">${totalVictorias} Grandes Premios</strong>
    </div>
    <div class="summary-metric">
      <span class="metric-caption">Puntos asignados</span>
      <strong class="metric-value">${totalPuntos.toLocaleString("es-ES")} pts</strong>
    </div>
    <div class="summary-metric">
      <span class="metric-caption">Total clasificados</span>
      <strong class="metric-value">${lista.length}</strong>
    </div>
  `;
}

/**
 * Renderiza la tabla oficial de clasificación de pilotos.
 * @param {Array} pilotos
 */
export function renderTablaPilotos(pilotos) {
  if (pilotos.length === 0) {
    app.innerHTML = `
      <div class="telemetry-state empty">
        <p class="state-message">No se registran pilotos para el criterio seleccionado.</p>
      </div>
    `;
    return;
  }

  const filasHtml = pilotos
    .map((item) => {
      const { position, points, wins, Driver, Constructors } = item;
      const dadoNombre = Driver?.givenName ?? "";
      const apellido = Driver?.familyName ?? "";
      const codigo = Driver?.code ?? apellido.slice(0, 3).toUpperCase();
      const numero = Driver?.permanentNumber ?? "—";
      const nacionalidad = Driver?.nationality ?? "—";
      const escuderia = Constructors?.[0]?.name ?? "Independiente";

      const posNum = Number(position);
      const podioClase = posNum <= 3 ? `podium-rank p-${posNum}` : "standard-rank";

      return `
        <tr class="driver-row">
          <td class="col-pos">
            <span class="pos-indicator ${podioClase}">${position}</span>
          </td>
          <td class="col-num">
            <span class="racing-num">${numero}</span>
          </td>
          <td class="col-driver">
            <div class="driver-meta">
              <span class="driver-code">${codigo}</span>
              <span class="driver-fullname">${dadoNombre} <strong>${apellido}</strong></span>
            </div>
          </td>
          <td class="col-team">
            <span class="team-tag">${escuderia}</span>
          </td>
          <td class="col-nat">
            <span class="nationality-text">${nacionalidad}</span>
          </td>
          <td class="col-wins center">
            <span class="metric-figure ${Number(wins) > 0 ? "has-wins" : ""}">${wins}</span>
          </td>
          <td class="col-points right">
            <span class="points-figure">${points}</span>
          </td>
        </tr>
      `;
    })
    .join("");

  app.innerHTML = `
    <div class="timing-board-container">
      <table class="f1-timing-table">
        <thead>
          <tr>
            <th class="col-pos">Pos</th>
            <th class="col-num">N°</th>
            <th class="col-driver">Piloto</th>
            <th class="col-team">Escudería</th>
            <th class="col-nat">Nacionalidad</th>
            <th class="col-wins center">Victorias</th>
            <th class="col-points right">Puntos</th>
          </tr>
        </thead>
        <tbody>
          ${filasHtml}
        </tbody>
      </table>
    </div>
  `;
}

/**
 * Renderiza la tabla oficial de clasificación de constructores.
 * @param {Array} constructores
 */
export function renderTablaConstructores(constructores) {
  if (constructores.length === 0) {
    app.innerHTML = `
      <div class="telemetry-state empty">
        <p class="state-message">
          No hay registros de constructores disponibles para este año (el Mundial de Constructores se inició en 1958).
        </p>
      </div>
    `;
    return;
  }

  const filasHtml = constructores
    .map((item) => {
      const { position, points, wins, Constructor } = item;
      const nombre = Constructor?.name ?? "Desconocido";
      const nacionalidad = Constructor?.nationality ?? "—";
      const posNum = Number(position);
      const podioClase = posNum <= 3 ? `podium-rank p-${posNum}` : "standard-rank";

      return `
        <tr class="constructor-row">
          <td class="col-pos">
            <span class="pos-indicator ${podioClase}">${position}</span>
          </td>
          <td class="col-team-name">
            <strong class="constructor-name">${nombre}</strong>
          </td>
          <td class="col-nat">
            <span class="nationality-text">${nacionalidad}</span>
          </td>
          <td class="col-wins center">
            <span class="metric-figure ${Number(wins) > 0 ? "has-wins" : ""}">${wins}</span>
          </td>
          <td class="col-points right">
            <span class="points-figure">${points}</span>
          </td>
        </tr>
      `;
    })
    .join("");

  app.innerHTML = `
    <div class="timing-board-container">
      <table class="f1-timing-table">
        <thead>
          <tr>
            <th class="col-pos">Pos</th>
            <th class="col-team-name">Constructor / Escudería</th>
            <th class="col-nat">Sede</th>
            <th class="col-wins center">Victorias</th>
            <th class="col-points right">Puntos</th>
          </tr>
        </thead>
        <tbody>
          ${filasHtml}
        </tbody>
      </table>
    </div>
  `;
}