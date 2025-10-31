/**
 * ClockQuest Domain Logic
 * 時計の読み方を学習するためのドメインロジック
 */

export type ClockDifficulty = 1 | 2 | 3 | 4 | 5;
export type ClockGrade = 1 | 2 | 3 | 4 | 5 | 6;

export type ClockQuestion = {
  hours: number; // 0-23 (24時間表記)
  minutes: number; // 0-59
  difficulty: ClockDifficulty;
};

export type ClockAnswer = {
  hours: number;
  minutes: number;
};

const randInt = (max: number) => Math.floor(Math.random() * (max + 1));

/**
 * 難易度に応じた時刻を生成
 */
export const generateClockQuestion = (
  difficulty: ClockDifficulty
): ClockQuestion => {
  let hours: number;
  let minutes: number;

  switch (difficulty) {
    case 1: // 正時のみ（1時、2時など）
      hours = randInt(11) + 1; // 1-12
      minutes = 0;
      break;

    case 2: // 30分単位（1時、1時半など）
      hours = randInt(11) + 1; // 1-12
      minutes = Math.random() < 0.5 ? 0 : 30;
      break;

    case 3: // 15分単位
      hours = randInt(11) + 1; // 1-12
      minutes = [0, 15, 30, 45][randInt(3)];
      break;

    case 4: // 5分単位
      hours = randInt(11) + 1; // 1-12
      minutes = randInt(11) * 5; // 0, 5, 10, ..., 55
      break;

    case 5: // 1分単位（任意の時刻）
      hours = randInt(11) + 1; // 1-12
      minutes = randInt(59); // 0-59
      break;

    default:
      hours = 12;
      minutes = 0;
  }

  return {
    hours,
    minutes,
    difficulty,
  };
};

/**
 * 時刻を12時間表記の文字列に変換
 */
export const formatTime12Hour = (hours: number, minutes: number): string => {
  const h = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const m = minutes.toString().padStart(2, '0');
  return `${h}:${m}`;
};

/**
 * 時刻を日本語表記に変換（読み上げ用）
 */
export const formatTimeJapanese = (hours: number, minutes: number): string => {
  const h = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  if (minutes === 0) {
    return `${h}時`;
  }
  if (minutes === 30) {
    return `${h}時半`;
  }
  return `${h}時${minutes}分`;
};

/**
 * 答えが正しいかチェック
 */
export const checkClockAnswer = (
  question: ClockQuestion,
  answer: ClockAnswer
): boolean => {
  // 12時間表記を考慮して比較
  const questionHours =
    question.hours === 0
      ? 12
      : question.hours > 12
        ? question.hours - 12
        : question.hours;
  const answerHours =
    answer.hours === 0
      ? 12
      : answer.hours > 12
        ? answer.hours - 12
        : answer.hours;

  return questionHours === answerHours && question.minutes === answer.minutes;
};

/**
 * 難易度の説明を取得
 */
export const getDifficultyDescription = (
  difficulty: ClockDifficulty
): string => {
  switch (difficulty) {
    case 1:
      return 'ちょうど（1時、2時など）';
    case 2:
      return 'ちょうどと半（1時、1時半など）';
    case 3:
      return '15分きざみ（1時、1時15分など）';
    case 4:
      return '5分きざみ';
    case 5:
      return '1分きざみ';
    default:
      return '';
  }
};

export const getGradeDescription = (grade: ClockGrade): string => {
  const descriptions: Record<ClockGrade, string> = {
    1: '小学1年生: ちょうどの時刻を読んでみよう',
    2: '小学2年生: 半の時刻にもチャレンジ',
    3: '小学3年生: 15分単位で時間感覚を鍛えよう',
    4: '小学4年生: 5分ごとの読み取りを練習',
    5: '小学5年生: 細かい時間も正確に読もう',
    6: '小学6年生: 1分単位の時刻で総仕上げ',
  };

  return descriptions[grade];
};
