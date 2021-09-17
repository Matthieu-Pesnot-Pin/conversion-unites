<?php
        include '../../setroot.php';
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
    <title>Import</title>
</head>
<body>
<?php

        if ($_FILES['file']['error']) {
            echo "<p>Une erreur est survenue lors de l'upload du fichier</p><br>";
            switch ($_FILES['file']['error']){
              case 1: // UPLOAD_ERR_INI_SIZE
                echo "Le fichier dépasse la limite autorisée, merci d'utiliser un fichier < 30ko";
                break;
              case 2: // UPLOAD_ERR_FORM_SIZE
                echo "Le fichier dépasse la limite autorisée, merci d'utiliser un fichier < 30ko";
                break;
              case 3: // UPLOAD_ERR_PARTIAL
                echo "L'envoi du fichier a été interrompu pendant le transfert";
                break;
              case 4: // UPLOAD_ERR_NO_FILE
                echo "Le fichier que vous avez envoyé a une taille nulle";
                break;
            }
        
        die("<br><br><a class='btn btn-primary' href='index.html#/import'>Retour à la page d'import</a>");
    }
    function skip_accents( $str, $charset='utf-8' ) {
        if (mb_check_encoding($str, 'UTF-8')) $charset = 'utf-8'; 
        else if (mb_check_encoding($str, 'iso-8859-1')) $charset = 'iso-8859-1';
        return iconv($charset, 'utf-8', $str);
    }

    $autoId = (isset($_POST['autoId']) && $_POST['autoId'] == 'on');
    $autoCorrectId = (isset($_POST['autoCorrectId']) && $_POST['autoCorrectId'] == 'on');
    $saveList = (isset($_POST['saveList']) && $_POST['saveList'] == 'on');

    $importFile = fopen($_FILES['file']['tmp_name'], 'r+');
    $premiereLigne = fgets($importFile);
    $premiereLigne = explode(';', trim($premiereLigne));

    $CSV_ID_CONNEXION = 3;
    $CSV_NOM = 0;
    $CSV_PRENOM = 1;
    $CSV_CLASSE = 2;

    if (count($premiereLigne) != 4)
        die ('<h3>Erreur de format de fichier :<br></h3>'
            . '<h4>Le fichier doit être au format csv (séparateur : ";") et doit contenir en entete : Nom;Prenom;Classe;IdConnexion</h4><br>');
    
    if ( strtoupper($premiereLigne[0]) != 'NOM' 
        || strtoupper($premiereLigne[1]) != 'PRENOM' 
        || strtoupper($premiereLigne[2]) != 'CLASSE'
        || strtoupper($premiereLigne[3]) != 'IDCONNEXION'
    )   die ('<h3>Erreur de format de fichier :<br></h3>'
            . '<h4>Le fichier doit être au format csv (séparateur : ";") et doit contenir en entete : Nom;Prenom;Classe;IdConnexion</h4><br>' 
            . 'Format actuel du fichier : <br>'
            . '&nbsp;- ' . $premiereLigne[0] . '<br>'
            . '&nbsp;- ' . $premiereLigne[1] . '<br>'
            . '&nbsp;- ' . $premiereLigne[2] . '<br>'
            . '&nbsp;- ' . $premiereLigne[3]
        );

     
    include ($_SESSION['DBInitInclude']);


    $errorsFound = false;
    $someStudentsRejected = false;
    $someIdsModified = false;
    
    $now = date("Y-m-d-H-i-s");
    $nomRapport = "./rapports/rapport_" . $now . '_' . $_FILES['file']['name'] . ".txt";
    $nomListeEleveRejetes = "./rapports/liste-eleves-non-ajoutes_" . $now . '_' . $_FILES['file']['name'] . ".txt";
    $nomEleveIdModifie = "./rapports/liste-eleves-id-modife_" . $now . '_' . $_FILES['file']['name'] . ".txt";

    

    file_put_contents($nomRapport, utf8_decode ( "RAPPORT D'IMPORT DU FICHIER " . $_FILES['file']['name'] . " -- date : " . date("d/m/Y") ."\n\n\n"));
    file_put_contents($nomListeEleveRejetes, utf8_decode ("Liste d'élèves non ajoutés\n\n"));
    file_put_contents($nomEleveIdModifie,utf8_decode ("Liste des élèves ajoutés dont l'id est différent du nom de famille\n\n"));


    if ($saveList) {
        include 'exportlist.php';
        file_put_contents($nomRapport, utf8_decode ("Base de donnée sauvegardée dans le fichier " . $nomFichierSauvegarde . "\n\n"));
    }


    $nombreDeLignes = count(file($_FILES['file']['tmp_name']));
    $_SESSION['progression_restauration'] = 0;
    $_SESSION['count'] = 0;
    session_write_close();
    $numeroLigne = 1;
    while ($ligne = fgets($importFile)) {
        session_start();
            $_SESSION['progression_restauration'] = $numeroLigne / $nombreDeLignes;
        session_write_close();
        $numeroLigne++;
        $studentIdModified = false;
        $echecAjout = false;
        $studentIsTotallyTheSame = false;
        $eleve = explode(';', trim($ligne));
        if (!isset($eleve[$CSV_NOM]) || !isset($eleve[$CSV_PRENOM]) || !isset($eleve[$CSV_CLASSE])) {
            file_put_contents($nomRapport,utf8_decode ("\n**********************************************************************************************************************************************\n"),FILE_APPEND);
            file_put_contents($nomRapport, utf8_decode ("   Erreur lecture élève : il manque des informations à la ligne " . $numeroLigne . "\n" ), FILE_APPEND);
            file_put_contents($nomRapport,utf8_decode ("\n**********************************************************************************************************************************************\n"),FILE_APPEND);
        } else {
            if (!isset($eleve[$CSV_ID_CONNEXION]) || $eleve[$CSV_ID_CONNEXION] == "") {
                $errorsFound = true;
                if ($autoId) {
                    $idFromCSV = strtoupper(skip_accents($eleve[$CSV_NOM]));
                    file_put_contents($nomRapport,utf8_decode ("\n* AutoId : ajout d'un identifiant pour l'élève ") . $eleve[$CSV_NOM] . ' ' . $eleve[$CSV_PRENOM] . ' ' . $eleve[$CSV_CLASSE]. "\n", FILE_APPEND);
                } else {
                    $echecAjout = true;
                    $idFromCSV = "";
                }
            } else {
                $idFromCSV = htmlspecialchars(strtoupper(skip_accents($eleve[$CSV_ID_CONNEXION])));
            }
            
            $eleve[$CSV_NOM] = skip_accents($eleve[$CSV_NOM]);
            $eleve[$CSV_PRENOM] = skip_accents($eleve[$CSV_PRENOM]);
            $eleve[$CSV_CLASSE] = skip_accents($eleve[$CSV_CLASSE]);

            $eleveCheck = $resultatsExercices->prepare('SELECT * FROM eleve WHERE id_Connexion_Eleve = :id');
            $eleveCheck->execute([
                'id' => $idFromCSV
            ]);

            $eleveTrouve = $eleveCheck->fetch();
            $lettrePrenom = 0;

            while (isset($eleveTrouve['ID_CONNEXION_ELEVE']) && !$echecAjout) {
                
                $errorsFound = true;
                file_put_contents($nomRapport,utf8_decode ("\n* Attention : un élève avec le même id de connexion est déjà présent dans la BDD\n"),FILE_APPEND);
                file_put_contents($nomRapport,utf8_decode ("** Id Connexion : " . $eleveTrouve['ID_CONNEXION_ELEVE']."\n"),FILE_APPEND);
                file_put_contents($nomRapport,utf8_decode ("** Demande d'ajout : ") . $eleve[$CSV_NOM] . " " . $eleve[$CSV_PRENOM] . " " . $eleve[$CSV_CLASSE] . "\n",FILE_APPEND);
                file_put_contents($nomRapport,utf8_decode ("** Eleve dejà présent : " . $eleveTrouve['NOM_ELEVE'] . " " . $eleveTrouve['PRENOM_ELEVE'] . " " . $eleveTrouve['CLASSE_ELEVE'] . "\n"),FILE_APPEND);
                file_put_contents($nomRapport,utf8_decode ("\n"),FILE_APPEND);
                if ($eleveTrouve['ID_CONNEXION_ELEVE'] == $idFromCSV && $eleveTrouve['NOM_ELEVE'] == $eleve[$CSV_NOM] && $eleveTrouve['PRENOM_ELEVE'] == $eleve[$CSV_PRENOM] && $eleveTrouve['CLASSE_ELEVE'] == $eleve[$CSV_CLASSE]) {
                    $echecAjout = true;
                    $studentIsTotallyTheSame = true;
                } else if ($autoCorrectId) {
                    file_put_contents($nomRapport,utf8_decode ("** tentative de correction automatique d'identifiant\n"),FILE_APPEND);
                    $tmp = $idFromCSV;
                    $idFromCSV = $tmp . strtoupper(substr($eleve[$CSV_PRENOM], $lettrePrenom, 1));
                    $lettrePrenom++;
                    $echecAjout = $lettrePrenom > strlen($eleve[$CSV_PRENOM]);
                    file_put_contents($nomRapport,utf8_decode ('** Nouvel identifiant : ' . $idFromCSV . "\n"),FILE_APPEND);

                    $eleveCheck = $resultatsExercices->prepare('SELECT * FROM eleve WHERE id_Connexion_Eleve = :id');
                    $eleveCheck->execute([
                        'id' => htmlspecialchars(strtoupper($idFromCSV))
                        ]);

                    $eleveTrouve = $eleveCheck->fetch();
                    $studentIdModified = true;
                } else {
                    $studentIdModified = false;
                    $echecAjout = true;
                } 
                file_put_contents($nomRapport, utf8_decode ("\n"),FILE_APPEND);
            } 
            
            if ($echecAjout) {
                $someStudentsRejected = true;
                file_put_contents($nomListeEleveRejetes, "\n" . $eleve[$CSV_NOM] . " " . $eleve[$CSV_PRENOM] . " " . $eleve[$CSV_CLASSE], FILE_APPEND);

                file_put_contents($nomRapport,utf8_decode ("\n**********************************************************************************************************************************************\n"),FILE_APPEND);
                file_put_contents($nomRapport,utf8_decode ("Impossible de trouver un identifiant pour l'élève " . $eleve[$CSV_NOM] . " " . $eleve[$CSV_PRENOM] . " " . $eleve[$CSV_CLASSE] . " -- "),FILE_APPEND);
                if ($studentIsTotallyTheSame) {
                    file_put_contents($nomRapport,utf8_decode("\n\t|-!! L'élève a les mêmes noms, prénoms et classe qu'un autre élève !"),FILE_APPEND);
                    file_put_contents($nomListeEleveRejetes, utf8_decode(" - Un élève avec les mêmes nom, prénom et classe est déjà présent dans la base"), FILE_APPEND);
                }
                file_put_contents($nomRapport,utf8_decode ("\n\t|-Eleve non ajouté. (voir la liste des élèves non ajoutés)"),FILE_APPEND);
                file_put_contents($nomRapport,utf8_decode ("\n**********************************************************************************************************************************************\n"),FILE_APPEND);
                $studentIdModified = false;
            } else {
                $insertionBDD = $resultatsExercices->prepare('INSERT INTO eleve VALUES("", :id, :nom, :prenom, :classe)');
                $insertionBDD->execute([
                    'id' => strtoupper($idFromCSV),
                    'nom' => $eleve[$CSV_NOM],
                    'prenom' => $eleve[$CSV_PRENOM],
                    'classe' => $eleve[$CSV_CLASSE]
                ]);
                file_put_contents($nomRapport,utf8_decode ("\n**********************************************************************************************************************************************\n"),FILE_APPEND);
                file_put_contents($nomRapport,utf8_decode ("Elève ajouté : ") . $eleve[$CSV_NOM] . " " . $eleve[$CSV_PRENOM] . " " . $eleve[$CSV_CLASSE] . " (id : " .$idFromCSV . ")",FILE_APPEND);
                file_put_contents($nomRapport,utf8_decode ("\n**********************************************************************************************************************************************\n"),FILE_APPEND);
                if ($studentIdModified) {
                    file_put_contents($nomEleveIdModifie, ($eleve[$CSV_NOM] . " " . $eleve[$CSV_PRENOM] . " " . $eleve[$CSV_CLASSE] . " : nouvel id = " .$idFromCSV . "\n"),FILE_APPEND);
                    $someIdsModified = true;
                }
            }
        }
    }
    
    fclose($importFile);

    echo "<h2>Import terminé</h2><br><br>";

    if ($errorsFound) {
        // echo "<h2>Des erreurs se sont produites lors de l'import</h2><br><br>";
        if ($someStudentsRejected) {
            echo "<h5>Des erreurs se sont produites lors de l'import</h5><br>";
            echo "Consulter la liste des éléves non ajoutés : <a href='". $nomListeEleveRejetes ."' target='_blank'>Liste des élèves non ajoutés</a><br>";
        } else {
            echo "<h5>Tous les élèves ont pu être ajoutés - certains ID ont été créés / modifiés <br></h5>";
        }
        echo "Consulter le rapport d'import : <a href='" . $nomRapport . "' target='_blank'>Rapport d'import</a><br>";
        if ($someIdsModified) {
            echo "Liste des élèves dont l'id de connexion a été modifié : <a href='". $nomEleveIdModifie ."' target='_blank'>Liste des élèves id modifié</a><br>";
        }
        echo "(clic droit - <em>enregistrer le lien sous</em> pour enregitrer les rapports)<br><br>";

    } else {
    }
    $_SESSION['progression_restauration'] = 1;
    echo "<a class='btn btn-primary' href='index.html#/import'>Retour à la page d'import</a>";
?>
    
</body>
</html>

