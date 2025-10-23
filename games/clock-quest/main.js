const $ = (sel) => document.querySelector(sel);

const setupSection = $('#setup');
const gameSection = $('#game');
const resultSection = $('#result');

const setupForm = $('#setupForm');
const difficultySel = $('#difficulty');
const questionCountSel = $('#questionCount');
const qIndexEl = $('#qIndex');
const qTotalEl = $('#qTotal');
const correctCountEl = $('#correctCount');
const elapsedEl = $('#elapsed');
const analogWrapper = $('#analogWrapper');
const digitalWrapper = $('#digitalWrapper');
const handHour = $('#handHour');
const handMinute = $('#handMinute');
const handSecond = $('#handSecond');
const digitalClock = $('#digitalClock');
const questionTextEl = $('#questionText');
const answerForm = $('#answerForm');
const answerInputs = $('#answerInputs');
const feedbackEl = $('#feedback');
const finalCorrectEl = $('#finalCorrect');
const finalTotalEl = $('#finalTotal');
const finalTimeEl = $('#finalTime');
const finalMessageEl = $('#finalMessage');
const againBtn = $('#againBtn');
const backBtn = $('#backBtn');
const skipBtn = $('#skipBtn');
const endBtn = $('#endBtn');

const DIFFICULTIES = {
  easy: { minuteStep: 5, allowSeconds: false },
  normal: { minuteStep: 1, allowSeconds: false },
  hard: { minuteStep: 1, allowSeconds: true },
};

const state = {
  total: 10,
  index: 0,
  correct: 0,
  settings: DIFFICULTIES.easy,
  difficulty: 'easy',
  currentQuestion: null,
  startedAt: 0,
  timerId: null,
};

const randInt = (max) => Math.floor(Math.random() * (max + 1));

const toDisplayHour = (hour) => {
  const h = hour % 12;
  return h === 0 ? 12 : h;
};

const formatDigital = (time, includeSeconds) => {
  const hh = String(toDisplayHour(time.hour)).padStart(2, '0');
  const mm = String(time.minute).padStart(2, '0');
  const ss = String(time.second ?? 0).padStart(2, '0');
  return includeSeconds ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`;
};

const describeTime = (time, includeSeconds) => {
  const hour = toDisplayHour(time.hour);
  const minute = time.minute;
  const second = time.second ?? 0;
  let text = `${hour}じ`;
  text += `${minute}ふん`;
  if (includeSeconds) text += `${second}びょう`;
  return text;
};

const describeDuration = (seconds, includeSeconds) => {
  if (includeSeconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}びょう`;
    if (secs === 0) return `${mins}ふん`;
    return `${mins}ふん${secs}びょう`;
  }
  const mins = Math.round(seconds / 60);
  return `${mins}ふん`;
};

const toSeconds = (time) => time.hour * 3600 + time.minute * 60 + (time.second ?? 0);

const secondsToTime = (totalSeconds) => {
  const s = Math.max(0, totalSeconds) % (12 * 3600);
  const hour = Math.floor(s / 3600);
  const minute = Math.floor((s % 3600) / 60);
  const second = s % 60;
  return { hour, minute, second };
};

const randomTime = (settings) => {
  const hour = randInt(11);
  const minute = settings.minuteStep * randInt(Math.floor(59 / settings.minuteStep));
  const second = settings.allowSeconds ? randInt(59) : 0;
  return { hour, minute, second };
};

const buildReadTimeQuestion = (settings) => {
  const display = Math.random() < 0.5 ? 'analog' : 'digital';
  const time = randomTime(settings);
  return {
    type: 'read-time',
    display,
    time,
    includeSeconds: settings.allowSeconds,
  };
};

