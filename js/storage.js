//storage.js - saves and loads the high score for Scale UP

const HIGH_SCORE_KEY = 'highScore';

export function getHighScore(){
    try {
        return Number(localStorage.getItem(HIGH_SCORE_KEY)) || 0;
    } catch (e) {
        return 0;
    }
}

export function saveHighScore(score){
    const best = getHighScore();
    if (score > best) {
        try {
            localStorage.setItem(HIGH_SCORE_KEY, String(score));
        } catch (e){}
        return score;
    }
    return best;
}