const levels = [
    { name: "Bronze I", threshold: 0 },
    { name: "Bronze II", threshold: 5 },
    { name: "Bronze III", threshold: 10 },
    { name: "Silver I", threshold: 30 },
    { name: "Silver II", threshold: 45 },
    { name: "Silver III", threshold: 60 },
    { name: "Gold I", threshold: 90 },
    { name: "Gold II", threshold: 120 },
    { name: "Gold III", threshold: 150 },
    { name: "Crystal I", threshold: 180 },
    { name: "Crystal II", threshold: 210 },
    { name: "Crystal III", threshold: 240 },
    { name: "Master I", threshold: 270 },
    { name: "Master II", threshold: 290 },
    { name: "Master III", threshold: 310 },
    { name: "Champion I", threshold: 330 },
    { name: "Champion II", threshold: 350 },
    { name: "Champion III", threshold: 365 },
    { name: "Titan I", threshold: 366 },
    { name: "Titan II", threshold: 380 },
    { name: "Titan III", threshold: 395 },
    { name: "Legendary🏆", threshold: 400 }
];

let streak = localStorage.getItem('streak') ? parseInt(localStorage.getItem('streak')) : 0;
let xp = localStorage.getItem('xp') ? parseInt(localStorage.getItem('xp')) : 0;
let lastCompletedTime = localStorage.getItem('lastCompletedTime') ? parseInt(localStorage.getItem('lastCompletedTime')) : 0;

const streakElement = document.getElementById('streak');
const xpElement = document.getElementById('xp');
const levelElement = document.getElementById('level');
const progressElement = document.getElementById('progress');
const achievementElement = document.getElementById('achievement');
const confirmationElement = document.getElementById('confirmation');
const cooldownElement = document.getElementById('cooldown');
const confirmResetButton = document.getElementById('confirmReset');
const cancelResetButton = document.getElementById('cancelReset');
const cooldownPopup = document.getElementById('cooldownPopup');

const cooldownDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

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

    // Save streak and xp to localStorage
    localStorage.setItem('streak', streak);
    localStorage.setItem('xp', xp);
}

function showAchievement() {
    achievementElement.style.display = 'flex';
    setTimeout(() => {
        achievementElement.style.display = 'none';
    }, 3000);
}

function showConfirmation() {
    confirmationElement.style.display = 'flex';
}

function hideConfirmation() {
    confirmationElement.style.display = 'none';
}

function showCooldownPopup(timeLeft) {
    cooldownPopup.style.display = 'flex';
    cooldownPopup.querySelector('.time-left').textContent = timeLeft;
    setTimeout(() => {
        cooldownPopup.style.display = 'none';
    }, 3000);
}

function formatTimeLeft(milliseconds) {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
}

document.getElementById('completeChallenge').addEventListener('click', () => {
    const now = Date.now();
    const timeSinceLastCompletion = now - lastCompletedTime;

    if (timeSinceLastCompletion >= cooldownDuration) {
        // Complete challenge
        streak++;
        const xpGain = 10 + Math.floor(streak / 7) * 5;
        xp += xpGain;
        lastCompletedTime = now;

        // Save last completed time to localStorage
        localStorage.setItem('lastCompletedTime', lastCompletedTime);

        // Check if the streak has reached a new level
        if (levels.some(level => level.threshold === streak)) {
            showAchievement();
        }

        updateDisplay();
    } else {
        const timeLeft = formatTimeLeft(cooldownDuration - timeSinceLastCompletion);
        showCooldownPopup(timeLeft); // Show the cooldown popup with time left
    }
});

document.getElementById('relapse').addEventListener('click', () => {
    showConfirmation();
});

confirmResetButton.addEventListener('click', () => {
    streak = 0;
    xp = Math.max(0, xp - 50);
    updateDisplay();
    hideConfirmation();
});

cancelResetButton.addEventListener('click', () => {
    hideConfirmation();
});

// Initial display update on page load
updateDisplay();
