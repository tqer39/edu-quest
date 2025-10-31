[🇯🇵 日本語](/docs/kanji-quest-design.ja.md)

# KanjiQuest Design Document

## Overview

KanjiQuest is an educational game for elementary school students to learn kanji (Chinese characters) in a fun and engaging way.

## Target Users

- Elementary school students (Grades 1-6)
- Age range: 6-12 years old
- Learning kanji according to the Japanese Ministry of Education curriculum

## Core Quest Types

### 1. Reading Quest (読み方クエスト)

**Objective**: Learn correct kanji readings (音読み/訓読み)

**Question Format**:

```text
Display: 学校
Question: この漢字の読み方は？
Options:
  A) がっこう ✓
  B) がくこう
  C) がくしょう
  D) がっしょう
```

**Difficulty Levels**:

- Easy: Single kanji with furigana hints
- Medium: 2-kanji compounds
- Hard: 3+ kanji compounds, no hints

**Hint System**:

- Level 1: Show partial furigana
- Level 2: Highlight radical
- Level 3: Show stroke order animation

---

### 2. Okurigana Quest (送り仮名クエスト)

**Objective**: Master correct okurigana usage

**Question Format**:

```text
Display: 書___
Question: 正しい送り仮名を選ぼう！
Options:
  A) 書く ✓
  B) 書き
  C) 書い
  D) 書け
```

**Educational Value**:

- Reinforces verb conjugation patterns
- Teaches common mistakes to avoid
- Builds reading comprehension skills

---

### 3. Kanji Puzzle Quest (漢字パズルクエスト)

**Objective**: Understand kanji composition and radicals

**Question Format - Type A (Combination)**:

```text
Question: 2つの漢字を組み合わせて新しい漢字を作ろう！
Display: 「木」 + 「木」 = ?
Options:
  A) 林 ✓
  B) 森
  C) 材
  D) 村
```

**Question Format - Type B (Decomposition)**:

```text
Question: この漢字はどの部首からできている？
Display: 「明」
Options:
  A) 日 + 月 ✓
  B) 日 + 目
  C) 白 + 月
  D) 白 + 目
```

**Hint System**:

- Show radical meanings
- Animate kanji formation
- Provide mnemonic hints

---

## Gamification Features

### 🏆 Story Mode: "Kanji Kingdom Adventure"

Progress through grade levels as kingdoms:

1. **Grade 1 Village** (80 kanji)

   - Theme: Daily life kanji
   - Badge: 🌱 Kanji Seedling

2. **Grade 2 Town** (160 kanji)

   - Theme: Nature and animals
   - Badge: 🌿 Kanji Sprout

3. **Grade 3 City** (200 kanji)

   - Theme: Actions and feelings
   - Badge: 🌳 Kanji Tree

4. **Grade 4 Castle** (202 kanji)

   - Theme: Society and culture
   - Badge: 🏯 Kanji Guardian

5. **Grade 5 Palace** (193 kanji)

   - Theme: Abstract concepts
   - Badge: 👑 Kanji Master

6. **Grade 6 Kingdom** (191 kanji)
   - Theme: Advanced vocabulary
   - Badge: ⭐ Kanji Emperor

### ⚔️ Boss Battle Mode

- Unlocked after completing 80% of a grade level
- Features challenging multi-kanji compounds
- Examples:
  - 四字熟語 (4-character idioms)
  - 難読漢字 (difficult readings)
  - 同音異義語 (homophones)

### 🎯 Time Attack Mode

- 30-second timer per question
- Combo system:
  - 3 correct → ⭐ +10 points
  - 5 correct → ⭐ +20 points
  - 10 correct → ⭐ +50 points

---

## Feature Implementation Roadmap

### Phase 1: MVP (Minimum Viable Product)

- [ ] Reading Quest implementation
- [ ] Grade-level selection (1-6)
- [ ] Basic scoring system
- [ ] Question count setting (5/10/20 questions)
- [ ] Simple results screen

### Phase 2: Enhanced Features

- [ ] Okurigana Quest
- [ ] Kanji Puzzle Quest
- [ ] Hint system (3 hint types)
- [ ] Sound effects toggle
- [ ] Progress tracking

### Phase 3: Advanced Features

- [ ] Story Mode progression
- [ ] Boss Battle Mode
- [ ] Time Attack Mode
- [ ] Voice reading (音声読み上げ)
- [ ] Achievements & badges
- [ ] Daily challenges

---

## Technical Architecture

### Domain Layer (`@edu-quest/domain`)

```typescript
// Kanji data structure
interface Kanji {
  character: string;
  grade: 1 | 2 | 3 | 4 | 5 | 6;
  readings: {
    onyomi: string[]; // 音読み
    kunyomi: string[]; // 訓読み
  };
  meanings: string[];
  radicals: string[];
  strokeCount: number;
  examples: string[]; // 熟語例
}

// Question types
type KanjiQuestionType =
  | 'reading' // 読み方クエスト
  | 'okurigana' // 送り仮名クエスト
  | 'puzzle' // 漢字パズルクエスト
  | 'radical' // 部首クエスト
  | 'compound'; // 熟語クエスト

// Question generator
class KanjiQuestionGenerator {
  generateReadingQuestion(kanji: Kanji, difficulty: Difficulty): Question;
  generateOkuriganaQuestion(verb: Kanji, difficulty: Difficulty): Question;
  generatePuzzleQuestion(kanjis: Kanji[], difficulty: Difficulty): Question;
}
```

