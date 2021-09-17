<?php
session_start();

include ($_SESSION['DBInitInclude']);
include '../../admin/assets/php/_getStudentInfosClasses.php'; // definition des objets
// include '../../admin/assets/php/DBInit.php';

$_GET['id'] = $_SESSION['idConnexion'];

//Recherche de l'élève :
$rechercheEleve = $resultatsExercices->query('SELECT * FROM eleve e WHERE ID_CONNEXION_ELEVE =\'' .  strtoupper($_GET['id']) . '\'');
// $_SESSION['nombreAcces']++;
if ($rechercheEleve->rowCount() == 0) {
    die(json_encode(array(
        'errorMessage' => 'Eleve introuvable'
    )));
}

$eleve = $rechercheEleve->fetch();

include '../../admin/assets/php/_getStudentInfos.php'; // Recuperation des infos eleve (son id etant dans $_GET['id'])

echo json_encode($ensembleDesResultatsEleve);

?>