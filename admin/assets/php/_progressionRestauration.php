<?php

session_start();
if ($_SESSION['progression_restauration'] == $_SESSION['last_progression']) {
    $_SESSION['count']++;
} else {
    $_SESSION['last_progression'] = $_SESSION['progression_restauration'];
    $_SESSION['count'] = 0;
}

if  ($_SESSION['count'] == 10) echo json_encode(['pourcentage' => -1]);
else echo json_encode(['pourcentage' => $_SESSION['progression_restauration']]);

session_write_close();