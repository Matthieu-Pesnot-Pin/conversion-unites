<?php


$boutonRetour = "<a class='btn btn-primary' href='index.html#/restore'>Retour à la page précédente</a>";

$restoreFile = fopen($DBFileName, 'r+');
  $premiereLigne = fgets($restoreFile);
  $premiereLigne = explode(';', trim($premiereLigne));

  $CSV_ID_ELEVE = 0;
  $CSV_ID_CONNEXION = 1;
  $CSV_NOM = 2;
  $CSV_PRENOM = 3;
  $CSV_CLASSE = 4;
  $CSV_ID_TEST = 5;
  $CSV_TYPE_TEST = 6;
  $CSV_DIFF_TEST = 7;
  $CSV_NOMBRE_QUESTIONS = 8;
  $CSV_NOMBRE_CORRECTES = 9;
  $CSV_DATE = 10;
  $CSV_IP = 11;


  if (count($premiereLigne) != 12) {
      echo $messageConsigne . '<br>';
      die($boutonRetour);
  } elseif (
      $premiereLigne[$CSV_ID_ELEVE] != 'IdEleve'
      || $premiereLigne[$CSV_ID_CONNEXION] != 'IdConnexion'
      || $premiereLigne[$CSV_NOM] != 'Nom'
      || $premiereLigne[$CSV_PRENOM] != 'Prenom'
      || $premiereLigne[$CSV_CLASSE] != 'Classe'
      || $premiereLigne[$CSV_ID_TEST] != 'IdTest'
      || $premiereLigne[$CSV_TYPE_TEST] != 'TypeTest'
      || $premiereLigne[$CSV_DIFF_TEST] != 'DiffTest'
      || $premiereLigne[$CSV_NOMBRE_QUESTIONS] != 'NombreQuestions'
      || $premiereLigne[$CSV_NOMBRE_CORRECTES] != 'NombreCorrectes'
      || $premiereLigne[$CSV_DATE] != 'Date'
      || $premiereLigne[$CSV_IP] != 'IP'
  ) {
      die($messageConsigne);
  }

  include $_SESSION['DBInitInclude'];

  try {
      $suppressionTotale = $resultatsExercices->prepare('DELETE FROM eleve WHERE id_eleve > 0');
      $suppressionTotale->execute();
  } catch (PDOException $erreur) {
      echo 'erreur supression : ' . $erreur->getMessage();
      die($boutonRetour);
  }

  $nombreDeLignes = count(file($DBFileName));
  $ligneCourante = 0;
  session_start();
  $_SESSION['progression_restauration'] = 0;
  $_SESSION['count'] = 0;
  session_write_close();
  
  while ($ligne = fgets($restoreFile)) {
    session_start();
    $_SESSION['progression_restauration'] = $ligneCourante / $nombreDeLignes;
    $ligneCourante++;
    session_write_close();
    $ligne = explode(';', $ligne);
    $idEleve = $ligne[$CSV_ID_ELEVE];
    if ($idEleve != '') {

          $idConnexion = $ligne[$CSV_ID_CONNEXION];
          $nomEleve = $ligne[$CSV_NOM];
          $prenomEleve = $ligne[$CSV_PRENOM];
          $classeEleve = $ligne[$CSV_CLASSE];

          try {
              $eleveCheck = $resultatsExercices->prepare('SELECT * FROM eleve WHERE ID_ELEVE = ?');
              $eleveCheck->execute([$idEleve]);
          } catch (PDOException $e) {
              echo 'Une erreur est survenue durant la restauration<br>Details : ' . $e->getMessage() . '<br>';
              die($boutonRetour);
          }

          if (!$eleveCheck->fetch()) {
              $insertionEleve = $resultatsExercices->prepare('INSERT INTO eleve VALUES(:id, :idConnexion, :nom, :prenom, :classe)');
              $insertionEleve->execute([
              'id'          => $idEleve,
              'idConnexion' => $idConnexion,
              'nom'         => $nomEleve,
              'prenom'      => $prenomEleve,
              'classe'      => $classeEleve
          ]);
          }

          
          if ($ligne[$CSV_ID_TEST] != '') {
              $ligne[$CSV_DATE] = date_format(date_create($ligne[$CSV_DATE]), 'Y-m-d');
              $insertionTestsEleve = $resultatsExercices->prepare('INSERT INTO test VALUES(:id, :typeTest, :difficulte, :nombreQ, :nombreC, :dateTest, :idEleve, :ipEleve)');
              $insertionTestsEleve->execute([
              'id'         => trim($ligne[$CSV_ID_TEST]),
              'typeTest'   => trim($ligne[$CSV_TYPE_TEST]),
              'difficulte' => trim($ligne[$CSV_DIFF_TEST]),
              'nombreQ'    => trim($ligne[$CSV_NOMBRE_QUESTIONS]),
              'nombreC'    => trim($ligne[$CSV_NOMBRE_CORRECTES]),
              'dateTest'   => trim($ligne[$CSV_DATE]),
              'idEleve'    => trim($ligne[$CSV_ID_ELEVE]),
              'ipEleve'    => trim($ligne[$CSV_IP])
          ]);
          }
      }
  }
  session_start();
  $_SESSION['progression_restauration'] = 1;
  echo '<br><h4>BDD Restaurée avec succès</h4><br>';
  echo $boutonRetour;