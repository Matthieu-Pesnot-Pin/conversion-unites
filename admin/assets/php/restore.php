<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
  <style type="text/css">
        html { padding: 50px;}
    </style>
   <title>Restauration</title>
</head>
<body>
<?php

  $messageConsigne = '<h3>Erreur de format de fichier :</h3><br><h5>Le fichier doit être au format csv (séparateur : ";") et doit contenir en entete : IdEleve;IdConnexion;Nom;Prenom;Classe;IdTest;TypeTest;DiffTest;NombreQuestions;NombreCorrectes;Date;IP</h5>';
  $boutonRetour = "<a class='btn btn-primary' href='index.html#/restore'>Retour à la page précédente</a>";

  if ($_FILES['file']['error']) {
      echo "<p><h3>Une erreur est survenue lors de l'upload du fichier</h3></p><br>";
      switch ($_FILES['file']['error']) {
      case 1: // UPLOAD_ERR_INI_SIZE
        echo "Le fichier dépasse la limite autorisée, merci d'utiliser un fichier < 1Mo<br>";
        break;
      case 2: // UPLOAD_ERR_FORM_SIZE
        echo "Le fichier dépasse la limite autorisée, merci d'utiliser un fichier < 1Mo<br>";
        break;
      case 3: // UPLOAD_ERR_PARTIAL
        echo "L'envoi du fichier a été interrompu pendant le transfert<br>";
        break;
      case 4: // UPLOAD_ERR_NO_FILE
        echo 'Le fichier que vous avez envoyé a une taille nulle<br>';
        break;
      }

      die($boutonRetour);
  }

  $DBFileName = $_FILES['file']['tmp_name'];

  include'_restore.php';

?>  
</body>
</html>

