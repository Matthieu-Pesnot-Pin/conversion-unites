<?php
try {
    $BDD = new PDO('mysql:host=xq1h3.myd.infomaniak.com;dbname=xq1h3_reseau;charset=UTF8', 'xq1h3_resApp', '0xzS80-fxI3', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    
} catch (Exception $e) {
    die('Erreur lors de la connexion à la base de donnée : ' . $e->getMessage());
}

$BDD->query("DELETE FROM comment WHERE created_at < '2020-07-26'");
$BDD->query("DELETE FROM content WHERE created_at < '2020-07-26'");
$BDD->query("DELETE FROM live WHERE created_at < 1595791541");
$BDD->query("DELETE FROM notification WHERE created_at < '2020-07-26'");





