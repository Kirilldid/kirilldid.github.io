const CONFIG = {
  blockWidth: 180,
  blockHeight: 34,
  baseSpeed: 3.0,
  speedIncrease: 0.18,
  maxSpeed: 9,
  gravityStrength: 0.5,
  perfectThreshold: 5,
  wobbleIncrement: 0.0018,
  maxWobble: 0.12,
  spawnVerticalOffset: 60,
  cameraFollowFactor: 0.1,
  cameraTargetOffset: 0.45,
  colors: {
    primary: '#FF6A00',
    secondary: '#ff8833',
    border: '#e5e5e5'
  }
};

class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.blocks = [];
    this.currentBlock = null;
    this.score = 0;
    this.bestScore = parseInt(localStorage.getItem('dataTowerBest') || '0');
    this.isPlaying = false;
    this.gameOver = false;
    this.speed = CONFIG.baseSpeed;
    this.wobbleAmount = 0;
    this.cameraY = 0;
    this.lastTime = performance.now();
    this.setupCanvas();
    this.loadBestScore();
    this.bindEvents();
    this.updateSpeedIndicator();
    this.gameLoop();
  }

  setupCanvas() {
    const container = document.getElementById('gameContainer');
    this.canvas.width = container.offsetWidth;
    this.canvas.height = container.offsetHeight;
    this.groundY = this.canvas.height - 110;
  }

  bindEvents() {
    document.getElementById('startBtn').addEventListener('click', () => this.start());
    document.getElementById('playAgainBtn').addEventListener('click', () => this.restart());
    document.getElementById('restartBtn').addEventListener('click', () => this.restart());
    window.addEventListener('resize', () => this.setupCanvas());
    const dropBlock = () => {
      if (this.isPlaying && this.currentBlock && !this.currentBlock.falling) {
        this.dropCurrentBlock();
        this.vibrate(10);
      }
    };
    this.canvas.addEventListener('click', dropBlock);
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        dropBlock();
      }
    });
  }

  start() {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameOverScreen').classList.add('hidden');
    document.getElementById('restartBtn').classList.remove('hidden');
    this.reset();
    this.isPlaying = true;
    this.spawnBaseBlock();
    this.spawnNewBlock();
    this.lastTime = performance.now();
  }

  restart() { this.start(); }

  reset() {
    this.blocks = [];
    this.currentBlock = null;
    this.score = 0;
    this.speed = CONFIG.baseSpeed;
    this.wobbleAmount = 0;
    this.cameraY = 0;
    this.gameOver = false;
    this.updateScore();
    this.updateSpeedIndicator();
  }

  spawnBaseBlock() {
    const block = new Block(
      this.canvas.width / 2 - CONFIG.blockWidth / 2,
      this.groundY - CONFIG.blockHeight,
      CONFIG.blockWidth,
      CONFIG.blockHeight,
      true
    );
    block.isBase = true;
    this.blocks.push(block);
  }

  spawnNewBlock() {
    if (this.gameOver) return;
    const lastBlock = this.blocks[this.blocks.length - 1];
    const y = lastBlock.y - CONFIG.blockHeight - CONFIG.spawnVerticalOffset;
    this.currentBlock = new Block(0, y, lastBlock.width, CONFIG.blockHeight, false);
    this.currentBlock.speed = this.speed;
    this.currentBlock.direction = Math.random() > 0.5 ? 1 : -1;
  }

  dropCurrentBlock() {
    if (!this.currentBlock || this.currentBlock.falling) return;
    this.currentBlock.falling = true;
    this.currentBlock.velocity = 0;
    this.playSound();
  }

  update(delta) {
    if (!this.isPlaying || this.gameOver) return;
    const dt = Math.min(delta / 16.67, 2);
    if (this.currentBlock) {
      this.currentBlock.update(this.canvas.width, dt);
      const lastBlock = this.blocks[this.blocks.length - 1];
      if (this.currentBlock.falling) {
        if (this.currentBlock.y + this.currentBlock.height >= lastBlock.y) {
          this.handleBlockPlacement();
        }
      }
    }
    this.blocks.forEach((block, index) => {
      if (index > 0) {
        const wobblePhase = Date.now() / 700 + index * 0.3;
        block.wobbleOffset = Math.sin(wobblePhase) * this.wobbleAmount * (index / this.blocks.length);
      }
    });
    if (this.blocks.length > 0) {
      const topBlock = this.blocks[this.blocks.length - 1];
      const targetY = topBlock.y - this.canvas.height * CONFIG.cameraTargetOffset;
      this.cameraY += (targetY - this.cameraY) * CONFIG.cameraFollowFactor;
    }
  }

  handleBlockPlacement() {
    const lastBlock = this.blocks[this.blocks.length - 1];
    const current = this.currentBlock;
    const leftEdgeCurrent = current.x;
    const rightEdgeCurrent = current.x + current.width;
    const leftEdgeLast = lastBlock.x + (lastBlock.wobbleOffset || 0);
    const rightEdgeLast = leftEdgeLast + lastBlock.width;
    const overlapLeft = Math.max(leftEdgeCurrent, leftEdgeLast);
    const overlapRight = Math.min(rightEdgeCurrent, rightEdgeLast);
    const overlapWidth = overlapRight - overlapLeft;
    if (overlapWidth < 10) {
      this.endGame();
      return;
    }
    const centerOffset = Math.abs((current.x + current.width / 2) - (leftEdgeLast + lastBlock.width / 2));
    const isPerfect = centerOffset < CONFIG.perfectThreshold;
    const newWidth = isPerfect ? lastBlock.width : overlapWidth;
    const newX = isPerfect ? lastBlock.x : overlapLeft;
    const newBlock = new Block(newX, lastBlock.y - CONFIG.blockHeight, newWidth, CONFIG.blockHeight, true);
    newBlock.perfect = isPerfect;
    this.blocks.push(newBlock);
    this.currentBlock = null;
    this.score++;
    this.updateScore();
    this.speed = Math.min(CONFIG.maxSpeed, CONFIG.baseSpeed + this.score * CONFIG.speedIncrease);
    this.wobbleAmount = Math.min(CONFIG.maxWobble, this.score * CONFIG.wobbleIncrement);
    this.updateSpeedIndicator();
    setTimeout(() => this.spawnNewBlock(), 220);
  }

  endGame() {
    this.gameOver = true;
    this.isPlaying = false;
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem('dataTowerBest', this.bestScore.toString());
      this.updateBestScore();
    }
    setTimeout(() => {
      document.getElementById('finalScore').textContent = this.score;
      document.getElementById('motivation').textContent = this.getMotivation();
      document.getElementById('gameOverScreen').classList.remove('hidden');
      this.vibrate(40);
    }, 400);
  }

  getMotivation() {
    if (this.score >= 40) return '🏆 Невероятно! Архитектура данных выдержала всё.';
    if (this.score >= 30) return '🎯 Отличный баланс. Это уже production-ready башня.';
    if (this.score >= 20) return '📊 Хорошая работа! Стабильная структура данных.';
    if (this.score >= 10) return '📈 Неплохое начало. Есть куда расти.';
    return '💪 Попробуйте ещё раз. Практика делает мастера!';
  }

  render() {
    this.ctx.fillStyle = '#fafafa';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#f8f8f8');
    gradient.addColorStop(0.5, '#fafafa');
    gradient.addColorStop(1, '#f4f4f4');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(0, -this.cameraY);
    const groundGrad = this.ctx.createLinearGradient(0, this.groundY, 0, this.groundY + 120);
    groundGrad.addColorStop(0, '#f0f0f0');
    groundGrad.addColorStop(0.5, '#e8e8e8');
    groundGrad.addColorStop(1, '#f4f4f4');
    this.ctx.fillStyle = groundGrad;
    this.ctx.fillRect(0, this.groundY, this.canvas.width, 150);
    this.ctx.strokeStyle = CONFIG.colors.border;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.groundY);
    this.ctx.lineTo(this.canvas.width, this.groundY);
    this.ctx.stroke();
    this.blocks.forEach(block => block.render(this.ctx));
    if (this.currentBlock) { this.currentBlock.render(this.ctx, true); }
    this.ctx.restore();
  }

  gameLoop() {
    const now = performance.now();
    const delta = now - this.lastTime;
    this.lastTime = now;
    this.update(delta);
    this.render();
    requestAnimationFrame(() => this.gameLoop());
  }

  updateScore() { document.getElementById('score').textContent = this.score; }
  loadBestScore() { this.updateBestScore(); }
  updateBestScore() { document.getElementById('bestScore').textContent = this.bestScore; }
  updateSpeedIndicator() {
    const percentage = Math.min(100, (this.speed / CONFIG.maxSpeed) * 100);
    document.getElementById('speedFill').style.width = percentage + '%';
    document.getElementById('speedLevelLabel').textContent = '×' + (this.speed / CONFIG.baseSpeed).toFixed(1);
  }

  playSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.frequency.value = 750;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {}
  }

  vibrate(duration) {
    if ('vibrate' in navigator) { navigator.vibrate(duration); }
  }
}

