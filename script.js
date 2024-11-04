const levels = [
    { name: "Novice", threshold: 0 },
    { name: "Apprentice", threshold: 7 },
    { name: "Adept", threshold: 30 },
    { name: "Expert", threshold: 90 },
    { name: "Master", threshold: 180 },
    { name: "Legend", threshold: 365 }
];

let streak = 0;
let xp = 0;

const streakElement = document.getElementById('streak');
const xpElement = document.getElementById('xp');
const levelElement = document.getElementById('level');
const progressElement = document.getElementById('progress');
const achievementElement = document.getElementById('achievement');

function updateDisplay() {
    streakElement.textContent = streak;
    xpElement.textContent = xp;

    const currentLevel = levels.reduce((acc, level) => streak >= level.threshold ? level : acc, levels[0]);
    const nextLevel = levels.find(level => streak < level.threshold) || levels[levels.length - 1];
    levelElement.textContent = currentLevel.name;

    const progress = nextLevel.threshold > currentLevel.threshold
        ? ((streak - currentLevel.threshold) / (nextLevel.threshold - currentLevel.threshold)) * 100
        : 100;
    progressElement.style.width = `${progress}%`;
}

function showAchievement() {
    achievementElement.style.display = 'flex';
    setTimeout(() => {
        achievementElement.style.display = 'none';
    }, 3000);
}

document.getElementById('completeChallenge').addEventListener('click', () => {
    streak++;
    const xpGain = 10 + Math.floor(streak / 7) * 5;
    xp += xpGain;

    if (levels.some(level => level.threshold === streak)) {
        showAchievement();
    }

    updateDisplay();
});

document.getElementById('relapse').addEventListener('click', () => {
    streak = 0;
    xp = Math.max(0, xp - 50);
    updateDisplay();
});

updateDisplay();
