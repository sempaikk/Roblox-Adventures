import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// 🔧 Configuração Supabase
const SUPABASE_URL = "https://dwpytvfngsaxrupvirje.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3cHl0dmZuZ3NheHJ1cHZpcmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTY2MzYsImV4cCI6MjA3NjE5MjYzNn0.49bLB1f29SuTvO5-D1Jzn3fluu2McZuKDL8oT10CeOU";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 🧱 Elementos do DOM
const gamesContainer = document.getElementById("grid");
const modal = document.getElementById("modalBackdrop");
const modalTitle = document.getElementById("modalTitle");
const mediaGrid = document.getElementById("mediaGrid");
const modalClose = document.getElementById("modalClose");
const searchInput = document.querySelector(".search input");
const searchButton = document.querySelector(".search button");
const filterButtons = document.querySelectorAll(".filters button");
const themeBtn = document.getElementById("themeBtn");
const imageViewer = document.getElementById("imageViewer");
const viewerImg = document.getElementById("viewerImg");
const closeImageBtn = document.getElementById("closeImage");

// 🎥 Converter links do YouTube
function convertYouTube(url) {
  try {
    if (url.includes("embed/")) return url;
    let id = "";
    if (url.includes("watch?v=")) id = url.split("watch?v=")[1].split("&")[0];
    else if (url.includes("youtu.be/")) id = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  } catch {
    return url;
  }
}

// 🌀 Função de loading spinner
function showLoading() {
  gamesContainer.innerHTML = `
    <div style="display:flex;justify-content:center;align-items:center;height:60vh;">
      <div class="spinner"></div>
    </div>
  `;
}
function hideLoading() {
  const spinner = document.querySelector(".spinner");
  if (spinner) spinner.parentElement.remove();
}

// 🚀 Carregar jogos + recursos
async function loadGames(filter = "all", search = "") {
  showLoading();

  let query = supabase.from("games").select("*, resources(*)").order("title", { ascending: true });

  if (search.trim() !== "") {
    query = query.ilike("title", `%${search.trim()}%`);
  }

  const { data: games, error } = await query;

  if (error) {
    console.error("Erro ao carregar jogos:", error);
    gamesContainer.innerHTML = "<p style='text-align:center;'>Erro ao carregar jogos.</p>";
    return;
  }

  let filteredGames = games;
  if (filter === "video") {
    filteredGames = games.filter(g => g.resources?.some(r => r.type === "youtube"));
  } else if (filter === "image") {
    filteredGames = games.filter(g => g.resources?.some(r => r.type === "image"));
  } else if (filter === "none") {
    filteredGames = games.filter(g => !g.resources || g.resources.length === 0);
  }

  renderGames(filteredGames);
}

// 🎨 Renderizar cards
function renderGames(games) {
  if (!games || games.length === 0) {
    gamesContainer.innerHTML = "<p style='text-align:center;'>Nenhum jogo encontrado.</p>";
    return;
  }

  gamesContainer.innerHTML = "";
  games.forEach((game) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const thumb = game.thumb
      ? `<div class="thumb"><img src="${game.thumb}" alt="${game.title}"></div>`
      : `<div class="thumb"><div style='background:#222;width:100%;height:180px;display:flex;align-items:center;justify-content:center;'>Sem imagem</div></div>`;

    card.innerHTML = `
      ${thumb}
      <div class="card-body">
        <h3>${game.title}</h3>
        <p>${game.desc || ""}</p>
      </div>
    `;

    // 👉 Agora abre a página game.html?id=...
    card.addEventListener("click", () => {
      window.location.href = `game.html?id=${encodeURIComponent(game.id)}`;
    });

    gamesContainer.appendChild(card);
  });
}

// 🔍 Buscar
searchButton.addEventListener("click", () => loadGames(getActiveFilter(), searchInput.value));
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") loadGames(getActiveFilter(), searchInput.value);
});

// 🎮 Filtros
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    loadGames(btn.dataset.filter, searchInput.value);
  });
});
function getActiveFilter() {
  const active = document.querySelector(".filters button.active");
  return active ? active.dataset.filter : "all";
}

// 🌗 Tema (com salvamento)
function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "light") root.classList.add("light");
  else root.classList.remove("light");
}
function toggleTheme() {
  const root = document.documentElement;
  const current = root.classList.contains("light") ? "light" : "dark";
  const next = current === "light" ? "dark" : "light";
  applyTheme(next);
  localStorage.setItem("theme", next);
}
themeBtn.addEventListener("click", toggleTheme);

// Carregar tema salvo
const savedTheme = localStorage.getItem("theme") || "dark";
applyTheme(savedTheme);

// 🖼️ Visualizador de imagem (para quando quiser usar novamente)
function openImageViewer(src) {
  viewerImg.src = src;
  imageViewer.style.display = "flex";
}
function closeImageViewer() {
  imageViewer.style.display = "none";
  viewerImg.src = "";
}

// Eventos de fechamento
if (closeImageBtn) closeImageBtn.addEventListener("click", closeImageViewer);
if (imageViewer) {
  imageViewer.addEventListener("click", (e) => {
    if (e.target === imageViewer) closeImageViewer();
  });
}
window.addEventListener("keyup", (e) => {
  if (e.key === "Escape") closeImageViewer();
});

// 🚀 Iniciar
loadGames();
