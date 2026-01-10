# German Typing Trainer - Project Plan

## 1. Project Structure
- `index.html`: Single Page Application containing both the Landing Page (Level Selector) and Game View.
- `style.css`: Styling for the interface, including animations for stars and feedback.
- `script.js`: 
  - Game logic (typing, checking).
  - State management (loading/saving progress).
  - View switching (Menu <-> Game).
- `data.js`: Structured content with lessons.
- `assets/`: Directory for sound files (e.g., `click.mp3`, `win.mp3`, `error.mp3`).

## 2. Features

### Core Mechanics
- **Text Display**: Display current word/sentence.
- **Typing Logic**: Visual feedback for correct/incorrect keys.
- **Audio**: "Clicky" mechanical keyboard sound on keypress.

### RPG Progression System (New!)
- **Player Level (1-100)**: 
  - Calculated dynamically: `(Total Stars Earned / Total Possible Stars) * 100`.
  - Motivating progress bar on the Landing Page.
- **Titles**: 
  - Unlock a fancy new title every 5 levels (e.g., Level 5: "Tasten-Neuling", Level 10: "Buchstaben-Jäger", Level 100: "Tipp-Legende").
  - Titles displayed prominently next to the username/avatar.
- **Lesson Stars**: 1 to 3 stars per lesson based on accuracy/speed.
- **Persistence**: Save `stars` per lesson in `localStorage`. Level and Titles are derived from this data.

### Gamification & Fun
- **Visual Rewards**: Confetti explosion on 3-star victories.
- **Streak Mode**: Screen border glows when typing 10+ characters without error.
- **Unlockable Themes**: Earning stars unlocks new color themes.
- **Sound Feedback**: Distinct sounds for errors, success, and level ups.

### UI/UX
- **Landing Page**: 
  - **Header**: Player Level, Progress Bar, Current Title.
  - **Grid**: Lesson selector showing star progress per lesson.
- **Game Interface**: Clean focus mode.
- **Result Screen**: Shows stars earned, new Player Level progress, and Title unlocks if applicable.

## 3. Implementation Steps
1.  **Scaffold**: Setup files and `assets` folder.
2.  **Data**: Define 20+ initial lessons in `data.js` to ensure the 100-level scale feels meaningful. Define `Titles` array.
3.  **State Management**: 
    - `calculatePlayerLevel()` function.
    - `getTitleForLevel(level)` function.
4.  **Game Loop**: 
    - Update logic to re-calculate player level after every finished lesson.
    - Check for "Level Up" or "New Title" events to trigger specific celebrations.
5.  **UI Updates**: Add the Level/Title header to the main menu.
6.  **Gamification**: Confetti, Streaks, Sounds.
7.  **Styling**: Kid-friendly theme.

## 4. Deployment
- **Compatibility**: GitHub Pages (Client-side only).