class Block {
  constructor(x, y, width, height, isPlaced) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isPlaced = isPlaced;
    this.falling = false;
    this.velocity = 0;
    this.speed = CONFIG.baseSpeed;
    this.direction = 1;
    this.wobbleOffset = 0;
    this.isBase = false;
    this.perfect = false;
    this.rows = Math.floor(Math.random() * 2) + 2;
    this.cols = Math.floor(Math.random() * 3) + 4;
    this.color = this.generateColor();
  }

  generateColor() {
    const colors = [CONFIG.colors.primary, CONFIG.colors.secondary, '#ff9944'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update(canvasWidth, dt) {
    if (this.falling) {
      this.velocity += CONFIG.gravityStrength * dt;
      this.y += this.velocity * dt;
    } else if (!this.isPlaced) {
      this.x += this.speed * this.direction * dt;
      if (this.x <= 0) { this.x = 0; this.direction = 1; }
      else if (this.x + this.width >= canvasWidth) {
        this.x = canvasWidth - this.width;
        this.direction = -1;
      }
    }
  }

  render(ctx, isCurrent = false) {
    const drawX = this.x + (this.wobbleOffset || 0);
    ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;
    const grad = ctx.createLinearGradient(drawX, this.y, drawX, this.y + this.height);
    if (this.isPlaced || this.isBase) {
      grad.addColorStop(0, this.color);
      grad.addColorStop(1, '#d15a00');
    } else {
      grad.addColorStop(0, '#ffb78a');
      grad.addColorStop(1, CONFIG.colors.primary);
    }
    ctx.fillStyle = grad;
    ctx.fillRect(drawX, this.y, this.width, this.height);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.strokeStyle = CONFIG.colors.border;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(drawX, this.y, this.width, this.height);
    this.drawDataFace(ctx, drawX, this.y);
    if (isCurrent && !this.falling) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 106, 0, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.strokeRect(drawX + 2, this.y + 2, this.width - 4, this.height - 4);
      ctx.restore();
    }
  }

  drawDataFace(ctx, x, y) {
    const paddingX = 10, paddingY = 6;
    const innerW = this.width - paddingX * 2;
    const innerH = this.height - paddingY * 2;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(x + paddingX, y + paddingY, innerW, innerH);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.lineWidth = 1;
    const cellWidth = innerW / this.cols;
    const cellHeight = innerH / this.rows;
    for (let i = 1; i < this.rows; i++) {
      ctx.beginPath();
      ctx.moveTo(x + paddingX, y + paddingY + i * cellHeight);
      ctx.lineTo(x + paddingX + innerW, y + paddingY + i * cellHeight);
      ctx.stroke();
    }
    for (let i = 1; i < this.cols; i++) {
      ctx.beginPath();
      ctx.moveTo(x + paddingX + i * cellWidth, y + paddingY);
      ctx.lineTo(x + paddingX + i * cellWidth, y + paddingY + innerH);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    const dotCount = Math.floor(this.rows * this.cols * 0.3);
    for (let i = 0; i < dotCount; i++) {
      const rx = x + paddingX + 3 + Math.random() * (innerW - 6);
      const ry = y + paddingY + 3 + Math.random() * (innerH - 6);
      ctx.fillRect(rx, ry, 2, 2);
    }
  }
}

const game = new Game();