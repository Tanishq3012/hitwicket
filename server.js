const WebSocket = require('ws');

// Create a WebSocket server
const server = new WebSocket.Server({ port: 8080 });

// Initialize game state
let gameState = {
  board: [
    ['P1', null, null, null, 'P2'],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    ['P2', null, null, null, 'P1']
  ],
  currentTurn: 'P1', // Track whose turn it is
  players: {}, // Store connected players
};

// Handle incoming connections
server.on('connection', (ws) => {
  const playerID = `Player ${Object.keys(gameState.players).length + 1}`;
  gameState.players[playerID] = ws;

  ws.send(JSON.stringify({ type: 'init', playerID, gameState }));

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    handlePlayerAction(playerID, data);
  });

  ws.on('close', () => {
    delete gameState.players[playerID];
    console.log(`${playerID} disconnected`);
  });
});

function handlePlayerAction(playerID, data) {
  if (data.type === 'move') {
    const { character, move } = data;
    if (gameState.currentTurn === character.charAt(0)) {
      if (isValidMove(character, move)) {
        updateGameState(character, move);
        broadcastState();
      } else {
        gameState.players[playerID].send(JSON.stringify({ type: 'error', message: 'Invalid move' }));
      }
    } else {
      gameState.players[playerID].send(JSON.stringify({ type: 'error', message: 'Not your turn' }));
    }
  }
}

function isValidMove(character, move) {
  // Implement validation logic (e.g., checking grid boundaries, movement patterns)
  return true;
}

function updateGameState(character, move) {
  // Update the game board and game state based on the move
  gameState.currentTurn = gameState.currentTurn === 'P1' ? 'P2' : 'P1';
}

function broadcastState() {
  for (let playerID in gameState.players) {
    gameState.players[playerID].send(JSON.stringify({ type: 'update', gameState }));
  }
}

console.log('WebSocket server running on ws://localhost:8080');

app.use(express.static('public'));
