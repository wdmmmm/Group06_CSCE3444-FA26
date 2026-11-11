// game.js - controls when the game starts, pauses, resumes, and ends

export class Game{ 
    constructor(onTick){
        this.onTick = onTick;
        this.state = 'menu';
        this.speed = 130;
        this.timer = null;
    }

    start(speed) {
    clearInterval(this.timer);
    this.speed = speed;
    this.state = 'playing';
    this.timer = setInterval(this.onTick, this.speed);
  }

  end() {
    clearInterval(this.timer);
    this.timer = null;
    this.state = 'over';
  }

    pause() {
    if (this.state !== 'playing') return;
    clearInterval(this.timer);
    this.timer = null;
    this.state = 'paused';
  }

  resume() {
    if (this.state !== 'paused') return;
    this.state = 'playing';
    this.timer = setInterval(this.onTick, this.speed);
  }

  togglePause() {
    if (this.state === 'playing') this.pause();
    else if (this.state === 'paused') this.resume();
  }
}
