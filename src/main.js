// Ponto de entrada da aplicação.
// Bootstrap é importado via npm (sem CDN), tanto o CSS quanto o bundle de JS.
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './style.css';
import { loadSprites } from './sprites.js';
import { Game } from './game.js';
import {
  getRanking,
  getPlayerName,
  setPlayerName,
  addScore,
  clearRanking,
  getHighScore,
  renderRanking
} from './leaderboard.js';

const canvas = document.getElementById('game-canvas');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayText = document.getElementById('overlay-text');
const startBtn = document.getElementById('start-btn');
const scoreBadge = document.getElementById('score-badge');
const highscoreBadge = document.getElementById('highscore-badge');
const speedIndicator = document.getElementById('speed-indicator');
const livesWrapper = document.getElementById('lives-wrapper');
const btnJump = document.getElementById('btn-jump');
const btnSpin = document.getElementById('btn-spin');
const nameForm = document.getElementById('name-form');
const nameInput = document.getElementById('player-name');
const leaderboardList = document.getElementById('leaderboard-list');
const clearRankingBtn = document.getElementById('clear-ranking-btn');

nameInput.value = getPlayerName();
highscoreBadge.textContent = getHighScore();
renderRanking(leaderboardList);

function updateLives(lives) {
  const icons = livesWrapper.querySelectorAll('.life-icon');
  icons.forEach((icon, index) => {
    icon.classList.toggle('spent', index >= lives);
  });
}

function showOverlay(title, text, buttonLabel) {
  overlayTitle.textContent = title;
  overlayText.textContent = text;
  startBtn.textContent = buttonLabel;
  overlay.classList.remove('d-none');
}

function hideOverlay() {
  overlay.classList.add('d-none');
}

let game;

async function init() {
  const sprites = await loadSprites();

  game = new Game(canvas, sprites, {
    onScore: (score) => {
      scoreBadge.textContent = score;
    },
    onLives: (lives) => {
      updateLives(lives);
    },
    onSpeed: (multiplier) => {
      speedIndicator.textContent = `Velocidade: ${multiplier.toFixed(1)}x`;
    },
    onGameOver: (finalScore) => {
      const name = nameInput.value.trim() || getPlayerName() || 'Aventureiro';
      addScore(name, finalScore);
      renderRanking(leaderboardList);
      highscoreBadge.textContent = getHighScore();

      showOverlay(
        'Fim de corrida!',
        `Você fez ${finalScore} pontos. Toque para tentar superar seu recorde.`,
        'Jogar novamente'
      );
    }
  });

  updateLives(3);
}

startBtn.addEventListener('click', () => {
  hideOverlay();
  game.start();
});

btnJump.addEventListener('click', () => game?.jump());
btnSpin.addEventListener('click', () => game?.spin());

canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  game?.jump();
});

nameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  if (!name) return;
  setPlayerName(name);
  nameForm.classList.add('was-validated');
});

clearRankingBtn.addEventListener('click', () => {
  clearRanking();
  renderRanking(leaderboardList);
  highscoreBadge.textContent = 0;
});

init();
