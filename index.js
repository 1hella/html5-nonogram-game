const numRows = 20;
const numCols = numRows;
const board = new Array(numRows);
const tableCells = new Array(numRows + 1);
const tbody = document.getElementById('game-table-body');
const percentSpots = 75;

const UNSELECTED = 0;
const SELECTED = 1;
const MARKED = 2;

makeTable();
makeGame();
setHints();

tbody.addEventListener('click', (e) => {
    let tableCell = e.target;
    let row = tableCell.dataset.row;
    let col = tableCell.dataset.col;

    if (row >= 0 && col >= 0) {
        let cell = board[row][col];

        switch (cell.selectedState) {
            case UNSELECTED:
                cell.selectedState = SELECTED;
                break;
            case SELECTED:
                cell.selectedState = MARKED;
                break;
            case MARKED:
                cell.selectedState = UNSELECTED;
                break;
        }

        updateTable();
        checkForWin();
    }
});

function setHints() {
    // horizontal
    for (let i = 1; i < numRows + 1; i++) {
        let row = [];
        let count = 0;
        for (let j = 1; j < numCols + 1; j++) {
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
        row.forEach(num => {
            let span = document.createElement('span');
            span.innerHTML = num;
            infoCell.appendChild(span);
        })
    }

    // vertical
    for (let j = 1; j < numCols + 1; j++) {
        let col = [];
        let count = 0;
        for (let i = 1; i < numRows + 1; i++) {
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
        col.forEach(num => {
            let span = document.createElement('span');
            span.innerHTML = num;
            infoCell.appendChild(span);
        })
    }
}

function checkForWin() {
    for (let i = 1; i < numRows + 1; i++) {
        for (let j = 1; j < numCols + 1; j++) {
            let tableCell = tableCells[i][j];
            let cell = board[i - 1][j - 1];
            if ((cell.isSpot && cell.selectedState !== SELECTED)
                || (!cell.isSpot && cell.selectedState === SELECTED)) {
                return;
            }
        }
    }

    alert('You win!');
}

// updates game cells, not info cells
function updateTable() {
    for (let i = 1; i < numRows + 1; i++) {
        for (let j = 1; j < numCols + 1; j++) {
            let tableCell = tableCells[i][j];
            let cell = board[i - 1][j - 1];
            if (cell.selectedState === SELECTED) {
                tableCell.classList.add("checked");
                tableCell.classList.remove("marked")
            } else if (cell.selectedState === MARKED) {
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
    for (let i = 0; i < numRows; i++) {
        board[i] = new Array(numCols);
        for (let j = 0; j < numCols; j++) {
            board[i][j] = {
                selectedState: UNSELECTED,
                isSpot: Math.random() >= 1 - (percentSpots / 100)
            }
        }
    }
}

function makeTable() {
    for (let i = 0; i < numRows + 1; i++) {
        tableCells[i] = new Array(numCols + 1);
        let row = document.createElement('tr');

        for (let j = 0; j < numCols + 1; j++) {
            let cell = document.createElement('td');
            let isInfoCell = i === 0 || j === 0;
            cell.setAttribute('data-row', i - 1);
            cell.setAttribute('data-col', j - 1);
            let cellClass = isInfoCell ? 'info-cell' : 'game-cell';
            cell.setAttribute('class', cellClass);
            tableCells[i][j] = cell;
            row.appendChild(cell);
        }

        tbody.appendChild(row);
    }
}

function reset() {
    for (let i = 1; i < numRows + 1; i++) {
        for (let j = 1; j < numCols + 1; j++) {
            let cell = board[i - 1][j - 1];
            cell.selectedState = UNSELECTED;
        }
    }

    updateTable();
}

function solve() {
    for (let i = 1; i < numRows + 1; i++) {
        for (let j = 1; j < numCols + 1; j++) {
            let cell = board[i - 1][j - 1];
            cell.selectedState = cell.isSpot ? SELECTED : UNSELECTED;
        }
    }

    updateTable();
}
