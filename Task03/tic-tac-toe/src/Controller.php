<?php

namespace SavickayaM\TicTacToe;

use SavickayaM\TicTacToe\View;

class Controller
{
    private function validationData(string $playerData): array|bool
    {
        $inputArray = explode(' ', $playerData);

        if (count($inputArray) !== 2) {
            echo "Неправильный формат ввода. Пожалуйста, введите координаты в формате '1 1'.\n";
            return false;
        }

        // Проверка на то, что введены числа
        if (!is_numeric($inputArray[0]) || !is_numeric($inputArray[1])) {
            echo "Координаты должны быть числами. Пожалуйста, введите числовые координаты.\n";
            return false;
        }

        // Проверка на диапазон значений
        if ($inputArray[0] < 1 || $inputArray[0] > 3 || $inputArray[1] < 1 || $inputArray[1] > 3) {
            echo "Координаты должны быть в диапазоне от 1 до 3. Пожалуйста, введите допустимые координаты.\n";
            return false;
        }

        return $inputArray;
    }

    private function isСrosses(): bool
    {
        $isCrosses = rand(0, 1);
        return $isCrosses === 1;
    }

    private function isEmpty(string $cell): bool
    {
        return $cell === ' ';
    }

    private function isWinner(array $board, string $symbol): bool
    {
        for ($i = 0; $i < 3; $i++) {
            if ($board[$i][0] === $symbol && $board[$i][1] === $symbol && $board[$i][2] === $symbol) {
                return true;
            }
            if ($board[0][$i] === $symbol && $board[1][$i] === $symbol && $board[2][$i] === $symbol) {
                return true;
            }
        }
        if ($board[0][0] === $symbol && $board[1][1] === $symbol && $board[2][2] === $symbol) {
            return true;
        }
        if ($board[0][2] === $symbol && $board[1][1] === $symbol && $board[2][0] === $symbol) {
            return true;
        }
        return false;
    }

    public function generateComputerMove($board): array
    {
        $n = count($board);

        do {
            $x = rand(0, $n - 1);
            $y = rand(0, $n - 1);
        } while (!$this->isEmpty($board[$x][$y]));

        return [$x, $y];
    }

    public function startGame(): void
    {
        $board = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
        $computerMove = '';
        $playerMove = '';
        $moves = 0;

        try {
            if ($this->isСrosses()) {
                $computerMove = 'X';
                $playerMove = 'O';

                View::showProgress(true);

                $computerCeil = $this->generateComputerMove($board);
                $board[$computerCeil[0]][$computerCeil[1]] = $computerMove;

                echo "Ход компьютера:\n";
                View::showBoard($board);

                $moves++;
            } else {
                $computerMove = 'O';
                $playerMove = 'X';

                View::showProgress(false);

                $playerData = readline("Введите координаты ячейки (в формате x y, например 1 1): ");

                if (!$this->validationData($playerData)) {
                    View::showErrorMessage();
                    return;
                }

                $ceil = explode(' ', $playerData);
                $board[$ceil[0] - 1][$ceil[1] - 1] = $playerMove;

                View::showBoard($board);

                $computerCeil = $this->generateComputerMove($board);
                $board[$computerCeil[0]][$computerCeil[1]] = $computerMove;

                echo "Ход компьютера:\n";
                View::showBoard($board);

                $moves += 2;
            }

            while (true) {
                $playerData = readline("Введите координаты ячейки (в формате x y, например 1 1): ");

                if (!$this->validationData($playerData)) {
                    View::showErrorMessage();
                    continue;
                }

                $ceil = explode(' ', $playerData);

                if ($this->isEmpty($board[$ceil[0] - 1][$ceil[1] - 1])) {
                    $board[$ceil[0] - 1][$ceil[1] - 1] = $playerMove;

                    $computerCeil = $this->generateComputerMove($board);
                    $board[$computerCeil[0]][$computerCeil[1]] = $computerMove;

                    View::showBoard($board);
                    $moves += 2;
                } else {
                    View::showHint();
                    continue;
                }

                if ($this->isWinner($board, $playerMove)) {
                    View::showWin();
                    break;
                } elseif ($this->isWinner($board, $computerMove)) {
                    View::showLose();
                    break;
                } elseif ($moves >= 9) {
                    View::showDraw();
                    break;
                }
            }
        } catch (\Exception $e) {
            View::showErrorMessage();
        }
    }
}