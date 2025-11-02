/**
 * KanjiQuest - Kanji Learning Quest
 *
 * Educational game for elementary school students to learn kanji characters
 * based on the Japanese Ministry of Education curriculum.
 */

import kanjiGrade1Data from './data/kanji-grade-1.json';

/**
 * Kanji character data structure
 */
export interface Kanji {
  character: string;
  grade: number;
  strokeCount: number;
  readings: {
    onyomi: string[]; // 音読み (Chinese reading)
    kunyomi: string[]; // 訓読み (Japanese reading)
  };
  meanings: string[];
  radicals: string[];
  examples: Array<{
    word: string;
    reading: string;
    meaning: string;
  }>;
}

/**
 * Quest types for KanjiQuest
 */
export type KanjiQuestType = 'reading' | 'stroke-count' | 'radical';

/**
 * Difficulty level based on school grade
 */
export type KanjiGrade = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Kanji question structure
 */
export interface KanjiQuestion {
  character: string;
  questionText: string;
  correctAnswer: string;
  choices: string[];
  questType: KanjiQuestType;
  grade: KanjiGrade;
}

/**
 * Reading type for Reading Quest
 */
export type ReadingType = 'onyomi' | 'kunyomi' | 'both';

/**
 * Configuration for KanjiQuest session
 */
export interface KanjiQuestConfig {
  grade: KanjiGrade;
  questType: KanjiQuestType;
  questionCount: number;
  readingType?: ReadingType; // For reading quest
}

/**
 * Load kanji data by grade
 */
