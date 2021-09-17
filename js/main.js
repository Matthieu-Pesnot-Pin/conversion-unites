

// ****************************************************************************************************************//
// *****************************************        MISE A JOUR ONGLETS       *************************************//
// ****************************************************************************************************************//


function updateOnglets(selected){

    $('#zoneExercice').css("background-image",'url("./images/petittableau.jpg")');
    $('#zoneValidation').css("display", "none");
    askBeforeUpdate = false;
    selectedOnglet = selected;

    if (selectedOnglet == idOngletVitesses) { 
        $('#difficultySettings').hide();  
        niveauDifficulte = "1";
    }
    else $('#difficultySettings').show(); 

    /************************************Consignes ******************************************************************/

    $('#zoneTravail').html("");
    $('#zoneTravail').append($('<h2>', {class:'exTitle', text: "Exercices de physique"}));
    $('#zoneTravail').append($('<h2>', {class:'detailsConsigne', text: "Cette application permet de travailler les écritures scientifiques ainsi que les conversions d'unités"}));
    $('#zoneTravail').append($('<h2>', {class:'detailsConsigne', text: "Exercice choisi : " + descriptionGeneraleExercice[selectedOnglet]}));
    $('#zoneTravail').append($('<h2>', {class:'detailsConsigne', id:'affichageConsigneEcranDepart', html:consignesExercices[selectedOnglet][niveauDifficulte.valueOf()-1]}));
    
}



// ****************************************************************************************************************//
// **************************************        MISE EN FORME CORRECTION      ************************************//
// ****************************************************************************************************************//

