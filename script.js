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
let clickSound = null;
let errorSound = null;
let winSound = null;

function initAudio() {
  // Create audio elements using Web Audio API oscillator for click sounds
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
  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
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
  const notes = [392, 494, 587, 784, 988, 1175]; // G4, B4, D5, G5, B5, D6
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
let errors = 0;
let totalChars = 0;
let startTime = null;
let isPaused = false;
let pauseStartTime = null;
let totalPausedTime = 0;
let streak = 0;
let previousLevel = 1;

// ============== View Management ==============
function showView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
}

function showMenu() {
  renderMenu();
  showView('menu-view');
}

function showGame(lessonId) {
  currentLesson = LESSONS.find(l => l.id === lessonId);
  if (!currentLesson) return;
  
  previousLevel = calculatePlayerLevel();
  currentTextIndex = 0;
  startNewText();
  showView('game-view');
  document.getElementById('lesson-title').textContent = currentLesson.name;
  document.getElementById('lesson-progress').textContent = `Text ${currentTextIndex + 1}/${currentLesson.texts.length}`;
  
  // Focus for keyboard input
  document.getElementById('game-view').focus();
}

function showResult(stars, accuracy, wpm) {
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
  document.getElementById('result-wpm').textContent = `Geschwindigkeit: ${wpm} WPM`;
  
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
  
  showView('result-view');
}

// ============== Menu Rendering ==============
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
    
    card.addEventListener('click', () => showGame(lesson.id));
    grid.appendChild(card);
  });
}

// ============== Game Logic ==============
function startNewText() {
  currentText = currentLesson.texts[currentTextIndex];
  currentCharIndex = 0;
  errors = 0;
  totalChars = currentText.length;
  startTime = Date.now();
  totalPausedTime = 0;
  isPaused = false;
  streak = 0;
  
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
      span.className = 'typed';
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
  
  // Ignore modifier keys alone
  if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') {
    return;
  }
  
  // Resume audio context if suspended (browser autoplay policy)
  if (window.audioCtx && window.audioCtx.state === 'suspended') {
    window.audioCtx.resume();
  }
  
  const expectedChar = currentText[currentCharIndex];
  
  if (e.key === expectedChar) {
    playClick();
    currentCharIndex++;
    streak++;
    updateStreak();
    renderText();
    
    // Check if text complete
    if (currentCharIndex >= currentText.length) {
      handleTextComplete();
    }
  } else if (e.key.length === 1) { // Ignore special keys like Backspace
    playError();
    errors++;
    streak = 0;
    updateStreak();
    
    // Visual error feedback
    const container = document.getElementById('text-display');
    container.classList.add('shake');
    setTimeout(() => container.classList.remove('shake'), 200);
  }
  
  e.preventDefault();
}

function updateStreak() {
  const gameView = document.getElementById('game-view');
  if (streak >= 10) {
    gameView.classList.add('streak');
  } else {
    gameView.classList.remove('streak');
  }
}

function handleTextComplete() {
  currentTextIndex++;
  document.getElementById('lesson-progress').textContent = `Text ${Math.min(currentTextIndex + 1, currentLesson.texts.length)}/${currentLesson.texts.length}`;
  
  if (currentTextIndex >= currentLesson.texts.length) {
    // Lesson complete
    finishLesson();
  } else {
    // Next text
    startNewText();
  }
}

function finishLesson() {
  const endTime = Date.now();
  const timeSpent = (endTime - startTime - totalPausedTime) / 1000 / 60; // minutes
  
  // Calculate total chars and errors across all texts
  let totalTypedChars = 0;
  currentLesson.texts.forEach(t => totalTypedChars += t.length);
  
  const accuracy = Math.max(0, Math.round(((totalTypedChars - errors) / totalTypedChars) * 100));
  const words = totalTypedChars / 5; // Standard: 5 chars = 1 word
  const wpm = Math.round(words / Math.max(timeSpent, 0.1));
  
  // Calculate stars
  let stars = 1;
  if (accuracy >= 90 && wpm >= 20) stars = 2;
  if (accuracy >= 98 && wpm >= 30) stars = 3;
  
  // Save progress
  saveProgress(currentLesson.id, stars);
  playWin();
  
  showResult(stars, accuracy, wpm);
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

// ============== Event Listeners ==============
document.addEventListener('DOMContentLoaded', () => {
  initAudio();
  showMenu();
  
  // Keyboard input for game
  document.getElementById('game-view').addEventListener('keydown', handleKeyPress);
  
  // Menu button
  document.getElementById('back-btn').addEventListener('click', showMenu);
  
  // Pause button
  document.getElementById('pause-btn').addEventListener('click', togglePause);
  
  // Resume from pause overlay
  document.getElementById('pause-overlay').addEventListener('click', () => {
    if (isPaused) togglePause();
  });
  
  // Result buttons
  document.getElementById('retry-btn').addEventListener('click', () => showGame(currentLesson.id));
  document.getElementById('next-btn').addEventListener('click', () => {
    const nextLesson = LESSONS.find(l => l.id === currentLesson.id + 1);
    if (nextLesson) {
      showGame(nextLesson.id);
    } else {
      showMenu();
    }
  });
  document.getElementById('menu-btn').addEventListener('click', showMenu);
  
  // Reset progress
  document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm('Wirklich allen Fortschritt löschen? Das kann nicht rückgängig gemacht werden!')) {
      resetProgress();
      renderMenu();
    }
  });
});
