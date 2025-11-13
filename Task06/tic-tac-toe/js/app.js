class App {
    constructor() {
        this.database = new Database();
        this.currentGame = null;
        this.replayData = null;
        this.currentReplayMove = 0;
        this.init();
    }

    async init() {
        await this.database.init();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Меню
        document.getElementById('newGameBtn').addEventListener('click', () => {
            this.showScreen('newGameScreen');
        });

        document.getElementById('historyBtn').addEventListener('click', () => {
            this.showHistoryScreen();
        });

        document.getElementById('replayBtn').addEventListener('click', () => {
            this.showReplayListScreen();
        });

        // Новая игра
        document.getElementById('startGameBtn').addEventListener('click', () => {
            this.startNewGame();
        });

        // Кнопки "Назад"
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.id === 'backToMenu' && this.currentGame && !this.currentGame.gameOver) {
                    if (!confirm('Вы уверены? Текущая игра будет потеряна.')) {
                        return;
                    }
                }
                this.showScreen('menu');
            });
        });

        // Управление повтором
        document.getElementById('prevMove').addEventListener('click', () => {
            this.replayPrevMove();
        });

        document.getElementById('nextMove').addEventListener('click', () => {
            this.replayNextMove();
        });
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    startNewGame() {
        const playerName = document.getElementById('playerName').value.trim();
        if (!playerName) {
            alert('Введите имя игрока!');
            return;
        }

        const boardSize = parseInt(document.getElementById('boardSize').value);
        const playerSymbol = Math.random() < 0.5 ? 'X' : 'O';
        
        this.currentGame = new Game(boardSize, playerName, playerSymbol);
        this.renderGame();
        this.showScreen('gameScreen');

        document.getElementById('playerNameDisplay').textContent = playerName;
        document.getElementById('playerSymbol').textContent = playerSymbol;
        
        if (playerSymbol === 'O') {
            setTimeout(() => {
                this.makeAIMove();
            }, 500);
        }
    }

    renderGame() {
        const boardElement = document.getElementById('gameBoard');
        boardElement.innerHTML = '';
        boardElement.style.gridTemplateColumns = `repeat(${this.currentGame.boardSize}, 1fr)`;
        
        for (let row = 0; row < this.currentGame.boardSize; row++) {
            for (let col = 0; col < this.currentGame.boardSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                const value = this.currentGame.board[row][col];
                if (value) {
                    cell.textContent = value;
                    cell.classList.add(value.toLowerCase());
                    cell.classList.add('disabled');
                }
                
                // Подсветка выигрышной комбинации
                if (this.currentGame.winningCells.some(c => c.row === row && c.col === col)) {
                    cell.classList.add('win');
                }
                
                cell.addEventListener('click', () => this.handleCellClick(row, col));
                boardElement.appendChild(cell);
            }
        }
        
        document.getElementById('currentTurn').textContent = 
            this.currentGame.currentTurn === this.currentGame.playerSymbol ? 'Ваш' : 'Компьютер';
        
        if (this.currentGame.gameOver) {
            this.showGameResult();
        }
    }

    handleCellClick(row, col) {
        if (this.currentGame.gameOver || 
            this.currentGame.currentTurn !== this.currentGame.playerSymbol ||
            this.currentGame.board[row][col]) {
            return;
        }

        if (this.currentGame.makeMove(row, col)) {
            this.renderGame();
            
            if (!this.currentGame.gameOver) {
                setTimeout(() => {
                    this.makeAIMove();
                }, 500);
            } else {
                this.saveGame();
            }
        }
    }

    makeAIMove() {
        if (this.currentGame.makeAIMove()) {
            this.renderGame();
            if (this.currentGame.gameOver) {
                this.saveGame();
            }
        }
    }

    showGameResult() {
        const messageElement = document.getElementById('gameMessage');
        
        if (this.currentGame.winner === 'Draw') {
            messageElement.textContent = 'Ничья!';
            messageElement.className = 'draw';
        } else if (this.currentGame.winner === this.currentGame.playerSymbol) {
            messageElement.textContent = 'Вы победили!';
            messageElement.className = 'win';
        } else {
            messageElement.textContent = 'Компьютер победил!';
            messageElement.className = 'lose';
        }
    }

    async saveGame() {
        await this.database.saveGame(this.currentGame.getGameData());
    }

    async showHistoryScreen() {
        const games = await this.database.getAllGames();
        const listElement = document.getElementById('historyList');
        listElement.innerHTML = '';
        
        if (games.length === 0) {
            listElement.innerHTML = '<p>Нет сохраненных игр</p>';
        } else {
            games.forEach(game => {
                const item = document.createElement('div');
                item.className = 'history-item';
                
                const date = new Date(game.date).toLocaleString('ru-RU');
                const result = game.winner === 'Draw' ? 'Ничья' : 
                              game.winner === game.playerSymbol ? 'Победа' : 'Поражение';
                
                item.innerHTML = `
                    <strong>Дата:</strong> ${date}<br>
                    <strong>Игрок:</strong> ${game.playerName}<br>
                    <strong>Размер:</strong> ${game.boardSize}x${game.boardSize}<br>
                    <strong>Играл за:</strong> ${game.playerSymbol}<br>
                    <strong>Результат:</strong> ${result}
                `;
                
                listElement.appendChild(item);
            });
        }
        
        this.showScreen('historyScreen');
    }

    async showReplayListScreen() {
        const games = await this.database.getAllGames();
        const listElement = document.getElementById('replayList');
        listElement.innerHTML = '';
        
        if (games.length === 0) {
            listElement.innerHTML = '<p>Нет сохраненных игр</p>';
        } else {
            games.forEach(game => {
                const item = document.createElement('div');
                item.className = 'replay-item';
                
                const date = new Date(game.date).toLocaleString('ru-RU');
                
                item.innerHTML = `
                    <strong>Дата:</strong> ${date}<br>
                    <strong>Игрок:</strong> ${game.playerName}<br>
                    <strong>Размер:</strong> ${game.boardSize}x${game.boardSize}
                `;
                
                item.addEventListener('click', () => this.startReplay(game));
                listElement.appendChild(item);
            });
        }
        
        this.showScreen('replayScreen');
    }

    startReplay(gameData) {
        this.replayData = gameData;
        this.currentReplayMove = 0;
        
        const infoElement = document.getElementById('replayInfo');
        const date = new Date(gameData.date).toLocaleString('ru-RU');
        
        infoElement.innerHTML = `
            <p><strong>Дата игры:</strong> ${date}</p>
            <p><strong>Игрок:</strong> ${gameData.playerName}</p>
            <p><strong>Размер поля:</strong> ${gameData.boardSize}x${gameData.boardSize}</p>
            <p><strong>Играл за:</strong> ${gameData.playerSymbol}</p>
        `;
        
        this.renderReplay();
        this.showScreen('replayViewScreen');
    }

    renderReplay() {
        const boardElement = document.getElementById('replayBoard');
        boardElement.innerHTML = '';
        boardElement.style.gridTemplateColumns = `repeat(${this.replayData.boardSize}, 1fr)`;
        
        // Создаем пустое поле
        const board = Array(this.replayData.boardSize).fill(null)
            .map(() => Array(this.replayData.boardSize).fill(null));
        
        // Применяем ходы до текущего
        for (let i = 0; i < this.currentReplayMove && i < this.replayData.moves.length; i++) {
            const move = this.replayData.moves[i];
            if (move.X) {
                const [row, col] = move.X.split(',').map(Number);
                board[row][col] = 'X';
            }
            if (move.O) {
                const [row, col] = move.O.split(',').map(Number);
                board[row][col] = 'O';
            }
        }
        
        // Отображаем поле
        for (let row = 0; row < this.replayData.boardSize; row++) {
            for (let col = 0; col < this.replayData.boardSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell disabled';
                
                if (board[row][col]) {
                    cell.textContent = board[row][col];
                    cell.classList.add(board[row][col].toLowerCase());
                }
                
                boardElement.appendChild(cell);
            }
        }
        
        document.getElementById('moveCounter').textContent = 
            `Ход: ${this.currentReplayMove} / ${this.replayData.moves.length}`;
        
        // Управление кнопками
        document.getElementById('prevMove').disabled = this.currentReplayMove === 0;
        document.getElementById('nextMove').disabled = 
            this.currentReplayMove >= this.replayData.moves.length;
    }

    replayPrevMove() {
        if (this.currentReplayMove > 0) {
            this.currentReplayMove--;
            this.renderReplay();
        }
    }

    replayNextMove() {
        if (this.currentReplayMove < this.replayData.moves.length) {
            this.currentReplayMove++;
            this.renderReplay();
        }
    }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
    new App();
});