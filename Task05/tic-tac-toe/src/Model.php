<?php

namespace SavickayaM\TicTacToe;

use RedBeanPHP\R;

class Model
{
    public function __construct($db_path)
    {
        R::setup("sqlite:$db_path");
    }

    public function createId()
    {
        $lastGameId = R::getCell("SELECT id FROM results ORDER BY id DESC LIMIT 1");

        return $lastGameId ? $lastGameId + 1 : 1;
    }

    public function createTables()
    {
        R::exec("
            CREATE TABLE IF NOT EXISTS results (
                id INTEGER PRIMARY KEY,
                player_name TEXT NOT NULL,
                player_figure TEXT NOT NULL,
                field_size TEXT NOT NULL,
                winning_figure TEXT NOT NULL,
                created_at  DATETIME NOT NULL
            )
        ");

        R::exec("
            CREATE TABLE IF NOT EXISTS tries (
                id INTEGER PRIMARY KEY,
                game_id INTEGER NOT NULL,
                number_try INTEGER NOT NULL,
                x_coordinate TEXT NOT NULL,
                o_coordinate TEXT NOT NULL
            )
        ");

        echo "Таблицы успешно созданы";
    }

    public function closeConnection()
    {
        R::close();
    }

    public function storeResult($playerName, $playerFigure, $fieldSize, $winningFigure)
    {
        $now = date('Y-m-d H:i:s');

        $game = R::dispense('results');
        $game->player_name = $playerName;
        $game->player_figure = $playerFigure;
        $game->field_size = $fieldSize;
        $game->winning_figure = $winningFigure;
        $game->created_at = $now;

        R::store($game);
    }

    public function storeTry($gameId, $numberTry, $xCoordinate, $oCoordinate)
    {
        $try = R::dispense('tries');
        $try->game_id = $gameId;
        $try->number_try = $numberTry;
        $try->x_coordinate = $xCoordinate;
        $try->o_coordinate = $oCoordinate;

        R::store($try);
    }

    public function getGames()
    {
        return R::findAll('results');
    }

    public function getGame($gameId)
    {
        return R::findAll('tries', 'game_id = ?', [$gameId]);
    }
}
