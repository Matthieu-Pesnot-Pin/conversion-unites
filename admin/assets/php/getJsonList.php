<?php

session_start();


include ($_SESSION['DBInitInclude']);

//$_SESSION['nombreAcces'] = 0;


// recherche de l'élève
$rechercheEleve = $resultatsExercices->prepare('SELECT * FROM eleve e ORDER BY NOM_ELEVE' );

$rechercheEleve->execute();
//$_SESSION['nombreAcces']++;

$outPutArray = [];
include '_getStudentInfosClasses.php';

if ($rechercheEleve->rowCount() != 0) { // S'il existe des tests associés à l'élève, on renvoie les infos
    while ($eleve = $rechercheEleve->fetch()) {
        $_GET['id'] = $eleve['ID_CONNEXION_ELEVE'];
        include '_getStudentInfos.php';
        $ensembleDesResultatsEleve->noteCiblee = -1;
        $outPutArray[] = $ensembleDesResultatsEleve;
    }
    //echo $_SESSION['nombreAcces']++;
    
    echo json_encode($outPutArray);

} else { // sinon Elève Non IDentifié
    echo json_encode([
        'studentNotFound' => true
    ]);
}
$rechercheEleve->closeCursor();

?>
