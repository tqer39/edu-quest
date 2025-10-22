import { html, raw } from 'hono/html';
import type { GradePreset } from './grade-presets';

const MODULE_SOURCE = `
(() => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeStartPage);
  } else {
    initializeStartPage();
  }

  function initializeStartPage() {
    const STORAGE_KEY = 'edu-quest:progress:v1';
    const SOUND_STORAGE_KEY = 'edu-quest:sound-enabled';
    const WORKING_STORAGE_KEY = 'edu-quest:show-working';
    const COUNTDOWN_STORAGE_KEY = 'edu-quest:countdown-enabled';
    const QUESTION_COUNT_STORAGE_KEY = 'edu-quest:question-count-default';
    const SESSION_STORAGE_KEY = 'edu-quest:pending-session';

    const getJSON = (id, fallback = []) => {
      const el = document.getElementById(id);
      if (!el) return fallback;
      try {
        const parsed = JSON.parse(el.textContent || 'null');
        return parsed ?? fallback;
      } catch (e) {
        console.warn('failed to parse JSON', e);
        return fallback;
      }
    };

    const presets = getJSON('grade-presets', []);
    const calculationTypes = getJSON('calculation-types', []);
    const gradeLevels = getJSON('grade-levels', []);
    const gradeCalculationTypesMap = getJSON('grade-calculation-types', {});

    const fallbackCalcTypeIds = Array.isArray(calculationTypes)
      ? calculationTypes
          .map((calcType) => (typeof calcType?.id === 'string' ? calcType.id : null))
          .filter((id) => id !== null)
      : [];

    const defaultCalcTypeIds = Array.isArray(gradeCalculationTypesMap.default)
      ? gradeCalculationTypesMap.default
      : Array.isArray(gradeCalculationTypesMap['grade-1'])
        ? gradeCalculationTypesMap['grade-1']
        : fallbackCalcTypeIds;

    // 状態管理
    const state = {
      selectedGrade: null,
      selectedActivity: null, // 'math' or 'game'
      selectedCalculationType: null,
      selectedTheme: null,
      selectedGame: null,
      customConfig: {
        operations: [], // ['add', 'sub', 'mul', 'div', 'add-inverse', 'sub-inverse']
        terms: 2,
        max: 100,
      },
    };

    // DOM要素
    const step1Grade = document.getElementById('step-1-grade');
    const step2Activity = document.getElementById('step-2-activity');
    const step3CalcType = document.getElementById('step-3-calc-type');
    const step4Custom = document.getElementById('step-4-custom');
    const step4Theme = document.getElementById('step-4-theme');
    const step4Game = document.getElementById('step-4-game');

    const gradeBtns = document.querySelectorAll('.grade-btn');
    const activityBtns = document.querySelectorAll('.activity-btn');
    const calcTypeGrid = document.getElementById('calculation-type-grid');
    const themeBtns = document.querySelectorAll('.theme-btn');
    const gameBtns = document.querySelectorAll('.game-btn');

    const soundToggle = document.getElementById('toggle-sound');
    const stepsToggle = document.getElementById('toggle-steps');
    const countdownToggle = document.getElementById('toggle-countdown');
    const startButton = document.getElementById('start-session');
    const clearButton = document.getElementById('clear-selections');
    const questionCountRadios = document.querySelectorAll('input[name="question-count"]');
    const questionCountFieldset = document.getElementById('question-count-fieldset');

    // ステップ表示制御
    function showStep(stepElement) {
      if (stepElement) {
        stepElement.classList.remove('step-hidden');
        updateStepNumbers();
      }
    }

    function hideStep(stepElement) {
      if (stepElement) {
        stepElement.classList.add('step-hidden');
        updateStepNumbers();
      }
    }

    // ステップ番号を更新
    function updateStepNumbers() {
      const allSteps = [step1Grade, step2Activity, step3CalcType, step4Custom, step4Theme, step4Game];
      let currentStep = 0;

      allSteps.forEach(stepElement => {
        if (stepElement && !stepElement.classList.contains('step-hidden')) {
          currentStep++;
          const stepNumberElement = stepElement.querySelector('.step-number');
          if (stepNumberElement) {
            stepNumberElement.textContent = \`STEP \${currentStep}\`;
          }
        }
      });
    }

    function hideAllStepsAfter(stepNumber) {
      if (stepNumber < 2) {
        hideStep(step2Activity);
      }
      if (stepNumber < 3) {
        hideStep(step3CalcType);
      }
      if (stepNumber < 4) {
        hideStep(step4Custom);
        hideStep(step4Theme);
        hideStep(step4Game);
      }
    }

    // ボタン選択状態の制御
    function selectButton(buttons, selectedButton) {
      buttons.forEach(btn => {
        btn.classList.remove('selection-card--selected');
        btn.style.borderColor = '';
      });
      if (selectedButton) {
        selectedButton.classList.add('selection-card--selected');
      }
    }

    // STEP 1: 学年選択（任意・トグル可能）
    gradeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;

        const gradeId = btn.dataset.gradeId;

        // トグル機能: 選択中のボタンを押すと未選択に
        if (state.selectedGrade === gradeId) {
          state.selectedGrade = null;
          btn.classList.remove('selection-card--selected');
        } else {
          state.selectedGrade = gradeId;
          selectButton(gradeBtns, btn);
        }

        // テーマフィルタリングを更新（計算種類が選択されている場合）
        if (state.selectedCalculationType) {
          filterThemesByCalculationType(state.selectedCalculationType.mode);
        }

        updateStartButtonState();
      });
    });

    // STEP 2: 活動選択
    activityBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const activity = btn.dataset.activity;
        state.selectedActivity = activity;
        selectButton(activityBtns, btn);

        // 後続ステップの選択状態をリセット
        state.selectedCalculationType = null;
        state.selectedTheme = null;
        state.selectedGame = null;

        // UIの選択状態もリセット
        themeBtns.forEach(btn => btn.classList.remove('selection-card--selected'));
        gameBtns.forEach(btn => btn.classList.remove('selection-card--selected'));
        if (calcTypeGrid) {
          calcTypeGrid.querySelectorAll('.calc-type-btn').forEach(btn => {
            btn.classList.remove('selection-card--selected');
          });
        }

        // すべての後続ステップを非表示
        hideAllStepsAfter(2);

        // 問題数と途中式の表示/非表示を制御
        if (questionCountFieldset) {
          if (activity === 'math') {
            questionCountFieldset.style.display = '';
          } else {
            questionCountFieldset.style.display = 'none';
          }
        }
        if (stepsToggle) {
          if (activity === 'math') {
            stepsToggle.style.display = '';
          } else {
            stepsToggle.style.display = 'none';
          }
        }

        // STEP 3を表示
        if (activity === 'math') {
          showStep(step3CalcType);
          renderCalculationTypes();
        } else if (activity === 'game') {
          showStep(step4Game);
        }

        updateStartButtonState();
      });
    });

    // 計算の種類をレンダリング
    function renderCalculationTypes() {
      if (!calcTypeGrid) return;

      const availableCalcTypeIds =
        state.selectedGrade && Array.isArray(gradeCalculationTypesMap[state.selectedGrade])
          ? gradeCalculationTypesMap[state.selectedGrade]
          : defaultCalcTypeIds;

      const availableTypes = Array.isArray(calculationTypes)
        ? calculationTypes.filter((calcType) =>
            availableCalcTypeIds.includes(calcType.id)
          )
        : [];

      renderCalculationTypeButtons(availableTypes);
    }

    // 計算種類ボタンを生成
    function renderCalculationTypeButtons(availableTypes) {
      if (!calcTypeGrid) return;

      calcTypeGrid.innerHTML = '';

      availableTypes.forEach((calcType) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'calc-type-btn rounded-2xl border-2 border-transparent bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--mq-primary)]';
        button.dataset.calcTypeId = calcType.id;
        button.dataset.mode = calcType.mode;
        button.innerHTML = \`
          <p class="text-sm font-bold text-[var(--mq-primary-strong)]">\${calcType.label}</p>
          <p class="text-sm font-semibold text-[var(--mq-ink)]">\${calcType.description}</p>
        \`;

        button.addEventListener('click', () => {
          state.selectedCalculationType = calcType;
          const allCalcBtns = calcTypeGrid.querySelectorAll('.calc-type-btn');
          selectButton(allCalcBtns, button);

          hideAllStepsAfter(3);

          // カスタム設定の場合はカスタム設定画面を表示
          if (calcType.mode === 'custom') {
            showStep(step4Custom);
            initializeCustomSettings();
          } else {
            showStep(step4Theme);
            // 学年選択の有無に関わらず、計算種類に応じてテーマをフィルタリング
            filterThemesByCalculationType(calcType.mode);
          }

          updateStartButtonState();
        });

        calcTypeGrid.appendChild(button);
      });
    }

    // カスタム設定の初期化
    function initializeCustomSettings() {
      // カスタム設定のチェックボックスとラジオボタンを取得
      const opCheckboxes = [
        document.getElementById('custom-op-add'),
        document.getElementById('custom-op-sub'),
        document.getElementById('custom-op-mix'),
        document.getElementById('custom-op-mul'),
        document.getElementById('custom-op-div'),
        document.getElementById('custom-op-add-inverse'),
        document.getElementById('custom-op-sub-inverse'),
      ];
      const termsRadios = document.querySelectorAll('input[name="custom-terms"]');
      const maxRadios = document.querySelectorAll('input[name="custom-max"]');

      // チェックボックスの変更を監視
      opCheckboxes.forEach(checkbox => {
        if (!checkbox) return;
        checkbox.addEventListener('change', () => {
          updateCustomOperations();
          updateStartButtonState();
        });
      });

      // ラジオボタンの変更を監視
      termsRadios.forEach(radio => {
        radio.addEventListener('change', () => {
          state.customConfig.terms = Number(radio.value);
          updateStartButtonState();
        });
      });

      maxRadios.forEach(radio => {
        radio.addEventListener('change', () => {
          state.customConfig.max = Number(radio.value);
          updateStartButtonState();
        });
      });

      // 初期値を設定
      updateCustomOperations();
    }

    // カスタム設定の演算子を更新
    function updateCustomOperations() {
      const operations = [];
      const checkboxes = [
        { id: 'custom-op-add', value: 'add' },
        { id: 'custom-op-sub', value: 'sub' },
        { id: 'custom-op-mix', value: 'mix' },
        { id: 'custom-op-mul', value: 'mul' },
        { id: 'custom-op-div', value: 'div' },
        { id: 'custom-op-add-inverse', value: 'add-inverse' },
        { id: 'custom-op-sub-inverse', value: 'sub-inverse' },
      ];

      checkboxes.forEach(({ id, value }) => {
        const checkbox = document.getElementById(id);
        if (checkbox && checkbox.checked) {
          operations.push(value);
        }
      });

      state.customConfig.operations = operations;
    }

    // テーマをフィルタリング
    function filterThemesByCalculationType(calculationMode) {
      const currentGrade = state.selectedGrade;
      const currentGradeOrder = gradeLevels.findIndex(g => g.id === currentGrade);

      themeBtns.forEach(btn => {
        const themeMode = btn.dataset.mode;
        const themeMinGrade = btn.dataset.minGrade;
        const themeMinGradeOrder = gradeLevels.findIndex(g => g.id === themeMinGrade);

        const matchesCalculationType = !calculationMode || themeMode === calculationMode;
        // 学年が未選択の場合は学年制限をチェックしない
        const matchesGradeRequirement = currentGradeOrder === -1 || currentGradeOrder >= themeMinGradeOrder;

        if (matchesCalculationType && matchesGradeRequirement) {
          btn.style.display = '';
        } else {
          btn.style.display = 'none';
        }
      });
    }

    // STEP 4A: テーマ選択
    themeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const themeId = btn.dataset.themeId;

        if (state.selectedTheme === themeId) {
          state.selectedTheme = null;
          btn.classList.remove('selection-card--selected');
        } else {
          state.selectedTheme = themeId;
          themeBtns.forEach(b => b.classList.remove('selection-card--selected'));
          btn.classList.add('selection-card--selected');
        }

        updateStartButtonState();
      });
    });

    // STEP 4B: ゲーム選択
    gameBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const game = btn.dataset.game;
        state.selectedGame = game;
        selectButton(gameBtns, btn);

        updateStartButtonState();
      });
    });

    // スタートボタンの状態更新
    function updateStartButtonState() {
      if (!startButton) return;

      let canStart = false;

      // ゲームモードの場合
      if (state.selectedActivity === 'game' && state.selectedGame) {
        canStart = true;
      }

      // 計算モードの場合（学年は任意）
      if (state.selectedActivity === 'math' && state.selectedCalculationType) {
        // カスタム設定の場合は、少なくとも1つの演算子が選択されている必要がある
        if (state.selectedCalculationType.mode === 'custom') {
          canStart = state.customConfig.operations.length > 0;
        } else {
          canStart = true;
        }
      }

      startButton.disabled = !canStart;
    }

    // トグルボタン
    function toggleButton(button) {
      if (!button) return;
      const nextState = button.dataset.state !== 'on';
      button.dataset.state = nextState ? 'on' : 'off';
      if (nextState) {
        button.classList.add('setting-toggle--on');
      } else {
        button.classList.remove('setting-toggle--on');
      }

      // localStorageに保存
      try {
        if (button === soundToggle) {
          localStorage.setItem(SOUND_STORAGE_KEY, String(nextState));
        } else if (button === stepsToggle) {
          localStorage.setItem(WORKING_STORAGE_KEY, String(nextState));
        } else if (button === countdownToggle) {
          localStorage.setItem(COUNTDOWN_STORAGE_KEY, String(nextState));
        }
      } catch (e) {
        console.warn('failed to save toggle state', e);
      }
    }

    if (soundToggle) {
      soundToggle.addEventListener('click', () => toggleButton(soundToggle));
    }
    if (stepsToggle) {
      stepsToggle.addEventListener('click', () => toggleButton(stepsToggle));
    }
    if (countdownToggle) {
      countdownToggle.addEventListener('click', () => toggleButton(countdownToggle));
    }

    // リセットボタン
    if (clearButton) {
      clearButton.addEventListener('click', () => {
        // 状態をリセット
        state.selectedGrade = null;
        state.selectedActivity = null;
        state.selectedCalculationType = null;
        state.selectedTheme = null;
        state.selectedGame = null;

        // 全てのステップを非表示（STEP 1とSTEP 2は常に表示）
        hideAllStepsAfter(2);

        // 問題数と途中式を非表示に戻す（初期状態）
        if (questionCountFieldset) {
          questionCountFieldset.style.display = 'none';
        }
        if (stepsToggle) {
          stepsToggle.style.display = 'none';
        }

        // 全ての選択を解除
        gradeBtns.forEach(btn => btn.classList.remove('selection-card--selected'));
        activityBtns.forEach(btn => btn.classList.remove('selection-card--selected'));
        themeBtns.forEach(btn => btn.classList.remove('selection-card--selected'));
        gameBtns.forEach(btn => btn.classList.remove('selection-card--selected'));
        if (calcTypeGrid) {
          calcTypeGrid.querySelectorAll('.calc-type-btn').forEach(btn => {
            btn.classList.remove('selection-card--selected');
          });
        }

        updateStartButtonState();
      });
    }

    // スタートボタン
    if (startButton) {
      startButton.addEventListener('click', () => {
        if (startButton.disabled) return;

        // ゲームモードの場合
        if (state.selectedActivity === 'game' && state.selectedGame === 'sudoku') {
          window.location.href = '/sudoku';
          return;
        }

        // 計算モードの場合（学年は任意）
        if (state.selectedActivity === 'math' && state.selectedCalculationType) {
          const soundEnabled = soundToggle?.dataset.state === 'on';
          const workingEnabled = stepsToggle?.dataset.state === 'on';
          const countdownEnabled = countdownToggle?.dataset.state === 'on';
          const questionCount = Number(
            Array.from(questionCountRadios).find(r => r.checked)?.value || 10
          );

          try {
            localStorage.setItem(SOUND_STORAGE_KEY, String(soundEnabled));
            localStorage.setItem(WORKING_STORAGE_KEY, String(workingEnabled));
            localStorage.setItem(COUNTDOWN_STORAGE_KEY, String(countdownEnabled));
            localStorage.setItem(QUESTION_COUNT_STORAGE_KEY, String(questionCount));
          } catch (e) {
            console.warn('failed to persist settings', e);
          }

          const gradePreset = state.selectedGrade ? (presets.find(p => p.id === state.selectedGrade) || gradeLevels.find(l => l.id === state.selectedGrade)) : gradeLevels[0];
          const themePreset = state.selectedTheme ? presets.find(p => p.id === state.selectedTheme) : null;

          const session = {
            gradeId: state.selectedGrade || gradePreset.id,
            gradeLabel: gradePreset?.label || '',
            gradeDescription: gradePreset?.description || '',
            mode: state.selectedCalculationType.mode,
            max: gradePreset?.max || null,
            questionCount,
            soundEnabled,
            workingEnabled,
            countdownEnabled,
            createdAt: Date.now(),
            baseGradeId: state.selectedGrade || gradePreset.id,
            baseGradeLabel: gradePreset?.label || '',
            baseGradeDescription: gradePreset?.description || '',
            baseGradeMode: gradePreset?.mode || '',
            baseGradeMax: gradePreset?.max || null,
            baseGrade: gradePreset ? {
              id: gradePreset.id,
              label: gradePreset.label,
              description: gradePreset.description,
              mode: gradePreset.mode,
              max: gradePreset.max,
            } : null,
            theme: themePreset ? {
              id: themePreset.id,
              label: themePreset.label,
              description: themePreset.description,
            } : null,
            calculationType: {
              id: state.selectedCalculationType.id,
              label: state.selectedCalculationType.label,
              description: state.selectedCalculationType.description,
              mode: state.selectedCalculationType.mode,
            },
            // カスタム設定の場合は設定値を保存
            customConfig: state.selectedCalculationType.mode === 'custom' ? {
              operations: state.customConfig.operations,
              terms: state.customConfig.terms,
              max: state.customConfig.max,
            } : null,
          };

          try {
            sessionStorage.removeItem(SESSION_STORAGE_KEY);
            sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
            console.log('Session saved:', session);
          } catch (e) {
            console.warn('failed to write session storage', e);
          }

          window.location.href = '/math/play';
        }
      });
    }

    // 初期化: STEP 1とSTEP 2は常に表示
    if (step1Grade) step1Grade.classList.remove('step-hidden');
    if (step2Activity) step2Activity.classList.remove('step-hidden');
    updateStartButtonState();

    // ローカルストレージから設定を復元
    try {
      const soundEnabled = localStorage.getItem(SOUND_STORAGE_KEY) === 'true';
      const workingEnabled = localStorage.getItem(WORKING_STORAGE_KEY) === 'true';
      const countdownEnabledStored = localStorage.getItem(COUNTDOWN_STORAGE_KEY);
      // カウントダウンはデフォルトでON（初回はnullなのでtrue）
      const countdownEnabled = countdownEnabledStored === null ? true : countdownEnabledStored === 'true';

      if (soundToggle) {
        soundToggle.dataset.state = soundEnabled ? 'on' : 'off';
        if (soundEnabled) soundToggle.classList.add('setting-toggle--on');
      }
      if (stepsToggle) {
        stepsToggle.dataset.state = workingEnabled ? 'on' : 'off';
        if (workingEnabled) stepsToggle.classList.add('setting-toggle--on');
      }
      if (countdownToggle) {
        countdownToggle.dataset.state = countdownEnabled ? 'on' : 'off';
        if (countdownEnabled) {
          countdownToggle.classList.add('setting-toggle--on');
        } else {
          countdownToggle.classList.remove('setting-toggle--on');
        }
      }
    } catch (e) {
      console.warn('failed to load settings', e);
    }
  }
})();
`;

export const renderStartClientScript = (
  presets: readonly GradePreset[],
  calculationTypes: unknown,
  gradeLevels: unknown,
  gradeCalculationTypes: unknown
) => html`
  <script id="grade-presets" type="application/json">
    ${raw(JSON.stringify(presets))}
  </script>
  <script id="calculation-types" type="application/json">
    ${raw(JSON.stringify(calculationTypes))}
  </script>
  <script id="grade-levels" type="application/json">
    ${raw(JSON.stringify(gradeLevels))}
  </script>
  <script id="grade-calculation-types" type="application/json">
    ${raw(JSON.stringify(gradeCalculationTypes))}
  </script>
  <script type="module">
    ${raw(MODULE_SOURCE)};
  </script>
`;
