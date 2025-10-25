import { html, raw } from 'hono/html';
import type {
  GradeMeta,
  QuestionTypeMeta,
  KanjiQuestionType,
} from '../../application/usecases/kanji-quiz';

const MODULE_SOURCE = `
(() => {
  const SESSION_KEY = 'kanjiquest:session:v1';
  const QUESTION_COUNT_KEY = 'kanjiquest:question-count-default';

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

  const gradeLevels = parseJSON('kanji-grade-levels', []);
  const questionTypes = parseJSON('kanji-question-types', []);
  const gradeTypeMap = parseJSON('kanji-grade-type-map', {});
  const questionCountOptions = parseJSON('kanji-question-count-options', [10]);

  const state = {
    selectedGrade: null,
    selectedTypes: new Set(),
    questionCount: Array.isArray(questionCountOptions) && questionCountOptions.length > 0
      ? Number(questionCountOptions[0])
      : 10,
  };

  const root = document.getElementById('kanji-start-root');
  if (!root) return;

  const gradeButtons = root.querySelectorAll('[data-grade-id]');
  const typeButtons = root.querySelectorAll('[data-type-id]');
  const startButton = document.getElementById('kanji-start-button');
  const resetButton = document.getElementById('kanji-reset-button');
  const typeHint = document.getElementById('kanji-type-hint');
  const countRadios = root.querySelectorAll('input[name="kanji-question-count"]');

  const updateStartButtonState = () => {
    if (!startButton) return;
    const hasGrade = typeof state.selectedGrade === 'string';
    const hasType = state.selectedTypes.size > 0;
    startButton.disabled = !(hasGrade && hasType);
  };

  const updateTypeAvailability = () => {
    const currentTypes =
      typeof state.selectedGrade === 'string'
        ? gradeTypeMap[state.selectedGrade] || []
        : [];
    const allowed = new Set(currentTypes);
    typeButtons.forEach((button) => {
      const typeId = button.getAttribute('data-type-id');
      if (!typeId) return;
      const available = allowed.size === 0 || allowed.has(typeId);
      if (available) {
        button.removeAttribute('disabled');
        button.classList.remove('kanji-option--disabled');
        button.setAttribute('aria-disabled', 'false');
      } else {
        button.setAttribute('disabled', 'true');
        button.classList.add('kanji-option--disabled');
        button.setAttribute('aria-disabled', 'true');
        button.classList.remove('selection-card--selected');
        state.selectedTypes.delete(typeId);
      }
    });

    if (typeHint) {
      if (allowed.size === 0) {
        typeHint.textContent = '先に学年を選ぶと出題形式が表示されます。';
      } else {
        typeHint.textContent = 'あてたい形式を選んでね（複数えらべるよ）';
      }
    }

    updateStartButtonState();
  };

  const toggleSelection = (button, typeId) => {
    if (!button || !typeId) return;
    const isSelected = state.selectedTypes.has(typeId);
    if (isSelected) {
      state.selectedTypes.delete(typeId);
      button.classList.remove('selection-card--selected');
    } else {
      state.selectedTypes.add(typeId);
      button.classList.add('selection-card--selected');
    }
    updateStartButtonState();
  };

  gradeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const gradeId = button.getAttribute('data-grade-id');
      if (!gradeId || button.hasAttribute('disabled')) return;

      gradeButtons.forEach((btn) => btn.classList.remove('selection-card--selected'));
      if (state.selectedGrade === gradeId) {
        state.selectedGrade = null;
      } else {
        state.selectedGrade = gradeId;
        button.classList.add('selection-card--selected');
      }
      updateTypeAvailability();
    });
  });

  typeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.hasAttribute('disabled')) return;
      const typeId = button.getAttribute('data-type-id');
      toggleSelection(button, typeId);
    });
  });

  countRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        state.questionCount = Number(radio.value);
      }
    });
  });

  if (startButton) {
    startButton.addEventListener('click', () => {
      if (startButton.disabled) return;
      const grade = gradeLevels.find((item) => item.id === state.selectedGrade);
      if (!grade) return;
      const types = Array.from(state.selectedTypes);
      if (types.length === 0) return;

      const session = {
        gradeId: grade.id,
        gradeLabel: grade.label,
        gradeDescription: grade.description,
        questionTypes: types,
        questionCount: state.questionCount,
        createdAt: Date.now(),
      };

      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        localStorage.setItem(QUESTION_COUNT_KEY, String(state.questionCount));
      } catch (error) {
        console.warn('failed to store kanji session', error);
      }

      window.location.href = '/kanji/play';
    });
  }

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      state.selectedGrade = null;
      state.selectedTypes.clear();
      gradeButtons.forEach((btn) => btn.classList.remove('selection-card--selected'));
      typeButtons.forEach((btn) => btn.classList.remove('selection-card--selected'));
      updateTypeAvailability();
      updateStartButtonState();
    });
  }

  try {
    const savedCount = Number(localStorage.getItem(QUESTION_COUNT_KEY));
    if (!Number.isNaN(savedCount) && savedCount > 0) {
      state.questionCount = savedCount;
      countRadios.forEach((radio) => {
        radio.checked = Number(radio.value) === savedCount;
      });
    }
  } catch (error) {
    console.warn('failed to restore question count', error);
  }

  updateTypeAvailability();
  updateStartButtonState();
})();
`;

export const renderKanjiStartClientScript = (
  grades: readonly GradeMeta[],
  questionTypes: readonly QuestionTypeMeta[],
  gradeTypeMap: Record<string, KanjiQuestionType[]>,
  questionCountOptions: readonly number[]
) => html`
  <script id="kanji-grade-levels" type="application/json">
    ${raw(JSON.stringify(grades))}
  </script>
  <script id="kanji-question-types" type="application/json">
    ${raw(JSON.stringify(questionTypes))}
  </script>
  <script id="kanji-grade-type-map" type="application/json">
    ${raw(JSON.stringify(gradeTypeMap))}
  </script>
  <script id="kanji-question-count-options" type="application/json">
    ${raw(JSON.stringify(questionCountOptions))}
  </script>
  <script type="module">
    ${raw(MODULE_SOURCE)}
  </script>
`;
