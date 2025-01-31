// Setup canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Info elements
const infoLives = document.getElementById('lives');
const infoScore = document.getElementById('score');
const infoLevel = document.getElementById('level');

// Global game variables
let level = 1;
let levelEnd = 1000; // x-coordinate objective to finish level
let gameOver = false;

// Key tracking
const keys = {};
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

// Player object with animation properties
const player = {
  x: 100,
  y: 500,
  width: 32,
  height: 48,
  vx: 0,
  vy: 0,
  speed: 3,
  jumpStrength: -10,
  onGround: false,
  lives: 3,
  score: 0,
  startX: 100,
  startY: 500,
  frameIndex: 0,      // current frame of animation
  frameCount: 4,      // total frames in sprite sheet
  frameDuration: 200, // time (ms) per frame
  lastFrameTime: 0
};

// Load player sprite sheet image
const playerSprite = new Image();
playerSprite.src = 'player.png'; // Ensure this file exists in your project

// Gravity constant
const gravity = 0.5;

// Platforms array – common to all levels
let platforms = [
  { x: 0, y: 550, width: 1200, height: 50 },  // ground platform
  { x: 200, y: 450, width: 100, height: 10 },
  { x: 400, y: 400, width: 150, height: 10 },
  { x: 700, y: 350, width: 100, height: 10 }
];

// Enemies array – will be spawned based on level
let enemies = [];

// Bullets array – player’s pistol bullets
let bullets = [];

// Camera offset for horizontal scrolling
let cameraX = 0;

// Spawn enemies based on current level. In level 1 we keep them sparse.
function spawnEnemies() {
  enemies = [];
  let numEnemies = Math.min(2 + level, 6);
  for (let i = 0; i < numEnemies; i++) {
    let ex = 250 + i * ((levelEnd - 350) / numEnemies);
    enemies.push({
      x: ex,
      y: 510,  // positioned on the ground platform
      width: 32,
      height: 32,
      vx: 1 + 0.2 * level, // slightly faster at higher levels
      minX: ex - 50,
      maxX: ex + 50
    });
  }
}

spawnEnemies();

// Update info display
function updateInfo() {
  infoLives.innerText = player.lives;
  infoScore.innerText = player.score;
  infoLevel.innerText = level;
}

// Player shooting: when "KeyZ" is pressed, fire a bullet.
function shootBullet() {
  bullets.push({
    x: player.x + player.width, // start from player's right side
    y: player.y + player.height / 2,
    width: 8,
    height: 4,
    vx: 6
  });
}

window.addEventListener('keydown', e => {
  if (e.code === 'KeyZ') {
    shootBullet();
  }
});

// Update player's animation frame based on time
function updatePlayerAnimation(deltaTime) {
  player.lastFrameTime += deltaTime;
  if (player.lastFrameTime >= player.frameDuration) {
    player.frameIndex = (player.frameIndex + 1) % player.frameCount;
    player.lastFrameTime = 0;
  }
}

