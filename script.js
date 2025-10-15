document.addEventListener('DOMContentLoaded', () => {

(function applySavedTheme() {
  try {
    const theme = localStorage.getItem('theme');
    if (theme === 'light') document.body.classList.add('light');
  } catch (e) {}
})();

const themeBtn = document.getElementById('themeBtn');
themeBtn.addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  themeBtn.textContent = isLight ? '🌞' : '🌙';
});
themeBtn.textContent = document.body.classList.contains('light') ? '🌞' : '🌙';

const goalBoundResources = [
  { type: 'youtube', src: 'https://www.youtube.com/embed/14FTMQ_fsbc', date: '2025-10-14', isNew: true },
  { type: 'youtube', src: 'https://www.youtube.com/embed/WnWG-N0cvGM', date: '2024-10-10', isNew: false }
];


  const animeVanguardsResources = [
  { type: 'image', src: 'https://raw.githubusercontent.com/sempaikk/av-trade/refs/heads/main/image.png', date: '2025-10-14', isNew: true }
];

// Detecta automaticamente o mais recente
  const latest = goalBoundResources
    .filter(r => r.type === 'video' || r.type === 'youtube')
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    
  if (latest) {
    goalBoundResources.forEach(r => {
    if (r.src === latest.src) r.isNew = true;
  });
  }


const data = [
  { id: "memeDefense", type: "none", title: "Meme Defense — Sneaks Oficiais", thumb: "https://tr.rbxcdn.com/180DAY-8c0c817a358715708c2860a14f8290a1/768/432/Image/Webp/noFilter", desc: "Nenhum conteúdo disponível no momento." },
  { id: "animeVanguards", type: "image", isNew: true, isNew: true, title: "Anime Vanguards — Sneaks Oficiais", thumb: "https://tr.rbxcdn.com/180DAY-7e12df7f63f9ce7a6d10d51004b0e673/768/432/Image/Webp/noFilter", desc: "Nova imagem exclusiva dos sneaks!" },
  { id: "goalbound", type: "video", isNew: true, isNew: true, title: "GoalBound — Sneaks Oficiais", thumb: "https://tr.rbxcdn.com/180DAY-5ff411f158104aab50bc1c25493028be/768/432/Image/Webp/noFilter", desc: "Sneaks e vazamentos exclusivos direto do campo!" }
];

// Marca cards com novidades automáticas
data.forEach(game => {
  const hasNew =
    (game.id === "goalbound" && goalBoundResources.some(r => r.isNew)) ||
    (game.id === "animeVanguards" && animeVanguardsResources.some(r => r.isNew));
  if (hasNew) game.isNew = true;
});



const grid = document.getElementById('grid');
const notFound = document.getElementById('notFound');
const modalBackdrop = document.getElementById('modalBackdrop');
const mediaGrid = document.getElementById('mediaGrid');
const modalClose = document.getElementById('modalClose');
const searchInput = document.getElementById('search');
const suggestionsBox = document.getElementById('suggestions');


