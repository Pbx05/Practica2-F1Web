const app = document.querySelector("#app");

export function renderCargando() {
  app.innerHTML = `<p class="estado cargando">Cargando datos de pilotos</p>`;
}

export function renderError(mensaje) {
  app.innerHTML = `
    <div class="estado error">
      <p>Error al obtener la información: ${mensaje}</p>
    </div>
  `;
}

export function renderPilotos(listaPilotos) {
  if (listaPilotos.length === 0) {
    app.innerHTML = `<p class="estado vacio">No hay resultados que coincidan.</p>`;
    return;
  }

  const itemsHtml = listaPilotos
    .map((piloto) => {
      const { givenName, familyName, nationality, dateOfBirth, permanentNumber } = piloto;
      const numero = permanentNumber ?? "S/N";

      return `
        <article class="card">
          <header class="card-header">
            <h2>${givenName} ${familyName}</h2>
            <span class="badge">#${numero}</span>
          </header>
          <div class="card-body">
            <p><strong>Nacionalidad:</strong> ${nationality}</p>
            <p><strong>Nacimiento:</strong> ${dateOfBirth}</p>
          </div>
        </article>
      `;
    })
    .join("");

  app.innerHTML = `<section class="grid">${itemsHtml}</section>`;
}