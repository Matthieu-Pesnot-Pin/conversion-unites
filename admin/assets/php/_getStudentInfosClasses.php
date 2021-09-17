<?php
class resultatExercice {
    public $nombreQuestions = 0;
    public $nombreCorrectes = 0;
    public $noteUnitaire = 0;
    public function __construct ($q, $c) {
        $this->nombreQuestions = $q;
        $this->nombreCorrectes = $c;
        if ($q != 0 && $q != -1) $this->noteUnitaire = $c / $q;
    }
}



class categorieResultatExercice {
    public $niveaux = [];
    public $nomCategorie = "";
    public $nomCourtCategorie = "";
    public $codeCategorie = "";
    public $moyenneCategorie;
    public function addNiveau($resultat) {
        $this->niveaux[] = $resultat;
        $nbNiveaux = 0;
        $totalMoyenneNiveaux = 0;
        foreach ($this->niveaux as $niveau) {
            $nbNiveaux ++;
            $totalMoyenneNiveaux += $niveau->noteUnitaire;
        }
        $this->moyenneCategorie = $totalMoyenneNiveaux / $nbNiveaux;
    }
}


class resultatsEleve {
    public $categories = [];
    public $nomEleve = "";
    public $prenomEleve = "";
    public $classeEleve = "";
    public $idConnexion = "";
    public $totalQuestions = 0;
    public $totalCorrectes = 0;
    public $nombreNivMoyenneAtteinte = 0;
    public $nombreCatMoyenneAtteinte = 0;
    public $studentBadge1 = 'badge-warning';
    public $studentBadge2 = 'badge-warning';
    // public $studentBadgeContent1 = '&nbsp;';
    // public $studentBadgeContent2 = '&nbsp;';
    public $integerBadge1 = 'vide';
    public $integerBadge2 = 'vide';
    public $noteCiblee = 0.0;
    public $nombreExercices = 0;

    
    public function __construct ($nom, $prenom, $classe, $idConnexion) {
        $this->nomEleve = $nom;
        $this->prenomEleve = $prenom;
        $this->classeEleve = $classe;
        $this->idConnexion = $idConnexion;
    }
    public function addCategorie($cat) {
        $this->categories[] = $cat;
    }

    public function computeStats() {
        foreach ($this->categories as $cat) {
            if ($cat->moyenneCategorie >= 0.5) $this->nombreCatMoyenneAtteinte++;
            foreach ($cat->niveaux as $niveau)
            {
                if ($niveau->noteUnitaire >= 0.5) $this->nombreNivMoyenneAtteinte++;
                $this->totalQuestions += $niveau->nombreQuestions;
                $this->totalCorrectes += $niveau->nombreCorrectes;
            }
        }
/*
        if ($this->nombreCatMoyenneAtteinte == 0) $this->studentBadge1 = 'bad';
        else if ($this->nombreCatMoyenneAtteinte == 5) $this->studentBadge1 = 'max';
        else $this->studentBadgeContent1 = $this->nombreCatMoyenneAtteinte;
        
        if (floor($this->nombreNivMoyenneAtteinte/3) == 0) $this->studentBadge2 = 'bad';
        else if (floor($this->nombreNivMoyenneAtteinte/3) == 5) $this->studentBadge2 = 'max';
        else $this->studentBadgeContent2 = floor($this->nombreNivMoyenneAtteinte/3);
*/

        if ($this->nombreCatMoyenneAtteinte == 0) $this->studentBadge1 = 'badge-danger';
        else if ($this->nombreCatMoyenneAtteinte == 5) $this->studentBadge1 = 'badge-success';

        if (floor($this->nombreNivMoyenneAtteinte/3) == 0) $this->studentBadge2 = 'badge-danger';
        else if (floor($this->nombreNivMoyenneAtteinte/3) == 5) $this->studentBadge2 = 'badge-success';

        // $this->studentBadgeContent1 = $this->nombreCatMoyenneAtteinte;
        // $this->studentBadgeContent2 = floor($this->nombreNivMoyenneAtteinte/3);

        $this->integerBadge1 = $this->nombreCatMoyenneAtteinte;
        $this->integerBadge2 = floor($this->nombreNivMoyenneAtteinte/3);
        
    }
}
