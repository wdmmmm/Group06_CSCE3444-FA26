// board.js - GameBoard

class GameBoard {
    constructor(width = 20, height = 20) {
        this.width = width;
        this.height = height;
    }

    isOutOfBounds(x, y) {
        return x < 0 || x >= this.width || y < 0 || y >= this.height;
    }
}
