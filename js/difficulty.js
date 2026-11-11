// difficulty.js - settings for each difficulty level

export const DIFFICULTIES = {
    easy: {label: 'Easy', speed: 180, obstacles: 0},
    medium: {label: 'Medium', speed: 130, obstacles: 3},
    hard: {label: 'Hard', speed: 80, obstacles: 6},
};

export function getDifficulty(name) {
    return DIFFICULTIES[name] || DIFFICULTIES.medium;
}
