<?php
include "../../setroot.php";

include ($_SESSION['DBInitInclude']);


/*try {
    $resultatsExercices = new PDO('mysql:host=localhost;dbname=resultats_exercices;charset=utf8', 'root', '', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
//        $resultatsExercices = new PDO('mysql:host=mysql213.sql002:3306;dbname=otravezfib173;charset=utf8', 'otravezfib173', 'Armand666OVH', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    
} catch (Exception $e) {
    die('Erreur lors de la connexion à la base de donnée : ' . $e->getMessage());
}
*/
$idCheck = $resultatsExercices->prepare('SELECT * FROM eleve WHERE id_connexion_eleve = :id');

$idCheck->execute([
    'id' => htmlspecialchars($_GET['id'])
]);
if ($eleve = $idCheck->fetch()){
    $_SESSION['idConnexion'] = $eleve['ID_CONNEXION_ELEVE'];
    $_SESSION['nomEleve'] = $eleve['NOM_ELEVE'];
    $_SESSION['prenomEleve'] = $eleve['PRENOM_ELEVE'];
    $_SESSION['classeEleve'] = $eleve['CLASSE_ELEVE'];
    echo json_encode($eleve);
} 
else {
    echo json_encode(['message' => 'Eleve introuvable']);
}
