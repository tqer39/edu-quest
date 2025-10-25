import { html, raw } from 'hono/html';
import type { QuestionTypeMeta } from '../../application/usecases/kanji-quiz';

const MODULE_SOURCE = `
(() => {
  const SESSION_KEY = 'kanjiquest:session:v1';
  const PROGRESS_KEY = 'kanjiquest:progress:v1';

  const parseJSON = (id, fallback) => {
    const el = document.getElementById(id);
    if (!el) return fallback;
    try {
      const parsed = JSON.parse(el.textContent || 'null');
      return parsed ?? fallback;
    } catch (error) {
      console.warn('failed to parse JSON payload', id, error);
      return fallback;
    }
  };

  const typeMetaList = parseJSON('kanji-type-meta', []);
  const typeMetaMap = new Map(typeMetaList.map((meta) => [meta.id, meta]));

  const root = document.getElementById('kanji-play-root');
  if (!root) return;

  const loadSession = () => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn('failed to parse kanji session', error);
      return null;
    }
  };

  const session = loadSession();
  if (
    !session ||
    typeof session.gradeId !== 'string' ||
    !Array.isArray(session.questionTypes) ||
    session.questionTypes.length === 0
  ) {
    window.location.replace('/kanji/start');
    return;
  }

  const todayKey = new Date().toISOString().slice(0, 10);

  const loadProgress = () => {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (!raw) {
        return { todayKey, todayCorrect: 0, lastPlayed: null };
      }
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.todayKey !== todayKey) {
        return { todayKey, todayCorrect: 0, lastPlayed: parsed?.lastPlayed ?? null };
      }
      return {
        todayKey,
        todayCorrect: Number(parsed.todayCorrect) || 0,
        lastPlayed: parsed.lastPlayed ?? null,
      };
    } catch (error) {
      console.warn('failed to load kanji progress', error);
      return { todayKey, todayCorrect: 0, lastPlayed: null };
    }
  };

  const saveProgress = (progress) => {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch (error) {
      console.warn('failed to save kanji progress', error);
    }
  };

  const state = {
    index: 0,
    correct: 0,
    total:
      typeof session.questionCount === 'number' && session.questionCount > 0
        ? session.questionCount
        : 10,
    currentQuestion: null,
    selected: new Set(),
    answered: false,
    loading: false,
    excludeIds: [],
    progress: loadProgress(),
  };

  const gradeLabelEl = document.getElementById('kanji-play-grade');
  const selectedTypesEl = document.getElementById('kanji-selected-types');
  const progressCurrentEl = document.getElementById('kanji-progress-current');
  const progressTotalEl = document.getElementById('kanji-progress-total');
  const progressMessageEl = document.getElementById('kanji-progress-message');
  const questionPromptEl = document.getElementById('kanji-question-prompt');
  const questionMainEl = document.getElementById('kanji-question-main');
  const questionWordEl = document.getElementById('kanji-question-word');
  const questionWordKanaEl = document.getElementById('kanji-question-word-kana');
  const questionSentenceEl = document.getElementById('kanji-question-sentence');
  const questionSentenceKanaEl = document.getElementById('kanji-question-sentence-kana');
  const questionNoteEl = document.getElementById('kanji-question-note');
  const choiceListEl = document.getElementById('kanji-choice-list');
  const feedbackEl = document.getElementById('kanji-feedback');
  const submitButton = document.getElementById('kanji-submit-button');
  const nextButton = document.getElementById('kanji-next-button');
  const correctAnswersEl = document.getElementById('kanji-correct-answers');
  const explanationEl = document.getElementById('kanji-explanation');
  const todayCorrectEl = document.getElementById('kanji-today-correct');
  const lastPlayedEl = document.getElementById('kanji-last-played');
  const resultPanel = document.getElementById('kanji-result-panel');
  const resultMessageEl = document.getElementById('kanji-result-message');
  const retryButton = document.getElementById('kanji-retry-button');

  const renderSelectedTypes = () => {
    if (!selectedTypesEl) return;
    const labels = session.questionTypes
      .map((typeId) => typeMetaMap.get(typeId)?.label || typeId)
      .join(' / ');
    selectedTypesEl.textContent = labels || '出題形式が未設定です';
  };

  const updateProgressSummary = () => {
    if (todayCorrectEl) {
      todayCorrectEl.textContent = String(state.progress.todayCorrect ?? 0);
    }
    if (lastPlayedEl) {
      const lastPlayed = state.progress.lastPlayed;
      if (!lastPlayed) {
        lastPlayedEl.textContent = '-';
      } else {
        try {
          const date = new Date(lastPlayed);
          lastPlayedEl.textContent = date.toLocaleDateString('ja-JP');
        } catch {
          lastPlayedEl.textContent = '-';
        }
      }
    }
  };

  const updateScoreboard = () => {
    const currentDisplay = state.answered
      ? state.index
      : Math.min(state.index + 1, state.total);
    if (progressCurrentEl)
      progressCurrentEl.textContent = String(Math.min(currentDisplay, state.total));
    if (progressTotalEl) progressTotalEl.textContent = String(state.total);
    const remaining = Math.max(state.total - state.index, 0);
    if (progressMessageEl) {
      progressMessageEl.textContent =
        remaining > 0 ? 'あと' + remaining + '問！' : '結果を確認しよう。';
    }
    const scoreEl = document.getElementById('kanji-score-correct');
    if (scoreEl) {
      scoreEl.textContent = String(state.correct);
    }
  };

  const setFeedback = (status, message) => {
    if (!feedbackEl) return;
    feedbackEl.dataset.state = status;
    feedbackEl.textContent = message;
  };

  const updateSubmitState = () => {
    if (!submitButton) return;
    submitButton.disabled = state.selected.size === 0 || state.answered || state.loading;
  };

  const updateChoiceSelection = () => {
    if (!choiceListEl) return;
    choiceListEl.querySelectorAll('button[data-value]').forEach((button) => {
      const value = button.getAttribute('data-value');
      const selected = value ? state.selected.has(value) : false;
      button.setAttribute('data-selected', selected ? 'true' : 'false');
    });
  };

  const resetQuestionDisplay = () => {
    if (questionMainEl) questionMainEl.textContent = '';
    if (questionWordEl) {
      questionWordEl.textContent = '';
      questionWordEl.classList.add('hidden');
    }
    if (questionWordKanaEl) {
      questionWordKanaEl.textContent = '';
      questionWordKanaEl.classList.add('hidden');
    }
    if (questionSentenceEl) {
      questionSentenceEl.textContent = '';
      questionSentenceEl.classList.add('hidden');
    }
    if (questionSentenceKanaEl) {
      questionSentenceKanaEl.textContent = '';
      questionSentenceKanaEl.classList.add('hidden');
    }
    if (questionNoteEl) {
      questionNoteEl.textContent = '';
      questionNoteEl.classList.add('hidden');
    }
    if (correctAnswersEl) correctAnswersEl.textContent = '';
    if (explanationEl) explanationEl.textContent = '';
  };

  const renderQuestion = (question) => {
    state.currentQuestion = question;
    state.selected.clear();
    state.answered = false;
    state.loading = false;

    if (questionPromptEl) questionPromptEl.textContent = question.prompt || '問題';

    resetQuestionDisplay();

    if (questionMainEl) {
      questionMainEl.textContent = question.display?.mainKanji ?? '';
    }
    if (question.display?.wordWithBlank || question.display?.word) {
      if (questionWordEl) {
        questionWordEl.textContent = question.display.wordWithBlank || question.display.word || '';
        questionWordEl.classList.remove('hidden');
      }
      if (questionWordKanaEl) {
        questionWordKanaEl.textContent = question.display.wordKana || '';
        questionWordKanaEl.classList.toggle('hidden', !question.display.wordKana);
      }
    }
    if (question.display?.sentenceWithBlank || question.display?.sentence) {
      if (questionSentenceEl) {
        questionSentenceEl.textContent = question.display.sentenceWithBlank || question.display.sentence || '';
        questionSentenceEl.classList.remove('hidden');
      }
      if (questionSentenceKanaEl) {
        questionSentenceKanaEl.textContent = question.display.sentenceKana || '';
        questionSentenceKanaEl.classList.toggle('hidden', !question.display.sentenceKana);
      }
    }
    if (question.display?.note && questionNoteEl) {
      questionNoteEl.textContent = question.display.note;
      questionNoteEl.classList.remove('hidden');
    }

    if (choiceListEl) {
      choiceListEl.innerHTML = '';
      question.choices.forEach((choice) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = choice;
        button.className = 'kanji-choice rounded-2xl border-2 border-[var(--mq-outline)] bg-[var(--mq-surface)] px-4 py-3 text-sm font-semibold text-[var(--mq-ink)] shadow-sm';
        button.setAttribute('data-value', choice);
        button.addEventListener('click', () => {
          if (state.loading || state.answered) return;
          if (question.selectionType === 'single') {
            state.selected.clear();
            state.selected.add(choice);
          } else {
            if (state.selected.has(choice)) {
              state.selected.delete(choice);
            } else {
              state.selected.add(choice);
            }
          }
          updateChoiceSelection();
          updateSubmitState();
        });
        choiceListEl.appendChild(button);
      });
    }

    updateChoiceSelection();
    updateSubmitState();
    setFeedback('info', '正しい答えを選ぼう');

    if (nextButton) {
      nextButton.classList.add('hidden');
      nextButton.disabled = true;
    }

    updateScoreboard();
  };

  const fetchQuestion = async () => {
    state.loading = true;
    state.selected.clear();
    updateSubmitState();
    setFeedback('info', '問題を読み込み中…');
    resetQuestionDisplay();
    if (choiceListEl) choiceListEl.innerHTML = '';

    try {
      const response = await fetch('/apis/kanji/questions/next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gradeId: session.gradeId,
          allowedTypes: session.questionTypes,
          excludeIds: state.excludeIds.slice(-5),
        }),
      });
      if (!response.ok) throw new Error('failed to load question');
      const data = await response.json();
      if (!data || !data.question) throw new Error('invalid response');
      renderQuestion(data.question);
      setFeedback('info', '正しい答えを選ぼう');
    } catch (error) {
      console.error(error);
      setFeedback('error', '問題を取得できませんでした。ページを更新してください。');
      state.loading = false;
    }
  };

  const finishSession = () => {
    updateScoreboard();
    if (resultPanel) {
      resultPanel.classList.remove('hidden');
    }
    if (resultMessageEl) {
      resultMessageEl.textContent =
        '全' + state.total + '問中 ' + state.correct + '問せいかい！';
    }
  };

  const moveNext = () => {
    if (state.index >= state.total) {
      finishSession();
    } else {
      fetchQuestion();
    }
  };

  const submitAnswer = async () => {
    if (state.loading || state.answered) return;
    if (!state.currentQuestion || state.selected.size === 0) return;
    state.loading = true;
    updateSubmitState();
    try {
      const response = await fetch('/apis/kanji/answers/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: state.currentQuestion.id,
          selections: Array.from(state.selected),
        }),
      });
      if (!response.ok) throw new Error('failed to check answer');
      const result = await response.json();
      state.answered = true;
      state.index += 1;
      state.excludeIds.push(state.currentQuestion.id);
      if (result?.ok) {
        state.correct += 1;
        setFeedback('success', 'せいかい！よくできたね');
        state.progress.todayCorrect += 1;
      } else {
        setFeedback('error', 'ざんねん… 正しい答えを確認しよう');
      }
      state.progress.lastPlayed = new Date().toISOString();
      saveProgress(state.progress);
      updateProgressSummary();

      if (correctAnswersEl) {
        const answers = Array.isArray(result?.correctAnswers)
          ? result.correctAnswers.join(' ・ ')
          : '';
        correctAnswersEl.textContent = answers;
      }
      if (explanationEl) {
        explanationEl.textContent = result?.explanation || '';
      }

      if (choiceListEl) {
        choiceListEl.querySelectorAll('button[data-value]').forEach((button) => {
          button.setAttribute('disabled', 'true');
        });
      }
      if (submitButton) submitButton.disabled = true;
      if (nextButton) {
        nextButton.classList.remove('hidden');
        nextButton.disabled = false;
      }
      state.loading = false;
      updateScoreboard();
    } catch (error) {
      console.error(error);
      setFeedback('error', '採点に失敗しました。通信環境を確認してください。');
      state.loading = false;
      state.answered = false;
      updateSubmitState();
    }
  };

  if (submitButton) {
    submitButton.addEventListener('click', submitAnswer);
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      if (nextButton.disabled) return;
      nextButton.disabled = true;
      nextButton.classList.add('hidden');
      moveNext();
    });
  }

  if (retryButton) {
    retryButton.addEventListener('click', () => {
      state.index = 0;
      state.correct = 0;
      state.excludeIds = [];
      state.selected.clear();
      state.answered = false;
      state.loading = false;
      if (resultPanel) resultPanel.classList.add('hidden');
      updateScoreboard();
      fetchQuestion();
    });
  }

  if (gradeLabelEl) {
    gradeLabelEl.textContent = session.gradeLabel || '学年未設定';
  }

  renderSelectedTypes();
  updateProgressSummary();
  updateScoreboard();

  progressTotalEl && (progressTotalEl.textContent = String(state.total));

  fetchQuestion();
})();
`;

export const renderKanjiPlayClientScript = (
  questionTypes: readonly QuestionTypeMeta[],
) => html`
  <script id="kanji-type-meta" type="application/json">
    ${raw(JSON.stringify(questionTypes))}
  </script>
  <script type="module">
    ${raw(MODULE_SOURCE)}
  </script>
`;
