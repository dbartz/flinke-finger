# German Typing Trainer - Project Plan

## 1. Project Structure
- `index.html`: Single Page Application containing both the Landing Page (Level Selector) and Game View.
- `style.css`: Styling for the interface, including animations for stars and feedback.
- `script.js`: 
  - Game logic (typing, checking).
  - State management (loading/saving progress).
  - View switching (Menu <-> Game).
- `data.js`: Structured content with levels of increasing difficulty.
- `assets/`: Directory for sound files (e.g., `click.mp3`, `win.mp3`, `error.mp3`).

## 2. Features

### Core Mechanics
- **Text Display**: Display current word/sentence.
- **Typing Logic**: Visual feedback for correct/incorrect keys.
- **Audio**: "Clicky" mechanical keyboard sound on keypress.

### Progression System
- **Levels**: Multiple lessons increasing in difficulty (e.g., "Home Row", "Simple Words", "Sentences").
- **Scoring**: 1 to 3 stars based on accuracy and speed.
- **Persistence**: Use `localStorage` (modern alternative to cookies) to store earned stars and unlock status per level.

### Gamification & Fun (New!)
- **Visual Rewards**: Confetti explosion on 3-star victories (using `canvas-confetti` library).
- **Streak Mode**: Screen border glows (e.g., gold or fire effect) when typing 10+ characters without error.
- **Unlockable Themes**: Earning stars unlocks new color themes (e.g., "Underwater", "Space", "Candy").
- **Sound Feedback**: Distinct sounds for errors (gentle "bonk") vs success vs level complete fanfare.

### UI/UX
- **Landing Page**: Grid of levels showing current star progress.
- **Game Interface**: Clean focus mode with a "Back to Menu" button.
- **Result Screen**: Shows stars earned, WPM (Words Per Minute), and "Next Level" button.

## 3. Implementation Steps
1.  **Scaffold**: Setup files and `assets` folder.
2.  **Dependencies**: Add lightweight confetti library (CDN).
3.  **Data Structure**: Define levels in `data.js`.
4.  **State Management**: Implement `saveProgress` & `loadProgress`.
5.  **Game Loop**: 
    - Implement typing checks & streak counter.
    - Play sounds (click, error, win).
    - Calculate score/stars.
6.  **Gamification Logic**: 
    - Trigger confetti on win.
    - Apply streak styles.
    - Check for theme unlocks.
7.  **Styling**: Apply kid-friendly theme with animations.

## 4. Deployment
- **Compatibility**: Fully compatible with GitHub Pages.
- **Status**: Repository already configured for GitHub Pages on `main`.
