<?php

session_start();
include ($_SESSION['DBInitInclude']);

// recherche de l'élève
$rechercheTestsEleve = $resultatsExercices->query('SELECT * FROM eleve e LEFT JOIN test t ON e.ID_ELEVE = t.ID_ELEVE WHERE ID_CONNEXION_ELEVE =\'' .  strtoupper($_GET['id']) . '\'');

if ($rechercheTestsEleve->rowCount() != 0) { // S'il existe des tests associés à l'élève, on renvoie les infos
    $infos = $rechercheTestsEleve->fetch();
    echo $infos['NOM_ELEVE'] . ',' . $infos['PRENOM_ELEVE'] . ',' . $infos['CLASSE_ELEVE'] . ';';
    if ($infos['TYPE_TEST']!= null)
    echo $infos['TYPE_TEST'] . ',' . $infos['DIFFICULTE_TEST'] . ',' . $infos['NOMBRE_QUESTIONS_TEST'] . ',' . $infos['NOMBRE_REPONSES_CORRECTES'] . ',' . $infos['DATE_TEST'] . ';';

    while ($infos = $rechercheTestsEleve->fetch()) {
        if ($infos['TYPE_TEST']!= null)
        echo $infos['TYPE_TEST'] . ',' . $infos['DIFFICULTE_TEST'] . ',' . $infos['NOMBRE_QUESTIONS_TEST'] . ',' . $infos['NOMBRE_REPONSES_CORRECTES'] . ',' . $infos['DATE_TEST'] . ';';
    }
} else { // sinon Elève Non IDentifié
    echo 'NID';
}
$rechercheTestsEleve->closeCursor();
?>



