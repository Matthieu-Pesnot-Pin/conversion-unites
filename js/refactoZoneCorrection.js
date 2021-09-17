var emFactor = 1;

// Mise en place des DisplayBox pour l'affichage de la correction : 
var displayBoxToShow = new CorrectionDisplayElements(
    listeExercice[i].question.toDisplayBox("correctionQuestion", correctionBoxesPosX, correctionBoxesPosY), // La question
    listeExercice[i].question.toArrowDisplayBox(correctionBoxesPosX, correctionBoxesPosY + correctionBoxesLigneHeight * emFactor), // Les fleches
    listeExercice[i].question.toExpCountDisplayBox(correctionBoxesPosX, correctionBoxesPosY + correctionBoxesLigneHeight * emFactor * 2), // Les comptes
    listeExercice[i].correctAnswer.toDisplayBox("correctionQuestion", correctionBoxesPosX, correctionBoxesPosY + correctionBoxesLigneHeight * emFactor * 3, "black")// La réponse attendue  
);

zoneFLottanteElt.style.height = ((NbreLigne + 3) * correctionBoxesLigneHeight * emFactor).toString() + "px";
