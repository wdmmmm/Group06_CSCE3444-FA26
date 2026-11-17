// difficulty.js - settings for each difficulty level

export const DIFFICULTIES = {
    // obstacleSpawnChance: chance that a food spawn is replaced by a new asteroid
    // maxExtraObstacles:   cap on asteroids added mid-game this way (per game)
    easy: {label: 'Easy', speed: 180, obstacles: 0, obstacleSpawnChance: 0, maxExtraObstacles: 0},
    medium: {label: 'Medium', speed: 130, obstacles: 3, obstacleSpawnChance: 0, maxExtraObstacles: 0},
    hard: {label: 'Hard', speed: 80, obstacles: 6, obstacleSpawnChance: 0.25, maxExtraObstacles: 6},
};

export function getDifficulty(name) {
    return DIFFICULTIES[name] || DIFFICULTIES.medium;
}
