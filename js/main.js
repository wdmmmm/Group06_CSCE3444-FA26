// main.js - wires Snake, GameBoard and Food together to play
import { Food } from './food.js';

const CELL = 20;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const board = new GameBoard(20, 20);
const snake = new Snake(10, 10);
const food = new Food({ cols: 20, rows: 20, cellSize: CELL });

let score = 0;
let speed = 130;
let timer = null;

let highScore = 0;
try {
  highScore = Number(localStorage.getItem('highScore')) || 0;
} catch (e) {}

function show(id, visible) {
  document.getElementById(id).hidden = !visible;
}

function showMenu() {
  clearInterval(timer);
  document.getElementById('high-start').textContent = highScore;
  show('start-screen', true);
  show('canvas', false);
  show('score-line', false);
  show('game-over', false);
}

function startGame() {
  clearInterval(timer);
  snake.reset(10, 10);

  score = 0;
  document.getElementById('score').textContent = score;
  food.spawn(snake.body);

  show('start-screen', false);
  show('game-over', false);
  show('canvas', true);
  show('score-line', true);

  draw();
  timer = setInterval(tick, speed);
}

function tick() {
  const h = snake.nextHead();
  if (board.isOutOfBounds(h.x, h.y)) return endGame();

  const ate = food.isEatenBy(h);
  if (!snake.move(ate)) return endGame();

  if (ate) {
    score += food.points * 10; // normal = 10, bonus = 50
    document.getElementById('score').textContent = score;
    food.spawn(snake.body);
  } else if (food.isExpired()) {
    food.spawn(snake.body); // bonus food timed out
  }
  draw();
}

function endGame() {
  clearInterval(timer);
  if (score > highScore) {
    highScore = score;
    try {
      localStorage.setItem('highScore', highScore);
    } catch (e) {}
  }
  document.getElementById('final-score').textContent = score;
  document.getElementById('final-high').textContent = highScore;
  show('game-over', true);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  food.draw(ctx);

  ctx.fillStyle = 'lime';
  for (const part of snake.body) {
    ctx.fillRect(part.x * CELL, part.y * CELL, CELL - 1, CELL - 1);
  }
}

const KEYS = {
  w: 'UP', a: 'LEFT', s: 'DOWN', d: 'RIGHT',
  arrowup: 'UP', arrowleft: 'LEFT', arrowdown: 'DOWN', arrowright: 'RIGHT',
};

document.addEventListener('keydown', (e) => {
  const dir = KEYS[e.key.toLowerCase()];
  if (dir) {
    snake.changeDirection(dir);
    e.preventDefault();
  }
});

document.querySelectorAll('[data-speed]').forEach((btn) => {
  btn.addEventListener('click', () => {
    speed = Number(btn.dataset.speed);
    startGame();
  });
});
document.getElementById('play-again').addEventListener('click', startGame);
document.getElementById('main-menu').addEventListener('click', showMenu);

showMenu();
