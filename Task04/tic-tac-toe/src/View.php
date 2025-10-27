<?php

declare(strict_types=1);

namespace SavickayaM\TicTacToe\View;

use function cli\line;

class View
{
    public static function showProgress($isCheck): void
    {
        if ($isCheck) {
            line("Компьютер играет за крестики");
        } else {
            line("Вы играете за крестики");
        }
    }

    public static function showGame(bool $isExist): void
    {
        line("1) Новая игра");
        if ($isExist) {
            line("2) Вывод списка всех сохраненных в базе партий");
            line("3) Повтор любой сохраненной партии");
        }
    }

    public static function showLose(): void
    {
        line("Компьютер победил. Попробуйте еще раз!");
    }

    public static function showWin(): void
    {
        line("Вы победили! Поздравляем!");
    }

    public static function showDraw(): void
    {
        line("Ничья. Попробуйте еще раз!");
    }

    public static function showHint(): void
    {
        line("Эта клетка занята, попробуйте еще раз!");
    }

    public static function showBoard(array $board): void
    {
        $n = count($board);

        for ($i = 0; $i < $n; $i++) {
            for ($j = 0; $j < $n; $j++) {
                if ($j < 2) {
                    echo($board[$i][$j] . " | ");
                } else {
                    echo($board[$i][$j]) ;
                }
            }
            if ($i < 2) {
                line(PHP_EOL . "---------");
            }
        }
        line();
    }

    public static function showErrorMessage(): void
    {
        line("Произошла ошибка, возможно, Вы ввели неверное значение. Попробуйте еще раз!");
    }

    public static function showHistory($games)
    {
        print("\033[2J\033[;H");

        line("| Номер партии | Размер поля |      Дата игры      |           Имя игрока | Фигура игрока | Фигура выигравшего |");
        foreach ($games as $game) {
            printf(
                "| %12s | %11s |%20s | %20s | %13s | %18s |\n",
                $game['id'],
                $game['field_size'],
                $game['created_at'],
                $game['player_name'],
                $game['player_figure'],
                $game['winning_figure']
            );
        }
    }

    public static function showGameRepeat($tries)
    {
        print("\033[2J\033[;H");

        line("| Номер хода  | Координата Х | Координата О |");
        foreach ($tries as $try) {
            printf(
                "| %11s | %12s | %12s |\n",
                $try['number_try'],
                $try['x_coordinate'],
                $try['o_coordinate'],
            );
        }
    }
}