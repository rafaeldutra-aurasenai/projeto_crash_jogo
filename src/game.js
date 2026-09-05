const GROUND_Y = 300;
const GRAVITY = 0.62;
const JUMP_FORCE = -12.6;
const PLAYER_X = 90;
const PLAYER_SIZE = 56;
const BASE_SPEED = 4.4;
const SPAWN_MIN = 70;
const SPAWN_MAX = 130;

// Configurações da animação do personagem (Sprite Sheet com 13 frames)
const HERO_TOTAL_FRAMES = 13;
const HERO_FRAME_SPEED = 4; // Menor valor = animação mais rápida

export class Game {
  constructor(canvas, sprites, callbacks = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.sprites = sprites;
    this.callbacks = callbacks;
    this.width = canvas.width;
    this.height = canvas.height;

    this.bgOffset = 0;
    this.frame = 0;

    this.reset();
    this._bindInput();
  }

  reset() {
    this.running = false;
    this.gameOver = false;
    this.score = 0;
    this.lives = 3;
    this.speed = BASE_SPEED;
    this.spawnTimer = 60;
    this.obstacles = [];
    this.invulnerableFrames = 0;

    this.player = {
      y: GROUND_Y - PLAYER_SIZE,
      vy: 0,
      onGround: true,
      spinning: false,
      spinTimer: 0
    };

    this._emitScore();
    this._emitLives();
    this._emitSpeed();
  }

  start() {
    this.reset();
    this.running = true;
    this.gameOver = false;
    if (!this._loopStarted) {
      this._loopStarted = true;
      requestAnimationFrame((t) => this._loop(t));
    }
  }

  stop() {
    this.running = false;
  }

  jump() {
    if (!this.running) return;
    if (this.player.onGround) {
      this.player.vy = JUMP_FORCE;
      this.player.onGround = false;
    }
  }

  spin() {
    if (!this.running) return;
    this.player.spinning = true;
    this.player.spinTimer = 22;
  }

