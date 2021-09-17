<?php

// $listeComplete = $resultatsExercices->query('SELECT * FROM eleve LEFT JOIN test ON eleve.ID_ELEVE = test.ID_ELEVE ORDER BY eleve.ID_ELEVE');
$listeComplete = $resultatsExercices->query(
    'SELECT e.ID_ELEVE, 
            e.ID_CONNEXION_ELEVE, 
            e.NOM_ELEVE, 
            e.PRENOM_ELEVE, 
            e.CLASSE_ELEVE, 
            t.ID_TEST, 
            t.TYPE_TEST, 
            t.DIFFICULTE_TEST, t
            .NOMBRE_QUESTIONS_TEST, 
            t.NOMBRE_REPONSES_CORRECTES, 
            t.DATE_TEST, 
            t.IP_ELEVE 
      FROM eleve e 
      LEFT JOIN test t 
      ON t.ID_ELEVE = e.ID_ELEVE 
      ORDER BY e.ID_ELEVE'
);

$nomFichierSauvegarde = './exports/export-auto_' . date('Y-m-d-H-i-s') . '_' . $_FILES['file']['name'] . '.csv';

file_put_contents($nomFichierSauvegarde, "IdEleve;IdConnexion;Nom;Prenom;Classe;IdTest;TypeTest;DiffTest;NombreQuestions;NombreCorrectes;Date;IP\n");

while ($test = $listeComplete->fetch()) {

    file_put_contents($nomFichierSauvegarde, 
          $test['ID_ELEVE'] . ';' 
        . $test['ID_CONNEXION_ELEVE'] . ';'
        . $test['NOM_ELEVE'] . ';' 
        . $test['PRENOM_ELEVE'] . ';' 
        . $test['CLASSE_ELEVE'] . ';' 
        . $test['ID_TEST'] . ';'
        . $test['TYPE_TEST'] . ';'
        . $test['DIFFICULTE_TEST'] . ';'
        . $test['NOMBRE_QUESTIONS_TEST'] . ';'
        . $test['NOMBRE_REPONSES_CORRECTES'] . ';'
        . $test['DATE_TEST'] . ';'
        . $test['IP_ELEVE'] . "\n"
        , FILE_APPEND);
}
$listeComplete->closeCursor();

?>

