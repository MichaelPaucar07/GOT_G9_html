// Configuración base de la API
const API = "https://thronesapi.com/api/v2";

// Utilidades de DOM
const $ = (s, c = document) => c.querySelector(s);
const list = $("#list");
const detail = $("#detail");
const search = $("#search");
const statusEl = $("#status");

let data = [];        // todos los personajes
let filtered = [];    // filtrados por búsqueda

function setStatus(msg) { statusEl.textContent = msg || ""; }

// 1) Traer lista de personajes
async function loadCharacters() {
  setStatus("Cargando...");
  try {
    const res = await fetch(`${API}/Characters`);
    if (!res.ok) throw new Error("HTTP " + res.status);
    data = await res.json();
    filtered = data;
    renderList(filtered);
    setStatus(`${filtered.length} personajes`);
  } catch (e) {
    console.error(e);
    setStatus("Error al cargar");
    list.innerHTML = `<li>Error al cargar personajes.</li>`;
  }
}

// 2) Pintar tarjetas
function renderList(items) {
  list.innerHTML = items.map(ch => `
    <li class="card" data-id="${ch.id}">
      <img src="${ch.imageUrl}" alt="${ch.fullName}">
      <div class="meta">
        <div><strong>${ch.fullName}</strong></div>
        <div>${ch.family || ""}</div>
      </div>
    </li>
  `).join("");

  // click → detalle
  list.querySelectorAll(".card").forEach(li => {
    li.addEventListener("click", () => showDetail(li.dataset.id));
  });
}

// 3) Detalle por id
async function showDetail(id) {
  setStatus("Cargando detalle...");
  try {
    const res = await fetch(`${API}/Characters/${id}`);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const ch = await res.json();
    detail.innerHTML = `
      <img src="${ch.imageUrl}" alt="${ch.fullName}">
      <h2>${ch.fullName}</h2>
      <p><strong>Familia:</strong> ${ch.family || "—"}</p>
      <p><strong>Título:</strong> ${ch.title || "—"}</p>
      <p><strong>ID:</strong> ${ch.id}</p>
    `;
    setStatus(`${filtered.length} personajes`);
    if (window.innerWidth < 900) detail.scrollIntoView({behavior:"smooth"});
  } catch (e) {
    console.error(e);
    detail.textContent = "No se pudo cargar el detalle.";
    setStatus("Error");
  }
}

// 4) Búsqueda simple
search.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase().trim();
  filtered = !q ? data : data.filter(ch =>
    (ch.fullName || "").toLowerCase().includes(q) ||
    (ch.family || "").toLowerCase().includes(q)
  );
  renderList(filtered);
  detail.innerHTML = "";
  setStatus(`${filtered.length} personajes`);
});

// Inicio
loadCharacters();
