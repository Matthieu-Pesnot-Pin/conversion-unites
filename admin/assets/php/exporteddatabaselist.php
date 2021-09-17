<?php

$dossierExports = '../exports/';
$contenuDossierExport = opendir($dossierExports);

$dataBaseList = [];

while($databaseFile = readdir($contenuDossierExport))
{
if($databaseFile != '.' && $databaseFile != '..')
{
array_push($dataBaseList, $databaseFile);
}
}
closedir($contenuDossierExport);

echo json_encode([
    "databaseList" => $dataBaseList
]);