function defineCorrectionVisibilityEvents(currEx) {


    // Pour chaque question, création de l'évènement pour afficher la correction
    for (var numeroExercice = 0 ; numeroExercice < nombreExercices ; numeroExercice ++) {
        var idCorrection = "#corr" + (numeroExercice+1).toString();
        $(idCorrection).css('visibility', 'visible');

       (function(capturedNumeroExercice) { // fonction pour capturer le numéro de la question
            
            $(idCorrection).on("click", function (e) {
                AfficherCorrection(listeExercice[capturedNumeroExercice]);
                
                    $(idZoneFlottante).css('visibility','visible');
                    $(idMasqueGris).css('visibility','visible');

                    var widthL2 = $("#correctionL2P1").outerWidth() + $("#correctionL2P2").outerWidth() + 20;
                    var widthL3 = $("#correctionL3").outerWidth() + 20;
                    var newWidth = widthL2 > widthL3 ? widthL2 : widthL3;
                    newWidth = newWidth < 200 ? 200 : newWidth;
                    newWidth = 500;
                    

                    $(idZoneFlottante).css('left', window.scrollX + window.innerWidth / 2  - 0.5 * $(idZoneFlottante).outerWidth());
                    $(idZoneFlottante).css('top', window.scrollY + window.innerHeight  / 2 - 0.5 * $(idZoneFlottante).outerHeight());
    
                    e.stopPropagation();
                });
                
                function quitCorrection() {
                    //zoneFLottanteElt.style.top = "-500px";
                    $(idZoneFlottante).css('top', -500);
                    $(idMasqueGris).css('visibility','hidden');
                }frames

                // document.addEventListener("click", function (e) {
                $(idMasqueGris).on("click", function (e) {
                    quitCorrection();
                });

        })(numeroExercice);
    }

    function AfficherCorrection(currEx) {
        $(idZoneFlottante).html("");
        // remplissage de la zone flottante

        if (selectedOnglet == idOngletScientifique){

            $(idZoneFlottante)
                .append($('<span>',{html: "Ecriture scientifique de " + currEx.question.toHTML(""), class: "elementDeCorrectionTitre"}))
                .append($('<br>'));
            if (currEx.question.toString() == currEx.question.toScientific(PRECISION).toString()){
                $(idZoneFlottante).append($('<span>',{html: "Il s'agit déjà d'une écriture scientifique !", class: "elementDeCorrection"}))
            }

            else {
                $(idZoneFlottante) 

                    /********* Rappel de la question ********/
                    .append($('<span>',{text: currEx.question.base.toString(),class: "elementDeCorrection cadreVert" }))
                    .append($('<span>',{html: currEx.question.expToHtml() + currEx.question.unite, class: "elementDeCorrection"}))
                    .append($('<br>'))

                    /********* Affichage du "nombre de transition" ********/
                    .append($('<span>',{html:"= ",class: "elementDeCorrection"}))
                    .append($('<span>',{html: currEx.transitionNumber.base.toString() + currEx.transitionNumber.expToHtml(),id: 'correctionL2P1',class: "elementDeCorrection cadreVert"}))
                    .append($("<span>",{html: currEx.question.expToHtml() + currEx.question.unite,id: 'correctionL2P2',class: "elementDeCorrection"}))
                    .append("<br>");

                    /********* Réponse ********/
                if (currEx.question.expToHtml() != "") {
                    $(idZoneFlottante).append($('<span>',{html: "Réponse : " + currEx.correctAnswer.toHTML(""),id: 'correctionL3', class: "elementDeCorrection reponseZoneCorrection"}));
                }
            }
        } 
        else if (selectedOnglet == idOngletConversion){
            if (niveauDifficulte == "1") displayCorrectionConversionLvl2()

            else if (niveauDifficulte == "2"){
                displayCorrectionTable();
            }

            else if (niveauDifficulte == "3"){
                displayCorrectionConversionsLvl3();
            }
        }
        else if (selectedOnglet == idOngletVolumes){
            if (niveauDifficulte == "1") displayCorrectionConversionLvl2();
            else if (niveauDifficulte == "2") displayCorrectionTable();
            else if (niveauDifficulte == "3"){
                displayCorrectionConversionsLvl3();
            }
        }

        else if (selectedOnglet == idOngletMassesVolumiques){
            if (niveauDifficulte == "1") {
                var startUnitUpperPart =  currEx.question.unite.split('/')[0];
                var startUnitDownerPart =  currEx.question.unite.split('/')[1];
                var destUnitUpperPart =  currEx.correctAnswer.unite.split('/')[0];
                var destUnitDownerPart =  currEx.correctAnswer.unite.split('/')[1];

                $(idZoneFlottante)
                .append($('<span>',{html: "Conversion de " + currEx.question.toHTML("") + " en " + ChampExercice.displayUnit(currEx.correctAnswer.unite), class: "elementDeCorrectionTitre"}))
                .append($('<br>'));

                // Mise en forme unité de départ
                var startUnitFractionBar = $('<table>');
                startUnitFractionBar.append($('<tr>').append(
                    $('<td>', {class: "fractionUpperPart"}).append(
                        $('<span>', {text:startUnitUpperPart, class: "fractionUnit cadreVert"}))));

                startUnitFractionBar.append($('<tr>').append($('<td>', {text:startUnitDownerPart, class: "fractionUnit cadreRouge"})));

                // mise en forme de l'unité d'arrivée

                var destUnitFractionBar = $('<table>');
                destUnitFractionBar.append($('<tr>').append(
                    $('<td>', {class: "fractionUpperPart"}).append(
                        $('<span>', {html: conversionUnites.conversionFactorExpToHtml(startUnitUpperPart, destUnitUpperPart) + " " + destUnitUpperPart, class: "fractionUnit cadreVert"}))));

                destUnitFractionBar.append($('<tr>').append($('<td>', {html: conversionUnites.conversionFactorExpToHtml(startUnitDownerPart, destUnitDownerPart) + " " +  destUnitDownerPart, class: "fractionUnit cadreRouge"})));

                // Affichage de la correction
                $(idZoneFlottante)
                    .append($('<span>', {html: "1&nbsp;", class: "elementDeCorrection"}))
                    .append(startUnitFractionBar)
                    .append($('<span>', {html: "&nbsp;=&nbsp;1&nbsp;×&nbsp;", class: "elementDeCorrection"}))
                    .append(destUnitFractionBar)
                    .append($('<br>'))
                    .append($('<span>', {html: "Réponse : " + currEx.correctAnswer.toHTML(), class: "reponseZoneCorrection elementDeCorrection"}));

            }
            else if (niveauDifficulte == "2") {
                var startUnitUpperPart =  currEx.question.unite.split('/')[0];
                var startUnitDownerPart =  currEx.question.unite.split('/')[1];
                var destUnitUpperPart =  currEx.correctAnswer.unite.split('/')[0];
                var destUnitDownerPart =  currEx.correctAnswer.unite.split('/')[1];

                $(idZoneFlottante)
                .append($('<span>',{html: "Conversion de " + currEx.question.toHTML("") + " en " + ChampExercice.displayUnit(currEx.correctAnswer.unite), class: "elementDeCorrectionTitre"}))
                .append($('<br>'));

                // Mise en forme unité de départ
                var startUnitFractionBar = $('<table>');
                startUnitFractionBar.append($('<tr>').append(
                    $('<td>', {class: "fractionUpperPart"}).append(
                        $('<span>', {text:startUnitUpperPart, class: "fractionUnit cadreVert"}))));

                startUnitFractionBar.append($('<tr>').append($('<td>', {text:startUnitDownerPart, class: "fractionUnit cadreRouge"})));

                // mise en forme de l'unité d'arrivée

                var destUnitFractionBar = $('<table>');
                destUnitFractionBar.append($('<tr>').append(
                    $('<td>', {class: "fractionUpperPart"}).append(
                        $('<span>', {html: conversionUnites.conversionFactorExpToHtml(startUnitUpperPart, destUnitUpperPart) + " " + destUnitUpperPart, class: "fractionUnit cadreVert"}))));

                destUnitFractionBar.append($('<tr>').append($('<td>', {html: conversionUnites.conversionFactorExpToHtml(startUnitDownerPart, destUnitDownerPart) + " " +  destUnitDownerPart, class: "fractionUnit cadreRouge"})));

                // Affichage de la correction
                $(idZoneFlottante)
                    .append($('<span>', {html: currEx.question.base.toString(), class: "elementDeCorrection cadreBleu"}))
                    .append(startUnitFractionBar)
                    .append($('<span>', {html: "&nbsp;=&nbsp;", class: "elementDeCorrection"}))
                    .append($('<span>', {html: currEx.transitionNumber.base.toString() + currEx.transitionNumber.expToHtml(), class: "elementDeCorrection cadreBleu"}))
                    .append($('<span>', {html: "&nbsp;×&nbsp;", class: "elementDeCorrection"}))
                    .append(destUnitFractionBar)
                    .append($('<br>'))
                    .append($('<span>', {html: "Réponse : " + currEx.correctAnswer.toHTML(), class: "reponseZoneCorrection elementDeCorrection"}));                
            }
            else if (niveauDifficulte == "3"){
                var startUnitUpperPart =  currEx.question.unite.split('/')[0];
                var startUnitDownerPart =  currEx.question.unite.split('/')[1];
                var destUnitUpperPart =  currEx.correctAnswer.unite.split('/')[0];
                var destUnitDownerPart =  currEx.correctAnswer.unite.split('/')[1];

                $(idZoneFlottante)
                .append($('<span>',{html: "Conversion de " + currEx.question.toHTML("") + " en " + ChampExercice.displayUnit(currEx.correctAnswer.unite), class: "elementDeCorrectionTitre"}))
                .append($('<br>'));

                // Mise en forme unité de départ
                var startUnitFractionBar = $('<table>');
                startUnitFractionBar.append($('<tr>').append(
                    $('<td>', {class: "fractionUpperPart"}).append(
                        $('<span>', {text:startUnitUpperPart, class: "fractionUnit cadreVert"}))));

                startUnitFractionBar.append($('<tr>').append($('<td>', {text:startUnitDownerPart, class: "fractionUnit cadreRouge"})));

                // mise en forme de l'unité d'arrivée

                var destUnitFractionBar = $('<table>');
                destUnitFractionBar.append($('<tr>').append(
                    $('<td>', {class: "fractionUpperPart"}).append(
                        $('<span>', {html: conversionUnites.conversionFactorExpToHtml(startUnitUpperPart, destUnitUpperPart) + " " + destUnitUpperPart, class: "fractionUnit cadreVert"}))));

                destUnitFractionBar.append($('<tr>').append($('<td>', {html: conversionUnites.conversionFactorExpToHtml(startUnitDownerPart, destUnitDownerPart) + " " +  destUnitDownerPart, class: "fractionUnit cadreRouge"})));

                // Affichage de la correction
                $(idZoneFlottante)
                    .append($('<span>', {html: currEx.question.base.toString(), class: "elementDeCorrection cadreBleu"}))
                    .append($('<span>', {html: currEx.question.expToHtml(), class: "elementDeCorrection"}))
                    .append(startUnitFractionBar)
                    .append($('<br>'))
                    .append($('<span>', {html: "&nbsp;=&nbsp;", class: "elementDeCorrection"}))
                    .append($('<span>', {html: currEx.transitionNumber.base.toString() + currEx.transitionNumber.expToHtml(), class: "elementDeCorrection cadreBleu"}))
                    .append($('<span>', { html: currEx.question.expToHtml(), class: "elementDeCorrection" }))
                    .append($('<span>', {html: "&nbsp;×&nbsp;", class: "elementDeCorrection"}))
                    .append(destUnitFractionBar)
                    .append($('<br>'))
                    .append($('<span>', {html: "Réponse : " + currEx.correctAnswer.toHTML(), class: "reponseZoneCorrection elementDeCorrection"}));                

            }
        }

        else if (selectedOnglet == idOngletVitesses){

            var startUnitUpperPart =  currEx.question.unite.split('/')[0];
            var startUnitDownerPart =  currEx.question.unite.split('/')[1];
            var destUnitUpperPart =  currEx.correctAnswer.unite.split('/')[0];
            var destUnitDownerPart =  currEx.correctAnswer.unite.split('/')[1];



            // Rappel de la question
            $(idZoneFlottante)
                .append($('<span>',{html: "Conversion de " + currEx.question.toHTML("") + " en " + ChampExercice.displayUnit(currEx.correctAnswer.unite), class: "elementDeCorrectionTitre"}))
                .append($('<br>'));

            var displayedFactor = "";

            if (startUnitUpperPart == "m") {
                displayedFactor = "&nbsp;×&nbsp;3,6&nbsp;";
            } else {
                displayedFactor = "×&nbsp;<table><tr><td class='fractionUpperPart'><span class='fractionUnit'>1</span></td></tr><tr><td><span class='fractionUnit'>3,6</span></tr></td></table>";
            }
            var speedConversionFactor = conversionUnites.convertFromTo(currEx.question.unite, currEx.correctAnswer.unite);
                $(idZoneFlottante)
                    // Premiere ligne - question avec les cadres
                    .append($('<span>', {html: currEx.question.base.toString(), class: "elementDeCorrection cadreBleu"}))
                    .append($('<span>', {html: currEx.question.expToHtml(), class: "elementDeCorrection "}))
                    .append($('<span>', {html: currEx.question.unite, class: "elementDeCorrection cadreVert"}))
                    .append($('<br>'))

                    // Deuxieme ligne - transformation de l'unité de départ en unite d'arrivée + facteur
                    .append($('<span>', {html: "&nbsp;=&nbsp;", class: "elementDeCorrection"}))
                    .append($('<span>', {html: currEx.question.base.toString(), class: "elementDeCorrection cadreBleu"}))
                    .append($('<span>', {class: "elementDeCorrection cadreVert"})
                        .append($('<span>', {html: displayedFactor}))
                        .append($('<span>', {html: currEx.correctAnswer.unite})))
                    .append($('<span>', {html: currEx.question.expToHtml(), class: "elementDeCorrection "}))
                    .append($('<br>'))

                    // Troisieme ligne - affichage du nombre de départ mutliplié par le facteur
                    .append($('<span>', {html: "&nbsp;=&nbsp;", class: "elementDeCorrection"}))
                    // .append($('<span>', {html: currEx.transitionNumber.toComputedString(), class: "elementDeCorrection cadreBleu"}))
                    .append($('<span>', {html: currEx.question.base.multiplyBy(speedConversionFactor).toString(), class: "elementDeCorrection cadreBleu"}))
                    // .append($('<span>', {html: "&nbsp;", class: "elementDeCorrection"}))
                    .append($('<span>', {html: currEx.correctAnswer.unite, class: "elementDeCorrection cadreVert"}))
                    .append($('<span>', {html: currEx.question.expToHtml(), class: "elementDeCorrection "}))
                    .append($('<br>'))
                    
                    // Quatrième ligne - ecriture scientifique de la base d'arrivée
                    .append($('<span>', {html: "&nbsp;=&nbsp;", class: "elementDeCorrection"}))
                    .append($('<span>', {html: currEx.transitionNumber.base.toString() + currEx.transitionNumber.expToHtml(), class: "elementDeCorrection cadreBleu"}))
                    // .append($('<span>', {html: "&nbsp;", class: "elementDeCorrection"}))
                    .append($('<span>', {html: currEx.question.expToHtml(), class: "elementDeCorrection "}))
                    // .append($('<span>', {html: "&nbsp;", class: "elementDeCorrection"}))
                    .append($('<span>', {html: currEx.correctAnswer.unite, class: "elementDeCorrection cadreVert"}))
                    .append($('<br>'))
                    
            

            // Affichage de la réponse
            $(idZoneFlottante).append($('<span>', {html: "Réponse : " + currEx.correctAnswer.toHTML(), class: "reponseZoneCorrection elementDeCorrection"}));
            
        }

        function displayCorrectionConversionsLvl3() {
            $(idZoneFlottante)
            .append($('<span>',{html: "Conversion de " + currEx.question.toHTML("") + " en " + currEx.correctAnswer.unite , class: "elementDeCorrectionTitre"}))
            .append($('<br>'));

            $(idZoneFlottante) // Remplissage de la zone de correction

                /********* Rappel de la question ********/
                .append($('<span>', { text: currEx.question.base.toString(), id: "correctionL3", class: "elementDeCorrection cadreVert" }))
                .append($('<span>', { html: currEx.question.expToHtml(), class: "elementDeCorrection" }))
                .append($('<span>', { html: currEx.question.unite, class: "elementDeCorrection cadreRouge" }))
                .append("<br>")

                /********* Affichage du "nombre de transition" ********/
                .append($('<span>', { html: currEx.transitionNumber.base.toString() + currEx.transitionNumber.expToHtml(), id: 'correctionL2P1', class: "elementDeCorrection cadreVert" }))
                .append($("<span>", { html: currEx.question.expToHtml(), id: 'correctionL2P2', class: "elementDeCorrection" }))
                .append($('<span>', { html: currEx.conversionFactor.expToHtml() + currEx.correctAnswer.unite, class: "elementDeCorrection cadreRouge" }))
                .append("<br>");
            /********* Réponse ********/
            $(idZoneFlottante).append($('<span>', { html: currEx.correctAnswer.toHTML(""), id: 'correctionL3', class: "elementDeCorrection reponseZoneCorrection" }));
        }

        function displayCorrectionConversionLvl2() {
            $(idZoneFlottante)
            .append($('<span>',{html: "Conversion de " + currEx.question.toHTML("") + " en " + currEx.correctAnswer.unite , class: "elementDeCorrectionTitre"}))
            .append($('<br>'));
    
            if (niveauDifficulte == "1"){
                $(idZoneFlottante) // Remplissage de la zone de correction
    
                /********* Rappel de la question ********/
                .append($('<span>',{text: currEx.question.base.toString(),class: "elementDeCorrection" }))
                .append($('<span>',{html: currEx.question.expToHtml() + currEx.question.unite, class: "elementDeCorrection cadreRouge"}))
    
    
                /********* Réponse ********/
                .append($('<span>',{text: "= " + currEx.correctAnswer.base.toString() , class: "elementDeCorrection" }))
                .append($('<span>',{html: currEx.correctAnswer.expToHtml() + currEx.correctAnswer.unite, class: "elementDeCorrection cadreRouge"}));
    
            }
        }
    
        function displayCorrectionTable() {
            
            $(idZoneFlottante)
            .append($('<span>',{html: "Conversion de " + currEx.question.toHTML("") + " en " + currEx.correctAnswer.unite , class: "elementDeCorrectionTitre"}))
            .append($('<br>'));
              
            var equivalentUnits = false;
    
    
            var startUnitPos = 0;
            var destUnitPos = 0;
    
            switch (conversionUnites.type(currEx.question.unite)) { // Choix du tableau en fonction du type de l'unité
                case DISTANCE_TYPE:
                    unitTableList = distanceUnitPosInConvArray;
                    importantUnitList = distanceImportantUnit;
                    break;
    
                case WEIGHT_TYPE:
                    unitTableList = weightUnitPosInConvArray;
                    importantUnitList = weightImportantUnit;
                    break;
    
                case VOLUME_TYPE:
                    unitTableList = volumeUnitPosInConvArray;
                    importantUnitList = volumeImportantUnit;
                    equivalentUnits = volumeEquivalenceMap.get(currEx.question.unite) == volumeEquivalenceMap.get(currEx.correctAnswer.unite);
                    break;
            }
    
            /* Creation du tableau de correction*/            
    
            if (equivalentUnits) {
                $(idZoneFlottante)
                    .append($('<span>',{html: "Les unités " + currEx.question.unite + " et " + currEx.correctAnswer.unite + " sont équivalentes !", class: "elementDeCorrection"}))
                    .append($('<br>'));
            }
    
            $(idZoneFlottante).append($('<table>', { id: 'tableauConversion', class: "conversionTable" }));
            $("#tableauConversion")
                .append($('<tr>', { id: 'premiereLigneTableauConversion' }))
                .append($('<tr>', { id: 'deuxiemeLigneTableauConversion' }));
    
            for (let i = 0; i < unitTableList.length; i++) { // recherche des positions des unités dans le tableau
                var currUnit = unitTableList[i];
                if (conversionUnites.type(currEx.question.unite)==VOLUME_TYPE) // Gestion des unités équivalentes avec des noms différents
                {
                    if (volumeEquivalenceMap.get(currUnit) == volumeEquivalenceMap.get(currEx.question.unite)) currUnit = currEx.question.unite;
                        if (volumeEquivalenceMap.get(currUnit) == volumeEquivalenceMap.get(currEx.correctAnswer.unite)) currUnit = currEx.correctAnswer.unite;
                    }
                    
    
                    if (currUnit == currEx.question.unite) {
                        startUnitPos = i;
                    if (equivalentUnits) destUnitPos = i;
                }
                
                if (currUnit == currEx.correctAnswer.unite) {
                    destUnitPos = i;
                    if (equivalentUnits) startUnitPos = i;
                }
            }
            
            var tableStart;
            var tableEnd;
            
            if (startUnitPos <= destUnitPos) {
                tableStart = startUnitPos - currEx.question.base.partieEntiere.length + 1;
                if (tableStart + currEx.question.base.partieDecimale.length > destUnitPos){
                    tableEnd = tableStart + currEx.question.base.partieDecimale.length;
                } else tableEnd = destUnitPos;
            }
            else {
                tableEnd = startUnitPos + currEx.question.base.partieDecimale.length;
                if (tableEnd - currEx.question.base.partieEntiere.length < destUnitPos - currEx.correctAnswer.base.partieEntiere.length){
                    tableStart = tableEnd - currEx.question.base.partieEntiere.length;
                } else tableStart = destUnitPos - currEx.correctAnswer.base.partieEntiere.length + 1;
            }
            
            // Construction du tableau
            for (let i = tableStart; i <= tableEnd; i++) {
                var currUnit = unitTableList[i];
                var isImportantUnit = importantUnitList.indexOf(currUnit) != -1;
                
                if (conversionUnites.type(currEx.question.unite)==VOLUME_TYPE) // Gestion des unités équivalentes avec des noms différents
                {
                        if (volumeEquivalenceMap.get(currUnit) == volumeEquivalenceMap.get(currEx.question.unite)) currUnit = currEx.question.unite;
                        if (volumeEquivalenceMap.get(currUnit) == volumeEquivalenceMap.get(currEx.correctAnswer.unite)) currUnit = currEx.correctAnswer.unite;
                }
    
    
                if (currUnit == currEx.question.unite) {
                    startUnitPos = i;
                    if (equivalentUnits) destUnitPos = i;
                }
                
                if (currUnit == currEx.correctAnswer.unite) {
                    destUnitPos = i;
                    if (equivalentUnits) startUnitPos = i;
                }
    
                var isImportantClass = "";
                if (isImportantUnit) isImportantClass = "importantUnit";
    
                $('#premiereLigneTableauConversion')
                .append($('<td>',
                    {
                        text: listeUnites.indexOf(currUnit) != -1 ? currUnit : "",
                        class: currEx.question.unite == currUnit ? "cadreVert" : "" + currEx.correctAnswer.unite == currUnit ? "cadreRouge" : "" + isImportantClass + " conversionTableElement",
                    }
                ));
    
                $('#deuxiemeLigneTableauConversion')
                    .append($('<td>',
                        {
                            id: "tableauConversionCase" + i.toString(),
                            class: isImportantClass + " conversionTableElement"
                        }
                    ));
            }
    
            // Remplissage du tableau de correction
            var partieEntiereStr = currEx.question.base.partieEntiere;
            var partieDecimaleStr = currEx.question.base.partieDecimale;
    
            for (let charPos = 0; charPos < partieEntiereStr.length; charPos++) {
                $('#tableauConversionCase' + (startUnitPos - charPos)).text(partieEntiereStr[partieEntiereStr.length - 1 - charPos]);
            }
    
            for (let charPos = 0; charPos < partieDecimaleStr.length; charPos++) {
                $('#tableauConversionCase' + (startUnitPos + charPos + 1)).text(partieDecimaleStr[charPos]);
            }
    
            // Ajout des zeros dans les cases vides 
            // (sauf si les unités de départ et d'arrivée sont des unités équivalentes avec des noms différents)
            if (!equivalentUnits)
            {
                if (destUnitPos > startUnitPos && startUnitPos + partieDecimaleStr.length < destUnitPos) {
                    for (let i = startUnitPos + partieDecimaleStr.length + 1; i <= destUnitPos; i++) {
                        $('#tableauConversionCase' + i).text("0");
                    }
                }
    
                if (destUnitPos < startUnitPos && startUnitPos - partieEntiereStr.length >= destUnitPos) {
                    for (let i = startUnitPos - partieEntiereStr.length; i >= destUnitPos; i--) {
                        $('#tableauConversionCase' + i).text("0");
                    }
                }
            }
    
            $(idZoneFlottante)
            .append($('<span>', {html: 'Donc : ' + currEx.question.toHTML() + ' = ' + currEx.question.convertUnitTo(currEx.correctAnswer.unite).toHTML(), class: "elementDeCorrection"}))
            .append($('<br>'))
            .append($('<span>', {html: 'Et enfin : ' + currEx.question.convertUnitTo(currEx.correctAnswer.unite).toHTML() + ' = ' + currEx.correctAnswer.toHTML(), class: "elementDeCorrection"}))
            .append($('<br>'))
            .append($('<span>', {html: 'Correction : ' + currEx.correctAnswer.toHTML(), class: "elementDeCorrection reponseZoneCorrection"}));
    
        }
                    
    }
}


