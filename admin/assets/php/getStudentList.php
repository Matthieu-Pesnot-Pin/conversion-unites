<?php
session_start();

include ($_SESSION['DBInitInclude']);

/*try {
        $resultatsExercices = new PDO('mysql:host=localhost;dbname=resultats_exercices;charset=utf8', 'root', '', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
//        $resultatsExercices = new PDO('mysql:host=mysql213.sql002:3306;dbname=otravezfib173;charset=utf8', 'otravezfib173', 'Armand666OVH', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
        
    } catch (Exception $e) {

        die('Erreur lors de la connexion à la base de donnée : ' . $e->getMessage());
    }
*/  
// recherche de l'élève

$rechercheTestsEleve = $resultatsExercices->query('SELECT * FROM eleve e');

if ($rechercheTestsEleve->rowCount() != 0) { // S'il existe des tests associés à l'élève, on renvoie les infos
    while ($infos = $rechercheTestsEleve->fetch()) {
        echo $infos['NOM_ELEVE'] . ',' . $infos['PRENOM_ELEVE'] . ',' . $infos['CLASSE_ELEVE'] . ',' . $infos['ID_CONNEXION_ELEVE'] . ';';
    }
} else { // sinon Elève Non IDentifié
    echo 'NID';
}
$rechercheTestsEleve->closeCursor();
?>