const buildDifferenceQuestion = (settings) => {
  const minGap = settings.allowSeconds ? 30 : settings.minuteStep * 60;
  let start;
  let startSeconds;
  let maxDiff;
  for (let i = 0; i < 20; i += 1) {
    const candidate = randomTime(settings);
    const candidateSeconds = toSeconds(candidate);
    const candidateMaxDiff = 12 * 3600 - 1 - candidateSeconds;
    if (candidateMaxDiff >= minGap) {
      start = candidate;
      startSeconds = candidateSeconds;
      maxDiff = candidateMaxDiff;
      break;
    }
  }
  if (!start) {
    start = { hour: 2, minute: 0, second: settings.allowSeconds ? 0 : 0 };
    startSeconds = toSeconds(start);
    maxDiff = 12 * 3600 - 1 - startSeconds;
  }
  let diffSeconds;
  if (settings.allowSeconds) {
    const maxRange = Math.max(30, Math.min(maxDiff, 3600));
    diffSeconds = randInt(maxRange);
    if (diffSeconds < 30) diffSeconds = 30;
  } else {
    const stepSeconds = settings.minuteStep * 60;
    const maxMultiplier = Math.max(1, Math.floor(maxDiff / stepSeconds));
    const multiplier = randInt(maxMultiplier - 1) + 1;
    diffSeconds = multiplier * stepSeconds;
  }
  const endSeconds = startSeconds + diffSeconds;
  const end = secondsToTime(endSeconds);
  const includeSeconds = settings.allowSeconds;
  const startDisplay = Math.random() < 0.5 ? 'analog' : 'digital';
  return {
    type: 'difference',
    includeSeconds,
    start,
    end,
    startDisplay,
    diffSeconds,
  };
};

const buildQuestion = (settings) => {
  return Math.random() < 0.55
    ? buildReadTimeQuestion(settings)
    : buildDifferenceQuestion(settings);
};

const setHandRotation = (hand, degrees) => {
  if (!hand) return;
  hand.style.transform = `rotate(${degrees}deg)`;
};

const updateAnalogClock = (time, showSeconds) => {
  const hourDeg = (toDisplayHour(time.hour) % 12 + time.minute / 60 + (time.second ?? 0) / 3600) * 30;
  const minuteDeg = (time.minute + (time.second ?? 0) / 60) * 6;
  const secondDeg = (time.second ?? 0) * 6;
  setHandRotation(handHour, hourDeg);
  setHandRotation(handMinute, minuteDeg);
  setHandRotation(handSecond, secondDeg);
  if (handSecond) {
    handSecond.classList.toggle('hidden', !showSeconds);
  }
};

const showAnalog = (time, includeSeconds) => {
  analogWrapper.classList.remove('hidden');
  updateAnalogClock(time, includeSeconds);
};

const showDigital = (time, includeSeconds) => {
  digitalWrapper.classList.remove('hidden');
  digitalClock.textContent = formatDigital(time, includeSeconds);
};

const hideDisplays = () => {
  analogWrapper.classList.add('hidden');
  digitalWrapper.classList.add('hidden');
};

const clearFeedback = () => {
  feedbackEl.textContent = '';
  feedbackEl.classList.remove('ok', 'ng');
};

const focusFirstInput = () => {
  const firstInput = answerInputs.querySelector('input');
  if (firstInput) firstInput.focus();
};

const makeNumberControl = (id, caption, unit, attributes = {}) => {
  const wrapper = document.createElement('label');
  wrapper.className = 'number-control';

  const spanCaption = document.createElement('span');
  spanCaption.className = 'caption';
  spanCaption.textContent = caption;

  const input = document.createElement('input');
  input.type = 'number';
  input.id = id;
  input.inputMode = 'numeric';
  input.pattern = '\\d*';
  input.setAttribute('aria-label', caption);
  Object.assign(input, attributes);

  const spanUnit = document.createElement('span');
  spanUnit.className = 'unit';
  spanUnit.textContent = unit;

  wrapper.append(spanCaption, input, spanUnit);
  return wrapper;
};

const renderAnswerInputs = (question) => {
  answerInputs.innerHTML = '';
  if (question.type === 'read-time') {
    answerInputs.append(
      makeNumberControl('answerHour', 'なんじ', 'じ', { min: 1, max: 12 }),
      makeNumberControl('answerMinute', 'なんぷん', 'ふん', { min: 0, max: 59 })
    );
    if (question.includeSeconds) {
      answerInputs.append(
        makeNumberControl('answerSecond', 'なんびょう', 'びょう', { min: 0, max: 59 })
      );
    }
  } else {
    answerInputs.append(
      makeNumberControl('answerMinutes', 'なんぷん', 'ふん', { min: 0, max: 300 })
    );
    if (question.includeSeconds) {
      answerInputs.append(
        makeNumberControl('answerSeconds', 'なんびょう', 'びょう', { min: 0, max: 59 })
      );
    }
  }
  focusFirstInput();
};