function render(filter = 'all', query = '') {
  const existingCards = Array.from(grid.children);
  const q = query.toLowerCase().trim();

  
const results = data.filter(d => {
    if (filter === 'all') return true;
    if (filter === 'video' && (d.type === 'video' || d.type === 'both')) return true;
    if (filter === 'image' && (d.type === 'image' || d.type === 'both')) return true;
    if (filter === 'none' && (!d.type || d.type === 'none')) return true;
    return false;
  }).filter(d => d.title.toLowerCase().includes(q) || d.desc.toLowerCase().includes(q));

  // Fade out dos cards antigos
  existingCards.forEach(card => {
    card.style.animation = 'fadeOut 0.25s forwards';
  });

  setTimeout(() => {
    grid.innerHTML = '';
    if (results.length === 0) {
      notFound.style.display = 'block';
      return;
    }
    notFound.style.display = 'none';

    
results.forEach((d, index) => {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="thumb"><img src="${d.thumb}" alt="${d.title}"></div>
    <div class="card-body"><h3>${d.title}</h3><p>${d.desc}</p></div>`;
  card.addEventListener('click', () => { if (d.id === 'goalbound') openGoalBoundModal(); if (d.id === 'animeVanguards') openAnimeVanguardsModal(); });

  
if (d.isNew) card.classList.add("new");

  // Adiciona atraso escalonado
  card.style.animationDelay = (index * 100) + 'ms';
  grid.appendChild(card);
});
}, 200);

}
render();


document.querySelectorAll('.filters button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render(btn.dataset.filter, searchInput.value);
  });
});

document.getElementById('searchBtn').addEventListener('click', () => {
  render(document.querySelector('.filters button.active').dataset.filter, searchInput.value);
});


searchInput.addEventListener('keyup', e => {
  const val = e.target.value.toLowerCase().trim();

  // Atualiza sugestões
  if (val) {
    const matches = data.filter(d => d.title.toLowerCase().includes(val));
    suggestionsBox.innerHTML = matches.map(m => `<div class="suggestion-item">${m.title}</div>`).join('');
    suggestionsBox.classList.toggle('show', matches.length > 0);
  } else {
    suggestionsBox.classList.remove('show');
  }

  // Filtra em tempo real com animação suave
  grid.querySelectorAll('.card').forEach(card => {
    card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
  });

  render(document.querySelector('.filters button.active').dataset.filter, val);
});
suggestionsBox.addEventListener('click', e => {
  if (e.target.classList.contains('suggestion-item')) {
    searchInput.value = e.target.textContent;
    suggestionsBox.classList.remove('show');
    render(document.querySelector('.filters button.active').dataset.filter, searchInput.value);
  }
});


function openGoalBoundModal() {
  mediaGrid.innerHTML = '';
  goalBoundResources.forEach(r => {
    const el = document.createElement('div');
    el.className = 'media-card';
    if (r.isNew && (r.type === "video" || r.type === "youtube")) el.classList.add("new");

    if (r.type === 'youtube') {
  const wrapper = document.createElement('div');
  wrapper.className = 'responsive-video';
  const iframe = document.createElement('iframe');
  iframe.src = r.src;
  iframe.frameBorder = '0';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  wrapper.appendChild(iframe);
  el.appendChild(wrapper);
} else if (r.type === 'video') {
      const v = document.createElement('video');
      v.controls = true;
      v.src = r.src;
      el.appendChild(v);
    } else if (r.type === 'image') {
      const i = document.createElement('img');
      i.src = r.src;
      i.onclick = () => openImageViewer(i.src);
      el.appendChild(i);
    }
    mediaGrid.appendChild(el);
  });
  modalBackdrop.classList.add('show');
}


function openAnimeVanguardsModal() {
  mediaGrid.innerHTML = '';
  animeVanguardsResources.forEach(r => {
    const el = document.createElement('div');
    el.className = 'media-card';
    if (r.isNew && (r.type === "video" || r.type === "youtube")) el.classList.add("new");

    if (r.type === 'image') {
      const i = document.createElement('img');
      i.src = r.src;
      i.onclick = () => openImageViewer(i.src);
      el.appendChild(i);
    }
    mediaGrid.appendChild(el);
  });
  document.querySelector('.modal-header h2').textContent = "Anime Vanguards — Sneaks Oficiais";
  modalBackdrop.classList.add('show');
}


modalClose.onclick = () => {
  // pausa/remova iframes para evitar vídeos tocando em segundo plano
  mediaGrid.querySelectorAll('iframe').forEach(iframe => {
    iframe.src = '';
  });
  modalBackdrop.classList.remove('show');
  // restaura título padrão
  document.querySelector('.modal-header h2').textContent = "GoalBound — Sneaks Oficiais";
};


function openImageViewer(src) {
  document.getElementById('viewerImg').src = src;
  document.getElementById('imageViewer').classList.add('show');
}
document.getElementById('closeImage').onclick = () => {
  document.getElementById('imageViewer').classList.remove('show');
};


// Corrigido: remove selos apenas após 00:00 real do próximo dia
(function() {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const savedDay = localStorage.getItem('lastNewDay');

  // Só remove se for um novo dia real após 00:00
  if (savedDay && savedDay !== today) {
    document.querySelectorAll('.card.new').forEach(el => el.classList.remove('new'));
  }
  localStorage.setItem('lastNewDay', today);
})();

(function() {
  const today = new Date().toISOString().split('T')[0];
  const savedDay = localStorage.getItem('lastNewDay');
  if (savedDay !== today) {
    localStorage.setItem('lastNewDay', today);
    // Limpa as flags antigas
    document.querySelectorAll('.card.new').forEach(el => el.classList.remove('new'));
  }
})();


// === Sistema automático de novidade baseado em datas ===
// Detecta conteúdos adicionados hoje ou nas últimas 24 horas
(function autoDetectNewness() {
  const now = new Date();
  const cutoff = new Date(now.getTime() - (24 * 60 * 60 * 1000)); // 24h atrás
  const todayStr = now.toISOString().split('T')[0];

  const resourceMap = {
    goalbound: typeof goalBoundResources !== 'undefined' ? goalBoundResources : [],
    animeVanguards: typeof animeVanguardsResources !== 'undefined' ? animeVanguardsResources : []
  };

  // Para cada jogo em `data`, verifica seus resources se existirem
  if (typeof data !== 'undefined') {
    data.forEach(game => {
      const resList = resourceMap[game.id] || [];
      let foundNew = false;
      resList.forEach(r => {
        if (!r || !r.date) return;
        const rDate = new Date(r.date + 'T00:00:00');
        if (r.date === todayStr || rDate >= cutoff) {
          r.isNew = true;
          foundNew = true;
        }
      });
      if (foundNew) game.isNew = true;
    });
  }
})();
// === fim do sistema automático ===


}); // end DOMContentLoaded