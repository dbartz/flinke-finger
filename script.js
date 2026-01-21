// German Typing Trainer - Main Script

// ============== State Management ==============
const STATE_KEY = 'flinke-finger-progress';
const BEST_RUNS_KEY = 'flinke-finger-best-runs';

function loadProgress() {
  const saved = localStorage.getItem(STATE_KEY);
  return saved ? JSON.parse(saved) : {};
}

function loadBestRuns() {
    const saved = localStorage.getItem(BEST_RUNS_KEY);
    return saved ? JSON.parse(saved) : {};
}

function saveBestRun(lessonId, runData) {
    const bestRuns = loadBestRuns();
    // Logic: Is this new run better?
    // Criteria: More stars, or same stars and higher wpm
    const currentBest = bestRuns[lessonId];
    
    let isBetter = false;
    if (!currentBest) {
        isBetter = true;
    } else {
        if (runData.stars > currentBest.stars) {
            isBetter = true;
        } else if (runData.stars === currentBest.stars) {
            if (runData.wpm > currentBest.wpm) {
                isBetter = true;
            }
        }
    }
    
    if (isBetter) {
        bestRuns[lessonId] = runData;
        localStorage.setItem(BEST_RUNS_KEY, JSON.stringify(bestRuns));
    }
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
let streak = 0;
let previousLevel = 1;

// ============== Menu Logic (index.html) ==============
function initMenu() {
  renderMenu();
  
  // Navigate to specific lesson if hash is present
  if (window.location.hash) {
    const id = window.location.hash.substring(1);
    const element = document.getElementById(id);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }
  
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

  const tocList = document.getElementById('toc-list');
  if (tocList) tocList.innerHTML = '';

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
    
    const stageName = stageNames[stageIndex] || `Stage ${stageIndex + 1}`;
    // User requested removing "Stage" from the TOC name
    const tocName = stageName.replace('Stage ', '');
    
    // TOC Item
    if (tocList) {
        const li = document.createElement('li');
        li.className = 'toc-item';
        
        const link = document.createElement('a');
        link.href = `#stage-${stageIndex}`;
        
        const titleSpan = document.createElement('span');
        titleSpan.className = 'toc-title';
        titleSpan.textContent = tocName;
        link.appendChild(titleSpan);
        
        const badgeSpan = document.createElement('span');
        if (isStageLocked) {
           badgeSpan.className = 'toc-badge locked';
           badgeSpan.innerHTML = '🔒';
        } else if (stageStats[stageIndex].completed) {
           const avg = stageStats[stageIndex].avgStars.toFixed(1);
           badgeSpan.className = 'toc-badge completed';
           badgeSpan.innerHTML = `✅ Ø ${avg} ⭐`;
        } else {
           badgeSpan.className = 'toc-badge open';
           badgeSpan.innerHTML = '🔓';
        }
        link.appendChild(badgeSpan);
        li.appendChild(link);
        tocList.appendChild(li);
    }
    
    // Create Stage Container
    const stageContainer = document.createElement('div');
    stageContainer.id = `stage-${stageIndex}`; // Add ID for scrolling
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

      // Assign an ID so we can anchor-link back to this lesson
      card.id = `lesson-${lesson.id}`;
      card.className = `lesson-card ${isLessonLocked ? 'locked' : 'unlocked'}`;
      
      let html = `
        <div class="lesson-number">${lesson.id}</div>
        <div class="lesson-name">${lesson.name}</div>
        <div class="lesson-description">${lesson.description}</div>
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

  // Render unlocked keys on main menu
  let maxUnlockedId = 1;
  for (let i = 1; i < LESSONS.length; i++) {
    const lesson = LESSONS[i];
    const prevStars = progress[lesson.id - 1] || 0;
    if (prevStars >= 3) {
      maxUnlockedId = lesson.id;
    } else {
      break;
    }
  }

  if (document.getElementById('keyboard-container')) {
    renderKeyboard(maxUnlockedId);
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

  // Show Start Overlay instead of starting immediately
  const startOverlay = document.getElementById('start-overlay');
  if (startOverlay) {
    document.getElementById('start-lesson-title').textContent = currentLesson.name;
    document.getElementById('start-lesson-desc').textContent = currentLesson.description;
    
    // Show stats on start screen
    const targetWPM = currentLesson.targetSpeed || 50;
    document.getElementById('start-target-wpm').textContent = `${targetWPM} WPM`;
    
    const bestRuns = loadBestRuns();
    const best = bestRuns[currentLesson.id];
    if (best) {
        document.getElementById('start-best-wpm-val').textContent = `${best.wpm} WPM`;
        document.getElementById('start-best-acc-val').textContent = `${best.accuracy}%`;
        
        // Recalculate stars breakdown for display
        const speedPercent = Math.round((best.wpm / targetWPM) * 100);
        const accuracyStars = getAccuracyStars(best.accuracy);
        const speedStars = getSpeedStars(speedPercent);
        
        document.getElementById('start-best-acc-stars').innerHTML = getStarsString(accuracyStars);
        document.getElementById('start-best-wpm-stars').innerHTML = getStarsString(speedStars);
        document.getElementById('start-best-total-stars').innerHTML = generateStarsHTML(best.stars);
    } else {
        ['start-best-wpm-val', 'start-best-acc-val'].forEach(id => document.getElementById(id).textContent = '-');
        ['start-best-acc-stars', 'start-best-wpm-stars', 'start-best-total-stars'].forEach(id => document.getElementById(id).innerHTML = '');
    }

    startOverlay.classList.remove('hidden');
    
    // Focus start button for accessibility
    const startBtn = document.getElementById('start-game-btn');
    startBtn.focus();
    
    startBtn.onclick = () => {
      startOverlay.classList.add('hidden');
      startGameflow();
    };

    const menuBtn = document.getElementById('start-menu-btn');
    if (menuBtn) {
        menuBtn.onclick = () => {
            window.location.href = `index.html#lesson-${currentLesson.id}`;
        };
    }
    
    // Allow Enter key to start logic is handled by button focus usually, 
    // but just in case focus is lost or not set:
    startOverlay.onkeydown = (e) => {
        if(e.key === 'Enter') {
            startBtn.click();
        }
    }
    
  } else {
    // Fallback if overlay doesn't exist
    startGameflow();
  }

  function startGameflow() {
    lessonStartTime = Date.now();
    startNewText();
    renderKeyboard(currentLesson.id);
    
    // Focus game
    const gameView = document.getElementById('game-view');
    gameView.focus();
    gameView.addEventListener('keydown', handleKeyPress);
  }
  
  // Controls
  document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = `index.html#lesson-${currentLesson.id}`;
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
    window.location.href = `index.html#lesson-${currentLesson.id}`;
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
  
  // Accumulate total chars (texts can vary in length)
  totalLessonChars += currentText.length;
  
  document.getElementById('lesson-progress').textContent = `Text ${currentTextIndex + 1}/${currentLesson.texts.length}`;
  renderText();
  updateStreak();
  highlightNextKey();
  updateHands();
}