const questionPrompt = (question) => {
  if (question.type === 'read-time') {
    return question.display === 'analog'
      ? 'いまなんじ？（アナログ時計をよんでね）'
      : 'いまなんじ？（デジタルひょうじ）';
  }
  const targetText = describeTime(question.end, question.includeSeconds);
  if (question.startDisplay === 'analog') {
    return `いまはアナログ時計をよんでね。${targetText}まではなん${
      question.includeSeconds ? 'ぷんなんびょう' : 'ぷん'
    }ある？`;
  }
  const currentText = describeTime(question.start, question.includeSeconds);
  return `いまは ${currentText}。${targetText}まではなん${
    question.includeSeconds ? 'ぷんなんびょう' : 'ぷん'
  }ある？`;
};

const presentQuestion = (question) => {
  hideDisplays();
  renderAnswerInputs(question);
  questionTextEl.textContent = questionPrompt(question);
  if (question.type === 'read-time') {
    if (question.display === 'analog') {
      showAnalog(question.time, question.includeSeconds);
    } else {
      showDigital(question.time, question.includeSeconds);
    }
  } else if (question.startDisplay === 'analog') {
    showAnalog(question.start, question.includeSeconds);
  } else {
    showDigital(question.start, question.includeSeconds);
  }
};

const questionAnswerText = (question) => {
  if (question.type === 'read-time') {
    return `せいかいは ${describeTime(question.time, question.includeSeconds)} だよ。`;
  }
  return `せいかいは ${describeDuration(
    question.diffSeconds,
    question.includeSeconds
  )} だよ。`;
};

const durationAnswer = (question) => {
  const minutesInput = document.getElementById('answerMinutes');
  if (!minutesInput) return null;
  const minutes = minutesInput.value.trim();
  if (minutes === '') return null;
  const mins = Number(minutes);
  if (!Number.isFinite(mins) || mins < 0 || !Number.isInteger(mins)) return null;
  let seconds = 0;
  if (question.includeSeconds) {
    const secondsInput = document.getElementById('answerSeconds');
    if (!secondsInput) return null;
    const rawSeconds = secondsInput.value.trim();
    if (rawSeconds === '') return null;
    seconds = Number(rawSeconds);
    if (
      !Number.isFinite(seconds) ||
      seconds < 0 ||
      seconds >= 60 ||
      !Number.isInteger(seconds)
    ) {
      return null;
    }
  }
  const totalSeconds = mins * 60 + seconds;
  return totalSeconds;
};

const readTimeAnswer = (question) => {
  const hourInput = document.getElementById('answerHour');
  const minuteInput = document.getElementById('answerMinute');
  if (!hourInput || !minuteInput) return null;
  const rawHour = hourInput.value.trim();
  const rawMinute = minuteInput.value.trim();
  if (!rawHour || !rawMinute) return null;
  const hour = Number(rawHour);
  const minute = Number(rawMinute);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  if (hour < 1 || hour > 12 || minute < 0 || minute >= 60) return null;
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) return null;
  let second = 0;
  if (question.includeSeconds) {
    const secondInput = document.getElementById('answerSecond');
    if (!secondInput) return null;
    const rawSecond = secondInput.value.trim();
    if (rawSecond === '') return null;
    second = Number(rawSecond);
    if (
      !Number.isFinite(second) ||
      second < 0 ||
      second >= 60 ||
      !Number.isInteger(second)
    ) {
      return null;
    }
  }
  return {
    hour,
    minute,
    second,
  };
};

const checkAnswer = (event) => {
  event.preventDefault();
  if (!state.currentQuestion) return;
  clearFeedback();
  const question = state.currentQuestion;
  if (question.type === 'read-time') {
    const answer = readTimeAnswer(question);
    if (!answer) {
      feedbackEl.textContent = 'すうじをいれてね。';
      return;
    }
    const expectedHour = toDisplayHour(question.time.hour);
    const expectedMinute = question.time.minute;
    const expectedSecond = question.time.second ?? 0;
    if (
      answer.hour === expectedHour &&
      answer.minute === expectedMinute &&
      (!question.includeSeconds || answer.second === expectedSecond)
    ) {
      markCorrect();
    } else {
      markWrong();
    }
  } else {
    const answerSeconds = durationAnswer(question);
    if (answerSeconds === null) {
      feedbackEl.textContent = 'すうじをいれてね。';
      return;
    }
    if (question.includeSeconds) {
      if (answerSeconds === question.diffSeconds) {
        markCorrect();
      } else {
        markWrong();
      }
    } else {
      const expectedMinutes = Math.round(question.diffSeconds / 60);
      if (answerSeconds === expectedMinutes * 60) {
        markCorrect();
      } else {
        markWrong();
      }
    }
  }
};

