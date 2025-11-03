import { html, raw } from 'hono/html';

const MODULE_SOURCE = `
(() => {
  const root = document.getElementById('stellar-balance-root');
  if (!root) {
    return;
  }

  const puzzleRaw = root.dataset.puzzle;
  if (!puzzleRaw) {
    return;
  }

  const SYMBOLS = ['S', 'M', 'N'];
  const SYMBOL_DISPLAY = {
    S: { icon: '☀️', label: '太陽' },
    M: { icon: '🌙', label: '月' },
    N: { icon: '⭐', label: '星' },
  };

  let parsed;
  try {
    parsed = JSON.parse(puzzleRaw);
  } catch (error) {
    console.error('Failed to parse puzzle data', error);
    return;
  }

  const gridSize = Array.isArray(parsed.solution) ? parsed.solution.length : 0;
  if (!gridSize) {
    return;
  }

  const targetPerLine = gridSize / SYMBOLS.length;
  const totalPerSymbol = targetPerLine * gridSize;

  const initialGrid = parsed.puzzle.map((row) =>
    row.split('').map((cell) => (cell === '.' ? null : cell))
  );
  const solutionGrid = parsed.solution.map((row) => row.split(''));

  const lockedByInitial = parsed.puzzle.map((row) =>
    row.split('').map((cell) => cell !== '.')
  );
  const lockedByHint = parsed.puzzle.map((row) =>
    row.split('').map(() => false)
  );

  const gridState = initialGrid.map((row) => row.slice());

  const gridElement = document.getElementById('stellar-grid');
  const feedbackElement = document.getElementById('stellar-feedback');
  const countsElement = document.getElementById('stellar-counts');
  const checkButton = document.getElementById('stellar-check');
  const hintButton = document.getElementById('stellar-hint');
  const resetButton = document.getElementById('stellar-reset');
  const newButton = document.getElementById('stellar-new');

  if (!gridElement || !feedbackElement || !countsElement) {
    return;
  }

  const paletteButtons = Array.from(
    document.querySelectorAll('[data-stellar-symbol]')
  );

  let activeSymbol = 'S';

  const getIsLocked = (row, col) =>
    lockedByInitial[row][col] || lockedByHint[row][col];

  const updatePaletteState = () => {
    paletteButtons.forEach((button) => {
      const isActive = button.dataset.stellarSymbol === activeSymbol;
      button.dataset.active = isActive ? 'true' : 'false';
    });
  };

  updatePaletteState();

  paletteButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const symbol = button.dataset.stellarSymbol;
      if (!symbol) {
        return;
      }
      activeSymbol = symbol;
      updatePaletteState();
    });
  });

  const renderCell = (cell, value) => {
    if (value) {
      cell.dataset.symbol = value;
      cell.innerHTML =
        '<span aria-hidden="true">' + SYMBOL_DISPLAY[value].icon + '</span>';
    } else {
      cell.dataset.symbol = '';
      cell.innerHTML =
        '<span class="text-sm font-semibold text-slate-400">？</span>';
    }
  };

  const updateCounts = () => {
    const totals = { S: 0, M: 0, N: 0 };
    gridState.forEach((row) => {
      row.forEach((value) => {
        if (value) {
          totals[value] += 1;
        }
      });
    });

    SYMBOLS.forEach((symbol) => {
      const rowElement = countsElement.querySelector(
        '[data-symbol="' + symbol + '"]'
      );
      if (!rowElement) {
        return;
      }
      const current = rowElement.querySelector('[data-role="current"]');
      const target = rowElement.querySelector('[data-role="target"]');
      if (current) {
        current.textContent = String(totals[symbol]);
      }
      if (target) {
        target.textContent = String(totalPerSymbol);
      }
    });
  };

  updateCounts();

  const setFeedback = (message, variant) => {
    feedbackElement.textContent = message;
    if (!variant || variant === 'default') {
      feedbackElement.removeAttribute('data-variant');
    } else {
      feedbackElement.setAttribute('data-variant', variant);
    }
  };

  const clearErrorStates = () => {
    const cellElements = Array.from(
      gridElement.querySelectorAll('.stellar-cell')
    );
    cellElements.forEach((cell) => {
      if (cell.dataset.state) {
        cell.dataset.state = '';
      }
    });
  };

  const markCells = (cells, state) => {
    cells.forEach(([row, col]) => {
      const cell = gridElement.querySelector(
        '[data-row="' + row + '"][data-col="' + col + '"]'
      );
      if (!cell) {
        return;
      }
      cell.dataset.state = state;
    });
  };

  const validateGrid = () => {
    clearErrorStates();

    let hasEmpty = false;
    const errors = new Set();
    const addError = (row, col) => {
      errors.add(row + ':' + col);
    };

    for (let row = 0; row < gridSize; row++) {
      const counts = { S: 0, M: 0, N: 0 };
      let rowHasEmpty = false;
      for (let col = 0; col < gridSize; col++) {
        const value = gridState[row][col];
        if (!value) {
          hasEmpty = true;
          rowHasEmpty = true;
          continue;
        }
        counts[value] += 1;
      }
      SYMBOLS.forEach((symbol) => {
        if (counts[symbol] > targetPerLine) {
          for (let col = 0; col < gridSize; col++) {
            if (gridState[row][col] === symbol) {
              addError(row, col);
            }
          }
        }
      });
      if (!rowHasEmpty && SYMBOLS.some((symbol) => counts[symbol] !== targetPerLine)) {
        for (let col = 0; col < gridSize; col++) {
          if (gridState[row][col]) {
            addError(row, col);
          }
        }
      }
    }

    for (let col = 0; col < gridSize; col++) {
      const counts = { S: 0, M: 0, N: 0 };
      let columnHasEmpty = false;
      for (let row = 0; row < gridSize; row++) {
        const value = gridState[row][col];
        if (!value) {
          columnHasEmpty = true;
          continue;
        }
        counts[value] += 1;
      }
      SYMBOLS.forEach((symbol) => {
        if (counts[symbol] > targetPerLine) {
          for (let row = 0; row < gridSize; row++) {
            if (gridState[row][col] === symbol) {
              addError(row, col);
            }
          }
        }
      });
      if (!columnHasEmpty && SYMBOLS.some((symbol) => counts[symbol] !== targetPerLine)) {
        for (let row = 0; row < gridSize; row++) {
          if (gridState[row][col]) {
            addError(row, col);
          }
        }
      }
    }

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const value = gridState[row][col];
        if (!value) {
          continue;
        }
        const neighbors = [
          [row - 1, col],
          [row + 1, col],
          [row, col - 1],
          [row, col + 1],
        ];
        neighbors.forEach(([nRow, nCol]) => {
          if (nRow < 0 || nRow >= gridSize || nCol < 0 || nCol >= gridSize) {
            return;
          }
          if (gridState[nRow][nCol] === value) {
            addError(row, col);
            addError(nRow, nCol);
          }
        });
      }
    }

    if (errors.size > 0) {
      const marked = Array.from(errors).map((item) => {
        const parts = item.split(':');
        return [Number(parts[0]), Number(parts[1])];
      });
      markCells(marked, 'error');
      setFeedback('条件に合っていないマスがあります。赤い枠の場所を見直してみましょう。', 'warning');
      return false;
    }

    if (hasEmpty) {
      setFeedback('まだ空いているマスがあります。すべてのマスにタイルを置いてから判定してください。');
      return false;
    }

    const matchesSolution = gridState.every((row, rowIndex) =>
      row.every((value, colIndex) => value === solutionGrid[rowIndex][colIndex])
    );

    if (!matchesSolution) {
      setFeedback('ルールは満たしていますが、観測チームの星図と少し違うようです。もう一度確認しましょう。');
      return false;
    }

    const allCells = Array.from(gridElement.querySelectorAll('.stellar-cell'));
    allCells.forEach((cell) => {
      cell.dataset.state = 'complete';
    });

    setFeedback('ミッション完了！宇宙観測士のリクエストどおりにバランスを整えました。', 'success');
    return true;
  };

  const resetGrid = () => {
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        gridState[row][col] = initialGrid[row][col];
        lockedByHint[row][col] = false;
        const cell = gridElement.querySelector(
          '[data-row="' + row + '"][data-col="' + col + '"]'
        );
        if (!cell) {
          continue;
        }
        if (cell.dataset.hinted) {
          delete cell.dataset.hinted;
        }
        cell.dataset.state = '';
        cell.dataset.locked = lockedByInitial[row][col] ? 'true' : 'false';
        renderCell(cell, gridState[row][col]);
      }
    }
    updateCounts();
    setFeedback('グリッドをリセットしました。もう一度バランスを整えてみましょう。');
  };

  const provideHint = () => {
    const candidates = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (getIsLocked(row, col)) {
          continue;
        }
        if (gridState[row][col] !== solutionGrid[row][col]) {
          candidates.push([row, col]);
        }
      }
    }

    if (candidates.length === 0) {
      setFeedback('ヒントを出せるマスがありません。判定ボタンでチェックしてみましょう。');
      return;
    }

    const [row, col] = candidates[Math.floor(Math.random() * candidates.length)];
    const symbol = solutionGrid[row][col];
    gridState[row][col] = symbol;
    lockedByHint[row][col] = true;

    const cell = gridElement.querySelector(
      '[data-row="' + row + '"][data-col="' + col + '"]'
    );
    if (cell) {
      renderCell(cell, symbol);
      cell.dataset.hinted = 'true';
      cell.dataset.locked = 'true';
      cell.dataset.state = '';
    }

    updateCounts();
    setFeedback('ヒントを 1 マス表示しました。ほかのマスもバランスが合うように考えてみましょう。');
  };

  const cellElements = Array.from(gridElement.querySelectorAll('.stellar-cell'));

  cellElements.forEach((cell) => {
    const row = Number(cell.dataset.row || '-1');
    const col = Number(cell.dataset.col || '-1');
    const isLocked = getIsLocked(row, col);
    cell.dataset.locked = isLocked ? 'true' : 'false';

    renderCell(cell, gridState[row] ? gridState[row][col] : null);

    cell.addEventListener('click', () => {
      if (getIsLocked(row, col)) {
        return;
      }

      if (activeSymbol === '.') {
        gridState[row][col] = null;
      } else {
        gridState[row][col] = activeSymbol;
      }

      renderCell(cell, gridState[row][col]);
      updateCounts();
      clearErrorStates();
      setFeedback('バランスを整えています。判定ボタンでいつでもチェックできます。');
    });
  });

  if (checkButton) {
    checkButton.addEventListener('click', () => {
      validateGrid();
    });
  }

  if (hintButton) {
    hintButton.addEventListener('click', () => {
      provideHint();
    });
  }

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      resetGrid();
    });
  }

  if (newButton) {
    newButton.addEventListener('click', () => {
      window.location.reload();
    });
  }
})();
`;

export const renderStellarBalanceClientScript = () => html`
  <script type="module">
    ${raw(MODULE_SOURCE)}
  </script>
`;
