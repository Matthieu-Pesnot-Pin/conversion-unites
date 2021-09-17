<?php
session_start();
include($_SESSION['DBInitInclude']);

$deleteStudent = $resultatsExercices->prepare('DELETE FROM eleve WHERE id_Connexion_Eleve = :id');

try {
    $deleteStudent->execute([
        'id' => $_POST['idConnexion']
    ]);
    echo json_encode([
        'message' => "Eleve supprimé de la liste",
        'status' => 'success',
        'success' => true
    ]);
} catch (PDOException $erreur) {
    echo json_encode([
        'message' => "Une erreur s'est produite lors de l'accès à la base de données" /*. $erreur->getMessage()*/ . " - Si l'erreur persiste, contactez votre admnistrateur",
        'status' => 'danger',
        'success' => false
    ]);

}

