// board.js - GameBoard

class GameBoard {
    constructor(width = 20, height = 20) {
        this.width = width;
        this.height = height;
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
    isObstacle(x,y){
        return this.obstacles.some(o=> o.x === x && o.y ===y);
    }

}
