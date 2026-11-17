// board.js - GameBoard

class GameBoard {
    constructor(width = 20, height = 20) {
        this.width = width;
        this.height = height;
        this.obstacles = [];
    }

    isOutOfBounds(x, y) {
        return x < 0 || x >= this.width || y < 0 || y >= this.height;
    }

    placeObstacles(count, head){
        this.obstacles = [];
        while (this.obstacles.length < count) {
            const x = Math.floor(Math.random() * this.width);
            const y = Math.floor(Math.random() * this.height);
            const nearHead = Math.abs(x - head.x) <= 4 && Math.abs(y - head.y) <= 4;
            if (nearHead || this.isObstacle(x, y)) continue;
            this.obstacles.push({ x: x, y: y });
        }
    }

    // Adds one obstacle on a random free cell during play (used on hard mode when
    // a food spawn is replaced by an asteroid). Returns the new cell, or null if none fit.
    // blocked: cells to avoid (snake body, current food). Stays away from the head.
    addObstacle(blocked, head, minHeadDistance = 4){
        const taken = new Set(blocked.map(c => `${c.x},${c.y}`));
        const free = [];
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const nearHead = Math.abs(x - head.x) <= minHeadDistance && Math.abs(y - head.y) <= minHeadDistance;
                if (nearHead || taken.has(`${x},${y}`) || this.isObstacle(x, y)) continue;
                free.push({ x, y });
            }
        }
        if (free.length === 0) return null;
        const cell = free[Math.floor(Math.random() * free.length)];
        this.obstacles.push(cell);
        return cell;
    }

    isObstacle(x,y){
        return this.obstacles.some(o=> o.x === x && o.y ===y);
    }

}
