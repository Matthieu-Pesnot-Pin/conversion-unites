<?php
session_start();
include($_SESSION['DBInitInclude']);

$eleveCheck = $resultatsExercices->prepare('SELECT * FROM eleve WHERE id_Connexion_Eleve = :id');

$_POST['nouvelId'] = strtoupper($_POST['nouvelId']);

$eleveCheck->execute([
    'id' => $_POST['nouvelId']
]);

$eleveTrouve = $eleveCheck->fetch();
$success = false;

$message = "";

// Si pas d'identifiant
if ($_POST['nouvelId'] == "") { 
    $message = "Veuillez sélectionner un élève ou préciser un identifiant de connexion";
    $status = "warning";

// Si certains autres champs sont vides
} else if ($_POST['nouveauNom'] == '' || $_POST['nouveauPrenom'] == '' || $_POST['nouvelleClasse'] =='') {
    $message = "Impossible d'effectuer l'opération : certains champs sont vides";
    $status = "warning";

// Si le mode ajout est sélectionné    
} else if ($_POST['typeModif'] == 'add') {

    if (isset($eleveTrouve['ID_CONNEXION_ELEVE'])) {
        $message = "Erreur : l'identifiant est déjà utilisé par un autre éleve - L'élève n'a pas pu être ajouté";
        $status = "danger";
    } else {
        $eleveAjout = $resultatsExercices->prepare('INSERT INTO eleve VALUES("", :id, :nom, :prenom, :classe)');
        $eleveAjout->execute([
            'id'     => $_POST['nouvelId'],
            'nom'    => $_POST['nouveauNom'],
            'prenom' => $_POST['nouveauPrenom'],
            'classe' => $_POST['nouvelleClasse']
        ]);
        $message = "L'élève a été ajouté avec succès : " . $_POST['nouveauNom'] . " " . $_POST['nouveauPrenom'] . " " . $_POST['nouvelleClasse'] . ", identifiant : " . $_POST['nouvelId'];
        $status = "success";
    }

// Si le mode modification est sélectionné
// Si aucun élève n'a été choisi
} else if ($_POST['startId'] == '') {
    $message = "Veuillez sélectionner un élève à modifier avant de saisir les champs";
    $status = "warning";

// Si l'identifiant n'a pas été modifié    
} else if ($_POST['startId'] == $_POST['nouvelId']) {
    if ($eleveTrouve['NOM_ELEVE'] == $_POST['nouveauNom'] && $eleveTrouve['PRENOM_ELEVE'] == $_POST['nouveauPrenom'] && $eleveTrouve['CLASSE_ELEVE'] == $_POST['nouvelleClasse']) {
        $message = "Impossible d'appliquer les changements : Aucun changement n'a été effectué";
        $status = "warning";
    } else {
        $eleveCheck = $resultatsExercices->prepare('UPDATE eleve SET NOM_ELEVE=:nom, PRENOM_ELEVE=:prenom, CLASSE_ELEVE=:classe WHERE ID_CONNEXION_ELEVE=:id');
        $eleveCheck->execute([
            'id' => $_POST['startId'],
            'nom' => $_POST['nouveauNom'],
            'prenom' => $_POST['nouveauPrenom'],
            'classe' => $_POST['nouvelleClasse']
        ]);
        $message = "L'élève a été modifié avec succès !";
        $status = "success";
        
    }

// Si l'identifiant  a été modifié
} else {
    if (isset($eleveTrouve['ID_CONNEXION_ELEVE'])) {
        $message = "Erreur : l'identifiant est déjà utilisé par un autre éleve - L'élève n'a pas été modifié";
        $status = "danger";
    } else {
        $eleveCheck = $resultatsExercices->prepare('UPDATE eleve SET ID_CONNEXION_ELEVE=:nouvelId, NOM_ELEVE=:nom, PRENOM_ELEVE=:prenom, CLASSE_ELEVE=:classe WHERE ID_CONNEXION_ELEVE=:startId');
        $eleveCheck->execute([
            'startId' => $_POST['startId'],
            'nouvelId' => $_POST['nouvelId'],
            'nom' => $_POST['nouveauNom'],
            'prenom' => $_POST['nouveauPrenom'],
            'classe' => $_POST['nouvelleClasse']
        ]);
        $message = "L'élève a été modifié avec succès !";
        $status = "success";
    }
}


// Envoi du rapport
echo json_encode([
    'message' => $message,
    'status' => $status,
    'success' => ($status == "success")
]);