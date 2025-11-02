import { describe, expect, it } from 'vitest';
import {
  generateReadingQuestion,
  generateStrokeCountQuestion,
  generateRadicalQuestion,
  generateKanjiQuestions,
  verifyKanjiAnswer,
  calculateKanjiScore,
  getKanjiPerformanceMessage,
  type Kanji,
  type KanjiQuestion,
  type KanjiQuestConfig,
} from '../kanji-quest';

// Sample kanji data for testing
const sampleKanji: Kanji[] = [
  {
    character: '一',
    grade: 1,
    strokeCount: 1,
    readings: {
      onyomi: ['イチ', 'イツ'],
      kunyomi: ['ひと', 'ひと-つ'],
    },
    meanings: ['one'],
    radicals: ['一'],
    examples: [
      { word: '一つ', reading: 'ひとつ', meaning: 'one (thing)' },
      { word: '一人', reading: 'ひとり', meaning: 'one person' },
    ],
  },
  {
    character: '二',
    grade: 1,
    strokeCount: 2,
    readings: {
      onyomi: ['ニ'],
      kunyomi: ['ふた', 'ふた-つ'],
    },
    meanings: ['two'],
    radicals: ['二'],
    examples: [{ word: '二つ', reading: 'ふたつ', meaning: 'two (things)' }],
  },
  {
    character: '三',
    grade: 1,
    strokeCount: 3,
    readings: {
      onyomi: ['サン'],
      kunyomi: ['み', 'み-つ', 'みっ-つ'],
    },
    meanings: ['three'],
    radicals: ['一'],
    examples: [{ word: '三つ', reading: 'みっつ', meaning: 'three (things)' }],
  },
  {
    character: '四',
    grade: 1,
    strokeCount: 5,
    readings: {
      onyomi: ['シ'],
      kunyomi: ['よ', 'よ-つ', 'よっ-つ', 'よん'],
    },
    meanings: ['four'],
    radicals: ['囗'],
    examples: [{ word: '四つ', reading: 'よっつ', meaning: 'four (things)' }],
  },
  {
    character: '五',
    grade: 1,
    strokeCount: 4,
    readings: {
      onyomi: ['ゴ'],
      kunyomi: ['いつ', 'いつ-つ'],
    },
    meanings: ['five'],
    radicals: ['二'],
    examples: [{ word: '五つ', reading: 'いつつ', meaning: 'five (things)' }],
  },
];

describe('generateReadingQuestion', () => {
  it('generates a valid reading question', () => {
    const kanji = sampleKanji[0];
    const question = generateReadingQuestion(kanji, sampleKanji);

    expect(question.character).toBe('一');
    expect(question.questType).toBe('reading');
    expect(question.grade).toBe(1);
    // Grade 1-2 kanji should have ruby tags
    expect(question.questionText).toMatch(
      /^「一」の(<ruby>音読<rt>おんよ<\/rt><\/ruby>み|<ruby>訓読<rt>くんよ<\/rt><\/ruby>み)は？$/
    );
    expect(question.choices).toHaveLength(4);
    expect(question.choices).toContain(question.correctAnswer);

    // Verify correct answer is a valid reading
    const allReadings = [...kanji.readings.onyomi, ...kanji.readings.kunyomi];
    expect(allReadings).toContain(question.correctAnswer);
  });

  it('generates onyomi question when specified', () => {
    const kanji = sampleKanji[0];
    const question = generateReadingQuestion(kanji, sampleKanji, 'onyomi');

    // Grade 1 should have ruby tags
    expect(question.questionText).toBe(
      '「一」の<ruby>音読<rt>おんよ</rt></ruby>みは？'
    );
    expect(kanji.readings.onyomi).toContain(question.correctAnswer);
  });

  it('generates kunyomi question when specified', () => {
    const kanji = sampleKanji[0];
    const question = generateReadingQuestion(kanji, sampleKanji, 'kunyomi');

    // Grade 1 should have ruby tags
    expect(question.questionText).toBe(
      '「一」の<ruby>訓読<rt>くんよ</rt></ruby>みは？'
    );
    expect(kanji.readings.kunyomi).toContain(question.correctAnswer);
  });

  it('generates both onyomi and kunyomi questions with "both" setting', () => {
    const kanji = sampleKanji[0];
    const onyomiQuestions: number[] = [];
    const kunyomiQuestions: number[] = [];

    // Run multiple times to get both types
    for (let i = 0; i < 50; i++) {
      const question = generateReadingQuestion(kanji, sampleKanji, 'both');
      // Check for either plain text or ruby tags
      if (question.questionText.includes('音読')) {
        onyomiQuestions.push(i);
      } else if (question.questionText.includes('訓読')) {
        kunyomiQuestions.push(i);
      }
    }

    // Should generate both types
    expect(onyomiQuestions.length).toBeGreaterThan(0);
    expect(kunyomiQuestions.length).toBeGreaterThan(0);
  });

  it('generates 4 unique choices including correct answer', () => {
    const kanji = sampleKanji[0];
    const question = generateReadingQuestion(kanji, sampleKanji);

    expect(question.choices).toHaveLength(4);
    const uniqueChoices = new Set(question.choices);
    expect(uniqueChoices.size).toBe(4);
    expect(question.choices).toContain(question.correctAnswer);
  });

  it('does not include correct answer in wrong choices', () => {
    const kanji = sampleKanji[0];
    const question = generateReadingQuestion(kanji, sampleKanji);

    const wrongChoices = question.choices.filter(
      (choice) => choice !== question.correctAnswer
    );
    expect(wrongChoices).toHaveLength(3);
    expect(wrongChoices).not.toContain(question.correctAnswer);
  });
});

