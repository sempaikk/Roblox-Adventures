import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// 🔧 Configuração Supabase
const SUPABASE_URL = "https://dwpytvfngsaxrupvirje.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3cHl0dmZuZ3NheHJ1cHZpcmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTY2MzYsImV4cCI6MjA3NjE5MjYzNn0.49bLB1f29SuTvO5-D1Jzn3fluu2McZuKDL8oT10CeOU";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const gamesContainer = document.getElementById("grid");
const searchInput = document.querySelector(".search input");
const searchButton = document.querySelector(".search button");
const filterButtons = document.querySelectorAll(".filters button");

// Funções utilitárias
function showLoading() {
  gamesContainer.innerHTML = `
    <div style="display:flex;justify-content:center;align-items:center;height:60vh;">
      <div class="spinner"></div>
    </div>`;
}
function hideLoading() {
  const spinner = document.querySelector(".spinner");
  if (spinner) spinner.parentElement.remove();
}

async function loadGames(filter = "all", search = "") {
  showLoading();
  let query = supabase.from("games").select("*, resources(*)").order("title", { ascending: true });
  if (search.trim() !== "") query = query.ilike("title", `%${search.trim()}%`);
  const { data: games, error } = await query;

  if (error) {
    gamesContainer.innerHTML = "<p style='text-align:center;'>Erro ao carregar jogos.</p>";
    return;
  }

  let filtered = games;
  if (filter === "video") filtered = games.filter(g => g.resources?.some(r => r.type === "youtube"));
  else if (filter === "image") filtered = games.filter(g => g.resources?.some(r => r.type === "image"));
  else if (filter === "none") filtered = games.filter(g => !g.resources || g.resources.length === 0);
  renderGames(filtered);
}

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
    card.innerHTML = `${thumb}<div class="card-body"><h3>${game.title}</h3><p>${game.desc || ""}</p></div>`;
    card.addEventListener("click", () => (window.location.href = `game.html?id=${encodeURIComponent(game.id)}`));
    gamesContainer.appendChild(card);
  });
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    loadGames(btn.dataset.filter, searchInput.value);
  });
});
searchButton.addEventListener("click", () => loadGames(getFilter(), searchInput.value));
searchInput.addEventListener("keyup", (e) => e.key === "Enter" && loadGames(getFilter(), searchInput.value));
function getFilter() {
  const active = document.querySelector(".filters button.active");
  return active ? active.dataset.filter : "all";
}
loadGames();
