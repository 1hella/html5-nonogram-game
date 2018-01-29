(() => {
    const NUM_ROWS = 20;
    const NUM_COLS = NUM_ROWS;
    const EASY_PERCENT = 92;
    const MEDIUM_PERCENT = 82;
    const HARD_PERCENT = 72;
    const EASY_DIFFICULTY = 'easy';
    const MEDIUM_DIFFICULTY = 'medium';
    const HARD_DIFFICULTY = 'hard';
    const STATE_UNSELECTED = 0;
    const STATE_SELECTED = 1;
    const STATE_MARKED = 2;
    const DEFAULT_DIFFICULTY = MEDIUM_DIFFICULTY;

    const board = new Array(NUM_ROWS);
    const tableCells = new Array(NUM_ROWS + 1);
    const tbody = document.getElementById('game-table-body');

    let percentSpots = undefined;
    let currentSelectState = undefined;

    document.getElementById('reset').addEventListener('click', reset);
    document.getElementById('solve').addEventListener('click', solve);
    document.getElementById('start-easy').addEventListener('click', () => start(EASY_DIFFICULTY));
    document.getElementById('start-medium').addEventListener('click', () => start(MEDIUM_DIFFICULTY));
    document.getElementById('start-hard').addEventListener('click', () => start(HARD_DIFFICULTY));

    makeTable();
    start(DEFAULT_DIFFICULTY);

    function start(difficulty) {
        switch (difficulty) {
            case EASY_DIFFICULTY:
                percentSpots = EASY_PERCENT;
                break;
            case MEDIUM_DIFFICULTY:
                percentSpots = MEDIUM_PERCENT;
                break;
            case HARD_DIFFICULTY:
                percentSpots = HARD_PERCENT;
                break;
            default:
                start(DEFAULT_DIFFICULTY);
                break;
        }

        makeGame();
        setHints();
        reset();
    }

    function setHints() {
        // horizontal
        for (let i = 1; i < NUM_ROWS + 1; i++) {
            let row = [];
            let count = 0;
            for (let j = 1; j < NUM_COLS + 1; j++) {
                let cell = board[i - 1][j - 1];

                if (cell.isSpot) {
                    count++;
                } else if (count > 0) {
                    row.push(count);
                    count = 0;
                }
            }

            if (count > 0) {
                row.push(count);
            }

            let infoCell = tableCells[i][0];
            while (infoCell.firstChild) {
                infoCell.removeChild(infoCell.firstChild);
            }

            row.forEach(num => {
                let span = document.createElement('span');
                span.innerHTML = num;
                infoCell.appendChild(span);
            })
        }

        // vertical
        for (let j = 1; j < NUM_COLS + 1; j++) {
            let col = [];
            let count = 0;
            for (let i = 1; i < NUM_ROWS + 1; i++) {
                let cell = board[i - 1][j - 1];

                if (cell.isSpot) {
                    count++;
                } else if (count > 0) {
                    col.push(count);
                    count = 0;
                }
            }

            if (count > 0) {
                col.push(count);
            }

            let infoCell = tableCells[0][j];
            while (infoCell.firstChild) {
                infoCell.removeChild(infoCell.firstChild);
            }

            col.forEach(num => {
                let span = document.createElement('span');
                span.innerHTML = num;
                infoCell.appendChild(span);
            })
        }

        // click listeners
        let spans = document.querySelectorAll('.info-cell span');
        spans.forEach(span => {
            span.addEventListener('click', e => {
                let target = e.target;
                if (target.classList.contains('checked')) {
                    target.classList.remove('checked');
                } else {
                    target.classList.add('checked');
                }
            });
        });
    }

    function checkForWin() {
        for (let i = 1; i < NUM_ROWS + 1; i++) {
            for (let j = 1; j < NUM_COLS + 1; j++) {
                let tableCell = tableCells[i][j];
                let cell = board[i - 1][j - 1];
                if ((cell.isSpot && cell.selectedState !== STATE_SELECTED) ||
                    (!cell.isSpot && cell.selectedState === STATE_SELECTED)) {
                    return;
                }
            }
        }

        alert('You win!');
    }

    // updates game cells, not info cells
    function updateTable() {
        for (let i = 1; i < NUM_ROWS + 1; i++) {
            for (let j = 1; j < NUM_COLS + 1; j++) {
                let tableCell = tableCells[i][j];
                let cell = board[i - 1][j - 1];
                if (cell.selectedState === STATE_SELECTED) {
                    tableCell.classList.add("checked");
                    tableCell.classList.remove("marked")
                } else if (cell.selectedState === STATE_MARKED) {
                    tableCell.classList.add("marked");
                    tableCell.classList.remove("checked")
                } else {
                    tableCell.classList.remove("checked");
                    tableCell.classList.remove("marked");
                }
            }
        }
    }

    function makeGame() {
        for (let i = 0; i < NUM_ROWS; i++) {
            board[i] = new Array(NUM_COLS);
            for (let j = 0; j < NUM_COLS; j++) {
                board[i][j] = {
                    selectedState: STATE_UNSELECTED,
                    isSpot: Math.random() >= 1 - (percentSpots / 100)
                }
            }
        }
    }

    function makeTable() {
        let mouseoverListener = e => {
            let tableCell = e.target;
            let row = tableCell.dataset.row;
            let col = tableCell.dataset.col;
            if (row >= 0 && col >= 0 && e.buttons === 1 && currentSelectState !== undefined) {
                e.preventDefault();
                let cell = board[row][col];

                cell.selectedState = currentSelectState;


                updateTable();
                checkForWin();
            }
        };

        for (let i = 0; i < NUM_ROWS + 1; i++) {
            tableCells[i] = new Array(NUM_COLS + 1);
            let row = document.createElement('tr');

            for (let j = 0; j < NUM_COLS + 1; j++) {
                let cell = document.createElement('td');
                let isInfoCell = i === 0 || j === 0;
                cell.setAttribute('data-row', i - 1);
                cell.setAttribute('data-col', j - 1);
                let cellClass = isInfoCell ? 'info-cell' : 'game-cell';
                cell.setAttribute('class', cellClass);
                cell.addEventListener('mouseover', mouseoverListener);
                tableCells[i][j] = cell;
                row.appendChild(cell);
            }

            tbody.appendChild(row);
        }

        document.addEventListener('mousedown', e => {
            let tableCell = e.target;
            let row = tableCell.dataset.row;
            let col = tableCell.dataset.col;

            if (row >= 0 && col >= 0) {
                e.preventDefault();
                let cell = board[row][col];

                switch (cell.selectedState) {
                    case STATE_UNSELECTED:
                        cell.selectedState = STATE_SELECTED;
                        break;
                    case STATE_SELECTED:
                        cell.selectedState = STATE_MARKED;
                        break;
                    case STATE_MARKED:
                        cell.selectedState = STATE_UNSELECTED;
                        break;
                }

                currentSelectState = cell.selectedState;

                updateTable();
                checkForWin();
            } else {
                currentSelectState = undefined;
            }
        });
    }

    function reset() {
        for (let i = 1; i < NUM_ROWS + 1; i++) {
            for (let j = 1; j < NUM_COLS + 1; j++) {
                let cell = board[i - 1][j - 1];
                cell.selectedState = STATE_UNSELECTED;
            }
        }

        updateTable();
    }

    function solve() {
        for (let i = 1; i < NUM_ROWS + 1; i++) {
            for (let j = 1; j < NUM_COLS + 1; j++) {
                let cell = board[i - 1][j - 1];
                cell.selectedState = cell.isSpot ? STATE_SELECTED : STATE_UNSELECTED;
            }
        }

        updateTable();
    }
})();