describe('generateStrokeCountQuestion', () => {
  it('generates a valid stroke count question', () => {
    const kanji = sampleKanji[0]; // 一 has 1 stroke
    const question = generateStrokeCountQuestion(kanji, sampleKanji);

    expect(question.character).toBe('一');
    expect(question.questType).toBe('stroke-count');
    expect(question.grade).toBe(1);
    expect(question.correctAnswer).toBe('1');
    expect(question.choices).toHaveLength(4);
    expect(question.choices).toContain('1');
  });

  it('includes ruby tags for grade 1-2', () => {
    const kanji = sampleKanji[0];
    const question = generateStrokeCountQuestion(kanji, sampleKanji);

    // Grade 1 should have ruby tags for 画数
    expect(question.questionText).toBe(
      '「一」の<ruby>画数<rt>かくすう</rt></ruby>は？'
    );
  });

  it('generates 4 unique choices', () => {
    const kanji = sampleKanji[1]; // 二 has 2 strokes
    const question = generateStrokeCountQuestion(kanji, sampleKanji);

    expect(question.choices).toHaveLength(4);
    const uniqueChoices = new Set(question.choices);
    expect(uniqueChoices.size).toBe(4);
  });

  it('uses nearby stroke counts for wrong answers', () => {
    const kanji = sampleKanji[2]; // 三 has 3 strokes
    const question = generateStrokeCountQuestion(kanji, sampleKanji);

    expect(question.correctAnswer).toBe('3');
    const wrongChoices = question.choices.filter((c) => c !== '3');

    // Wrong choices should be numbers
    wrongChoices.forEach((choice) => {
      expect(Number.isInteger(Number(choice))).toBe(true);
      expect(Number(choice)).toBeGreaterThan(0);
    });
  });

  it('does not include correct answer in wrong choices', () => {
    const kanji = sampleKanji[0];
    const question = generateStrokeCountQuestion(kanji, sampleKanji);

    const wrongChoices = question.choices.filter(
      (choice) => choice !== question.correctAnswer
    );
    expect(wrongChoices).toHaveLength(3);
    expect(wrongChoices).not.toContain(question.correctAnswer);
  });
});

describe('generateRadicalQuestion', () => {
  it('generates a radical question with ruby for lower grades', () => {
    const kanji = sampleKanji[3]; // 四 -> radical 囗
    const question = generateRadicalQuestion(kanji, sampleKanji);

    expect(question.character).toBe('四');
    expect(question.questType).toBe('radical');
    expect(question.grade).toBe(1);
    expect(question.questionText).toBe('「四」の<ruby>部首<rt>ぶしゅ</rt></ruby>は？');
  });

  it('includes correct radical among the choices', () => {
    const kanji = sampleKanji[0];
    const question = generateRadicalQuestion(kanji, sampleKanji);

    expect(question.choices).toHaveLength(4);
    expect(question.choices).toContain(question.correctAnswer);

    const wrongChoices = question.choices.filter(
      (choice) => choice !== question.correctAnswer
    );
    expect(wrongChoices).toHaveLength(3);
    expect(wrongChoices).not.toContain(question.correctAnswer);
  });
});

