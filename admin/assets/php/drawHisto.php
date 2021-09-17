<?php
session_start();

//header('Content-type: image/png');

// include ($_SESSION['DBInitInclude']); // Connexion BDD

// include '_getStudentInfosClasses.php'; // definition des objets

// include '_getStudentInfos.php'; // recuperation des infos eleve dans la variable $ensembleDesResultatsEleve

$ensembleDesResultatsEleve = json_decode(json_encode($_POST));



$graph = imagecreate(400, 200);
$blanc = imagecolorallocate($graph, 255, 255, 255);

imagecolortransparent($graph, $blanc);

$noir = imagecolorallocate($graph, 0, 0, 0);
$gris = imagecolorallocate($graph, 180, 180, 180);
$sousTexte = imagecolorallocate($graph, 0, 180, 0);

$WGraph = imagesx($graph);
$HGraph = imagesy($graph);

$histWidth = 15;
$histSpace = 3;
$histGroupSpace = 25;
$firstHistPos = 40;

$graphBottom = 35;
$graphLeft = 20;
$graphTop = 20;



$posX = 30;

$zoneGraphH = $HGraph - $graphBottom - $graphTop;

 function drawHistos($firstHistPos) {
    global $WGraph, $HGraph, $graphBottom, $graph, $noir, $histWidth, $histSpace, $zoneGraphH, $histGroupSpace, $ensembleDesResultatsEleve, $catList, $sousTexte;

    $coulN = [
        imagecolorallocate($graph, 189, 226, 182),
        imagecolorallocate($graph, 119, 226, 112),
        imagecolorallocate($graph, 59, 200, 52)
    ];

    $coulBadNote = imagecolorallocate($graph, 175, 0, 0);

    $largeurCategorie = $histWidth * 3 + $histSpace * 2 + $histGroupSpace;

    for ($cat=0; $cat < count($ensembleDesResultatsEleve->categories); $cat ++) {

        $categorie = $ensembleDesResultatsEleve->categories[$cat];
        $textPos = // Centrage du texte
            $firstHistPos + $largeurCategorie * $cat  // debut des histogrammes
            + ($largeurCategorie - $histGroupSpace) / 2 // moitié de la largeur des histogrammes
            - 3 * strlen($catList[$cat]); // Moitié de la longeur de la chaine (largeur caractères = 6)

        imagestring($graph, 2, $textPos, $HGraph - $graphBottom + 22, $catList[$cat], $noir);

        for ($niveau=0; $niveau < count($categorie->niveaux); $niveau++) { 
            $coulNiv = $coulN[$niveau];
            if ($categorie->niveaux[$niveau]->noteUnitaire < 0.5) $coulNiv = $coulBadNote;
        
            $hauteur = $zoneGraphH * $categorie->niveaux[$niveau]->noteUnitaire;
            $posX = $firstHistPos + $largeurCategorie * $cat + ($histSpace + $histWidth)* $niveau;

            // Dessins des histogrammes et des légendes
            imageFilledRectangle($graph, $posX, $HGraph - $graphBottom - $hauteur, $posX + $histWidth, $HGraph - $graphBottom, $coulNiv);
            imagestring($graph, 1, $posX + 3, $HGraph - $graphBottom + 5, strval(round($categorie->niveaux[$niveau]->noteUnitaire * 20)), $noir);
            $nbreQestions =  $categorie->niveaux[$niveau]->nombreQuestions / 5;
            if ($nbreQestions < 0) $nbreQestions = 'N';
            imagestring($graph, 1, $posX + 3, $HGraph - $graphBottom + 13, $nbreQestions, $sousTexte);
        }
    }
 }

// Fond du graphique :

imageline($graph, $graphLeft, $HGraph - $graphBottom + 1, $WGraph, $HGraph - $graphBottom + 1, $noir);
imageline($graph, $graphLeft, $graphTop + $zoneGraphH / 2, $WGraph, $graphTop + $zoneGraphH / 2, $gris);
imageline($graph, $graphLeft, $graphTop, $graphLeft, $HGraph - $graphBottom, $noir);

imagestring($graph, 4, 0, $HGraph - $graphBottom - 7, "0", $noir);
imagestring($graph, 4, 0, $graphTop - 7, "20", $noir);
imagestring($graph, 4, 0, $graphTop + $zoneGraphH / 2 - 7, "10", $noir);

// Histogrammes :

$catList = [
    "Scient",
    "Simples",
    "Volumes",
    "MV",
    "Vitesses"
];

drawHistos($firstHistPos);

imagepng($graph, "../graph.png");