  _bindInput() {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        this.jump();
      }
      if (e.code === 'ArrowDown') {
        e.preventDefault();
        this.spin();
      }
    });
  }

  _spawnObstacle() {
    const roll = Math.random();
    let type = 'fruit';
    if (roll < 0.32) type = 'crate';
    else if (roll < 0.5) type = 'boulder';

    const size = type === 'boulder' ? 46 : type === 'crate' ? 42 : 30;
    const flying = type === 'fruit' && Math.random() < 0.5;

    this.obstacles.push({
      type,
      x: this.width + 20,
      y: flying ? GROUND_Y - PLAYER_SIZE - 40 : GROUND_Y - size,
      size,
      broken: false,
      collected: false
    });

    this.spawnTimer = (SPAWN_MIN + Math.random() * (SPAWN_MAX - SPAWN_MIN)) / (this.speed / BASE_SPEED);
  }

  _update() {
    this.frame++;
    this.speed = BASE_SPEED + Math.min(this.frame / 900, 3.5);
    this._emitSpeed();

    this.bgOffset -= this.speed * 0.4;

    // física do jogador
    const p = this.player;
    p.vy += GRAVITY;
    p.y += p.vy;
    if (p.y >= GROUND_Y - PLAYER_SIZE) {
      p.y = GROUND_Y - PLAYER_SIZE;
      p.vy = 0;
      p.onGround = true;
    }

    if (p.spinTimer > 0) {
      p.spinTimer--;
    } else {
      p.spinning = false;
    }

    if (this.invulnerableFrames > 0) this.invulnerableFrames--;

    // obstáculos
    this.spawnTimer--;
    if (this.spawnTimer <= 0) this._spawnObstacle();

    this.obstacles.forEach((o) => {
      o.x -= this.speed;
    });
    this.obstacles = this.obstacles.filter((o) => o.x + o.size > -20 && !o.collected && !o.broken);

    this._checkCollisions();

    if (this.lives <= 0 && !this.gameOver) {
      this.gameOver = true;
      this.running = false;
      this.callbacks.onGameOver?.(this.score);
    }
  }

  _checkCollisions() {
    const p = this.player;
    const px1 = PLAYER_X;
    const px2 = PLAYER_X + PLAYER_SIZE;
    const py1 = p.y;
    const py2 = p.y + PLAYER_SIZE;

    this.obstacles.forEach((o) => {
      const ox1 = o.x;
      const ox2 = o.x + o.size;
      const oy1 = o.y;
      const oy2 = o.y + o.size;

      const overlap = px1 < ox2 && px2 > ox1 && py1 < oy2 && py2 > oy1;
      if (!overlap) return;

      if (o.type === 'fruit') {
        o.collected = true;
        this.score += 10;
        this._emitScore();
        return;
      }

      // crate: se estiver girando, quebra e dá bônus; senão, dano
      if (o.type === 'crate' && p.spinning) {
        o.broken = true;
        this.score += 25;
        this._emitScore();
        return;
      }

      if (this.invulnerableFrames > 0) return;

      this.lives -= 1;
      this.invulnerableFrames = 70;
      this._emitLives();
      o.broken = true;
    });
  }

  _emitScore() {
    this.callbacks.onScore?.(this.score);
  }

  _emitLives() {
    this.callbacks.onLives?.(this.lives);
  }

  _emitSpeed() {
    this.callbacks.onSpeed?.(this.speed / BASE_SPEED);
  }

  _draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // fundo parallax
    const bg = this.sprites.background;
    if (bg) {
      const bgWidth = this.width;
      let x = this.bgOffset % bgWidth;
      if (x > 0) x -= bgWidth;
      for (let dx = x; dx < this.width; dx += bgWidth) {
        ctx.drawImage(bg, dx, 0, bgWidth, this.height);
      }
    }

    // chão
    ctx.fillStyle = '#123d3a';
    ctx.fillRect(0, GROUND_Y + PLAYER_SIZE - 6, this.width, this.height - GROUND_Y);
    ctx.fillStyle = '#0e6560';
    ctx.fillRect(0, GROUND_Y + PLAYER_SIZE - 6, this.width, 6);

    // obstáculos
    this.obstacles.forEach((o) => {
      const img = this.sprites[o.type];
      if (!img) return;
      ctx.drawImage(img, o.x, o.y, o.size, o.size);
    });

    // jogador
    const p = this.player;
    ctx.save();
    const cx = PLAYER_X + PLAYER_SIZE / 2;
    const cy = p.y + PLAYER_SIZE / 2;
    ctx.translate(cx, cy);

    if (p.spinning) {
      ctx.rotate((this.frame * 0.9) % (Math.PI * 2));
    } else if (!p.onGround) {
      ctx.rotate(-0.12);
    }

    if (this.invulnerableFrames > 0 && this.frame % 8 < 4) {
      ctx.globalAlpha = 0.35;
    }

    const heroImg = this.sprites.hero;
    if (heroImg) {
      // Divide a largura total da Sprite Sheet pelos 13 quadros
      const frameWidth = heroImg.width / HERO_TOTAL_FRAMES;
      const frameHeight = heroImg.height;

      // Frame atual calculado conforme o tempo
      const currentFrame = Math.floor(this.frame / HERO_FRAME_SPEED) % HERO_TOTAL_FRAMES;
      const sx = currentFrame * frameWidth;

      ctx.drawImage(
        heroImg,
        sx, 0, frameWidth, frameHeight,               // Recorte do frame atual na imagem original
        -PLAYER_SIZE / 2, -PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE // Posição/tamanho final no Canvas
      );
    }

    ctx.restore();
  }

  _loop(timestamp) {
    if (this.running) {
      this._update();
    }
    this._draw();
    requestAnimationFrame((t) => this._loop(t));
  }
}