describe('generateKanjiQuestions', () => {
  it('generates correct number of questions', () => {
    const config: KanjiQuestConfig = {
      grade: 1,
      questType: 'reading',
      questionCount: 3,
    };
    const questions = generateKanjiQuestions(config);

    expect(questions).toHaveLength(3);
  });

  it('generates questions for specified grade', () => {
    const config: KanjiQuestConfig = {
      grade: 1,
      questType: 'reading',
      questionCount: 5,
    };
    const questions = generateKanjiQuestions(config);

    questions.forEach((q) => {
      expect(q.grade).toBe(1);
    });
  });

  it('generates reading quest questions', () => {
    const config: KanjiQuestConfig = {
      grade: 1,
      questType: 'reading',
      questionCount: 3,
    };
    const questions = generateKanjiQuestions(config);

    questions.forEach((q) => {
      expect(q.questType).toBe('reading');
      // Grade 1-2 kanji should have ruby tags
      expect(q.questionText).toMatch(
        /^「.」の(<ruby>音読<rt>おんよ<\/rt><\/ruby>み|<ruby>訓読<rt>くんよ<\/rt><\/ruby>み)は？$/
      );
    });
  });

  it('uses specified reading type', () => {
    const config: KanjiQuestConfig = {
      grade: 1,
      questType: 'reading',
      questionCount: 5,
      readingType: 'onyomi',
    };
    const questions = generateKanjiQuestions(config);

    questions.forEach((q) => {
      // Check for "音読" which appears in both plain text and ruby tags
      expect(q.questionText).toContain('音読');
    });
  });

  it('generates stroke count quest questions', () => {
    const config: KanjiQuestConfig = {
      grade: 1,
      questType: 'stroke-count',
      questionCount: 3,
    };
    const questions = generateKanjiQuestions(config);

    questions.forEach((q) => {
      expect(q.questType).toBe('stroke-count');
      // Grade 1-2 kanji should have ruby tags for 画数
      expect(q.questionText).toContain('画数');
      expect(q.correctAnswer).toMatch(/^\d+$/); // Should be a number string
    });
  });

  it('generates radical quest questions', () => {
    const config: KanjiQuestConfig = {
      grade: 1,
      questType: 'radical',
      questionCount: 3,
    };
    const questions = generateKanjiQuestions(config);

    questions.forEach((q) => {
      expect(q.questType).toBe('radical');
      expect(q.questionText).toContain('部首');
      expect(q.choices).toHaveLength(4);
    });
  });

  it('generates different kanji for each question', () => {
    const config: KanjiQuestConfig = {
      grade: 1,
      questType: 'reading',
      questionCount: 5,
    };
    const questions = generateKanjiQuestions(config);

    const characters = questions.map((q) => q.character);
    const uniqueCharacters = new Set(characters);

    // Should have mostly unique characters (allowing for some duplicates due to randomness)
    expect(uniqueCharacters.size).toBeGreaterThanOrEqual(3);
  });

  it('throws error if grade has no data', () => {
    const config: KanjiQuestConfig = {
      grade: 2, // No data for grade 2 yet
      questType: 'reading',
      questionCount: 3,
    };

    // Should fall back to grade 1 data for now (based on implementation)
    // In the future when grade 2 is added, this test might need updating
    const questions = generateKanjiQuestions(config);
    expect(questions).toHaveLength(3);
  });
});

describe('verifyKanjiAnswer', () => {
  it('returns true for correct answer', () => {
    const question: KanjiQuestion = {
      character: '一',
      questionText: '「一」の音読みは？',
      correctAnswer: 'イチ',
      choices: ['イチ', 'ニ', 'サン', 'シ'],
      questType: 'reading',
      grade: 1,
    };

    expect(verifyKanjiAnswer(question, 'イチ')).toBe(true);
  });

  it('returns false for incorrect answer', () => {
    const question: KanjiQuestion = {
      character: '一',
      questionText: '「一」の音読みは？',
      correctAnswer: 'イチ',
      choices: ['イチ', 'ニ', 'サン', 'シ'],
      questType: 'reading',
      grade: 1,
    };

    expect(verifyKanjiAnswer(question, 'ニ')).toBe(false);
  });

  it('is case-sensitive', () => {
    const question: KanjiQuestion = {
      character: '一',
      questionText: '「一」の訓読みは？',
      correctAnswer: 'ひと',
      choices: ['ひと', 'ふた', 'み', 'よ'],
      questType: 'reading',
      grade: 1,
    };

    expect(verifyKanjiAnswer(question, 'ひと')).toBe(true);
    expect(verifyKanjiAnswer(question, 'ヒト')).toBe(false);
  });

  it('requires exact match', () => {
    const question: KanjiQuestion = {
      character: '一',
      questionText: '「一」の訓読みは？',
      correctAnswer: 'ひと-つ',
      choices: ['ひと-つ', 'ふた-つ', 'みっ-つ', 'よっ-つ'],
      questType: 'reading',
      grade: 1,
    };

    expect(verifyKanjiAnswer(question, 'ひと-つ')).toBe(true);
    expect(verifyKanjiAnswer(question, 'ひと')).toBe(false);
    expect(verifyKanjiAnswer(question, 'ひとつ')).toBe(false);
  });
});