function updateHands() {
  // Clear previous
  document.querySelectorAll('.finger.active-finger').forEach(f => f.classList.remove('active-finger'));
  
  if (currentCharIndex >= currentText.length) return;
  
  const char = currentText[currentCharIndex];
  let normalizedKey = char.toLowerCase();
  if (char === ' ') normalizedKey = 'space';
  
  // Find which finger(s) are responsible
  for (const [fingerId, keys] of Object.entries(FINGER_MAPPING)) {
    // Check both normalized and raw char (for symbols)
    if (keys.includes(normalizedKey) || keys.includes(char)) {
       const fingerEl = document.getElementById(fingerId);
       if (fingerEl) fingerEl.classList.add('active-finger');
    }
  }
  
  // Handle Shift logic
  // If char is uppercase and is a letter, or is a symbol requiring shift
  // Simplified logic: Check if char != normalized (for letters) or is specific symbol
  const shiftSymbols = ['!', '"', '§', '$', '%', '&', '/', '(', ')', '=', '?', '`', '*', '>', ';', ':'];
  const needsShift = (char !== normalizedKey && char.toUpperCase() !== char.toLowerCase()) || shiftSymbols.includes(char);
  
  if (needsShift) {
      // If right hand is typing, use left shift. If left hand, use right shift.
      const rightHandFingers = ['r-index', 'r-middle', 'r-ring', 'r-pinky', 'r-thumb'];
      let isRightHandChar = false;
      
      for (const [fingerId, keys] of Object.entries(FINGER_MAPPING)) {
         if (keys.includes(normalizedKey) && rightHandFingers.includes(fingerId)) {
             isRightHandChar = true;
             break;
         }
      }
      
      const shiftFingerId = isRightHandChar ? 'l-pinky' : 'r-pinky';
      const shiftEl = document.getElementById(shiftFingerId);
      if (shiftEl) shiftEl.classList.add('active-finger');
  }
}

function renderText() {
  const container = document.getElementById('text-display');
  container.innerHTML = '';
  
  // Render active line
  const activeLine = document.createElement('div');
  activeLine.className = 'line active-line';
  
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
    
    activeLine.appendChild(span);
  }
  container.appendChild(activeLine);

  // Render up to 2 previews
  for (let i = 1; i <= 2; i++) {
    const nextIdx = currentTextIndex + i;
    if (nextIdx < currentLesson.texts.length) {
      const nextLine = document.createElement('div');
      nextLine.className = 'line next-line';
      nextLine.textContent = currentLesson.texts[nextIdx];
      container.appendChild(nextLine);
    }
  }
}

