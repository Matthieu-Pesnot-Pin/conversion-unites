<?php
include ('../../setroot.php');
include $_SESSION['DBInitInclude'];

function mostRepresentedIp($ipReq) {
    $max = 0;
    $ipMax = "";
    for ($i=0; $i < count($ipReq); $i++) { 
        if ($ipReq[$i]['nombre'] > $max) {
            $max = $ipReq[$i]['nombre'];
            $ipMax = $ipReq[$i]['ip'];
        }
    }
    return $ipMax;    
}

// echo '<h2>Analyses des adresses IP</h2>';

$listeComportementsSuspects = [];

$listeEleves = $resultatsExercices->query(
    'SELECT ID_ELEVE as id, 
        NOM_ELEVE as nom, 
        PRENOM_ELEVE as prenom, 
        CLASSE_ELEVE as classe 
    FROM eleve'
);
//$_SESSION['nombreAcces']++;

while ($eleve = $listeEleves->fetch()) {
    $listeIPsUtiliseesSurCeCompte = $resultatsExercices->query(
        'SELECT COUNT(IP_ELEVE) as nombre, 
            IP_ELEVE as ip 
        FROM test 
        WHERE ID_ELEVE = ' . $eleve['id'] . 
        ' GROUP BY IP_ELEVE'
    )->fetchAll();
    //$_SESSION['nombreAcces']++;

    if (count($listeIPsUtiliseesSurCeCompte) > 1) 
    {
        // echo strtoupper($eleve['nom']) . ' ' . $eleve['prenom'] . ' : <br>';
        // echo 'IP multiples détectées - '. count($listeIPsUtiliseesSurCeCompte) .' ip différentes - recherches plus appronfondies :<br>';
        for ($i = 0; $i < count($listeIPsUtiliseesSurCeCompte) ; $i++)
        {
            $ipTestee = $listeIPsUtiliseesSurCeCompte[$i];
            $req = 
                'SELECT COUNT(e.ID_ELEVE) as nombre, 
                        e.ID_ELEVE as id, 
                        e.NOM_ELEVE as nom, 
                        e.PRENOM_ELEVE as prenom, 
                        e.CLASSE_ELEVE as classe
                FROM eleve e 
                LEFT JOIN test t 
                ON e.ID_ELEVE = t.ID_ELEVE 
                WHERE t.IP_ELEVE = "' . $ipTestee['ip'] . '" AND e.ID_ELEVE != ' . $eleve['id']
                . ' GROUP BY e.ID_ELEVE';
            $ListeEleveMemeIP = $resultatsExercices->query($req)->fetchAll();
            //$_SESSION['nombreAcces']++;

            $nombreDeComptesAccedeParIpTestee = count($ListeEleveMemeIP);
            if ($nombreDeComptesAccedeParIpTestee != 0) {
                $s = $nombreDeComptesAccedeParIpTestee > 1 ? 's':'';
                // echo " --- l'IP n°" . ($i + 1) ." a été utilisée dans " . $nombreDeComptesAccedeParIpTestee . " autre$s compte$s - ";
                foreach ($ListeEleveMemeIP as $eleveTeste) {
                    if ($eleveTeste['nombre'] != 0) {
                        
                        $listeIpEleveTeste = $resultatsExercices->query('SELECT COUNT(IP_ELEVE) as nombre, IP_ELEVE as ip FROM test WHERE ID_ELEVE = ' . $eleveTeste['id'] . ' GROUP BY IP_ELEVE')->fetchAll();
                        $ipPrincipaleEleveTeste = mostRepresentedIp($listeIpEleveTeste);
                        //$_SESSION['nombreAcces']++;


                        if ($eleveTeste['id'] == $eleve['id']) {
                            if ($ipTestee['ip'] == $ipPrincipaleEleveTeste) {
                                // echo 'Cette ip est l\'ip principale de ' . strtoupper($eleve['nom']) . ' ' . $eleve['prenom'] . '<br>';
                            } //else echo $ipTestee['ip'] . ' Cette ip est a été utilisée uniquement par ' . strtoupper($eleveTeste['nom']) . ' ' . $eleveTeste['prenom'] . '<br>';
                        } else {
                            $dernierAcces =  ($resultatsExercices->query(
                                'SELECT DATE_TEST 
                                FROM test
                                WHERE IP_ELEVE = "' . $ipTestee['ip'] . '" AND ID_ELEVE = "' . strval($eleve['id'])
                                . '" ORDER BY DATE_TEST DESC'
                                ) -> fetch())['DATE_TEST'];
                                //$_SESSION['nombreAcces']++;


                            if ($ipTestee['ip'] == $ipPrincipaleEleveTeste) {
                                // echo "ATTENTION FRAUDE POTENTIELLE : Cette IP est celle utilisée principalement par " . strtoupper($eleveTeste['nom']) . ' ' . $eleveTeste['prenom'] . "<br>";
                                // echo 'Il est possible que ' 
                                    // . strtoupper($eleveTeste['nom']) . ' ' . $eleveTeste['prenom'] 
                                    // . ' aie accédé au compte de ' 
                                    // . strtoupper($eleve['nom']) . ' ' . $eleve['prenom'] . '<br>';                                    
                               
                                $listeComportementsSuspects[] = [
                                    'suspect' => strtoupper($eleveTeste['nom']) . ' ' . $eleveTeste['prenom'] . ' (' . $eleveTeste['classe'] . ')',
                                    'victime' => strtoupper($eleve['nom']) . ' ' . $eleve['prenom'] . ' (' . $eleve['classe'] . ')',
                                    'ipPrincipaleSuspect' => $ipPrincipaleEleveTeste,
                                    'dateDernierAcces' => $dernierAcces,
                                    'indiceCertitude' => 10
                                ];
                            } else {
                                // $listeComportementsSuspects[] = [
                                //     'suspect' => strtoupper($eleveTeste['nom']) . ' ' . $eleveTeste['prenom'] . ' (' . $eleveTeste['classe'] . ')',
                                //     'victime' => strtoupper($eleve['nom']) . ' ' . $eleve['prenom'] . ' (' . $eleve['classe'] . ')',
                                //     'ipPrincipaleSuspect' => $ipPrincipaleEleveTeste,
                                //     'dateDernierAcces' => $dernierAcces,
                                //     'indiceCertitude' => 1
                                // ];

                            }
                        }
                    }
                }
            }
        } 
    }
}
array_multisort($listeComportementsSuspects);
$output = [];
foreach($listeComportementsSuspects as $comportement) {
    $entree = [
        'victime' => $comportement['victime'],
        'dateDernierAcces' => $comportement['dateDernierAcces'],
        'indiceCertitude' => $comportement['indiceCertitude']
    ];
    $indexSuspect = false;
    foreach($output as $key => $suspect) {
        if ($suspect['nom'] == $comportement['suspect']) $indexSuspect = $key;
    }
    
    if ($indexSuspect != false) {
        $output[$indexSuspect]['listeMefaits'] [] = $entree;
    } else {
        $output[] = [
            'nom' => $comportement['suspect'],
            'listeMefaits' => [$entree]
        ];
    }
    
    // if (isset($output[$comportement['suspect']])) $output[$comportement['suspect']] [] =  $entree;
    // else $output[$comportement['suspect']] = [$entree];
    // $output[])) $output[$comportement['suspect']] [] =  $entree;
    // else $output[$comportement['suspect']] = [$entree];

    //$output[$comportement['suspect']]['ipPrincipaleSuspect'] = $comportement['ipPrincipaleSuspect'];

    // if (isset($compteAcces[$comportement['suspect']])) $compteAcces[$comportement['suspect']]++; 
    // else $compteAcces[$comportement['suspect']] = 2;
}
// echo $_SESSION['nombreAcces'];

echo json_encode($output);