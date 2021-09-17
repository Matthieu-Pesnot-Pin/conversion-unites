<?php
session_start();

include ($_SESSION['DBInitInclude']);

include '_getStudentInfosClasses.php'; // definition des objets

include '_getStudentInfos.php'; // Recuperation des infos eleve (son id etant dans $_GET['id'])

echo json_encode($ensembleDesResultatsEleve);

?>