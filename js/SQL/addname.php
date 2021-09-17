<?php
session_start();

include ($_SESSION['DBInitInclude']);
/*
try {
        $resultatsExercices = new PDO('mysql:host=localhost;dbname=resultats_exercices;charset=utf8', 'root', '', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
//        $resultatsExercices = new PDO('mysql:host=mysql213.sql002:3306;dbname=otravezfib173;charset=utf8', 'otravezfib173', 'Armand666OVH', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
        
    } catch (Exception $e) {
        die('Erreur lors de la connexion à la base de donnée : ' . $e->getMessage());
    }
    
*/

   $insertionBDD = $resultatsExercices->prepare('INSERT INTO eleve VALUES("", :id, :nom, :prenom, :classe)');

    $insertionBDD->execute([
        'id' => strtoupper($_GET['id']),
        'nom' => $_GET['nom'],
        'prenom' => $_GET['prenom'],
        'classe' => $_GET['classe']
    ]);

?>



