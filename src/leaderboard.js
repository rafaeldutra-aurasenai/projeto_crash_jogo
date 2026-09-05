const STORAGE_KEY = 'dashi-ilha-fruta:ranking';
const NAME_KEY = 'dashi-ilha-fruta:player-name';
const MAX_ENTRIES = 8;

export function getRanking() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getPlayerName() {
  return localStorage.getItem(NAME_KEY) || '';
}

export function setPlayerName(name) {
  localStorage.setItem(NAME_KEY, name);
}

export function addScore(name, score) {
  const ranking = getRanking();
  ranking.push({ name: name || 'Aventureiro', score, date: new Date().toISOString() });
  ranking.sort((a, b) => b.score - a.score);
  const trimmed = ranking.slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  return trimmed;
}

export function clearRanking() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getHighScore() {
  const ranking = getRanking();
  return ranking.length ? ranking[0].score : 0;
}

export function renderRanking(listEl) {
  const ranking = getRanking();
  listEl.innerHTML = '';

  if (!ranking.length) {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-start text-muted small';
    li.textContent = 'Nenhum recorde ainda — seja o primeiro!';
    listEl.appendChild(li);
    return;
  }

  ranking.forEach((entry) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-start small';
    li.innerHTML = `
      <span>${escapeHtml(entry.name)}</span>
      <span class="badge bg-teal-deep rounded-pill">${entry.score}</span>
    `;
    listEl.appendChild(li);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
