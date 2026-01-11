# German Typing Trainer - Project Plan

## 1. Project Structure

- `index.html`: Landing Page (Level Selector).
- `lesson.html`: Dedicated page for the running lesson.
- `style.css`: Styling for the interface, including animations for stars and feedback.
- `script.js`:
  - Game logic (typing, checking).
  - State management (loading/saving progress).
  - Navigation parameters (handling URL parameters to load correct lesson).
- `data.js`: Structured content with lessons.
- `assets/`: Directory for sound files (e.g., `click.mp3`, `win.mp3`, `error.mp3`).

## 2. Features

### Core Mechanics

- **Text Display**: Display current word/sentence.
- **Typing Logic**: Visual feedback for correct/incorrect keys.
- **Audio**: "Clicky" mechanical keyboard sound on keypress.
- **Pause/Resume**: Ability to pause the timer/game loop during a lesson.

### RPG Progression System

- **Structure**:
  - The game is divided into **10 Stages**.
  - Each Stage contains **5 Lectures (Lessons)**.
  - Total: 50 Lessons.
- **Progression Gate (Unlocking)**:
  - Lessons are linear.
  - A lesson is **grayed out/locked** until the player earns **at least 3 stars** in the previous lesson.
  - Completing all 5 lessons in a stage completes the Stage.
- **Player Level (1-100)**:
  - Calculated dynamically based on total stars.
  - Displays progress globally.
- **Titles**:
  - Unlock new titles every 5 levels.
- **Lesson Stars**: 1 to 5 stars per lesson based on accuracy/speed average.
  - **Accuracy Stars**:
    - 50% = 1 star
    - 70% = 2 stars
    - 80% = 3 stars
    - 90% = 4 stars
    - 100% = 5 stars
  - **Speed Stars** (where 50wpm = 100% speed):
    - 15% = 1 star
    - 40% = 2 stars
    - 60% = 3 stars
    - 80% = 4 stars
    - 100% = 5 stars
  - **Total Stars**: Average of Accuracy Stars and Speed Stars (can be X.5).
    - If either Accuracy Stars or Speed Stars is 0, Total Stars is 0.
- **Persistence**: Save `stars` per lesson in `localStorage`.
- **Reset Progress**: Option to wipe data.

### Curriculum Plan (10 Stages)

**Stage 1: The Foundation (Home Row)**

- **Topic**: Use of the 8 basic keys in the standard position (Grundstellung).
- **Scope**:
  - Lesson 1: Left Index (F) & Right Index (J)
  - Lesson 2: Left Middle (D) & Right Middle (K)
  - Lesson 3: Left Ring (S) & Right Ring (L)
  - Lesson 4: Left Pinky (A) & Right Pinky (Ö)
  - Lesson 5: All Home Row keys combined.

**Stage 2: Reaching In & Up (Strong Fingers)**

- **Topic**: Expanding to the central column and easy upper reach.
- **Scope**: Keys G, H (Index lateral) and E, I (Middle/Index up).

**Stage 3: Upper Row Expansion**

- **Topic**: Mastering the upper row with index and ring fingers.
- **Scope**: Keys R, U, T, Z (German layout consideration).

**Stage 4: Upper Row Completion**

- **Topic**: Weak fingers on the upper row.
- **Scope**: Keys W, O, Q, P.

**Stage 5: Lower Row Descent (Strong Fingers)**

- **Topic**: Reaching down with index fingers.
- **Scope**: Keys V, B, N, M.

**Stage 6: Lower Row Completion**

- **Topic**: Weak fingers on the lower row.
- **Scope**: Keys C, X, Y.

**Stage 7: Capitalization**

- **Topic**: Using the Shift keys.
- **Scope**: Left Shift, Right Shift, typing Nouns (Capital letters).

**Stage 8: German Character Set**

- **Topic**: Special German characters.
- **Scope**: Keys Ä, Ü, ß (and reviewing Ö).

**Stage 9: Punctuation & Numbers**

- **Topic**: Sentence structure and basic numeracy.
- **Scope**: Period, Comma, Dash, Numbers 0-9.

**Stage 10: Mastery & Flow**

- **Topic**: Integration of all keys.
- **Scope**: Complex sentences, speed drills, mixed content.

### Gamification & Fun

- **Visual Rewards**: Confetti explosion on 3-star victories.
- **Streak Mode**: Screen border glows when typing 10+ characters without error.
- **Unlockable Themes**: Earning stars unlocks new color themes.
- **Sound Feedback**: Distinct sounds for errors, success, and level ups.

### UI/UX

- **Landing Page**:
  - **Header**: Player Level, Progress Bar, Current Title.
  - **Grid**: Lesson selector showing star progress per lesson.
  - **Footer**: Reset Progress button ((separate page) with "Pause" and "Back to Menu" buttons.
- **Result Screen**:
  - **Popup/Modal**: Appears over the game interface upon completion.
  - Shows stars earned, new Player Level progress, and Title unlocks.
  - **Action**: Button to return to the Main Page (`index.html`)
- **Result Screen**: Shows stars earned, new Player Level progress, and Title unlocks if applicable.

## 3. Implementation Steps

1. **Scaffold**: Setup files and `assets` folder.
2. **Data**: Define **50 lessons** (10 Stages x 5 Lectures) in `data.js`.
3. **State Management**:
    - `calculatePlayerLevel()` function (Start at 1).
    - `resetProgress()` function.
    - `getTitleForLevel(level)` function.
    - **Unlock Logic**: Function to check if previous lesson has >= 3 stars.
4. **Game Loop**:
    - Update logic to re-calculate player level after every finished lesson.
    - Implement Pause/Resume logic.
    - Check for "Level Up" or "New Title" events to trigger specific celebrations.
5. **UI Updates**:
    - Update `index.html` to group lessons by Stage.
    - Visual indicator for "Locked" lessons (grayed out).
    - Add the Level/Title header and Reset/Pause buttons.
6. **Gamification**: Confetti, Streaks, Sounds.
7. **Styling**: Kid-friendly theme.

## 4. Deployment

- **Compatibility**: GitHub Pages (Client-side only).
- **Documentation**: Add README with features and live demo link.

## 5. Out of Scope

- **Mobile/Tablet Support**: The trainer is designed for physical keyboards (desktop/laptop) to teach proper touch typing. Virtual keyboards and touch devices are not supported.