// ****************************************************************************************************************//
// **************************************        GENERATION DES EXERCICES       ************************************//
// ****************************************************************************************************************//


function computeExerciseZone(){
    
    $('#zoneValidation').css("display", "block");

    $('#zoneTravail').html("");
    $('#zoneTravail').append($('<h2>', {class:'exTitle', text: 'Exercices'}));
    

    // ******************************************************************************************************//
    //* **************************************     CONSIGNES    *********************************************//
    // ******************************************************************************************************//

    $('#zoneTravail').append($('<h2>', {class:'detailsConsigne', text: "Exercice choisi : " + descriptionGeneraleExercice[selectedOnglet]}));
    $('#zoneTravail').append($('<h2>', {class:'detailsConsigne', html:consignesExercices[selectedOnglet][niveauDifficulte.valueOf() -1 ]}));

    switch (selectedOnglet) {
        case idOngletScientifique:
            var nbreExemple = new ChampExercice(Base.fromString("213,457"), 0,  conversionUnites.randomUnit(ANY_SIMPLE_UNIT));
            var exmpleStr = 'Exemple : ' + nbreExemple.toHTML() + ' = ' + nbreExemple.toScientific(PRECISION).toHTML();
            
            $('#zoneTravail').append($('<h2>', {class:'detailsConsigne', html:exmpleStr}));
            break;

        case idOngletConversion:
            break;
                    
        case idOngletVolumes:
            break;
        
        case idOngletMassesVolumiques:
            break;
        
        case idOngletVitesses:
            break;
        
    }
    var question;
    listeExercice = [];
    
    var conversionTrackList = [];
    for (var numeroQuestion = 0; numeroQuestion < nombreExercices; numeroQuestion++) {
        // ******************************************************************************************************//
        // ********************************** ECRITURE SCIENTIFIQUE *********************************************//
        // ******************************************************************************************************//


        if (selectedOnglet == idOngletScientifique) {
            if (niveauDifficulte == "1") {
                question = new ChampExercice(Base.random(3, 2, 0, 0, true), 0, conversionUnites.randomUnit(ANY_SIMPLE_UNIT));
                zoneTravailElt.innerHTML +=  renderExercise (numeroQuestion+1, question, question.unite);   
            } 
            else if (niveauDifficulte == "2") {
                question = new ChampExercice(Base.random(0, 5, -3, 0), 0, conversionUnites.randomUnit(ANY_UNIT));
                zoneTravailElt.innerHTML +=  renderExercise (numeroQuestion+1, question, question.unite);   
            }
            if (niveauDifficulte == "3") {
                question = new ChampExercice(Base.random(3, 2, -4, 6), Base.randomInt(10), conversionUnites.randomUnit(ANY_UNIT));
                zoneTravailElt.innerHTML +=  renderExercise (numeroQuestion+1, question, question.unite);   
            }
        }

        // ********************************************************************************************************//
        // ****************************************** CONVERSION SIMPLES ******************************************//
        // ********************************************************************************************************//

        else if (selectedOnglet == idOngletConversion) {
            if (niveauDifficulte == "1") {

                var startUnit = conversionUnites.randomUnit(PARAGRAPHE_2B_CONVERSION_UNIT);
                var destUnit = conversionUnites.randomUnit(PARAGRAPHE_2B_CONVERSION_UNIT, startUnit);

                // Verification que la conversion n'a pas déjà été demandée
                while (conversionTrackList.reduce( (a, v) => a = a || (v[0]==startUnit && v[1] == destUnit), false)) {
                    startUnit = conversionUnites.randomUnit(PARAGRAPHE_2B_CONVERSION_UNIT);
                    destUnit = conversionUnites.randomUnit(PARAGRAPHE_2B_CONVERSION_UNIT, startUnit);
                }

                conversionTrackList.push([startUnit, destUnit]); // on stocke la conversion pour eviter de demander la même dans les prochaines questions
                
                question = new ChampExercice(new Base("1", "0"), 0, startUnit);
                zoneTravailElt.innerHTML +=  renderExercise (numeroQuestion+1, question, destUnit);

            } else if (niveauDifficulte == "2") {
                question = new ChampExercice(Base.random(2, 3, -2, 3),0, conversionUnites.randomUnit(LEVEL_2_CONVERSION_UNIT));
                zoneTravailElt.innerHTML +=  renderExercise (numeroQuestion+1, question, conversionUnites.randomUnit(question.unite));

            } else if (niveauDifficulte == "3") {
                if (numeroQuestion < nombreExercices - 3) {
                    question = new ChampExercice(Base.random(3, 2, -4, 6), 0,conversionUnites.randomUnit(PARAGRAPHE_2B_CONVERSION_UNIT));
                    zoneTravailElt.innerHTML +=  renderExercise (numeroQuestion+1, question, conversionUnites.randomUnit(PARAGRAPHE_2B_CONVERSION_UNIT, question.unite));
                }
                else {
                    question = new ChampExercice(Base.random(3, 2, -4, 6), Base.randomInt(10) + 1, conversionUnites.randomUnit(PARAGRAPHE_2B_CONVERSION_UNIT));
                    zoneTravailElt.innerHTML +=  renderExercise (numeroQuestion+1, question, conversionUnites.randomUnit(PARAGRAPHE_2B_CONVERSION_UNIT, question.unite));
                }
            }
            
        }

        // ****************************************************************************************************//
        // ****************************************      VOLUMES      *****************************************//
        // ****************************************************************************************************//

        else if (selectedOnglet == idOngletVolumes) {
            if (niveauDifficulte == "1") {

                var startUnit = conversionUnites.randomUnit(PARAGRAPHE_3B_CONVERSION_UNIT);
                var destUnit = conversionUnites.randomUnit(PARAGRAPHE_3B_CONVERSION_UNIT, startUnit);

                // Verification que la conversion n'a pas déjà été demandée
                while (conversionTrackList.reduce( (a, v) => a = a || (v[0]==startUnit && v[1] == destUnit), false)) {
                    startUnit = conversionUnites.randomUnit(PARAGRAPHE_3B_CONVERSION_UNIT);
                    destUnit = conversionUnites.randomUnit(PARAGRAPHE_3B_CONVERSION_UNIT, startUnit);
                }

                conversionTrackList.push([startUnit, destUnit]); // on stocke la conversion pour le test précédent

                question = new ChampExercice(new Base("1", "0"), 0, startUnit);
                zoneTravailElt.innerHTML +=  renderExercise (numeroQuestion+1, question, destUnit);

            } else if (niveauDifficulte == "2") {
                question = new ChampExercice(Base.random(2, 3, -4, 3), 0, conversionUnites.randomUnit(VOLUME_TYPE));
                zoneTravailElt.innerHTML +=  renderExercise (numeroQuestion+1, question, conversionUnites.randomUnit(question.unite));

            } else if (niveauDifficulte == "3") {
                    question = new ChampExercice(Base.random(3, 2, -4, 6), Base.randomInt(10), conversionUnites.randomUnit(PARAGRAPHE_3B_CONVERSION_UNIT));
                    zoneTravailElt.innerHTML +=  renderExercise (numeroQuestion+1, question, conversionUnites.randomUnit(PARAGRAPHE_3B_CONVERSION_UNIT, question.unite));
            }
            
        }

        // ****************************************************************************************************//
        // ***************************************  MASSES VOLUMIQUES  ****************************************//
        // ****************************************************************************************************//

        else if (selectedOnglet == idOngletMassesVolumiques) {
            if (niveauDifficulte == "1") {
                question = new ChampExercice(new Base("1", "0"), 0, conversionUnites.randomUnit(MASSE_VOLUMIQUE_TYPE));
                zoneTravailElt.innerHTML +=  renderExercise (numeroQuestion+1, question, conversionUnites.randomUnit(question.unite));

            } else if (niveauDifficulte == "2") {
                question = new ChampExercice(Base.random(3, 2, -4, 6), 0, conversionUnites.randomUnit(MASSE_VOLUMIQUE_TYPE));
                zoneTravailElt.innerHTML +=  renderExercise (numeroQuestion+1, question, conversionUnites.randomUnit(question.unite));

            } else if (niveauDifficulte == "3") {
                question = new ChampExercice(Base.random(3, 2, -4, 6), Base.randomInt(10), conversionUnites.randomUnit(MASSE_VOLUMIQUE_TYPE));
                zoneTravailElt.innerHTML +=  renderExercise (numeroQuestion+1, question, conversionUnites.randomUnit(question.unite));
            }
            
        }

        // ****************************************************************************************************//
        // ******************************************     VITESSES     ****************************************//
        // ****************************************************************************************************//

        else if (selectedOnglet == idOngletVitesses) {
                question = new ChampExercice(Base.random(2, 2, -2, 2), Base.randomInt(10), conversionUnites.randomUnit(VITESSE_TYPE));
                zoneTravailElt.innerHTML +=  renderExercise (numeroQuestion+1, question, conversionUnites.randomUnit(question.unite));
        }
        
        // listeExercice.push(new Exercice(question));
    } // Fin boucle For


    zoneTravailElt.innerHTML += "<h2 id=\"zoneResultats\"></h2><p></p>";

    zoneTravailElt.style.paddingTop = (parseInt(zoneTravailElt.offsetHeight) / 20).toString() + "px";
    zoneTravailElt.style.paddingBottom = (parseInt(zoneTravailElt.offsetHeight) / 30).toString() + "px";

} // Fin computeExerciseZone



