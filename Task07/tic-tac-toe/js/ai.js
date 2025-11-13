class AI {
    constructor(boardSize) {
        this.boardSize = boardSize;
    }

    getMove(board, aiSymbol) {
        const playerSymbol = aiSymbol === 'X' ? 'O' : 'X';
        
        // Попытка выиграть
        let move = this.findWinningMove(board, aiSymbol);
        if (move) return move;
        
        // Блокировка противника
        move = this.findWinningMove(board, playerSymbol);
        if (move) return move;
        
        // Центр (для нечетных размеров)
        if (this.boardSize % 2 === 1) {
            const center = Math.floor(this.boardSize / 2);
            if (!board[center][center]) {
                return { row: center, col: center };
            }
        }
        
        // Углы
        const corners = [
            { row: 0, col: 0 },
            { row: 0, col: this.boardSize - 1 },
            { row: this.boardSize - 1, col: 0 },
            { row: this.boardSize - 1, col: this.boardSize - 1 }
        ];
        
        for (const corner of corners) {
            if (!board[corner.row][corner.col]) {
                return corner;
            }
        }
        
        // Случайный ход
        const emptyCells = [];
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (!board[row][col]) {
                    emptyCells.push({ row, col });
                }
            }
        }
        
        if (emptyCells.length > 0) {
            return emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }
        
        return null;
    }

    findWinningMove(board, symbol) {
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (!board[row][col]) {
                    board[row][col] = symbol;
                    if (this.checkWin(board, symbol, row, col)) {
                        board[row][col] = null;
                        return { row, col };
                    }
                    board[row][col] = null;
                }
            }
        }
        return null;
    }

    checkWin(board, symbol, lastRow, lastCol) {
        const winLength = this.boardSize === 3 ? 3 : Math.min(5, this.boardSize);
        
        // Проверка всех направлений
        const directions = [
            { dr: 0, dc: 1 },   // горизонталь
            { dr: 1, dc: 0 },   // вертикаль
            { dr: 1, dc: 1 },   // диагональ \
            { dr: 1, dc: -1 }   // диагональ /
        ];
        
        for (const { dr, dc } of directions) {
            let count = 1;
            
            // Проверка в положительном направлении
            for (let i = 1; i < winLength; i++) {
                const r = lastRow + dr * i;
                const c = lastCol + dc * i;
                if (r >= 0 && r < this.boardSize && 
                    c >= 0 && c < this.boardSize && 
                    board[r][c] === symbol) {
                    count++;
                } else {
                    break;
                }
            }
            
            // Проверка в отрицательном направлении
            for (let i = 1; i < winLength; i++) {
                const r = lastRow - dr * i;
                const c = lastCol - dc * i;
                if (r >= 0 && r < this.boardSize && 
                    c >= 0 && c < this.boardSize && 
                    board[r][c] === symbol) {
                    count++;
                } else {
                    break;
                }
            }
            
            if (count >= winLength) {
                return true;
            }
        }
        
        return false;
    }
}