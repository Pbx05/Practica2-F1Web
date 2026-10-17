const app = document.querySelector("#app");
const summaryBar = document.querySelector("#summary-bar");

/**
 * Muestra el estado de carga con estilo de telemetría técnica.
 * @param {string|number} temporada
 */
export function renderCargando(temporada) {
  summaryBar.replaceChildren();

  const container = document.createElement("div");
  container.className = "telemetry-state loading";

  const scanBar = document.createElement("div");
  scanBar.className = "telemetry-scan-bar";
  scanBar.setAttribute("aria-hidden", "true");

  const message = document.createElement("p");
  message.className = "state-message";
  message.textContent = `Sincronizando telemetría de la temporada ${temporada}`;

  container.append(scanBar, message);
  app.replaceChildren(container);
}

/**
 * Muestra un mensaje de error sobrio y profesional asegurando el escape del contenido.
 * @param {string} mensaje
 */
export function renderError(mensaje) {
  summaryBar.replaceChildren();

  const container = document.createElement("div");
  container.className = "telemetry-state error";

  const badge = document.createElement("div");
  badge.className = "error-badge";
  badge.textContent = "Aviso del sistema";

  const title = document.createElement("h2");
  title.className = "state-title";
  title.textContent = "Interrupción en la recepción de datos";

  const messageP = document.createElement("p");
  messageP.className = "state-message";
  messageP.textContent = String(mensaje);

  container.append(badge, title, messageP);
  app.replaceChildren(container);
}

/**
 * Muestra una franja horizontal compacta con las métricas clave de la temporada.
 * Construido con createElement y textContent para evitar inyección en datos externos.
 * @param {Array} lista Datos filtrados actuales
 * @param {"pilotos"|"constructores"} vista
 * @param {string} temporada
 */
export function renderResumen(lista, vista, temporada) {
  if (!lista || lista.length === 0) {
    summaryBar.replaceChildren();
    return;
  }

  const lider = lista[0];
  const nombreLider =
    vista === "pilotos"
      ? `${lider?.Driver?.givenName ?? ""} ${lider?.Driver?.familyName ?? ""}`.trim()
      : lider?.Constructor?.name ?? "Sin datos";

  const totalVictorias = lista.reduce((acc, item) => acc + Number(item.wins ?? 0), 0);
  const totalPuntos = lista.reduce((acc, item) => acc + Number(item.points ?? 0), 0);

  function crearMetrica(caption, value, isHighlight = false) {
    const box = document.createElement("div");
    box.className = "summary-metric";

    const spanCaption = document.createElement("span");
    spanCaption.className = "metric-caption";
    spanCaption.textContent = caption;

    const strongValue = document.createElement("strong");
    strongValue.className = isHighlight ? "metric-value highlight" : "metric-value";
    strongValue.textContent = value;

    box.append(spanCaption, strongValue);
    return box;
  }

  summaryBar.replaceChildren(
    crearMetrica(`Líder provisional · ${temporada}`, nombreLider, true),
    crearMetrica("Carreras disputadas", `${totalVictorias} Grandes Premios`),
    crearMetrica("Puntos asignados", `${totalPuntos.toLocaleString("es-ES")} pts`),
    crearMetrica("Total clasificados", String(lista.length))
  );
}

/**
 * Renderiza la tabla oficial de clasificación de pilotos de manera segura mediante el DOM API.
 * @param {Array} pilotos
 */
