class Game {
    constructor(boardSize, playerName, playerSymbol) {
        this.boardSize = boardSize;
        this.playerName = playerName;
        this.playerSymbol = playerSymbol;
        this.aiSymbol = playerSymbol === 'X' ? 'O' : 'X';
        this.board = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));
        this.currentTurn = 'X';
        this.moves = [];
        this.gameOver = false;
        this.winner = null;
        this.winningCells = [];
        this.ai = new AI(boardSize);
    }

    makeMove(row, col) {
        if (this.gameOver || this.board[row][col]) {
            return false;
        }

        this.board[row][col] = this.currentTurn;
        this.moves.push({
            moveNumber: this.moves.length + 1,
            [this.currentTurn]: `${row},${col}`
        });

        if (this.checkWin(row, col)) {
            this.gameOver = true;
            this.winner = this.currentTurn;
            return true;
        }

        if (this.checkDraw()) {
            this.gameOver = true;
            this.winner = 'Draw';
            return true;
        }

        this.currentTurn = this.currentTurn === 'X' ? 'O' : 'X';
        return true;
    }

    makeAIMove() {
        if (this.gameOver || this.currentTurn !== this.aiSymbol) {
            return false;
        }

        const move = this.ai.getMove(this.board, this.aiSymbol);
        if (move) {
            return this.makeMove(move.row, move.col);
        }
        return false;
    }

    checkWin(lastRow, lastCol) {
        const symbol = this.board[lastRow][lastCol];
        const winLength = this.boardSize === 3 ? 3 : Math.min(5, this.boardSize);
        
        const directions = [
            { dr: 0, dc: 1 },
            { dr: 1, dc: 0 },
            { dr: 1, dc: 1 },
            { dr: 1, dc: -1 }
        ];
        
        for (const { dr, dc } of directions) {
            const cells = [{ row: lastRow, col: lastCol }];
            
            for (let i = 1; i < winLength; i++) {
                const r = lastRow + dr * i;
                const c = lastCol + dc * i;
                if (r >= 0 && r < this.boardSize && 
                    c >= 0 && c < this.boardSize && 
                    this.board[r][c] === symbol) {
                    cells.push({ row: r, col: c });
                } else {
                    break;
                }
            }
            
            for (let i = 1; i < winLength; i++) {
                const r = lastRow - dr * i;
                const c = lastCol - dc * i;
                if (r >= 0 && r < this.boardSize && 
                    c >= 0 && c < this.boardSize && 
                    this.board[r][c] === symbol) {
                    cells.push({ row: r, col: c });
                } else {
                    break;
                }
            }
            
            if (cells.length >= winLength) {
                this.winningCells = cells;
                return true;
            }
        }
        
        return false;
    }

    checkDraw() {
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (!this.board[row][col]) {
                    return false;
                }
            }
        }
        return true;
    }

    getGameData() {
        return {
            boardSize: this.boardSize,
            playerName: this.playerName,
            playerSymbol: this.playerSymbol,
            winner: this.winner,
            moves: this.moves
        };
    }
}