function handleKeyPress(e) {
  if (e.key === 'Escape') {
    window.location.href = 'index.html';
    return;
  }
  
  // Ignore modifiers except for visual feedback on keyboard?
  // We can show visual press for any key.
  highlightKey(e.key);

  if (['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return;
  
  // Resume audio context
  if (window.audioCtx && window.audioCtx.state === 'suspended') {
    window.audioCtx.resume();
  }
  
  const expectedChar = currentText[currentCharIndex];
  
  if (e.key === expectedChar) {
    playClick();
    charStatus[currentCharIndex] = 'correct';
    
    // Feedback
    showKeyFeedback(e.key, 'success');
    
    currentCharIndex++;
    streak++;
    updateStreak();
    renderText();
    
    if (currentCharIndex >= currentText.length) {
      handleTextComplete();
    } else {
        highlightNextKey();
        updateHands();
    }
  } else if (e.key.length === 1) { 
    playError();
    charStatus[currentCharIndex] = 'incorrect';
    
    // Feedback
    showKeyFeedback(e.key, 'error');
    
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
    } else {
        highlightNextKey();
        updateHands();
    }
  }
  
  e.preventDefault();
}

function showKeyFeedback(key, type) {
    const keys = document.querySelectorAll('.key');
    let normalized = key.toLowerCase();
    if (key === ' ') normalized = 'space';
    
    keys.forEach(k => {
        if (k.dataset.key === normalized) {
            k.classList.add(type);
            setTimeout(() => k.classList.remove(type), 200);
        }
    });
}

function highlightNextKey() {
    // Clear previous
    document.querySelectorAll('.key.target').forEach(k => k.classList.remove('target'));
    
    if (currentCharIndex >= currentText.length) return;
    
    const char = currentText[currentCharIndex];
    let normalized = char.toLowerCase();
    if (char === ' ') normalized = 'space';
   
    const keys = document.querySelectorAll('.key');
    keys.forEach(k => {
        if (k.dataset.key === normalized) {
            k.classList.add('target');
        }
    });
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

// ============== Stats Helpers ==============
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

function getStarsString(count) {
  return '★'.repeat(count) + '☆'.repeat(5 - count);
}

function finishLesson() {
  const endTime = Date.now();
  const timeSpentMinutes = (endTime - lessonStartTime) / 1000 / 60;
  
  // Calculate based on cumulative stats
  const accuracy = Math.max(0, Math.round(((totalLessonChars - totalLessonErrors) / totalLessonChars) * 100));
  
  // WPM
  const words = totalLessonChars / 5;
  const targetWPM = currentLesson.targetSpeed || 50;
  
  const wpm = Math.round(words / Math.max(timeSpentMinutes, 0.001)); 
  
  // Star Calculation
  // 1 to 5 stars per lesson based on accuracy/speed average.
  // Accuracy Stars: 50 -> 1, 70 -> 2, 80 -> 3, 90 -> 4, 100 -> 5
  // Speed Stars (targetWPM=100%): 50% -> 1, 70% -> 2, 80% -> 3, 90% -> 4, 100% -> 5
  // Total: Average of Accuracy and Speed stars
  
  const speedPercent = Math.round((wpm / targetWPM) * 100);
  
  const accuracyStars = getAccuracyStars(accuracy);
  const speedStars = getSpeedStars(speedPercent);
  
  let stars = 0;
  if (accuracyStars > 0 && speedStars > 0) {
    stars = (accuracyStars + speedStars) / 2;
  }
  
  saveProgress(currentLesson.id, stars);
  
  // Save detailed stats
  saveBestRun(currentLesson.id, {
      wpm: wpm,
      accuracy: accuracy,
      stars: stars,
      date: new Date().toISOString()
  });

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

// ============== Initialization ==============
document.addEventListener('DOMContentLoaded', () => {
  initAudio();
  
  if (document.getElementById('menu-view')) {
    initMenu();
  } else if (document.getElementById('game-view')) {
    initGame();
  }
});

// ============== Keyboard Logic ==============
const FINGER_MAPPING = {
  'l-pinky': ['^', '°', '1', '!', 'q', 'a', 'y', '<', '>', '|', 'shift-l'],
  'l-ring': ['2', '"', 'w', 's', 'x'],
  'l-middle': ['3', '§', 'e', 'd', 'c'],
  'l-index': ['4', '$', '5', '%', 'r', 't', 'f', 'g', 'v', 'b'],
  'l-thumb': ['space'],
  'r-thumb': ['space'],
  'r-index': ['6', '&', '7', '/', 'z', 'u', 'h', 'j', 'n', 'm'],
  'r-middle': ['8', '(', 'i', 'k', ',', ';'],
  'r-ring': ['9', ')', 'o', 'l', '.', ':'],
  'r-pinky': ['0', '=', 'ß', '?', 'p', 'ö', '-', '_', 'ä', 'ü', '+', '*', '#', "'", 'enter', 'shift-r']
};

const KEYBOARD_LAYOUT = [
  ['^', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'ß', '´'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P', 'Ü', '+'],
  ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ö', 'Ä', '#', 'Enter'],
  ['Shift', '<', 'Y', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '-', 'Shift'],
  ['Space']
];

const KEY_UNLOCKS = {
  1: ['f', 'j'],
  2: ['d', 'k'],
  3: ['s', 'l'],
  4: ['a', 'ö'],
  6: ['g', 'h'],
  7: ['e', 'i'],
  11: ['r', 'u'],
  12: ['t', 'z'],
  16: ['w', 'o'],
  17: ['q', 'p'],
  21: ['v', 'b'],
  22: ['n', 'm'],
  26: ['c'],
  27: ['x'],
  28: ['y'],
  31: ['shift', 'caps'], 
  36: ['ä'],
  38: ['ü'],
  39: ['ß'],
  41: ['.', ','],
  43: ['1', '2', '3', '4', '5'],
  44: ['6', '7', '8', '9', '0']
};

function getKnownKeys(currentLessonId) {
  const known = new Set();
  
  // Base structural keys
  ['space', 'enter', 'tab'].forEach(k => known.add(k));

  for (const [lvl, keys] of Object.entries(KEY_UNLOCKS)) {
    if (currentLessonId >= parseInt(lvl)) {
      keys.forEach(k => known.add(k.toLowerCase()));
    }
  }
  return known;
}

function renderKeyboard(lessonId) {
  const container = document.getElementById('keyboard-container');
  if (!container) return;
  container.innerHTML = '';
  
  const knownKeys = getKnownKeys(lessonId);
  
  KEYBOARD_LAYOUT.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'kb-row';
    
    row.forEach(keyChar => {
      const keyDiv = document.createElement('div');
      keyDiv.className = 'key';
      
      const normalizedKey = keyChar.toLowerCase();
      let displayName = keyChar;
      if (keyChar === 'Space') displayName = '␣';
      
      // Check if known
      let isKnown = knownKeys.has(normalizedKey);
      
      // Auto-unlock specific structural symbols if not explicitly tracked
      if (['tab', 'caps', 'shift', 'enter', 'space', 'ctrl', 'opt', 'cmd'].includes(normalizedKey)) {
           // Shift/Caps only known if unlocked via lesson 31? 
           // Wait, "Space" is needed from start. "Enter" is needed?
           // Actually, let's just show Space/Enter always.
           if (['space', 'enter'].includes(normalizedKey)) isKnown = true;
           // Shift/Caps only if level >= 31
           if (['shift', 'caps'].includes(normalizedKey) && lessonId >= 31) isKnown = true;
           
           // If it's Lesson 1, Shift shouldn't be visible yet? 
           // If user presses Shift inadvertently, it works, but visually maybe hidden?
           // The prompt said "only showing the letters of the keys already introduced".
           // So I should hide Shift until Stage 7.
      }
       
      // Override for modifiers if strict mode
      if (['tab', 'ctrl', 'opt', 'cmd', '#', '+', '<', '´', '^'].includes(normalizedKey)) {
         // Hide these for now unless explicit?
         // They are not in unlock map, so they remain hidden/dimmed.
         // Effectively "unknown".
      }

      if (isKnown) {
        keyDiv.textContent = displayName;
        keyDiv.classList.add('known');
        keyDiv.dataset.key = normalizedKey;
      } else {
        keyDiv.classList.add('unknown');
        // keyDiv.textContent = ''; // Keep content for debug or just hide via CSS color: transparent
        keyDiv.textContent = displayName; // CSS handles transparency
      }
      
      // Special styling classes
      if (keyChar.length > 1) keyDiv.classList.add('wide');
      if (keyChar === 'Space') keyDiv.classList.add('space-key');
      
      rowDiv.appendChild(keyDiv);
    });
    
    container.appendChild(rowDiv);
  });
}

function highlightKey(key) {
    let normalized = key.toLowerCase();
    if (key === ' ') normalized = 'space';
    // Handle special cases
    if (key === 'Control') normalized = 'ctrl'; // Not in layout
    if (key === 'Shift') normalized = 'shift';
    if (key === 'Enter') normalized = 'enter';
    if (key === 'Backspace') normalized = 'backspace'; // Not in layout
    
    // Find key element by text content or dataset
    const keys = document.querySelectorAll('.key');
    keys.forEach(k => {
        if (k.dataset.key === normalized) {
            k.classList.add('active');
            setTimeout(() => k.classList.remove('active'), 150);
        }
    });
}
