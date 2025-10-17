import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// 🔧 Configuração Supabase
const SUPABASE_URL = "https://dwpytvfngsaxrupvirje.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3cHl0dmZuZ3NheHJ1cHZpcmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTY2MzYsImV4cCI6MjA3NjE5MjYzNn0.49bLB1f29SuTvO5-D1Jzn3fluu2McZuKDL8oT10CeOU";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 🧱 Corrigido: usar o ID existente do HTML
const gamesContainer = document.getElementById("grid");
const modal = document.getElementById("modalBackdrop");
const modalTitle = document.getElementById("modalTitle");
const mediaGrid = document.getElementById("mediaGrid");
const modalClose = document.getElementById("modalClose");

// 🎥 Função para converter links do YouTube
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

// 🚀 Carregar jogos
async function loadGames() {
  gamesContainer.innerHTML = "<p style='text-align:center;'>Carregando jogos...</p>";

  const { data: games, error } = await supabase
    .from("games")
    .select("*")
    .order("title", { ascending: true });

  if (error) {
    console.error("Erro ao carregar jogos:", error);
    gamesContainer.innerHTML = "<p style='text-align:center;'>Erro ao carregar jogos.</p>";
    return;
  }

  if (!games || games.length === 0) {
    gamesContainer.innerHTML = "<p style='text-align:center;'>Nenhum jogo encontrado.</p>";
    return;
  }

  for (const game of games) {
    const { data: resources, error: resError } = await supabase
      .from("resources")
      .select("*")
      .eq("game_id", game.id);

    if (resError) {
      console.error("Erro ao carregar recursos:", resError);
      continue;
    }

    game.resources = resources || [];
  }

  renderGames(games);
}

// 🎨 Renderizar jogos na tela
function renderGames(games) {
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

    card.addEventListener("click", () => openGameModal(game));
    gamesContainer.appendChild(card);
  });
}

// 🪟 Abrir modal com recursos
function openGameModal(game) {
  modalTitle.textContent = game.title;
  mediaGrid.innerHTML = "";

  if (!game.resources || game.resources.length === 0) {
    mediaGrid.innerHTML = "<p style='text-align:center;'>Sem recursos disponíveis para este jogo.</p>";
  } else {
    game.resources.forEach((r) => {
      const card = document.createElement("div");
      card.classList.add("media-card");

      if (r.type === "youtube") {
        const embed = convertYouTube(r.src);
        card.innerHTML = `
          <div class="responsive-video">
            <iframe src="${embed}" frameborder="0" allowfullscreen></iframe>
          </div>`;
      } else if (r.type === "image") {
        card.innerHTML = `<img src="${r.src}" alt="Imagem do recurso">`;
      } else {
        card.innerHTML = `<a href="${r.src}" target="_blank">${r.src}</a>`;
      }

      mediaGrid.appendChild(card);
    });
  }

  modal.classList.add("show");
}

// Fechar modal
modalClose.addEventListener("click", () => modal.classList.remove("show"));
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.remove("show");
});

// Iniciar
loadGames();
