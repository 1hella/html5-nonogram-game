const numRows = 20;
const numCols = numRows;
const board = new Array(numRows + 1);

const tbody = document.getElementById('game-table-body');

for (let i = 0; i < numRows + 1; i++) {
    let row = document.createElement('tr');

    for (let j = 0; j < numCols + 1; j++) {
        let cell = document.createElement('td');
        cell.setAttribute('data-row', i);
        cell.setAttribute('data-col', j);
        let cellClass = i === 0 || j === 0 ? 'info-cell' : 'game-cell';
        cell.setAttribute('class', cellClass);
        row.appendChild(cell);
    }

    tbody.appendChild(row);
}

tbody.addEventListener('click', (e) => {
    let cell = e.target;
    let row = cell.dataset.row;
    let col = cell.dataset.col;

    console.log('you clicked cell [' + row + ', ' + col + ']!');
});
