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
  const totalPossibleStars = LESSONS.length * 5;
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
  const maxStars = LESSONS.length * 5;
  
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

  // Group lessons by stage
  const STAGE_SIZE = 5;
  const stageNames = [
    "Stage 1: Grundstellung",
    "Stage 2: Zeigefinger & Mitte",
    "Stage 3: Obere Reihe",
    "Stage 4: Obere Reihe Rand",
    "Stage 5: Untere Reihe",
    "Stage 6: Untere Reihe Rand",
    "Stage 7: Großschreibung",
    "Stage 8: Sonderzeichen",
    "Stage 9: Satzzeichen & Zahlen",
    "Stage 10: Meisterschaft"
  ];
  
  // Calculate statistics per stage
  const stageStats = [];
  for (let i = 0; i < LESSONS.length; i += STAGE_SIZE) {
    const stageLessons = LESSONS.slice(i, i + STAGE_SIZE);
    let allLessonsCompleted = true;
    let totalStarsInStage = 0;
    
    stageLessons.forEach(l => {
        const s = progress[l.id] || 0;
        if (s < 3) allLessonsCompleted = false; // "Completed" means enough stars to unlock next
        totalStarsInStage += s;
    });
    
    stageStats.push({
        completed: allLessonsCompleted,
        avgStars: totalStarsInStage / STAGE_SIZE
    });
  }

  for (let i = 0; i < LESSONS.length; i += STAGE_SIZE) {
    const stageLessons = LESSONS.slice(i, i + STAGE_SIZE);
    const stageIndex = i / STAGE_SIZE;
    
    // Check locked status: Locked if previous stage not completed
    // Stage 0 (first) is never locked by a previous stage
    let isStageLocked = false;
    if (stageIndex > 0) {
        if (!stageStats[stageIndex - 1].completed) {
            isStageLocked = true;
        }
    }
    
    // Create Stage Container
    const stageContainer = document.createElement('div');
    stageContainer.className = `stage-container ${isStageLocked ? 'locked-stage' : ''}`;
    
    const headerDiv = document.createElement('div');
    headerDiv.className = 'stage-header-wrapper';
    
    const stageHeader = document.createElement('h2');
    stageHeader.className = 'stage-header';
    stageHeader.textContent = stageNames[stageIndex] || `Stage ${stageIndex + 1}`;
    headerDiv.appendChild(stageHeader);

    // Show stats if completed, or lock icon if locked
    if (isStageLocked) {
        const lockedBadge = document.createElement('span');
        lockedBadge.className = 'stage-locked-badge';
        lockedBadge.innerHTML = '🔒 Gesperrt';
        headerDiv.appendChild(lockedBadge);
    } else if (stageStats[stageIndex].completed) {
        const avg = stageStats[stageIndex].avgStars.toFixed(1);
        const statsBadge = document.createElement('span');
        statsBadge.className = 'stage-stats-badge';
        statsBadge.innerHTML = `✅ Abgeschlossen (Ø ${avg} ⭐)`;
        headerDiv.appendChild(statsBadge);
    } else {
        // Current open stage
        const openBadge = document.createElement('span');
        openBadge.className = 'stage-open-badge';
        openBadge.innerHTML = '🔓 Freigeschaltet';
        headerDiv.appendChild(openBadge);
    }
    
    stageContainer.appendChild(headerDiv);
    
    const stageGrid = document.createElement('div');
    stageGrid.className = 'stage-grid';
    
    stageLessons.forEach(lesson => {
      const card = document.createElement('div');
      const stars = progress[lesson.id] || 0;
      
      // Keep individual lesson lock logic for fine-grained progression inside a stage
      // If the stage is locked, all lessons are visually locked by the container style,
      // but let's keep the logic consistent.
      
      let isLessonLocked = false;
      if (lesson.id > 1) {
        const prevLessonId = lesson.id - 1;
        const prevStars = progress[prevLessonId] || 0;
        if (prevStars < 3) {
          isLessonLocked = true;
        }
      }
      
      // Force lock if stage is locked
      if (isStageLocked) isLessonLocked = true;

      card.className = `lesson-card ${isLessonLocked ? 'locked' : 'unlocked'}`;
      
      let html = `
        <div class="lesson-number">${lesson.id}</div>
        <div class="lesson-name">${lesson.name}</div>
        <div class="lesson-stars">
      `;
      
      if (isLessonLocked) {
        html += '<span class="lock-icon">🔒</span>';
      } else {
        html += generateStarsHTML(stars);
      }
      
      html += `</div>`;
      card.innerHTML = html;
      
      if (!isLessonLocked) {
        card.addEventListener('click', () => {
          window.location.href = `lesson.html?id=${lesson.id}`;
        });
      }
      
      stageGrid.appendChild(card);
    });
    
    stageContainer.appendChild(stageGrid);
    grid.appendChild(stageContainer);
  }
}

