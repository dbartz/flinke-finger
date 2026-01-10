// German Typing Trainer - Main Script

// ============== State Management ==============
const STATE_KEY = 'flinke-finger-progress';

function loadProgress() {
  const saved = localStorage.getItem(STATE_KEY);
  return saved ? JSON.parse(saved) : {};
}

function saveProgress(lessonId, stars) {
  const progress = loadProgress();
  // Only save if new score is better
  if (!progress[lessonId] || progress[lessonId] < stars) {
    progress[lessonId] = stars;
    localStorage.setItem(STATE_KEY, JSON.stringify(progress));
  }
  return progress;
}

function resetProgress() {
  localStorage.removeItem(STATE_KEY);
}

function calculatePlayerLevel() {
  const progress = loadProgress();
  const totalPossibleStars = LESSONS.length * 3;
  const earnedStars = Object.values(progress).reduce((sum, stars) => sum + stars, 0);
  // Level 1-100, always start at 1
  return Math.floor((earnedStars / totalPossibleStars) * 99) + 1;
}

function getTotalStars() {
  const progress = loadProgress();
  return Object.values(progress).reduce((sum, stars) => sum + stars, 0);
}

function getTitleForLevel(level) {
  let currentTitle = TITLES[1];
  for (const [lvl, title] of Object.entries(TITLES)) {
    if (level >= parseInt(lvl)) {
      currentTitle = title;
    }
  }
  return currentTitle;
}

// ============== Audio ==============
function initAudio() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (AudioContext) {
    window.audioCtx = new AudioContext();
  }
}

function playClick() {
  if (!window.audioCtx) return;
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillator.frequency.value = 800;
  oscillator.type = 'square';
  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + 0.05);
}

function playError() {
  if (!window.audioCtx) return;
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillator.frequency.value = 200;
  oscillator.type = 'sine';
  gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + 0.15);
}

function playWin() {
  if (!window.audioCtx) return;
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.frequency.value = freq;
    oscillator.type = 'sine';
    const startTime = audioCtx.currentTime + i * 0.1;
    gainNode.gain.setValueAtTime(0.1, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.3);
  });
}

function playLevelUp() {
  if (!window.audioCtx) return;
  const notes = [392, 494, 587, 784, 988, 1175];
  notes.forEach((freq, i) => {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.frequency.value = freq;
    oscillator.type = 'sine';
    const startTime = audioCtx.currentTime + i * 0.08;
    gainNode.gain.setValueAtTime(0.12, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.4);
  });
}

// ============== Game State ==============
let currentLesson = null;
let currentTextIndex = 0;
let currentCharIndex = 0;
let currentText = '';
let charStatus = []; // 'correct' or 'incorrect'
// Session stats (cumulative across all texts in lesson)
let totalLessonErrors = 0;
let totalLessonChars = 0;
let lessonStartTime = null;
let totalPausedTime = 0;
let isPaused = false;
let pauseStartTime = null;
let streak = 0;
let previousLevel = 1;

// ============== Menu Logic (index.html) ==============
function initMenu() {
  renderMenu();
  
  document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm('Wirklich allen Fortschritt löschen? Das kann nicht rückgängig gemacht werden!')) {
      resetProgress();
      renderMenu();
    }
  });
}

function renderMenu() {
  const progress = loadProgress();
  const level = calculatePlayerLevel();
  const title = getTitleForLevel(level);
  const totalStars = getTotalStars();
  const maxStars = LESSONS.length * 3;
  
  // Header
  document.getElementById('player-level').textContent = `Level ${level}`;
  document.getElementById('player-title').textContent = title;
  document.getElementById('star-count').textContent = `⭐ ${totalStars} / ${maxStars}`;
  
  // Progress bar
  const progressPercent = (totalStars / maxStars) * 100;
  document.getElementById('progress-fill').style.width = `${progressPercent}%`;
  
  // Lessons grid
  const grid = document.getElementById('lessons-grid');
  grid.innerHTML = '';
  
  LESSONS.forEach(lesson => {
    const card = document.createElement('div');
    card.className = 'lesson-card';
    const stars = progress[lesson.id] || 0;
    
    card.innerHTML = `
      <div class="lesson-number">${lesson.id}</div>
      <div class="lesson-name">${lesson.name}</div>
      <div class="lesson-stars">
        ${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}
      </div>
    `;
    
    // Navigate to lesson page
    card.addEventListener('click', () => {
      window.location.href = `lesson.html?id=${lesson.id}`;
    });
    grid.appendChild(card);
  });
}