function loadKanjiDataByGrade(grade: KanjiGrade): Kanji[] {
  switch (grade) {
    case 1:
      return kanjiGrade1Data as Kanji[];
    // TODO: Add grades 2-6 when data is available
    default:
      return kanjiGrade1Data as Kanji[];
  }
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate wrong answer choices for reading questions
 */
function generateWrongReadings(
  correctReading: string,
  allKanji: Kanji[],
  readingType: 'onyomi' | 'kunyomi',
  count: number = 3
): string[] {
  const wrongReadings: Set<string> = new Set();

  // Collect all possible readings from other kanji
  const allReadings = allKanji.flatMap((k) => k.readings[readingType]);

  // Filter out the correct reading
  const candidates = allReadings.filter((r) => r !== correctReading);

  // Randomly select wrong readings
  const shuffled = shuffleArray(candidates);
  for (const reading of shuffled) {
    if (wrongReadings.size >= count) break;
    wrongReadings.add(reading);
  }

  // If we don't have enough unique wrong readings, generate similar ones
  while (wrongReadings.size < count) {
    const baseReading =
      candidates[Math.floor(Math.random() * candidates.length)];
    if (baseReading && baseReading !== correctReading) {
      wrongReadings.add(baseReading);
    }
  }

  return Array.from(wrongReadings).slice(0, count);
}

/**
 * Format reading type name with ruby tags for lower grades
 */
function formatReadingTypeName(
  readingType: 'onyomi' | 'kunyomi',
  grade: KanjiGrade
): string {
  // 低学年（1-2年生）にはルビを振る
  if (grade <= 2) {
    return readingType === 'onyomi'
      ? '<ruby>音読<rt>おんよ</rt></ruby>み'
      : '<ruby>訓読<rt>くんよ</rt></ruby>み';
  }
  // 3年生以上はルビなし
  return readingType === 'onyomi' ? '音読み' : '訓読み';
}

/**
 * Generate wrong answer choices for radical questions
 */
function generateWrongRadicals(
  correctRadical: string,
  allKanji: Kanji[],
  count: number = 3
): string[] {
  const candidates = new Set<string>();

  for (const kanji of allKanji) {
    for (const radical of kanji.radicals) {
      if (radical !== correctRadical) {
        candidates.add(radical);
      }
    }
  }

  const shuffled = shuffleArray(Array.from(candidates));
  const wrongRadicals: string[] = [];

  for (const radical of shuffled) {
    if (wrongRadicals.length >= count) {
      break;
    }
    wrongRadicals.push(radical);
  }

  // If there are not enough unique candidates, reuse from existing pool
  while (wrongRadicals.length < count && shuffled.length > 0) {
    const randomRadical =
      shuffled[Math.floor(Math.random() * shuffled.length)] ?? correctRadical;
    if (randomRadical !== correctRadical) {
      wrongRadicals.push(randomRadical);
    }
  }

  return wrongRadicals.slice(0, count);
}

/**
 * Generate a Reading Quest question
 */
export function generateReadingQuestion(
  kanji: Kanji,
  allKanji: Kanji[],
  readingType: ReadingType = 'both'
): KanjiQuestion {
  // Determine which reading type to use
  let actualReadingType: 'onyomi' | 'kunyomi';
  if (readingType === 'both') {
    actualReadingType = Math.random() < 0.5 ? 'onyomi' : 'kunyomi';
  } else {
    actualReadingType = readingType;
  }

  // Select a reading from the chosen type
  const readings =
    actualReadingType === 'onyomi'
      ? kanji.readings.onyomi
      : kanji.readings.kunyomi;
  const correctAnswer = readings[Math.floor(Math.random() * readings.length)];

  // Generate wrong answer choices
  const wrongAnswers = generateWrongReadings(
    correctAnswer,
    allKanji,
    actualReadingType,
    3
  );

  // Combine and shuffle choices
  const choices = shuffleArray([correctAnswer, ...wrongAnswers]);

  // Generate question text with ruby tags for lower grades
  const grade = kanji.grade as KanjiGrade;
  const readingTypeName = formatReadingTypeName(actualReadingType, grade);
  const questionText = `「${kanji.character}」の${readingTypeName}は？`;

  return {
    character: kanji.character,
    questionText,
    correctAnswer,
    choices,
    questType: 'reading',
    grade,
  };
}

/**
 * Generate wrong answer choices for stroke count questions
 */
function generateWrongStrokeCounts(
  correctCount: number,
  allKanji: Kanji[],
  count: number = 3
): string[] {
  const wrongCounts: Set<string> = new Set();

  // Collect stroke counts from other kanji (excluding the correct one)
  const otherCounts = allKanji
    .map((k) => k.strokeCount)
    .filter((c) => c !== correctCount);

  // Add nearby stroke counts (±1, ±2, ±3)
  const nearby = [
    correctCount - 3,
    correctCount - 2,
    correctCount - 1,
    correctCount + 1,
    correctCount + 2,
    correctCount + 3,
  ].filter((c) => c > 0 && c !== correctCount);

  // Prioritize nearby counts that exist in the dataset
  const candidates = [...nearby.filter((c) => otherCounts.includes(c))];

  // Add other counts from the dataset
  candidates.push(...shuffleArray(otherCounts));

  // Select unique wrong counts
  for (const strokeCount of candidates) {
    if (wrongCounts.size >= count) break;
    wrongCounts.add(String(strokeCount));
  }

  return Array.from(wrongCounts).slice(0, count);
}

/**
 * Generate a Stroke Count Quest question
 */
export function generateStrokeCountQuestion(
  kanji: Kanji,
  allKanji: Kanji[]
): KanjiQuestion {
  const correctAnswer = String(kanji.strokeCount);

  // Generate wrong answer choices
  const wrongAnswers = generateWrongStrokeCounts(
    kanji.strokeCount,
    allKanji,
    3
  );

  // Combine and shuffle choices
  const choices = shuffleArray([correctAnswer, ...wrongAnswers]);

  // Generate question text with ruby tags for lower grades
  const grade = kanji.grade as KanjiGrade;
  const strokeCountLabel =
    grade <= 2 ? '<ruby>画数<rt>かくすう</rt></ruby>' : '画数';
  const questionText = `「${kanji.character}」の${strokeCountLabel}は？`;

  return {
    character: kanji.character,
    questionText,
    correctAnswer,
    choices,
    questType: 'stroke-count',
    grade,
  };
}

/**
 * Generate a Radical Quest question
 */
export function generateRadicalQuestion(
  kanji: Kanji,
  allKanji: Kanji[]
): KanjiQuestion {
  const [primaryRadical] = kanji.radicals;

  if (!primaryRadical) {
    throw new Error(`Kanji ${kanji.character} has no radical information.`);
  }

  const wrongAnswers = generateWrongRadicals(primaryRadical, allKanji, 3);
  const choices = shuffleArray([primaryRadical, ...wrongAnswers]);

  const grade = kanji.grade as KanjiGrade;
  const radicalLabel =
    grade <= 2 ? '<ruby>部首<rt>ぶしゅ</rt></ruby>' : '部首';
  const questionText = `「${kanji.character}」の${radicalLabel}は？`;

  return {
    character: kanji.character,
    questionText,
    correctAnswer: primaryRadical,
    choices,
    questType: 'radical',
    grade,
  };
}

/**
 * Generate multiple questions for a KanjiQuest session
 */
export function generateKanjiQuestions(
  config: KanjiQuestConfig
): KanjiQuestion[] {
  const kanjiData = loadKanjiDataByGrade(config.grade);

  if (kanjiData.length === 0) {
    throw new Error(`No kanji data available for grade ${config.grade}`);
  }

  // Shuffle and select kanji for questions
  const selectedKanji = shuffleArray(kanjiData).slice(0, config.questionCount);

  const questions: KanjiQuestion[] = [];

  for (const kanji of selectedKanji) {
    switch (config.questType) {
      case 'reading':
        questions.push(
          generateReadingQuestion(
            kanji,
            kanjiData,
            config.readingType || 'both'
          )
        );
        break;
      case 'stroke-count':
        questions.push(generateStrokeCountQuestion(kanji, kanjiData));
        break;
      case 'radical':
        questions.push(generateRadicalQuestion(kanji, kanjiData));
        break;
      // TODO: Add other quest types (okurigana, puzzle, etc.)
      default:
        throw new Error(`Unsupported quest type: ${config.questType}`);
    }
  }

  return questions;
}

/**
 * Verify if the given answer is correct
 */
export function verifyKanjiAnswer(
  question: KanjiQuestion,
  userAnswer: string
): boolean {
  return question.correctAnswer === userAnswer;
}

/**
 * Calculate score based on correct answers
 */
export function calculateKanjiScore(
  totalQuestions: number,
  correctAnswers: number
): number {
  if (totalQuestions === 0) return 0;
  return Math.round((correctAnswers / totalQuestions) * 100);
}

/**
 * Get performance message based on score
 */
export function getKanjiPerformanceMessage(score: number): string {
  if (score >= 90) return '素晴らしい！完璧です！';
  if (score >= 70) return 'よくできました！';
  if (score >= 50) return 'もう少し頑張りましょう！';
  return '復習が必要です。';
}
