// snake.js - Snake class for Scale

const DIRS = {
    UP: { x: 0, y: -1 },
    DOWN: {x: 0, y: 1 },
    LEFT: {x: -1, y:0 },
    RIGHT: {x: 1, y: 0 },
};

const OPPOSITE = {UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT'};

class Snake {
    constructor(startX, startY) {
        this.reset(startX, startY);
    }

    reset(startX = 10, startY = 10) {
        this.body = [{x: startX, y: startY}];
        this.cells = new Set(['${startX},${startY}']);
        this.direction = 'RIGHT';
        this.nextDirection = 'RIGHT';
    }
}

