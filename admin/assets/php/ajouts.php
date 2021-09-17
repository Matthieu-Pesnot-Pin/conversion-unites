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


$rechercheEleve = $resultatsExercices->query('SELECT ID_ELEVE FROM eleve WHERE ID_CONNEXION_ELEVE =\'' . strtoupper($_POST['idConnexion']) . '\'');

$eleve = $rechercheEleve->fetch();


if (!empty($eleve)) {
    $resultatsExercices->beginTransaction();
    $insertionBDD = $resultatsExercices->prepare('INSERT INTO test VALUES(NULL, :typeTest, :difficulteTest, :nbQ, :nbC, :testDate, :idEleve, :ipEleve)');
    $insertionBDD->execute([
                    'nbQ'     => $_POST['nbQuestions'],
                    'nbC'     => $_POST['nbCorrect'],
                    'idEleve' => $eleve['ID_ELEVE'],
                    'typeTest' => $_POST['typeTest'],
                    'difficulteTest' => $_POST['difficulteTest'],
                    'ipEleve' => $_SERVER['REMOTE_ADDR'],
                    'testDate' => '2020/07/' . $_POST['testDate']
                ]);
    $resultatsExercices->commit();
} else {
    echo 'NID';
}
?>



