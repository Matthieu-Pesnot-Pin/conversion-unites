<?php
session_start();

include ($_SESSION['DBInitInclude']);

$rechercheEleve = $resultatsExercices->query('SELECT ID_ELEVE FROM eleve WHERE ID_CONNEXION_ELEVE =\'' . strtoupper($_SESSION['idConnexion']) . '\'');

$eleve = $rechercheEleve->fetch();

if (!empty($eleve)) {
    $resultatsExercices->beginTransaction();
    $insertionBDD = $resultatsExercices->prepare('INSERT INTO test VALUES(NULL, :typeTest, :difficulteTest, :nbQ, :nbC, NOW(), :idEleve, :ipEleve)');
    $insertionBDD->execute([
                    'nbQ'     => $_POST['nbQuestions'],
                    'nbC'     => $_POST['nbCorrect'],
                    'idEleve' => $eleve['ID_ELEVE'],
                    'typeTest' => $_POST['typeTest'],
                    'difficulteTest' => $_POST['difficulteTest'],
                    'ipEleve' => $_SERVER['REMOTE_ADDR']
                ]);
    $resultatsExercices->commit();
    echo (json_encode([
        'message' => 'ecriture réussie'
    ]));
} else {
    echo (json_encode([
        'message' => 'élève introuvable'
    ]));
}
?>