// Helper for rendering stars (full, half, empty)
function generateStarsHTML(stars) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (stars >= i) {
      html += '<span class="star earned">★</span>';
    } else if (stars > i - 1) {
      html += '<span class="star half">★</span>';
    } else {
      html += '<span class="star empty">★</span>';
    }
  }
  return html;
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

  // Check lock status
  if (lessonId > 1) {
    const progress = loadProgress();
    const prevStars = progress[lessonId - 1] || 0;
    if (prevStars < 3) {
      alert("Diese Lektion ist noch gesperrt! Du brauchst 3 Sterne in der vorherigen Lektion.");
      window.location.href = 'index.html';
      return;
    }
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

  // Allow using Enter key to proceed from result screen
  document.addEventListener('keydown', (e) => {
    const resultOverlay = document.getElementById('result-overlay');
    if (resultOverlay && !resultOverlay.classList.contains('hidden') && e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('next-btn').click();
    }
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
  // 1 to 5 stars per lesson based on accuracy/speed average.
  // Accuracy Stars: 50 -> 1, 70 -> 2, 80 -> 3, 90 -> 4, 100 -> 5
  // Speed Stars (50wpm=100%): 50% -> 1, 70% -> 2, 80% -> 3, 90% -> 4, 100% -> 5
  // Total: Average of Accuracy and Speed stars
  
  const speedPercent = Math.round((wpm / 50) * 100);
  
  function getAccuracyStars(percent) {
    if (percent >= 100) return 5;
    if (percent >= 90) return 4;
    if (percent >= 80) return 3;
    if (percent >= 70) return 2;
    if (percent >= 50) return 1;
    return 0;
  }
  
  function getSpeedStars(percent) {
    if (percent >= 100) return 5;
    if (percent >= 80) return 4;
    if (percent >= 60) return 3;
    if (percent >= 40) return 2;
    if (percent >= 15) return 1;
    return 0;
  }
  
  const accuracyStars = getAccuracyStars(accuracy);
  const speedStars = getSpeedStars(speedPercent);
  
  let stars = 0;
  if (accuracyStars > 0 && speedStars > 0) {
    stars = (accuracyStars + speedStars) / 2;
  }
  
  saveProgress(currentLesson.id, stars);
  playWin();
  
  showResult(stars, accuracy, wpm, speedPercent, accuracyStars, speedStars);
}

function showResult(stars, accuracy, wpm, speedPercent, accuracyStars, speedStars) {
  const newLevel = calculatePlayerLevel();
  const newTitle = getTitleForLevel(newLevel);
  const leveledUp = newLevel > previousLevel;
  const newTitleUnlocked = getTitleForLevel(previousLevel) !== newTitle;
  
  // Render stars
  const starsContainer = document.getElementById('result-stars');
  starsContainer.innerHTML = generateStarsHTML(stars);
  
  // Stats
  function getStarsString(count) { // Helper to stringify stars
     return '★'.repeat(count) + '☆'.repeat(5 - count);
  }

  document.getElementById('result-accuracy').innerHTML = ` Genauigkeit: ${accuracy}% <span class="mini-stars">${getStarsString(accuracyStars)}</span>`;
  document.getElementById('result-wpm').innerHTML = `Geschwindigkeit: ${wpm} WPM (${speedPercent}%) <span class="mini-stars">${getStarsString(speedStars)}</span>`;
  
  
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
  
  // Focus next button for keyboard navigation
  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) nextBtn.focus();
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
