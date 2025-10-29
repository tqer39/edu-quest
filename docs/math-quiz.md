[日本語](/docs/math-quiz.ja.md)

# Math Quiz (Elementary School)

This is a simple browser-based arithmetic game. Learners can choose addition, subtraction, multiplication, or a mixed mode, and customize the number range and number of questions. The interface includes an on-screen keypad so it works well on touch devices. The target audience is lower to middle elementary school grades.

## Features

- Question types: addition / subtraction / multiplication / mixed
- Number ranges: `0–10` / `0–20` / `0–100`
- Question counts: 5 / 10 / 20 (10 by default)
- Feedback: immediate correct/incorrect indicators with light animations
- Timer: displays the elapsed time for the round
- Input: physical keyboard or on-screen keypad

## How to Use

1. Open `games/math-quiz/index.html` in a browser.
   - If you prefer to start a quick local server (for example on macOS), run it from the project root and then open `http://localhost:8000/games/math-quiz/`.
     - Python: `python3 -m http.server 8000`
2. Use the select boxes at the top of the page to choose the question type, number range, and number of problems, then click **Start**.
3. Enter the answer for each expression and press **Answer** or hit the Enter key. You can also tap the on-screen keypad buttons.
4. After solving all 10 questions (or the amount you configured), the results screen appears. Click **Try Again** to repeat with the same settings.

## File Structure

- `games/math-quiz/`
  - `index.html`: screen layout and elements
  - `styles.css`: layout and visual design
  - `main.js`: question generation, scoring, and UI interactions

## Development Notes

- This repository mainly provides formatting and linting boilerplate. After running `just setup`, execute `just lint` before opening a PR to confirm Markdown and styles are tidy.
- Multiplication questions bias toward slightly smaller values to keep difficulty manageable.
- Subtraction questions avoid negative answers.

## Future Enhancement Ideas

- Timed mode (solve as many problems as possible within a limit)
- Voice guidance or sound effects
- Review mode that replays questions the learner answered incorrectly
- Save results locally (for example, via localStorage)
- Add division and introductory word problems
