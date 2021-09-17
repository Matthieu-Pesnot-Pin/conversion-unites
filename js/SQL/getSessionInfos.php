<?php
session_start();

echo json_encode([
    'idConnexion' => $_SESSION['idConnexion'],
    'nomEleve' => $_SESSION['nomEleve'],
    'prenomEleve' => $_SESSION['prenomEleve'],
    'classeEleve' => $_SESSION['classeEleve']
]);