// ============== Game Logic (lesson.html) ==============
function initGame() {
  const params = new URLSearchParams(window.location.search);
  const lessonId = parseInt(params.get('id'));
  
  if (!lessonId) {
    window.location.href = 'index.html';
    return;
  }

  currentLesson = LESSONS.find(l => l.id === lessonId);
  if (!currentLesson) {
    window.location.href = 'index.html';
    return;
  }

  previousLevel = calculatePlayerLevel();
  currentTextIndex = 0;
  
  // Update header title
  document.getElementById('lesson-title').textContent = currentLesson.name;

  // Initialize session stats
  totalLessonErrors = 0;
  totalLessonChars = 0;
  lessonStartTime = Date.now();
  totalPausedTime = 0;

  startNewText();
  
  // Focus game
  document.getElementById('game-view').focus();
  document.getElementById('game-view').addEventListener('keydown', handleKeyPress);
  
  // Controls
  document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = 'index.html';
  });
  
  document.getElementById('pause-btn').addEventListener('click', togglePause);
  document.getElementById('pause-overlay').addEventListener('click', () => {
    if (isPaused) togglePause();
  });

  // Result buttons
  document.getElementById('retry-btn').addEventListener('click', () => {
    window.location.reload();
  });
  
  document.getElementById('next-btn').addEventListener('click', () => {
    const nextLesson = LESSONS.find(l => l.id === currentLesson.id + 1);
    if (nextLesson) {
      window.location.href = `lesson.html?id=${nextLesson.id}`;
    } else {
      window.location.href = 'index.html';
    }
  });
  
  document.getElementById('menu-btn').addEventListener('click', () => {
    window.location.href = 'index.html';
  });
}

function startNewText() {
  currentText = currentLesson.texts[currentTextIndex];
  currentCharIndex = 0;
  charStatus = new Array(currentText.length).fill(null);
  // errors = 0; // Removed: collecting global errors now
  // startTime = Date.now(); // Removed: using lessonStartTime
  isPaused = false;
  streak = 0;
  
  // Accumulate total chars (texts can vary in length)
  totalLessonChars += currentText.length;
  
  document.getElementById('lesson-progress').textContent = `Text ${currentTextIndex + 1}/${currentLesson.texts.length}`;
  renderText();
  updateStreak();
}

function renderText() {
  const container = document.getElementById('text-display');
  container.innerHTML = '';
  
  for (let i = 0; i < currentText.length; i++) {
    const span = document.createElement('span');
    span.textContent = currentText[i] === ' ' ? '␣' : currentText[i];
    
    if (i < currentCharIndex) {
      if (charStatus[i] === 'correct') {
        span.className = 'typed correct';
      } else {
        span.className = 'typed incorrect';
      }
    } else if (i === currentCharIndex) {
      span.className = 'current';
    } else {
      span.className = 'pending';
    }
    
    container.appendChild(span);
  }
}

