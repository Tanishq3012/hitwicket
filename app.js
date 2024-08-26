const socket = new WebSocket('ws://localhost:8080');
let playerID;
let gameState;

socket.onopen = () => console.log('Connected to the server');

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === 'init') {
    playerID = data.playerID;
    gameState = data.gameState;
    renderGameBoard();
  } else if (data.type === 'update') {
    gameState = data.gameState;
    renderGameBoard();
  } else if (data.type === 'error') {
    alert(data.message);
  }
};

function renderGameBoard() {
  const boardElement = document.getElementById('game-board');
  boardElement.innerHTML = ''; // Clear the board

  gameState.board.forEach((row, rowIndex) => {
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');

    row.forEach((cell, colIndex) => {
      const cellElement = document.createElement('div');
      cellElement.classList.add('cell');
      cellElement.textContent = cell || '';
      rowElement.appendChild(cellElement);
    });

    boardElement.appendChild(rowElement);
  });

  document.getElementById('turn-info').textContent = `Current Turn: ${gameState.currentTurn}`;
}

function sendMove(move) {
  socket.send(JSON.stringify({ type: 'move', character: playerID, move }));
}
