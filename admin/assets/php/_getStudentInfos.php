<?php



// Recherche de l'élève :
// $rechercheEleve = $resultatsExercices->query('SELECT * FROM eleve e WHERE ID_CONNEXION_ELEVE =\'' .  strtoupper($_GET['id']) . '\'');
// $_SESSION['nombreAcces']++;
// if ($rechercheEleve->rowCount() == 0) {
//     die(json_encode(array(
//         'errorMessage' => 'Eleve introuvable'
//     )));
// }

// $eleve = $rechercheEleve->fetch();

$ensembleDesResultatsEleve = new resultatsEleve($eleve['NOM_ELEVE'], $eleve['PRENOM_ELEVE'], $eleve['CLASSE_ELEVE'], $eleve['ID_CONNEXION_ELEVE']);

$NOM_CATEGORIE = 0;
$NBRE_NIVEAUX_CATEGORIE = 1;
$CODE_CATEGORIE = 2; 
$NOM_COURT_CATEGORIE = 3; 

$definitionCategories = [ // [ nom , nbreNiveaux, code]
    0 => ['Ecriture Scientifique', 3, 'SC', 'Ecriture Scient.'],
    1 => ['Conversion simples', 3, 'CS', 'Unites Simples'],
    2 => ['Conversions volumes', 3, 'CV', 'Volumes'],
    3 => ['Conversions masses volumiques', 3, 'MV', 'Masses Volumiques'],
    4 => ['Conversions vitesses', 1, 'VIT', 'Vitesses']
];


foreach($definitionCategories as $numCat => $infosCat) {

    $categorie = new categorieResultatExercice();

    $categorie->nomCategorie = $infosCat[$NOM_CATEGORIE];
    $categorie->codeCategorie = $infosCat[$CODE_CATEGORIE];
    $categorie->nomCourtCategorie = $infosCat[$NOM_COURT_CATEGORIE];

    for ($niveau=0; $niveau < $infosCat[$NBRE_NIVEAUX_CATEGORIE]; $niveau++) { 
        $nbreQuestionsNbreCorrectes = $resultatsExercices->

        prepare('SELECT SUM(VT.NOMBRE_QUESTIONS_TEST) as nbreQ, SUM(VT.NOMBRE_REPONSES_CORRECTES) as nbreC 
            FROM 
                (
                    SELECT e.ID_ELEVE, e.ID_CONNEXION_ELEVE, e.NOM_ELEVE, e.CLASSE_ELEVE, t.ID_TEST, t.TYPE_TEST, t.DIFFICULTE_TEST, t.NOMBRE_QUESTIONS_TEST, t.NOMBRE_REPONSES_CORRECTES, t.DATE_TEST, t.IP_ELEVE 
                    FROM eleve e LEFT JOIN test t ON e.ID_ELEVE = t.ID_ELEVE 
                    WHERE ID_CONNEXION_ELEVE = :idEleve AND TYPE_TEST = :typeTest AND DIFFICULTE_TEST = :diffTest 
                    ORDER BY t.ID_TEST DESC LIMIT 3
                ) AS VT'
        );

        $nbreQuestionsNbreCorrectes->execute([
            'idEleve' => strtoupper($_GET['id']),
            'diffTest' => $niveau,
            'typeTest' => $numCat
        ]);
        //$_SESSION['nombreAcces']++;

        $resultats = $nbreQuestionsNbreCorrectes->fetch();

        $nbreQ = $resultats['nbreQ'];
        $nbreC = $resultats['nbreC'];

        if ($nbreQ == null) $nbreQ = -1;
        if ($nbreC == null) $nbreC = -1;

        $categorie->addNiveau(new resultatExercice($nbreQ, $nbreC));

        $nbreQuestionsNbreCorrectes->closeCursor();
    }
    $ensembleDesResultatsEleve->addCategorie($categorie);
}
$ensembleDesResultatsEleve->computeStats();

?>