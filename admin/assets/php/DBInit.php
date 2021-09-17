<?php
try {
    // $resultatsExercices = new PDO('mysql:host=ei2pb.myd.infomaniak.com;dbname=ei2pb_nouvelot_resultats_exercices;charset=UTF8', 'ei2pb_dev_acount', 'Dfr_0Q74rE0', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    // $resultatsExercices = new PDO('mysql:host=185.98.131.148;dbname=conve1497959;charset=UTF8', 'conve1497959', 'cl9fmxtvds', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $resultatsExercices = new PDO('mysql:host=localhost;dbname=resultats_exercices;charset=UTF8', 'root', '', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    // $resultatsExercices = new PDO('mysql:host=mysql213.sql002:3306;dbname=otravezfib173;charset=utf8', 'otravezfib173', 'Armand666OVH', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    
} catch (Exception $e) {
    die('Erreur lors de la connexion à la base de donnée : ' . $e->getMessage());
}
