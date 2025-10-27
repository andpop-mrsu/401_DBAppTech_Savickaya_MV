<?php

declare(strict_types=1);

namespace SavickayaM\TicTacToe\Controller;

use SavickayaM\TicTacToe\View\View;
use SavickayaM\TicTacToe\Model\Model;

use function cli\line;

class Controller
{
    public function menu()
    {
        $isExist = file_exists('tic-tac-toe.db');

        View::showGame($isExist);

        $choiceUser = readline("Выберите действие: ");

        switch ($choiceUser) {
            case 1:
                $this->startGame();
                break;
            case 2:
                if ($isExist) {
                    $this->showHistory();
                    break;
                } else {
                    echo "Таблицы не существует";
                    break;
                }
            case 3:
                if ($isExist) {
                    $this->showGameRepeat();
                    break;
                } else {
                    echo "Таблицы не существует";
                    break;
                }
            default:
                echo "Неверный выбор";
                break;
        }
    }

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

        return $isCrosses === 1 ? true : false;
    }

    private function isEmpty(string $cell): bool
    {
        return $cell === ' ' ? true : false;
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

        $ceil = [$x, $y];

        return $ceil;
    }

    public function startGame(): void
    {
        $board = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
        $ceil = [];

        $computerMove = '';
        $playerMove = '';
        $numberTry = 0;

        $moves = 0;

        $playerName = readline("Введите ваше имя: ");

        if (! file_exists('tic-tac-toe.db')) {
            $model = new Model('tic-tac-toe.db');
            $model->createTables();
        } else {
            $model = new Model('tic-tac-toe.db');
        }
        $gameId = $model->createId();

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
                    die();
                }

                $ceil = explode(' ', $playerData);

                $board[$ceil[0] - 1][$ceil[1] - 1] = $playerMove;
                $moves++;
                $numberTry++;

                View::showBoard($board);

                $computerCeil = $this->generateComputerMove($board);
                $board[$computerCeil[0]][$computerCeil[1]] = $computerMove;

                echo "Ход компьютера:\n";
                View::showBoard($board);
                $moves++;
                $computerCeilView = $computerCeil[0] + 1 . ' ' . $computerCeil[1] + 1;

                $model->storeTry($gameId, $numberTry, $playerData, $computerCeilView);
            }

            $computerCeilView = $computerCeil[0] + 1 . ' ' . $computerCeil[1] + 1;

            while (true) {
                $playerData = readline("Введите координаты ячейки (в формате x y, например 1 1): ");

                if (!$this->validationData($playerData)) {
                    View::showErrorMessage();
                    die();
                }

                $ceil = explode(' ', $playerData);

                if ($this->isEmpty($board[$ceil[0] - 1][$ceil[1] - 1])) {
                    $board[$ceil[0] - 1][$ceil[1] - 1] = $playerMove;
                    $numberTry++;
                    $moves++;

                    $computerCeil = $this->generateComputerMove($board);
                    $board[$computerCeil[0]][$computerCeil[1]] = $computerMove;
                    $moves++;

                    View::showBoard($board);
                    $computerCeilView = $computerCeil[0] + 1 . ' ' . $computerCeil[1] + 1;

                    $model->storeTry($gameId, $numberTry, $playerData, $computerCeilView);
                } else {
                    View::showHint($board);
                    continue;
                }

                if ($this->isWinner($board, $playerMove)) {
                    View::showWin();
                    $model->storeResult($playerName, $playerMove, '3x3', $playerMove);
                    break;
                } elseif ($this->isWinner($board, $computerMove)) {
                    View::showLose();
                    $model->storeResult($playerName, $playerMove, '3x3', $computerMove);
                    break;
                } elseif ($moves === count($board) * count($board)) {
                    $model->storeResult($playerName, $playerMove, '3x3', '-');
                    View::showDraw();
                    break;
                }
            }
        } catch (\Exception $e) {
            View::showErrorMessage();
            die();
        }
    }

    public function showHistory(): void
    {
        $model = new Model('tic-tac-toe.db');

        $games = $model->getGames();

        View::showHistory($games);
    }

    public function showGameRepeat()
    {
        $gameId = readline("Введите номер сохраненной партии: ");

        $model = new Model('tic-tac-toe.db');

        $game = $model->getGame($gameId);

        View::showGameRepeat($game);
    }
}