// ****************************************************************************************************************//
// ***************************************        VERIFICATION REPONSES       *************************************//
// ****************************************************************************************************************//

function answersCheck() {

    var testResults = {
        nbQuestions : 0,
        nbCorrect : 0
    }

    for (var numeroQuestion = 0; numeroQuestion < nombreExercices ; numeroQuestion++){

        var reponseElt = document.getElementsByClassName("reponse" + (numeroQuestion+1).toString());
        var correctionImgElt = document.getElementById("corr" + (numeroQuestion+1).toString());

        listeExercice[numeroQuestion].givenAnswer.base = Base.fromString(reponseElt[ID_CHAMP_BASE_REPONSE].value);
        listeExercice[numeroQuestion].givenAnswer.exp = reponseElt[ID_CHAMP_EXP_REPONSE].value;

        if (listeExercice[numeroQuestion].givenAnswer.base == undefined) listeExercice[numeroQuestion].givenAnswer.base = Base.fromString("1,0");

        testResults.nbQuestions++;

        if (listeExercice[numeroQuestion].isCorrect()) {
            correctionImgElt.innerHTML = "<span>corr.</span>" + imgSuccessHtml;
            testResults.nbCorrect++;
        }
        else correctionImgElt.innerHTML = "<span>corr.</span>" + imgWrongHtml;
    }

    defineCorrectionVisibilityEvents();

    var typeTest = selectedOnglet;

    var data = {
        typeTest : ongletsTypeExMap[selectedOnglet], // ongletsTypeExMap permet d'éviter l'onglet non sélectionnable - voir declaration.js
        difficulteTest : parseInt(niveauDifficulte-1),
        nbQuestions : testResults.nbQuestions,
        nbCorrect : testResults.nbCorrect
    };

    //document.getElementById("zoneResultats").innerHTML = 'Resultat : ' + data.nbCorrect + ' / ' + data.nbQuestions;
    $('#zoneResultats').html('Resultat : ' + data.nbCorrect + ' / ' + data.nbQuestions);

     var fData = new FormData();

     for(name in data) {
        fData.append(name, data[name]);
      }

      ajaxPost('./js/SQL/writedatabase.php', fData, function (rep) 
        { 
            try {
                console.log("WriteDataBase.php : ", JSON.parse(rep).message);
            } catch(e) {
                console.log(rep);
            }
            updateInfosStats();
        });


} // Fin answersCheck

updateInfosStats();

//selectedOnglet = idOngletMassesVolumiques;

$('.niveauDeDifficulte').removeClass('niveauChoisi');
$('#niveau1').addClass('niveauChoisi');
niveauDifficulte = "1";

$.get('js/SQL/getSessionInfos.php', (infos) => {
    try {
        infos = JSON.parse(infos);
        $('#nom').text(infos.prenomEleve + " " + infos.nomEleve + " " + infos.classeEleve);
        eleveLycee = ['1', '2', 'T'].indexOf(infos.classeEleve[0]) != -1; }
    catch {
        window.location = 'index.html';
    }
});

updateOnglets(selectedOnglet);

