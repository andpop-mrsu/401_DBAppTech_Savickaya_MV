#!/usr/bin/env php

<?php

require_once __DIR__ . '/../vendor/autoload.php';

use SavickayaM\TicTacToe\Controller\Controller;

$controller = new Controller();
$controller->menu();