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

echo '<h2>Analyses des adresses IP</h2>';

$listeComportementsSuspects = [];

$listeEleves = $resultatsExercices->query('SELECT ID_ELEVE as id, NOM_ELEVE as nom, PRENOM_ELEVE as prenom FROM eleve');
while ($eleve = $listeEleves->fetch()) {
    $listeIPsUtiliseesSurCeCompte = $resultatsExercices->query('SELECT COUNT(IP_ELEVE) as nombre, IP_ELEVE as ip FROM test WHERE ID_ELEVE = ' . $eleve['id'] . ' GROUP BY IP_ELEVE')->fetchAll();

    if (count($listeIPsUtiliseesSurCeCompte) > 1) 
    {
        echo strtoupper($eleve['nom']) . ' ' . $eleve['prenom'] . ' : <br>';
        echo 'IP multiples détectées - '. count($listeIPsUtiliseesSurCeCompte) .' ip différentes - recherches plus appronfondies :<br>';
        for ($i = 0; $i < count($listeIPsUtiliseesSurCeCompte) ; $i++)
        {
            $ipTestee = $listeIPsUtiliseesSurCeCompte[$i];
            $req = 
                'SELECT COUNT(e.ID_ELEVE) as nombre, 
                        e.ID_ELEVE as id, 
                        e.NOM_ELEVE as nom, 
                        e.PRENOM_ELEVE as prenom, 
                        e.CLASSE_ELEVE 
                FROM eleve e 
                LEFT JOIN test t 
                ON e.ID_ELEVE = t.ID_ELEVE 
                WHERE t.IP_ELEVE = "' . $ipTestee['ip'] . '" AND e.ID_ELEVE != ' . $eleve['id']
                . ' GROUP BY e.ID_ELEVE';
            $ListeEleveMemeIP = $resultatsExercices->query($req)->fetchAll();
            $nombreDeComptesAccedeParIpTestee = count($ListeEleveMemeIP);
            if ($nombreDeComptesAccedeParIpTestee != 0) {
                $s = $nombreDeComptesAccedeParIpTestee > 1 ? 's':'';
                echo " --- l'IP n°" . ($i + 1) ." a été utilisée dans " . $nombreDeComptesAccedeParIpTestee . " autre$s compte$s - ";
                foreach ($ListeEleveMemeIP as $eleveTeste) {
                    if ($eleveTeste['nombre'] != 0) {
                        
                        $listeIpEleveTeste = $resultatsExercices->query('SELECT COUNT(IP_ELEVE) as nombre, IP_ELEVE as ip FROM test WHERE ID_ELEVE = ' . $eleveTeste['id'] . ' GROUP BY IP_ELEVE')->fetchAll();
                        $ipPrincipaleEleveTeste = mostRepresentedIp($listeIpEleveTeste);

                        if ($eleveTeste['id'] == $eleve['id']) {
                            if ($ipTestee['ip'] == $ipPrincipaleEleveTeste) {
                                echo 'Cette ip est l\'ip principale de ' . strtoupper($eleve['nom']) . ' ' . $eleve['prenom'] . '<br>';
                            } else echo $ipTestee['ip'] . ' Cette ip est a été utilisée uniquement par ' . strtoupper($eleveTeste['nom']) . ' ' . $eleveTeste['prenom'] . '<br>';
                        } else {
                            if ($ipTestee['ip'] == $ipPrincipaleEleveTeste) {
                                echo "ATTENTION FRAUDE POTENTIELLE : Cette IP est celle utilisée principalement par " . strtoupper($eleveTeste['nom']) . ' ' . $eleveTeste['prenom'] . "<br>";
                                echo 'Il est possible que ' 
                                    . strtoupper($eleveTeste['nom']) . ' ' . $eleveTeste['prenom'] 
                                    . ' aie accédé au compte de ' 
                                    . strtoupper($eleve['nom']) . ' ' . $eleve['prenom'] . '<br>';
                                    
                                $listeComportementsSuspects[] = [
                                    'suspect' => strtoupper($eleveTeste['nom']) . ' ' . $eleveTeste['prenom'],
                                    'victime' => strtoupper($eleve['nom']) . ' ' . $eleve['prenom'],
                                    'ipPrincipaleSuspect' => $ipPrincipaleEleveTeste
                                ];
                            }
                        }


                        // $listeIpEleveTeste = $resultatsExercices->query('SELECT COUNT(IP_ELEVE) as nombre, IP_ELEVE as ip FROM test WHERE ID_ELEVE = ' . $eleveTeste['id'] . ' GROUP BY IP_ELEVE')->fetchAll();
                        // $ipPrincipaleEleveTeste = mostRepresentedIp($listeIpEleveTeste);
                        // if ($ipTestee['ip'] == $ipPrincipaleEleveTeste) {
                        //     if ($eleveTeste['id'] == $eleve['id']) echo 'Cette ip est l\'ip principale de ' . strtoupper($eleve['nom']) . ' ' . $eleve['prenom'] . '<br>';
                        //     else echo "ATTENTION : Cette IP est celle utilisée principalement par " . strtoupper($eleveTeste['nom']) . ' ' . $eleveTeste['prenom'] . " || FRAUDE POTENTIELLE " . $eleveTeste['nombre'] . "<br>";
                        // } else if ($eleveTeste['id'] == $eleve['id'] && $eleveTeste['nombre'] == 1) {
                        //     echo $ipTestee['ip'] . ' Cette ip est a été utilisée uniquement par ' . strtoupper($eleveTeste['nom']) . ' ' . $eleveTeste['prenom'] . '<br>';
                        // }
                    // }
                    }
                }
            }
        } 
        echo '<br><br>';
    }
}
array_multisort($listeComportementsSuspects);
foreach($listeComportementsSuspects as $comportement) {
    if (isset($compteAcces[$comportement['suspect']])) $compteAcces[$comportement['suspect']]++; 
    else $compteAcces[$comportement['suspect']] = 2;
    echo "Ip suspecte : " . $comportement['ipPrincipaleSuspect'] . " - il est possible que " . $comportement['suspect'] . " aie accédé au compte de " . $comportement['victime'] . "<br>" ;
}

echo '<br><br>';

foreach($compteAcces as $nom => $nombreAcces) {
    echo $nom . ' a accédé à ' . $nombreAcces .' comptes différents (y compris le sien)<br>';
}