export function renderTablaPilotos(pilotos) {
  if (pilotos.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "telemetry-state empty";

    const msg = document.createElement("p");
    msg.className = "state-message";
    msg.textContent = "No se registran pilotos para el criterio seleccionado.";

    emptyState.append(msg);
    app.replaceChildren(emptyState);
    return;
  }

  const container = document.createElement("div");
  container.className = "timing-board-container";

  const table = document.createElement("table");
  table.className = "f1-timing-table";

  // El encabezado thead contiene únicamente texto estático predefinido
  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th class="col-pos">Pos</th>
      <th class="col-num">N°</th>
      <th class="col-driver">Piloto</th>
      <th class="col-team">Escudería</th>
      <th class="col-nat">Nacionalidad</th>
      <th class="col-wins center">Victorias</th>
      <th class="col-points right">Puntos</th>
    </tr>
  `;

  const tbody = document.createElement("tbody");

  for (const item of pilotos) {
    const { position, points, wins, Driver, Constructors } = item;
    const dadoNombre = Driver?.givenName ?? "";
    const apellido = Driver?.familyName ?? "";
    const codigo = Driver?.code ?? apellido.slice(0, 3).toUpperCase();
    const numero = Driver?.permanentNumber ?? "—";
    const nacionalidad = Driver?.nationality ?? "—";
    const escuderia = Constructors?.[0]?.name ?? "Independiente";

    const posNum = Number(position);
    const podioClase = posNum <= 3 ? `podium-rank p-${posNum}` : "standard-rank";

    const tr = document.createElement("tr");
    tr.className = "driver-row";

    // 1. Columna Posición
    const tdPos = document.createElement("td");
    tdPos.className = "col-pos";
    const spanPos = document.createElement("span");
    spanPos.className = `pos-indicator ${podioClase}`;
    spanPos.textContent = position ?? "";
    tdPos.append(spanPos);

    // 2. Columna Número de dorsal
    const tdNum = document.createElement("td");
    tdNum.className = "col-num";
    const spanNum = document.createElement("span");
    spanNum.className = "racing-num";
    spanNum.textContent = numero;
    tdNum.append(spanNum);

    // 3. Columna Piloto (Código + Nombre y Apellido resaltado)
    const tdDriver = document.createElement("td");
    tdDriver.className = "col-driver";
    const driverMeta = document.createElement("div");
    driverMeta.className = "driver-meta";

    const spanCode = document.createElement("span");
    spanCode.className = "driver-code";
    spanCode.textContent = codigo;

    const spanFullName = document.createElement("span");
    spanFullName.className = "driver-fullname";
    spanFullName.textContent = dadoNombre ? `${dadoNombre} ` : "";

    const strongApellido = document.createElement("strong");
    strongApellido.textContent = apellido;

    spanFullName.append(strongApellido);
    driverMeta.append(spanCode, spanFullName);
    tdDriver.append(driverMeta);

    // 4. Columna Escudería
    const tdTeam = document.createElement("td");
    tdTeam.className = "col-team";
    const spanTeam = document.createElement("span");
    spanTeam.className = "team-tag";
    spanTeam.textContent = escuderia;
    tdTeam.append(spanTeam);

    // 5. Columna Nacionalidad
    const tdNat = document.createElement("td");
    tdNat.className = "col-nat";
    const spanNat = document.createElement("span");
    spanNat.className = "nationality-text";
    spanNat.textContent = nacionalidad;
    tdNat.append(spanNat);

    // 6. Columna Victorias
    const tdWins = document.createElement("td");
    tdWins.className = "col-wins center";
    const spanWins = document.createElement("span");
    spanWins.className = `metric-figure ${Number(wins) > 0 ? "has-wins" : ""}`;
    spanWins.textContent = wins ?? "0";
    tdWins.append(spanWins);

    // 7. Columna Puntos
    const tdPoints = document.createElement("td");
    tdPoints.className = "col-points right";
    const spanPoints = document.createElement("span");
    spanPoints.className = "points-figure";
    spanPoints.textContent = points ?? "0";
    tdPoints.append(spanPoints);

    tr.append(tdPos, tdNum, tdDriver, tdTeam, tdNat, tdWins, tdPoints);
    tbody.append(tr);
  }

  table.append(thead, tbody);
  container.append(table);
  app.replaceChildren(container);
}

/**
 * Renderiza la tabla oficial de clasificación de constructores de manera segura.
 * @param {Array} constructores
 */
export function renderTablaConstructores(constructores) {
  if (constructores.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "telemetry-state empty";

    const msg = document.createElement("p");
    msg.className = "state-message";
    msg.textContent =
      "No hay registros de constructores disponibles para este año (el Mundial de Constructores se inició en 1958).";

    emptyState.append(msg);
    app.replaceChildren(emptyState);
    return;
  }

  const container = document.createElement("div");
  container.className = "timing-board-container";

  const table = document.createElement("table");
  table.className = "f1-timing-table";

  // El encabezado thead contiene únicamente texto estático predefinido
  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th class="col-pos">Pos</th>
      <th class="col-team-name">Constructor / Escudería</th>
      <th class="col-nat">Sede</th>
      <th class="col-wins center">Victorias</th>
      <th class="col-points right">Puntos</th>
    </tr>
  `;

  const tbody = document.createElement("tbody");

  for (const item of constructores) {
    const { position, points, wins, Constructor } = item;
    const nombre = Constructor?.name ?? "Desconocido";
    const nacionalidad = Constructor?.nationality ?? "—";
    const posNum = Number(position);
    const podioClase = posNum <= 3 ? `podium-rank p-${posNum}` : "standard-rank";

    const tr = document.createElement("tr");
    tr.className = "constructor-row";

    // 1. Columna Posición
    const tdPos = document.createElement("td");
    tdPos.className = "col-pos";
    const spanPos = document.createElement("span");
    spanPos.className = `pos-indicator ${podioClase}`;
    spanPos.textContent = position ?? "";
    tdPos.append(spanPos);

    // 2. Columna Nombre de Escudería / Constructor
    const tdTeam = document.createElement("td");
    tdTeam.className = "col-team-name";
    const strongName = document.createElement("strong");
    strongName.className = "constructor-name";
    strongName.textContent = nombre;
    tdTeam.append(strongName);

    // 3. Columna Nacionalidad / Sede
    const tdNat = document.createElement("td");
    tdNat.className = "col-nat";
    const spanNat = document.createElement("span");
    spanNat.className = "nationality-text";
    spanNat.textContent = nacionalidad;
    tdNat.append(spanNat);

    // 4. Columna Victorias
    const tdWins = document.createElement("td");
    tdWins.className = "col-wins center";
    const spanWins = document.createElement("span");
    spanWins.className = `metric-figure ${Number(wins) > 0 ? "has-wins" : ""}`;
    spanWins.textContent = wins ?? "0";
    tdWins.append(spanWins);

    // 5. Columna Puntos
    const tdPoints = document.createElement("td");
    tdPoints.className = "col-points right";
    const spanPoints = document.createElement("span");
    spanPoints.className = "points-figure";
    spanPoints.textContent = points ?? "0";
    tdPoints.append(spanPoints);

    tr.append(tdPos, tdTeam, tdNat, tdWins, tdPoints);
    tbody.append(tr);
  }

  table.append(thead, tbody);
  container.append(table);
  app.replaceChildren(container);
}