// ../js/personajes.js
const API = "https://thronesapi.com/api/v2";

const $ = (s, c = document) => c.querySelector(s);
const list    = $("#list");
const detail  = $("#detail");
const search  = $("#search");
const statusEl= $("#status");

let data = [];
let filtered = [];

const setStatus = (msg="") => statusEl && (statusEl.textContent = msg);

window.addEventListener("DOMContentLoaded", () => {
  bindSearch();
  loadCharacters();
});

async function loadCharacters() {
  setStatus("Cargando...");
  try {
    const res = await fetch(`${API}/Characters`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
    data.sort((a, b) => a.id - b.id);
    filtered = data;
    renderList(filtered);
    setStatus(`${filtered.length} personajes`);
  } catch (err) {
    console.error(err);
    setStatus("Error al cargar");
    list.innerHTML = `<li class="card" style="grid-column:1/-1;padding:16px;">Error al cargar personajes.</li>`;
  }
}

function renderList(items) {
  if (!items.length) {
    list.innerHTML = `<li class="card" style="grid-column:1/-1;padding:16px;">Sin resultados</li>`;
    return;
  }

  list.innerHTML = items.map(ch => `
    <li class="card" data-id="${ch.id}">
      <img src="${ch.imageUrl}" alt="${ch.fullName}" loading="lazy">

      <div class="meta">
        
        <h3 class="name">${ch.fullName}</h3>
        <div class="id-tag">#${ch.id}</div>
        <div class="row">
        <b>Familia:</b>
          <span class="family-badge">🛡️ ${ch.family || "Sin familia"}</span>
        </div>
        <div class="row">
          <b>Título:</b>
          <span class="pill ellipsis">${ch.title || "—"}</span>
        </div>
        
      </div>
    </li>
  `).join("");
}

function bindSearch() {
  search.addEventListener("input", () => {
    const q = search.value.toLowerCase().trim();
    filtered = !q ? data : data.filter(ch =>
      (ch.fullName || "").toLowerCase().includes(q) ||
      (ch.family || "").toLowerCase().includes(q) ||
      (ch.title || "").toLowerCase().includes(q)
    );
    renderList(filtered);
    detail.innerHTML = "";
    setStatus(`${filtered.length} personajes`);
  });
}
