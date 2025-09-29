<?php

namespace SavickayaM\TicTacToe;

class View
{
    public static function showProgress(bool $isCheck): void
    {
        if ($isCheck) {
            self::line("Компьютер играет за крестики");
        } else {
            self::line("Вы играете за крестики");
        }
    }

    public static function showLose(): void
    {
        self::line("Компьютер победил. Попробуйте еще раз!");
    }

    public static function showWin(): void
    {
        self::line("Вы победили! Поздравляем!");
    }

    public static function showDraw(): void
    {
        self::line("Ничья. Попробуйте еще раз!");
    }

    public static function showHint(): void
    {
        self::line("Эта клетка занята, попробуйте еще раз!");
    }

    public static function showBoard(array $board): void
    {
        $n = count($board);

        for ($i = 0; $i < $n; $i++) {
            for ($j = 0; $j < $n; $j++) {
                if ($j < 2) {
                    echo $board[$i][$j] . " | ";
                } else {
                    echo $board[$i][$j];
                }
            }
            if ($i < 2) {
                self::line(PHP_EOL . "---------");
            }
        }
        self::line();
    }

    public static function showErrorMessage(): void
    {
        self::line("Произошла ошибка, возможно, Вы ввели неверное значение. Попробуйте еще раз!");
    }

    private static function line(string $message = ""): void
    {
        echo $message . PHP_EOL;
    }
}