const markCorrect = () => {
  feedbackEl.textContent = 'せいかい！';
  feedbackEl.classList.add('ok');
  state.correct += 1;
  correctCountEl.textContent = String(state.correct);
  setTimeout(() => nextQuestion(), 500);
};

const markWrong = () => {
  feedbackEl.textContent = `ちがうよ… ${questionAnswerText(state.currentQuestion)}`;
  feedbackEl.classList.add('ng');
  setTimeout(() => nextQuestion(), 900);
};

const skipQuestion = () => {
  if (!state.currentQuestion) return;
  clearFeedback();
  feedbackEl.textContent = `スキップ！ ${questionAnswerText(state.currentQuestion)}`;
  feedbackEl.classList.add('ng');
  setTimeout(() => nextQuestion(), 600);
};

const finishGame = () => {
  if (state.timerId) cancelAnimationFrame(state.timerId);
  state.timerId = null;
  const elapsed = ((performance.now() - state.startedAt) / 1000).toFixed(1);
  finalCorrectEl.textContent = String(state.correct);
  finalTotalEl.textContent = String(state.total);
  finalTimeEl.textContent = elapsed;
  const ratio = state.correct / state.total;
  if (ratio === 1) finalMessageEl.textContent = 'パーフェクト！とけいマスター！';
  else if (ratio >= 0.7) finalMessageEl.textContent = 'とてもよくできました！';
  else finalMessageEl.textContent = 'じかんをよむれんしゅうをつづけよう。';
  gameSection.classList.add('hidden');
  resultSection.classList.remove('hidden');
};

const nextQuestion = () => {
  state.index += 1;
  if (state.index > state.total) {
    finishGame();
    return;
  }
  qIndexEl.textContent = String(state.index);
  clearFeedback();
  const question = buildQuestion(state.settings);
  state.currentQuestion = question;
  presentQuestion(question);
};

const startTimer = () => {
  state.startedAt = performance.now();
  const tick = () => {
    const elapsed = (performance.now() - state.startedAt) / 1000;
    elapsedEl.textContent = elapsed.toFixed(1);
    state.timerId = requestAnimationFrame(tick);
  };
  state.timerId = requestAnimationFrame(tick);
};

const startGame = (event) => {
  event.preventDefault();
  state.difficulty = difficultySel.value;
  state.settings = DIFFICULTIES[state.difficulty] ?? DIFFICULTIES.easy;
  state.total = Number(questionCountSel.value);
  state.index = 0;
  state.correct = 0;
  state.currentQuestion = null;
  elapsedEl.textContent = '0.0';
  correctCountEl.textContent = '0';
  qTotalEl.textContent = String(state.total);
  qIndexEl.textContent = '0';
  setupSection.classList.add('hidden');
  resultSection.classList.add('hidden');
  gameSection.classList.remove('hidden');
  state.startedAt = performance.now();
  if (state.timerId) cancelAnimationFrame(state.timerId);
  startTimer();
  nextQuestion();
};

const resetToStart = () => {
  if (state.timerId) cancelAnimationFrame(state.timerId);
  state.timerId = null;
  setupSection.classList.remove('hidden');
  gameSection.classList.add('hidden');
  resultSection.classList.add('hidden');
  feedbackEl.textContent = '';
  qIndexEl.textContent = '0';
  elapsedEl.textContent = '0.0';
};

answerForm.addEventListener('submit', checkAnswer);
skipBtn.addEventListener('click', skipQuestion);
endBtn.addEventListener('click', finishGame);
setupForm.addEventListener('submit', startGame);
againBtn.addEventListener('click', (event) => {
  event.preventDefault();
  setupSection.classList.add('hidden');
  resultSection.classList.add('hidden');
  gameSection.classList.remove('hidden');
  state.index = 0;
  state.correct = 0;
  state.currentQuestion = null;
  correctCountEl.textContent = '0';
  elapsedEl.textContent = '0.0';
  qIndexEl.textContent = '0';
  qTotalEl.textContent = String(state.total);
  state.startedAt = performance.now();
  if (state.timerId) cancelAnimationFrame(state.timerId);
  startTimer();
  nextQuestion();
});

backBtn.addEventListener('click', (event) => {
  event.preventDefault();
  resetToStart();
});

window.addEventListener('beforeunload', () => {
  if (state.timerId) cancelAnimationFrame(state.timerId);
});