### Application Layer (`@edu-quest/app`)

```typescript
// Quiz session management
class KanjiQuizSession {
  grade: number;
  questionType: KanjiQuestionType;
  questionCount: number;
  currentQuestion: number;
  score: number;
  hints: HintState;
}

// Answer verification
class KanjiAnswerVerifier {
  verify(answer: string, correctAnswer: string): VerificationResult;
  getHint(question: Question, hintLevel: number): Hint;
}
```

**Session Storage Strategy:**

KanjiQuest uses **Cloudflare KV** for server-side session management:

- Session data is stored in `KV_QUIZ_SESSION` with key pattern `kanji:{sessionId}`
- Only session ID is stored in HttpOnly cookie (`kanji_session_id`)
- Active session TTL: 1800 seconds (30 minutes)
- Result session TTL: 300 seconds (5 minutes)
- Session is deleted from KV when quiz completes

This approach provides security (XSS/CSRF protection) and scalability (distributed KV storage). See [AGENTS.md Section 7](../AGENTS.md#7-session-management-policy) for detailed guidelines.

### Edge Layer (`@edu-quest/edge`)

```typescript
// Routes
GET  /kanji              → Landing page
GET  /kanji/start        → Configuration wizard
GET  /kanji/play         → Practice session
POST /apis/kanji/quiz    → Quiz API
```

---

## UI/UX Design Principles

### Color Theme

- Primary: Purple (`#9B7EC8`) - Mystery and learning
- Secondary: Pink (`#E89AC7`) - Friendly and approachable
- Accent: Gold (`#FFD700`) - Achievement and success

### Visual Elements

- **Furigana Display**: Small ruby text above kanji
- **Stroke Order Animation**: Visual guide for writing
- **Radical Highlighting**: Color-coded radical components
- **Progress Bars**: Visual feedback on completion

### Sound Effects

- ✅ Correct answer: Cheerful chime
- ❌ Wrong answer: Gentle buzz
- 🎯 Combo achievement: Victory fanfare
- ⏱️ Time warning: Ticking sound
- 🏆 Level up: Grand celebration

### Accessibility

- Font size: Minimum 20px for kanji characters
- High contrast mode for readability
- Voice reading option for all text
- Keyboard navigation support

---

## Data Sources

### Kanji Database

Using official Japanese Ministry of Education (MEXT) kanji lists:

- 小学1年生: 80 kanji
- 小学2年生: 160 kanji
- 小学3年生: 200 kanji
- 小学4年生: 202 kanji
- 小学5年生: 193 kanji
- 小学6年生: 191 kanji
- **Total**: 1,026 kyōiku kanji (教育漢字)

### Example Data Structure

```json
{
  "character": "学",
  "grade": 1,
  "readings": {
    "onyomi": ["ガク"],
    "kunyomi": ["まな-ぶ"]
  },
  "meanings": ["study", "learning", "science"],
  "radicals": ["子"],
  "strokeCount": 8,
  "examples": [
    { "word": "学校", "reading": "がっこう", "meaning": "school" },
    { "word": "学生", "reading": "がくせい", "meaning": "student" },
    { "word": "学ぶ", "reading": "まなぶ", "meaning": "to study" }
  ]
}
```

---

## Success Metrics

### Learning Outcomes

- Kanji recognition rate improvement
- Reading speed improvement
- Retention rate (1 week, 1 month)
- Completion rate by grade level

### Engagement Metrics

- Daily active users
- Average session duration
- Questions attempted per session
- Return rate (next day, next week)

### Feature Adoption

- Most popular quest type
- Hint usage frequency
- Time attack participation rate
- Story mode progression rate

---

## Future Enhancements

### Advanced Features (Phase 4+)

- **Multiplayer Mode**: Compete with friends in real-time
- **Custom Flashcards**: Create personalized study sets
- **Handwriting Recognition**: Practice writing kanji on touchscreens
- **Spaced Repetition**: SRS algorithm for optimal review timing
- **Parent Dashboard**: Progress tracking and learning analytics
- **Integration with School Curriculum**: Align with specific textbooks

### Localization

- Support for Traditional Chinese characters (繁体字)
- Simplified Chinese mode (简体字)
- English learning mode (Kanji → English meanings)

---

## References

- [Japanese Ministry of Education Kanji List](https://www.mext.go.jp/)
- [Jōyō Kanji (常用漢字)](https://en.wikipedia.org/wiki/Jōyō_kanji)
- [Kyōiku Kanji (教育漢字)](https://en.wikipedia.org/wiki/Kyōiku_kanji)
