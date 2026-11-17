// main.js - wires Snake, GameBoard, Food, and Game together to play
import { Food } from './food.js';
import { getHighScore, saveHighScore } from './storage.js';
import { getDifficulty } from './difficulty.js';
import { Game } from './game.js';

const CELL = 20;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const board = new GameBoard(20, 20);
const snake = new Snake(10, 10);
const food = new Food({ cols: 20, rows: 20, cellSize: CELL });
const game = new Game(tick);

const stars = [];
for (let i = 0; i < 40; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() < 0.2 ? 2 : 1,
  });
}

let score = 0;
let difficulty = getDifficulty('medium');
let highScore = getHighScore();

function occupied() {
  return snake.body.concat(board.obstacles);
}

let extraObstacles = 0; // asteroids added mid-game by replaced food spawns

// Spawns the next food. On difficulties with obstacleSpawnChance (hard only),
// some spawns are replaced by an asteroid in the old food's spot, and the food
// then spawns on another free cell so there is always something to eat.
function spawnFood() {
  if (difficulty.obstacleSpawnChance > 0
      && extraObstacles < difficulty.maxExtraObstacles
      && Math.random() < difficulty.obstacleSpawnChance) {
    const blocked = occupied().concat([{ x: food.x, y: food.y }]);
    if (board.addObstacle(blocked, snake.head)) extraObstacles++;
  }
  food.spawn(occupied());
}

function show(id, visible) {
  document.getElementById(id).hidden = !visible;
}

function showMenu() {
  game.end();
  document.getElementById('high-start').textContent = highScore;
  show('start-screen', true);
  show('canvas', false);
  show('score-line', false);
  show('game-over', false);
}

function startGame() {
  snake.reset(10, 10);
  board.placeObstacles(difficulty.obstacles, snake.head);

  score = 0;
  extraObstacles = 0;
  document.getElementById('score').textContent = score;
  food.spawn(occupied());

  show('start-screen', false);
  show('game-over', false);
  show('canvas', true);
  show('score-line', true);

  draw();
  game.start(difficulty.speed);
}

function tick() {
  const h = snake.nextHead();
  if (board.isOutOfBounds(h.x, h.y)) return endGame();
  if (board.isObstacle(h.x, h.y)) return endGame();

  const ate = food.isEatenBy(h);
  if (!snake.move(ate)) return endGame();

  if (ate) {
    score += food.points * 10; // normal = 10, bonus = 50
    document.getElementById('score').textContent = score;
    spawnFood();
  } else if (food.isExpired()) {
    spawnFood(); // bonus food timed out
  }
  draw();
}

function endGame() {
  game.end();
  highScore = saveHighScore(score);
  document.getElementById('final-score').textContent = score;
  document.getElementById('final-high').textContent = highScore;
  show('game-over', true);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  for (const s of stars) ctx.fillRect(s.x, s.y, s.size, s.size);

  for (const o of board.obstacles) drawAsteroid(o);

  ctx.shadowColor = food.color;
  ctx.shadowBlur = 14;
  food.draw(ctx);
  ctx.shadowBlur = 0;

  drawSnake();
}

function drawAsteroid(o) {
  const cx = o.x * CELL + CELL / 2;
  const cy = o.y * CELL + CELL / 2;

  ctx.fillStyle = '#5b7a8c';
  ctx.beginPath();
  ctx.moveTo(cx - 8, cy - 3);
  ctx.lineTo(cx - 3, cy - 9);
  ctx.lineTo(cx + 5, cy - 8);
  ctx.lineTo(cx + 9, cy - 1);
  ctx.lineTo(cx + 6, cy + 8);
  ctx.lineTo(cx - 4, cy + 9);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#34495e';
  ctx.beginPath();
  ctx.arc(cx - 2, cy - 2, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawSnake() {
  ctx.shadowColor = '#22d3ee';
  ctx.shadowBlur = 10;
  snake.body.forEach((part, i) => {
    ctx.fillStyle = i === 0 ? '#a5f3fc' : '#22d3ee';
    ctx.fillRect(part.x * CELL + 1, part.y * CELL + 1, CELL - 2, CELL - 2);
  });
  ctx.shadowBlur = 0;
}

const KEYS = {
  w: 'UP', a: 'LEFT', s: 'DOWN', d: 'RIGHT',
  arrowup: 'UP', arrowleft: 'LEFT', arrowdown: 'DOWN', arrowright: 'RIGHT',
};

document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'p') {
    game.togglePause();
    return;
  }
  if (game.state === 'paused') return;
  const dir = KEYS[e.key.toLowerCase()];
  if (dir) {
    snake.changeDirection(dir);
    e.preventDefault();
  }
});

document.querySelectorAll('[data-difficulty]').forEach((btn) => {
  btn.addEventListener('click', () => {
    difficulty = getDifficulty(btn.dataset.difficulty);
    startGame();
  });
});
document.getElementById('play-again').addEventListener('click', startGame);
document.getElementById('main-menu').addEventListener('click', showMenu);

showMenu();
