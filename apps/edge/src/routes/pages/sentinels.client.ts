import { html } from 'hono/html';

export const renderSentinelsClientScript = () => html`
  <script type="module">
    (() => {
      const root = document.getElementById('sentinel-root');
      if (!root) {
        return;
      }

      const safeParse = (value, fallback) => {
        if (!value) return fallback;
        try {
          return JSON.parse(decodeURIComponent(value));
        } catch (error) {
          console.warn('Failed to parse sentinel data', error);
          return fallback;
        }
      };

      const puzzle = safeParse(root.dataset.puzzle, null);
      if (!puzzle) {
        return;
      }

      const regionColors = safeParse(root.dataset.regionColors, {});
      const size = Number(puzzle.size) || 6;
      const targetCount = Number(
        root.dataset.targetCount || puzzle.targetCount || size
      );
      const totalRegions = puzzle.regionMap
        ? new Set(puzzle.regionMap.join('').split('')).size
        : targetCount;

      const elements = {
        grid: document.getElementById('sentinel-grid'),
        feedback: document.getElementById('sentinel-feedback'),
        timer: document.getElementById('sentinel-timer'),
        progress: document.getElementById('sentinel-progress'),
        rowStatus: document.getElementById('row-status'),
        columnStatus: document.getElementById('column-status'),
        regionStatus: document.getElementById('region-status'),
        check: document.getElementById('check-sentinels'),
        hint: document.getElementById('hint-sentinels'),
        reset: document.getElementById('reset-sentinels'),
      };

      if (!elements.grid || !elements.feedback || !elements.timer || !elements.progress) {
        return;
      }

      elements.grid.style.gridTemplateColumns = `repeat(${size}, minmax(0, 1fr))`;

      const cells = Array.from({ length: size }, () =>
        Array.from({ length: size }, () => null)
      );
      const states = Array.from({ length: size }, () =>
        Array.from({ length: size }, () => 'empty')
      );

      const keyFrom = (row, col) => `${row},${col}`;
      const blocked = new Set(
        (puzzle.blockedCells || []).map(([row, col]) => keyFrom(row, col))
      );
      const givens = new Set(
        (puzzle.givenSentinels || []).map(([row, col]) => keyFrom(row, col))
      );
      const sentinelIcon = '🛡️';

      const setCellState = (row, col, state) => {
        const cell = cells[row][col];
        states[row][col] = state;
        cell.dataset.state = state;
        cell.dataset.error = 'false';
        cell.dataset.hint = 'false';

        if (state === 'sentinel' || state === 'given') {
          cell.textContent = sentinelIcon;
        } else if (state === 'blocked') {
          cell.textContent = '×';
        } else {
          cell.textContent = '';
        }
      };

      const clearHighlights = () => {
        for (let row = 0; row < size; row += 1) {
          for (let col = 0; col < size; col += 1) {
            const cell = cells[row][col];
            cell.dataset.error = 'false';
            cell.dataset.hint = 'false';
          }
        }
      };

      const initializeGrid = () => {
        elements.grid.innerHTML = '';

        for (let row = 0; row < size; row += 1) {
          for (let col = 0; col < size; col += 1) {
            const cell = document.createElement('button');
            cell.type = 'button';
            cell.className = 'sentinel-cell';
            cell.dataset.row = String(row);
            cell.dataset.col = String(col);

            const regionLetter = puzzle.regionMap?.[row]?.[col];
            if (regionLetter) {
              cell.dataset.region = regionLetter;
              const regionColor = regionColors[regionLetter];
              if (regionColor) {
                cell.style.setProperty('--region-color', regionColor);
              }
            }

            cells[row][col] = cell;
            elements.grid.appendChild(cell);

            const key = keyFrom(row, col);
            if (blocked.has(key)) {
              setCellState(row, col, 'blocked');
            } else if (givens.has(key)) {
              setCellState(row, col, 'given');
            } else {
              setCellState(row, col, 'empty');
            }

            cell.addEventListener('click', () => {
              if (blocked.has(key) || givens.has(key)) {
                return;
              }

              const current = states[row][col];
              const next =
                current === 'empty'
                  ? 'sentinel'
                  : current === 'sentinel'
                  ? 'maybe'
                  : 'empty';
              setCellState(row, col, next);
              updateAllStatuses();
            });
          }
        }
      };

      const getSentinelPositions = () => {
        const positions = [];
        for (let row = 0; row < size; row += 1) {
          for (let col = 0; col < size; col += 1) {
            const state = states[row][col];
            if (state === 'sentinel' || state === 'given') {
              positions.push({ row, col });
            }
          }
        }
        return positions;
      };

      const evaluateBoard = () => {
        const positions = getSentinelPositions();
        const rows = Array.from({ length: size }, () => []);
        const cols = Array.from({ length: size }, () => []);
        const regions = {};

        positions.forEach(({ row, col }) => {
          rows[row].push(row * size + col);
          cols[col].push(row * size + col);
          const regionLetter = puzzle.regionMap?.[row]?.[col];
          if (regionLetter) {
            if (!regions[regionLetter]) {
              regions[regionLetter] = [];
            }
            regions[regionLetter].push([row, col]);
          }
        });

        const conflicts = new Set();
        const warnings = [];

        rows.forEach((cellsInRow, rowIndex) => {
          if (cellsInRow.length === 0) {
            warnings.push(`${rowIndex + 1} 行目にセンチネルがありません。`);
          }
          if (cellsInRow.length > 1) {
            warnings.push(`${rowIndex + 1} 行目にセンチネルが 2 体以上あります。`);
            cellsInRow.forEach((cellIndex) => {
              const r = Math.floor(cellIndex / size);
              const c = cellIndex % size;
              conflicts.add(keyFrom(r, c));
            });
          }
        });

        cols.forEach((cellsInCol, colIndex) => {
          if (cellsInCol.length === 0) {
            warnings.push(`${colIndex + 1} 列目にセンチネルがありません。`);
          }
          if (cellsInCol.length > 1) {
            warnings.push(`${colIndex + 1} 列目にセンチネルが 2 体以上あります。`);
            cellsInCol.forEach((cellIndex) => {
              const r = Math.floor(cellIndex / size);
              const c = cellIndex % size;
              conflicts.add(keyFrom(r, c));
            });
          }
        });

        Object.entries(regions).forEach(([region, regionCells]) => {
          if (regionCells.length === 0) {
            warnings.push(`${region} の領域にセンチネルがありません。`);
          }
          if (regionCells.length > 1) {
            warnings.push(`${region} の領域にセンチネルが 2 体以上あります。`);
            regionCells.forEach(([row, col]) => {
              conflicts.add(keyFrom(row, col));
            });
          }
        });

        for (let i = 0; i < positions.length; i += 1) {
          for (let j = i + 1; j < positions.length; j += 1) {
            const a = positions[i];
            const b = positions[j];
            const dr = Math.abs(a.row - b.row);
            const dc = Math.abs(a.col - b.col);
            if ((dr === 1 && dc === 2) || (dr === 2 && dc === 1)) {
              warnings.push('ナイトの距離で到達できるセンチネルがあります。');
              conflicts.add(keyFrom(a.row, a.col));
              conflicts.add(keyFrom(b.row, b.col));
            }
          }
        }

        return { positions, conflicts, warnings };
      };

      const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60)
          .toString()
          .padStart(2, '0');
        const rest = (seconds % 60).toString().padStart(2, '0');
        return `${minutes}:${rest}`;
      };

      let elapsedSeconds = 0;
      const timerInterval = window.setInterval(() => {
        elapsedSeconds += 1;
        elements.timer.textContent = `⏱ ${formatTime(elapsedSeconds)}`;
      }, 1000);

      const updateStatusCounters = (positions) => {
        const rowCounts = Array.from({ length: size }, () => 0);
        const colCounts = Array.from({ length: size }, () => 0);
        const regionCounts = {};

        positions.forEach(({ row, col }) => {
          rowCounts[row] += 1;
          colCounts[col] += 1;
          const regionLetter = puzzle.regionMap?.[row]?.[col];
          if (regionLetter) {
            regionCounts[regionLetter] = (regionCounts[regionLetter] || 0) + 1;
          }
        });

        const rowsSatisfied = rowCounts.filter((count) => count === 1).length;
        const colsSatisfied = colCounts.filter((count) => count === 1).length;
        const regionsSatisfied = Object.values(regionCounts).filter(
          (count) => count === 1
        ).length;

        if (elements.rowStatus) {
          elements.rowStatus.textContent = `行: ${rowsSatisfied} / ${targetCount}`;
          elements.rowStatus.dataset.state =
            rowsSatisfied === targetCount ? 'good' : 'warning';
        }
        if (elements.columnStatus) {
          elements.columnStatus.textContent = `列: ${colsSatisfied} / ${targetCount}`;
          elements.columnStatus.dataset.state =
            colsSatisfied === targetCount ? 'good' : 'warning';
        }
        if (elements.regionStatus) {
          elements.regionStatus.textContent = `領域: ${regionsSatisfied} / ${totalRegions}`;
          elements.regionStatus.dataset.state =
            regionsSatisfied === totalRegions ? 'good' : 'warning';
        }
      };

      const updateProgress = (positions) => {
        const placed = positions.length;
        elements.progress.textContent = `🛡️ ${placed} / ${targetCount}`;
        if (placed === targetCount) {
          elements.progress.dataset.state = 'good';
        } else if (placed > targetCount) {
          elements.progress.dataset.state = 'error';
        } else {
          elements.progress.dataset.state = 'warning';
        }
      };

      const updateAllStatuses = () => {
        const { positions } = evaluateBoard();
        updateStatusCounters(positions);
        updateProgress(positions);
        elements.feedback.textContent = '';
        clearHighlights();
      };

      const showFeedback = (message, variant) => {
        elements.feedback.textContent = message;
        elements.feedback.classList.remove('celebration');
        if (variant === 'success') {
          elements.feedback.classList.add('celebration');
        }
      };

      const lockVictoryState = () => {
        window.clearInterval(timerInterval);
        if (elements.check instanceof HTMLButtonElement) {
          elements.check.disabled = true;
        }
        if (elements.hint instanceof HTMLButtonElement) {
          elements.hint.disabled = true;
        }
      };

      const handleCheck = () => {
        clearHighlights();
        const { positions, conflicts, warnings } = evaluateBoard();
        updateStatusCounters(positions);
        updateProgress(positions);

        const allRowsCovered = new Set(positions.map((pos) => pos.row)).size === size;
        const allColsCovered = new Set(positions.map((pos) => pos.col)).size === size;
        const regionsCovered = new Set(
          positions
            .map(({ row, col }) => puzzle.regionMap?.[row]?.[col])
            .filter(Boolean)
        ).size;

        if (
          conflicts.size === 0 &&
          positions.length === targetCount &&
          allRowsCovered &&
          allColsCovered &&
          regionsCovered === totalRegions
        ) {
          showFeedback('コンプリート！ナイトセンチネルの配置が完璧です 🎉', 'success');
          lockVictoryState();
          return;
        }

        if (warnings.length === 0) {
          if (positions.length < targetCount) {
            showFeedback('まだセンチネルが足りません。条件を確認しましょう。', 'info');
          } else {
            showFeedback('条件を満たしているか再度チェックしてみましょう。', 'info');
          }
          return;
        }

        showFeedback(warnings[0], 'error');

        conflicts.forEach((cellKey) => {
          const [row, col] = cellKey.split(',').map((value) => Number(value));
          const cell = cells[row]?.[col];
          if (cell) {
            cell.dataset.error = 'true';
          }
        });
      };

      const handleHint = () => {
        clearHighlights();
        const { positions } = evaluateBoard();
        const rowCounts = Array.from({ length: size }, () => 0);
        const colCounts = Array.from({ length: size }, () => 0);
        const regionCounts = {};

        positions.forEach(({ row, col }) => {
          rowCounts[row] += 1;
          colCounts[col] += 1;
          const regionLetter = puzzle.regionMap?.[row]?.[col];
          if (regionLetter) {
            regionCounts[regionLetter] = (regionCounts[regionLetter] || 0) + 1;
          }
        });

        const missingRow = rowCounts.findIndex((count) => count === 0);
        if (missingRow >= 0) {
          for (let col = 0; col < size; col += 1) {
            const cell = cells[missingRow][col];
            if (cell && states[missingRow][col] === 'empty') {
              cell.dataset.hint = 'true';
            }
          }
          showFeedback(`${missingRow + 1} 行目にセンチネルを置けるマスを探してみましょう。`, 'info');
          return;
        }

        const missingCol = colCounts.findIndex((count) => count === 0);
        if (missingCol >= 0) {
          for (let row = 0; row < size; row += 1) {
            const cell = cells[row][missingCol];
            if (cell && states[row][missingCol] === 'empty') {
              cell.dataset.hint = 'true';
            }
          }
          showFeedback(`${missingCol + 1} 列目にセンチネルを置けるマスを考えましょう。`, 'info');
          return;
        }

        const regions = Object.keys(regionCounts);
        const missingRegion = regions.find((key) => regionCounts[key] === 0);
        if (missingRegion) {
          for (let row = 0; row < size; row += 1) {
            for (let col = 0; col < size; col += 1) {
              if (
                puzzle.regionMap?.[row]?.[col] === missingRegion &&
                states[row][col] === 'empty'
              ) {
                cells[row][col].dataset.hint = 'true';
              }
            }
          }
          showFeedback(`${missingRegion} の領域にセンチネルを置ける場所を考えてみましょう。`, 'info');
          return;
        }

        showFeedback('推論メモを整理して、ナイトの動きを意識してみましょう。', 'info');
      };

      const handleReset = () => {
        clearHighlights();
        for (let row = 0; row < size; row += 1) {
          for (let col = 0; col < size; col += 1) {
            const key = keyFrom(row, col);
            if (givens.has(key)) {
              setCellState(row, col, 'given');
            } else if (blocked.has(key)) {
              setCellState(row, col, 'blocked');
            } else {
              setCellState(row, col, 'empty');
            }
          }
        }
        elements.feedback.textContent = '盤面をリセットしました。もう一度チャレンジ！';
        if (elements.check instanceof HTMLButtonElement) {
          elements.check.disabled = false;
        }
        if (elements.hint instanceof HTMLButtonElement) {
          elements.hint.disabled = false;
        }
        elapsedSeconds = 0;
        elements.timer.textContent = '⏱ 00:00';
      };

      initializeGrid();
      updateAllStatuses();

      elements.check?.addEventListener('click', handleCheck);
      elements.hint?.addEventListener('click', handleHint);
      elements.reset?.addEventListener('click', handleReset);

      root.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
          handleCheck();
        }
      });
    })();
  </script>
`;
