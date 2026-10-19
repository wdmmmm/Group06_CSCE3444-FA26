// food.js
// Food module for a grid-based snake game.
// Usage:
//   import { Food } from './food.js';
//   const food = new Food({ cols: 20, rows: 20, cellSize: 20 });
//   food.spawn(snake.body);          // body = [{ x, y }, ...]
//   food.draw(ctx);
//   if (food.isEatenBy(snake.head)) { score += food.points; food.spawn(snake.body); }

const FOOD_TYPES = {
  normal: { color: '#e74c3c', points: 1, weight: 85, lifetime: null },
  bonus:  { color: '#f1c40f', points: 5, weight: 15, lifetime: 5000 }, // disappears after 5s
};

export class Food {
  /**
   * @param {Object} options
   * @param {number} options.cols      Number of grid columns
   * @param {number} options.rows      Number of grid rows
   * @param {number} options.cellSize  Size of one grid cell in pixels
   * @param {boolean} [options.enableBonus=true]  Occasionally spawn bonus food
   */
  constructor({ cols, rows, cellSize, enableBonus = true }) {
    this.cols = cols;
    this.rows = rows;
    this.cellSize = cellSize;
    this.enableBonus = enableBonus;

    this.x = 0;
    this.y = 0;
    this.type = 'normal';
    this.color = FOOD_TYPES.normal.color;
    this.points = FOOD_TYPES.normal.points;
    this.spawnedAt = 0;
  }

  /**
   * Place food on a random empty cell.
   * @param {Array<{x:number,y:number}>} occupied  Cells the food must avoid (e.g. snake body)
   * @returns {boolean} false if the board is full (player has won)
   */
  spawn(occupied = []) {
    const taken = new Set(occupied.map(c => `${c.x},${c.y}`));
    const free = [];

    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        if (!taken.has(`${x},${y}`)) free.push({ x, y });
      }
    }

    if (free.length === 0) return false; // no room left

    const cell = free[Math.floor(Math.random() * free.length)];
    this.x = cell.x;
    this.y = cell.y;
    this._pickType();
    this.spawnedAt = performance.now();
    return true;
  }

  /** Check whether the snake's head is on the food. */
  isEatenBy(head) {
    return head.x === this.x && head.y === this.y;
  }

  /** True if a bonus item has outlived its lifetime and should be respawned. */
  isExpired(now = performance.now()) {
    const { lifetime } = FOOD_TYPES[this.type];
    return lifetime !== null && now - this.spawnedAt > lifetime;
  }

  /** Draw the food on a 2D canvas context. */
  draw(ctx) {
    const size = this.cellSize;
    const cx = this.x * size + size / 2;
    const cy = this.y * size + size / 2;

    // Bonus food pulses to stand out
    let radius = size / 2 - 2;
    if (this.type === 'bonus') {
      const pulse = Math.sin((performance.now() - this.spawnedAt) / 120) * 2;
      radius += pulse;
    }

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(radius, 2), 0, Math.PI * 2);
    ctx.fill();
  }

  // --- internal ---

  _pickType() {
    let type = 'normal';

    if (this.enableBonus) {
      const total = Object.values(FOOD_TYPES).reduce((sum, t) => sum + t.weight, 0);
      let roll = Math.random() * total;
      for (const [name, t] of Object.entries(FOOD_TYPES)) {
        roll -= t.weight;
        if (roll <= 0) {
          type = name;
          break;
        }
      }
    }

    this.type = type;
    this.color = FOOD_TYPES[type].color;
    this.points = FOOD_TYPES[type].points;
  }
}