function handleKeyPress(e) {
  if (isPaused) return;
  
  // Ignore modifiers
  if (['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return;
  
  // Resume audio context
  if (window.audioCtx && window.audioCtx.state === 'suspended') {
    window.audioCtx.resume();
  }
  
  const expectedChar = currentText[currentCharIndex];
  
  if (e.key === expectedChar) {
    playClick();
    charStatus[currentCharIndex] = 'correct';
    currentCharIndex++;
    streak++;
    updateStreak();
    renderText();
    
    if (currentCharIndex >= currentText.length) {
      handleTextComplete();
    }
  } else if (e.key.length === 1) { 
    playError();
    charStatus[currentCharIndex] = 'incorrect';
    totalLessonErrors++;
    currentCharIndex++; // Advance even on error
    streak = 0;
    updateStreak();
    renderText();

    const container = document.getElementById('text-display');
    container.classList.add('shake');
    setTimeout(() => container.classList.remove('shake'), 200);

    if (currentCharIndex >= currentText.length) {
      handleTextComplete();
    }
  }
  
  e.preventDefault();
}

function updateStreak() {
  const gameView = document.getElementById('game-view');
  if (!gameView) return;
  
  if (streak >= 10) {
    gameView.classList.add('streak');
  } else {
    gameView.classList.remove('streak');
  }
}

function handleTextComplete() {
  currentTextIndex++;
  
  if (currentTextIndex >= currentLesson.texts.length) {
    finishLesson();
  } else {
    startNewText();
  }
}

function finishLesson() {
  const endTime = Date.now();
  const timeSpentMinutes = (endTime - lessonStartTime - totalPausedTime) / 1000 / 60;
  
  // Calculate based on cumulative stats
  const accuracy = Math.max(0, Math.round(((totalLessonChars - totalLessonErrors) / totalLessonChars) * 100));
  
  // WPM
  const words = totalLessonChars / 5;
  const wpm = Math.round(words / Math.max(timeSpentMinutes, 0.001)); 
  
  // Star Calculation
  // Speed 50wpm = 100%
  // Average = (Speed% + Accuracy%) / 2
  // 1 star: Avg >= 50%
  // 2 stars: Avg >= 75%
  // 3 stars: Accuracy == 100% AND Speed >= 50wpm
  
  const speedPercent = Math.round((wpm / 50) * 100);
  const average = (speedPercent + accuracy) / 2;
  
  let stars = 0;
  if (average >= 50) stars = 1;
  if (average >= 75) stars = 2;
  if (accuracy === 100 && wpm >= 50) stars = 3;
  
  // Minimum 1 star if completed (optional, adhering to "One star: average 50%")
  // But usually 0 stars is valid. I'll stick to 0 if they do poorly.
  
  saveProgress(currentLesson.id, stars);
  playWin();
  
  showResult(stars, accuracy, wpm, speedPercent);
}

function showResult(stars, accuracy, wpm, speedPercent) {
  const newLevel = calculatePlayerLevel();
  const newTitle = getTitleForLevel(newLevel);
  const leveledUp = newLevel > previousLevel;
  const newTitleUnlocked = getTitleForLevel(previousLevel) !== newTitle;
  
  // Render stars
  const starsContainer = document.getElementById('result-stars');
  starsContainer.innerHTML = '';
  for (let i = 1; i <= 3; i++) {
    const star = document.createElement('span');
    star.className = 'star ' + (i <= stars ? 'earned' : 'empty');
    star.textContent = '★';
    starsContainer.appendChild(star);
  }
  
  // Stats
  document.getElementById('result-accuracy').textContent = `Genauigkeit: ${accuracy}%`;
  document.getElementById('result-wpm').textContent = `Geschwindigkeit: ${wpm} WPM (${speedPercent}%)`;
  
  // Level up message
  const levelUpEl = document.getElementById('level-up-message');
  if (leveledUp) {
    levelUpEl.textContent = `🎉 Level Up! Du bist jetzt Level ${newLevel}!`;
    levelUpEl.classList.remove('hidden');
    playLevelUp();
  } else {
    levelUpEl.classList.add('hidden');
  }
  
  // New title message
  const titleEl = document.getElementById('new-title-message');
  if (newTitleUnlocked) {
    titleEl.textContent = `🏆 Neuer Titel: ${newTitle}!`;
    titleEl.classList.remove('hidden');
  } else {
    titleEl.classList.add('hidden');
  }
  
  // Confetti for 3 stars
  if (stars === 3 && window.confetti) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
  
  // Show overlay
  document.getElementById('result-overlay').classList.remove('hidden');
}

function togglePause() {
  isPaused = !isPaused;
  const pauseBtn = document.getElementById('pause-btn');
  const overlay = document.getElementById('pause-overlay');
  
  if (isPaused) {
    pauseStartTime = Date.now();
    pauseBtn.textContent = '▶ Weiter';
    overlay.classList.remove('hidden');
  } else {
    totalPausedTime += Date.now() - pauseStartTime;
    pauseBtn.textContent = '⏸ Pause';
    overlay.classList.add('hidden');
    document.getElementById('game-view').focus();
  }
}

// ============== Initialization ==============
document.addEventListener('DOMContentLoaded', () => {
  initAudio();
  
  if (document.getElementById('menu-view')) {
    initMenu();
  } else if (document.getElementById('game-view')) {
    initGame();
  }
});
