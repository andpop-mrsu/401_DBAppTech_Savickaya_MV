document.addEventListener('DOMContentLoaded', async () => {
  await initDB(); // инициализация IndexedDB

  // Обработчики кнопок
  document.getElementById('btn-new-game').addEventListener('click', startNewGame);
  document.getElementById('btn-history').addEventListener('click', showGameHistory);
});

let currentGame = null;

async function startNewGame() {
  const playerName = prompt("Введите ваше имя:", "Игрок");
  if (!playerName) return;

  const size = parseInt(document.getElementById('board-size').value) || 3;
  const humanSymbol = Math.random() < 0.5 ? 'X' : 'O';

  currentGame = new TicTacToeGame(size, humanSymbol, playerName);
  renderBoard();

  // Если человек играет O — ИИ делает первый ход
  if (humanSymbol === 'O') {
    const aiMove = currentGame.aiMove();
    updateCell(aiMove.x, aiMove.y, 'X');
  }
}

function handleCellClick(x, y) {
  if (!currentGame || currentGame.gameOver) return;
  if (currentGame.currentPlayer !== currentGame.humanSymbol) return;

  if (currentGame.makeMove(x, y)) {
    updateCell(x, y, currentGame.humanSymbol);
    checkEndGame();

    // Ход ИИ после хода игрока (если игра не окончена)
    if (!currentGame.gameOver) {
      setTimeout(() => {
        const aiMove = currentGame.aiMove();
        if (aiMove) {
          updateCell(aiMove.x, aiMove.y, currentGame.getComputerSymbol());
          checkEndGame();
        }
      }, 300);
    }
  }
}

function checkEndGame() {
  if (currentGame.gameOver) {
    let message;
    if (currentGame.winner === 'draw') {
      message = "Ничья!";
    } else if (currentGame.winner === currentGame.humanSymbol) {
      message = "Вы победили!";
    } else {
      message = "Победил компьютер!";
    }
    alert(message);

    // Сохраняем игру
    const gameData = {
      size: currentGame.size,
      date: new Date().toISOString(),
      playerName: currentGame.playerName,
      playerSymbol: currentGame.humanSymbol,
      winner: currentGame.winner,
      moves: currentGame.moves
    };
    saveGame(gameData);
  }
}