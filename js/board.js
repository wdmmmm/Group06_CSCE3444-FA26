// board.js - GameBoard

class GameBoard { 
    constructor(width = 20, height = 20) {
        this.width = width;
        this.height = height;
        this.food = null;
    }

    isOutOfBounds(x,y) {
        return x < 0 || x >= this.width || y < 0 || y >= this.height;
    }

    generateFood(snake) {
        let x;
        let y;

        do {
            x = Math.floor(Math.random() * this.width);
            y = Math.floor(Math.random() * this.height);
        } while (snake.cells.has ('${x},${y}'));
        this.food = { x: x, y: y };
    }   
    foodAt(x,y){
        return this.food !== null && this.food.x === x && this.food.y === y;
    }

}




