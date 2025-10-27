<?php

declare(strict_types=1);

namespace SavickayaM\TicTacToe\Model;

use SQLite3;

class Model
{
    private $db;

    public function __construct($db_path)
    {
        $this->db = new SQLite3($db_path);
    }

    public function createId()
    {
        $query = "SELECT id FROM result_games ORDER BY id DESC LIMIT 1";

        $lastGameId = $this->db->query($query);

        if ($row = $lastGameId->fetchArray()) {
            $lastId = $row[0];
            return $lastId + 1;
        } else {
            return 1;
        }
    }

    public function createTables()
    {

        $query = "CREATE TABLE IF NOT EXISTS result_games (
            id INTEGER PRIMARY KEY,
            player_name TEXT NOT NULL,
            player_figure TEXT NOT NULL,
            field_size TEXT NOT NULL,
            winning_figure TEXT NOT NULL,
            created_at  DATETIME NOT NULL
        )";

        $this->db->exec($query);

        $query = "CREATE TABLE IF NOT EXISTS tries (
            id INTEGER PRIMARY KEY,
            game_id INTEGER NOT NULL,
            number_try INTEGER NOT NULL,
            x_coordinate TEXT NOT NULL,
            o_coordinate TEXT NOT NULL
        )";

        $this->db->exec($query);

        echo "Таблицы успешно созданы";
    }

    public function closeConnection()
    {
        $this->db->close();
    }

    public function storeResult($playerName, $playerFigure, $fieldSize, $winningFigure)
    {
        $now = date('Y-m-d H:i:s');

        $query = "INSERT INTO result_games (player_name, player_figure, field_size, winning_figure, created_at) VALUES ('$playerName', '$playerFigure', '$fieldSize', '$winningFigure', '$now')";

        $this->db->exec($query);
    }

    public function storeTry($gameId, $numberTry, $xCoordinate, $oCoordinate)
    {
        $query = "INSERT INTO tries (game_id, number_try, x_coordinate, o_coordinate) VALUES ('$gameId', '$numberTry', '$xCoordinate', '$oCoordinate')";

        $this->db->exec($query);
    }

    public function getGames()
    {
        $query = "SELECT * FROM result_games";

        $result = $this->db->query($query);

        $games = [];

        while ($game = $result->fetchArray(SQLITE3_ASSOC)) {
            $games[] = $game;
        }

        return $games;
    }

    public function getGame($gameId)
    {
        $query = "SELECT * FROM tries WHERE game_id = '$gameId'";

        $result = $this->db->query($query);

        $tries = [];

        while ($try = $result->fetchArray(SQLITE3_ASSOC)) {
            $tries[] = $try;
        }

        return $tries;
    }
}