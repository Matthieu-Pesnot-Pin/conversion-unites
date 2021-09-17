<?php
include ('../../setroot.php');
include $_SESSION['DBInitInclude'];

$dateDernierCheck = ($resultatsExercices->query('SELECT date_ipcheck FROM ipcheck')->fetch())['date_ipcheck'];

echo json_encode($dateDernierCheck);