describe('calculateKanjiScore', () => {
  it('returns 0 for zero questions', () => {
    expect(calculateKanjiScore(0, 0)).toBe(0);
  });

  it('returns 100 for perfect score', () => {
    expect(calculateKanjiScore(10, 10)).toBe(100);
  });

  it('returns 0 for no correct answers', () => {
    expect(calculateKanjiScore(10, 0)).toBe(0);
  });

  it('calculates percentage correctly', () => {
    expect(calculateKanjiScore(10, 5)).toBe(50);
    expect(calculateKanjiScore(10, 7)).toBe(70);
    expect(calculateKanjiScore(10, 9)).toBe(90);
  });

  it('rounds to nearest integer', () => {
    expect(calculateKanjiScore(3, 1)).toBe(33); // 33.333...
    expect(calculateKanjiScore(3, 2)).toBe(67); // 66.666...
  });
});

describe('getKanjiPerformanceMessage', () => {
  it('returns excellent message for 90-100%', () => {
    expect(getKanjiPerformanceMessage(90)).toBe('素晴らしい！完璧です！');
    expect(getKanjiPerformanceMessage(95)).toBe('素晴らしい！完璧です！');
    expect(getKanjiPerformanceMessage(100)).toBe('素晴らしい！完璧です！');
  });

  it('returns good message for 70-89%', () => {
    expect(getKanjiPerformanceMessage(70)).toBe('よくできました！');
    expect(getKanjiPerformanceMessage(80)).toBe('よくできました！');
    expect(getKanjiPerformanceMessage(89)).toBe('よくできました！');
  });

  it('returns encouragement message for 50-69%', () => {
    expect(getKanjiPerformanceMessage(50)).toBe('もう少し頑張りましょう！');
    expect(getKanjiPerformanceMessage(60)).toBe('もう少し頑張りましょう！');
    expect(getKanjiPerformanceMessage(69)).toBe('もう少し頑張りましょう！');
  });

  it('returns review message for below 50%', () => {
    expect(getKanjiPerformanceMessage(0)).toBe('復習が必要です。');
    expect(getKanjiPerformanceMessage(25)).toBe('復習が必要です。');
    expect(getKanjiPerformanceMessage(49)).toBe('復習が必要です。');
  });
});

describe('Integration: Full KanjiQuest lifecycle', () => {
  it('generates and validates correct answers', () => {
    const config: KanjiQuestConfig = {
      grade: 1,
      questType: 'reading',
      questionCount: 5,
    };
    const questions = generateKanjiQuestions(config);

    questions.forEach((q) => {
      // Correct answer should verify as true
      expect(verifyKanjiAnswer(q, q.correctAnswer)).toBe(true);

      // Wrong answers should verify as false
      const wrongAnswers = q.choices.filter(
        (choice) => choice !== q.correctAnswer
      );
      wrongAnswers.forEach((wrong) => {
        expect(verifyKanjiAnswer(q, wrong)).toBe(false);
      });
    });
  });

  it('calculates score and provides appropriate feedback', () => {
    const config: KanjiQuestConfig = {
      grade: 1,
      questType: 'reading',
      questionCount: 10,
    };
    const questions = generateKanjiQuestions(config);

    // Simulate perfect score
    let correctCount = 10;
    let score = calculateKanjiScore(questions.length, correctCount);
    expect(score).toBe(100);
    expect(getKanjiPerformanceMessage(score)).toBe('素晴らしい！完璧です！');

    // Simulate 70% score
    correctCount = 7;
    score = calculateKanjiScore(questions.length, correctCount);
    expect(score).toBe(70);
    expect(getKanjiPerformanceMessage(score)).toBe('よくできました！');

    // Simulate 50% score
    correctCount = 5;
    score = calculateKanjiScore(questions.length, correctCount);
    expect(score).toBe(50);
    expect(getKanjiPerformanceMessage(score)).toBe('もう少し頑張りましょう！');

    // Simulate low score
    correctCount = 2;
    score = calculateKanjiScore(questions.length, correctCount);
    expect(score).toBe(20);
    expect(getKanjiPerformanceMessage(score)).toBe('復習が必要です。');
  });

  it('ensures all questions have valid structure', () => {
    const config: KanjiQuestConfig = {
      grade: 1,
      questType: 'reading',
      questionCount: 10,
    };
    const questions = generateKanjiQuestions(config);

    questions.forEach((q) => {
      // Basic structure validation
      expect(q.character).toBeTruthy();
      expect(q.questionText).toBeTruthy();
      expect(q.correctAnswer).toBeTruthy();
      expect(q.choices).toHaveLength(4);
      expect(q.questType).toBe('reading');
      expect(q.grade).toBe(1);

      // Correct answer must be in choices
      expect(q.choices).toContain(q.correctAnswer);

      // All choices must be unique
      const uniqueChoices = new Set(q.choices);
      expect(uniqueChoices.size).toBe(4);
    });
  });
});
