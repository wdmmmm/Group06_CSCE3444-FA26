// snake.js - Snake class for Scale UP

const DIRS = {
  UP:    { x: 0,  y: -1 },
  DOWN:  { x: 0,  y: 1 },
  LEFT:  { x: -1, y: 0 },
  RIGHT: { x: 1,  y: 0 },
};

const OPPOSITE = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };

class Snake {
  constructor(startX, startY) {
    this.reset(startX, startY);
  }

  reset(startX = 10, startY = 10) {
    this.body = [{ x: startX, y: startY }];
    this.cells = new Set([`${startX},${startY}`]);
    this.direction = 'RIGHT';
    this.nextDirection = 'RIGHT';
  }

  get length() { return this.body.length; }
  get head() { return this.body[0]; }

  changeDirection(dir) {
    if (dir !== OPPOSITE[this.direction]) {
      this.nextDirection = dir;
    }
  }

  nextHead() {
    const d = DIRS[this.nextDirection];
    return { x: this.head.x + d.x, y: this.head.y + d.y };
  }

  move(grow = false) {
    this.direction = this.nextDirection;
    const h = this.nextHead();

    if (!grow) {
      const tail = this.body.pop();
      this.cells.delete(`${tail.x},${tail.y}`);
    }

    if (this.cells.has(`${h.x},${h.y}`)) return false;

    this.body.unshift(h);
    this.cells.add(`${h.x},${h.y}`);
    return true;
  }
}