// Draw the parallax background
function drawParallax() {
  // Far background: a gradient sky.
  let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#001');
  gradient.addColorStop(1, '#123');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Near background: hills that move slower than the camera for parallax effect.
  ctx.fillStyle = '#022';
  let hillOffset = (cameraX * 0.3) % canvas.width;
  ctx.beginPath();
  ctx.arc(-hillOffset, canvas.height, 150, Math.PI, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(canvas.width - hillOffset, canvas.height, 150, Math.PI, 2 * Math.PI);
  ctx.fill();
}

// Update game state
let lastTime = performance.now();
function update() {
  let now = performance.now();
  let deltaTime = now - lastTime;
  lastTime = now;
  
  if (gameOver) return;
  
  // Update player animation
  updatePlayerAnimation(deltaTime);
  
  // Horizontal movement
  if (keys['ArrowLeft']) {
    player.vx = -player.speed;
  } else if (keys['ArrowRight']) {
    player.vx = player.speed;
  } else {
    player.vx = 0;
  }
  
  // Jump if on ground
  if ((keys['Space'] || keys['ArrowUp']) && player.onGround) {
    player.vy = player.jumpStrength;
    player.onGround = false;
  }
  
  // Apply gravity
  player.vy += gravity;
  
  // Update player position
  player.x += player.vx;
  player.y += player.vy;
  
  // Collision with platforms
  player.onGround = false;
  for (let platform of platforms) {
    if (player.x < platform.x + platform.width &&
        player.x + player.width > platform.x &&
        player.y < platform.y + platform.height &&
        player.y + player.height > platform.y) {
      if (player.vy > 0) {
        player.y = platform.y - player.height;
        player.vy = 0;
        player.onGround = true;
      }
    }
  }
  
  // Lose life if player falls off screen
  if (player.y > canvas.height) {
    loseLife();
  }
  
  // Update bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    b.x += b.vx;
    if (b.x > canvas.width + cameraX) {
      bullets.splice(i, 1);
    } else {
      for (let j = enemies.length - 1; j >= 0; j--) {
        let e = enemies[j];
        if (b.x < e.x + e.width &&
            b.x + b.width > e.x &&
            b.y < e.y + e.height &&
            b.y + b.height > e.y) {
          enemies.splice(j, 1);
          bullets.splice(i, 1);
          player.score += 100;
          break;
        }
      }
    }
  }
  
  // Update enemy positions and check collisions with player
  for (let enemy of enemies) {
    enemy.x += enemy.vx;
    if (enemy.x < enemy.minX || enemy.x + enemy.width > enemy.maxX) {
      enemy.vx *= -1;
    }
    if (player.x < enemy.x + enemy.width &&
        player.x + player.width > enemy.x &&
        player.y < enemy.y + enemy.height &&
        player.y + player.height > enemy.y) {
      loseLife();
    }
  }
  
  // Level objective: progress to next level if player reaches levelEnd
  if (player.x >= levelEnd) {
    levelComplete();
  }
  
  // Update camera to follow player horizontally
  cameraX = player.x - 100;
  updateInfo();
}

// Handle life loss and game over
function loseLife() {
  player.lives--;
  if (player.lives <= 0) {
    alert("Game Over!");
    resetGame();
  } else {
    player.x = player.startX;
    player.y = player.startY;
    player.vx = 0;
    player.vy = 0;
  }
}

// Handle level completion: advance level and increase difficulty
function levelComplete() {
  alert("Level " + level + " Complete!");
  level++;
  levelEnd += 500;
  spawnEnemies();
  player.x = player.startX;
  player.y = player.startY;
  player.vx = 0;
  player.vy = 0;
}

// Reset entire game state
function resetGame() {
  player.lives = 3;
  player.score = 0;
  level = 1;
  levelEnd = 1000;
  spawnEnemies();
  player.x = player.startX;
  player.y = player.startY;
  player.vx = 0;
  player.vy = 0;
  gameOver = false;
}

// Draw game scene
function draw() {
  // Draw parallax background first
  drawParallax();
  
  // Draw platforms
  ctx.fillStyle = '#555';
  for (let platform of platforms) {
    ctx.fillRect(platform.x - cameraX, platform.y, platform.width, platform.height);
  }
  
  // Draw enemies
  ctx.fillStyle = '#FF0000';
  for (let enemy of enemies) {
    ctx.fillRect(enemy.x - cameraX, enemy.y, enemy.width, enemy.height);
  }
  
  // Draw bullets
  ctx.fillStyle = '#FFFF00';
  for (let bullet of bullets) {
    ctx.fillRect(bullet.x - cameraX, bullet.y, bullet.width, bullet.height);
  }
  
  // Draw player using the sprite sheet animation
  let frameWidth = playerSprite.width / player.frameCount;
  let sx = player.frameIndex * frameWidth;
  let sy = 0;
  ctx.drawImage(playerSprite, sx, sy, frameWidth, playerSprite.height,
                player.x - cameraX, player.y, player.width, player.height);
  
  // Draw level finish line
  ctx.strokeStyle = '#00FF00';
  ctx.beginPath();
  ctx.moveTo(levelEnd - cameraX, 0);
  ctx.lineTo(levelEnd - cameraX, canvas.height);
  ctx.stroke();
}

// Main game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
