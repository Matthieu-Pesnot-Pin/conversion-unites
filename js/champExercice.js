
const CONVERSION_TYPE_COMPATIBILITY_ERROR = "Erreur de conversion - unités incompatibles";
const CONVERSION_TYPE_UNKNOWN_ERROR = "Erreur de conversion - unité inconnue";

/*const UNIT_INPUT = 0;
const NO_UNIT_INPUT = 1;*/

const PRECISION = 5;

var correctionBoxesWidth = 15;

var correctionBoxesPosX = 25;
var correctionBoxesPosY = 30;
var correctionBoxesLigneHeight = 25;

var correctionFont = '';
/* classe ChampExercice 

classe de gestion des questions et réponses

*/

class ChampExercice{

    constructor (base, exp, unite) {
        this.base = new Base("0", "0");
        this.exp = 0;
        this.unite = "# pas d'unité transmise au constructeur de champExercice";

        if (unite!=undefined) this.unite = unite;
        if (!isNaN(exp)) this.exp = exp;
        if (base!=undefined)this.base = base;

    }


//*********************************** Fonctions gestion des nombres *******************************/

    compareTo(chp) {
        // Comparaison avec un autre nombre (chp) avec conversion d'unité automatique :
        return this.convertUnitTo(chp.unite).toScientific(PRECISION).toString() == chp.toString();
    }

    convertUnitTo(newUnit){
        // renvoie le nombre en format ChampExercice converti en newUnit
        var newExp = this.exp;

        var conversionFactor = conversionUnites.convertFromTo(this.unite, newUnit);
        var nouveauNombre = this.base.multiplyBy(conversionFactor, conversionUnites.type(this.unite));
        return new ChampExercice(nouveauNombre, newExp, newUnit);
    }
    
    toScientific(nbreChiffre) {
        // renvoie le nombre en format ChampExercice en mode ecriture scientifique (n,nnnnn x 10^m)
        if (nbreChiffre == undefined){ // Gestion du nombre de chiffre après la virgule si rien n'est précisé
            nbreChiffre = PRECISION;
            console.warn("toScientific : nombre de chiffres non précisé - utilisation du nombre de chiffres par defaut (" + PRECISION + ")");

        } 
        // Si le nombre est déjà sous forme  d'écriture scientfique on y touche pas
        if (this.base.partieEntiere.length == 1 && this.base.partieEntiere != "0" && this.base.partieDecimale.length <= nbreChiffre) return this;
        
        var tmpEntiere = this.base.partieEntiere;
        var tmpDecimale = this.base.partieDecimale;
        var tmpExp = this.exp;
        var tmpUnite = this.unite;

        while (tmpEntiere.length > 1) {  // Transfert des chiffres de la partie entière vers la partie décimale
            tmpDecimale = tmpEntiere[tmpEntiere.length - 1] + tmpDecimale;
            tmpEntiere = tmpEntiere.substring(0, tmpEntiere.length - 1);
            tmpExp ++;
        }

        while (tmpEntiere == "0"){
            
            if (tmpDecimale[0]!="0") {
                tmpEntiere = tmpDecimale[0];
            }
            tmpExp--;
            tmpDecimale = tmpDecimale.substring(1, tmpDecimale.length);
        }
        // réduction du nombre de décimales au nombre de chiffres significatifs choisis

        while (tmpDecimale.length>nbreChiffre) {
            var lastNumber = parseInt(tmpDecimale[tmpDecimale.length-1]);
            tmpDecimale = tmpDecimale.substring(0, tmpDecimale.length - 1);

            if (lastNumber >= 5){ // Gestion 
                var zeros = tmpDecimale.match(/^0*/)[0]; // Stockage du nombre de zero au début de la partie décimale
                var tmpDecimaleInt = parseInt(tmpDecimale); // (ils disparaissent lors du parseInt)

                // Gestion du cas ou on change de dizaine - moins de zeros en début de partie décimale
                if (Math.floor(Math.log10(tmpDecimaleInt + 1)) > Math.floor(Math.log10(tmpDecimaleInt))) {
                    zeros = zeros.substring(0, zeros.length-1);
                }
                var t = tmpDecimaleInt + 1;
                tmpDecimale = (tmpDecimaleInt + 1).toString();
                tmpDecimale = zeros + tmpDecimale;
            }
            
        }
        return new ChampExercice(new Base(tmpEntiere, tmpDecimale), tmpExp, tmpUnite).toScientific(nbreChiffre);
    }



// *************************************** Fonctions de rendu ***************************************/
    toHTML(attributs) {
    // renvoie le nombre écrit au format html. Chaque balise possède des attributs permettant de la retrouver 
    // depuis un appel getElementsByClassName si besoin.

        // var displayUnit = this.unite;
        // if (eleveLycee) displayUnit = conversionUnites.uniteFormatLycee(this.unite);

        var puissanceDe10 =  "<span></span><sup " + attributs + "></sup> "; // Pour respecter le nombre d'élements - a corriger

        if (this.exp!=0) {
            puissanceDe10 = "<span>&nbsp;× 10</span>";
            if (this.exp!=1) { puissanceDe10 += "<sup " + attributs + ">" + this.exp  + "</sup> ";
            }
            else { puissanceDe10 += "<sup " + attributs + ">" + "</sup> ";
            }
        }

        var uniteMiseEnForme = ChampExercice.displayUnit(this.unite);
        

        return "<span " + attributs + ">"
                    + this.base.toString()
                    + "</span>"
                        + puissanceDe10
                    +"<span " + attributs + ">"
                    + uniteMiseEnForme
                + "</span>";

    }

    expToHtml() {
        return (this.exp!=0)?
        "<span>"
            + "&nbsp;× 10"
        + "</span>"
        + "<sup>"
            + this.exp
        + "</sup> ":"";

    }

    static displayUnit(unit) { // Renvoi une unité au format HTML - affichage en fonction du niveau de l'élève (collège ou lycée)
        if (eleveLycee) unit = conversionUnites.uniteFormatLycee(unit); // premier filtre sur les unités pour ajuster en fonction du niveau (collège / lycée)
        unit = unit.split("²").join("<sup>2</sup>").split("³").join("<sup>3</sup>");  // Remplacement des ² et ³ par des <sup>
        return unit;
    }
    
    static inputHTML(attributs, unite, baseOrigine) { 
    // renvoie un code HTML pour les elements de saisie des réponses. Chaque balise possède des attributs permettant de la retrouver 
    // depuis un appel getElementsByClassName après validation des réponses

        if (baseOrigine == undefined) baseOrigine = Base.fromString("11,11");
        var firstPart;

        if (baseOrigine.partieEntiere == "1" && baseOrigine.partieDecimale == "0") {
            firstPart = "<span " + attributs + " style='display: none;'>noBase</span>";
        } else 
            // firstPart = "<input "+ attributs + " inputmode=\"decimal\" size=5 maxlength=7/> × ";
            firstPart = "<input "+ attributs + " inputmode=\"text\" size=5 maxlength=7/> × ";

       var uniteMiseEnForme = ChampExercice.displayUnit(unite);

        var baliseUnite = "<span "+ attributs + "></span>";
        if (!(unite == undefined)) baliseUnite = "<span "+ attributs + ">" + uniteMiseEnForme + "</span>";

        return firstPart
                    + "10"
                    + "<sup class=\"inputExp\">"
                        // + "<input "+ attributs + "inputmode=\"decimal\" size=1 maxlength=4/>"
                        + "<input "+ attributs + "inputmode=\"text\" size=1 maxlength=4/>"
                    + "</sup> "
                    + baliseUnite;
    }

    toString(){
    // renvoie une version texte du nombre sous la forme nnn,nnnn x 10^k
    //C'est cette version texte qui est utilisée pour vérifier que la réponse  est bonne (cf compareTo)
        return this.base.toString() + " x 10^" + this.exp;
    }

    toComputedString(){
    // renvoie une version texte du nombre après calcul - c'est-à-dire sans la puissance de 10.

        return this.base.x10Exp(this.exp).toString();
    }

    toFloat(){
    // Comme son nom l'indique

        return this.base.x10Exp(this.exp).toFloat();
    }

    realCopy(){
        return new ChampExercice (this.base, this.exp, this.unite);
    }

    static fromElts(eltBase, eltExp, eltUnit) {
    // Renvoie un nombre au format ChampExercice permet construit d'après les contenusde trois élements HTML
    // Est utilisé pour récupérer les réponses.
        if (eltBase.textContent == 'noBase') {
            return new ChampExercice(new Base("1", "0"), eltExp.value, eltUnit.textContent);
        }
        else
        if (eltBase.value != undefined && eltExp.value != undefined )
            return new ChampExercice(Base.fromString(eltBase.value),conversionStringFloat(eltExp.value), eltUnit.textContent);

        else if (eltBase.textContent != undefined && eltExp.textContent != undefined )
            return new ChampExercice(Base.fromString(eltBase.textContent),conversionStringFloat(eltExp.textContent), eltUnit.textContent);

        else 
            return new ChampExercice(new Base("1", "0"),0,"km");
                
    }

    static fromExerciceElt(exerciceElt) {
        return ChampExercice.fromElts(exerciceElt[ID_CHAMP_BASE_REPONSE], exerciceElt[ID_CHAMP_EXP_REPONSE], exerciceElt[ID_CHAMP_UNITE_REPONSE]);

    }
}




// // *************************** Fonction de mise en forme de la correction ************************//    

//     /* Ces fonctions permettent de mettre en forme la zone de correction 

//     formatage de la zone : 
//     - rappel question
//     - flèches repères
//     - compte exposant
//     - réponse

//     */

//     toDisplayBox(correctionBoxesPosX, correctionBoxesPosY, color){
//     // renvoie le nombre au format DisplayBox : une case par chiffre (et une pour la virgule), etc...

//         var bColor = "green";
//         if (color != undefined) bColor = color;
//         var returnBox = new DisplayBox("zoneFLottanteTransition", correctionBoxesPosX, correctionBoxesPosY);
//         var nbString = this.base.toString();

//         if (this.base.partieDecimale == "") nbString += ",00";

//         var pos10x = nbString.length;
//         var posExp = nbString.length+1;
//         var posUnit = nbString.length+2;
//         var posComma = this.getCommaPos();

//         returnBox.content = nbString;
//         returnBox.length = nbString.length + 3;

//         returnBox.computeNode();
//         returnBox.setBoxTextContent(pos10x, "   × 10");
//         returnBox.setBoxHTMLContent(posExp, "<sup>" + this.exp + "</sup>");
//         returnBox.setInnerHtmlBoxBorder(posExp, bColor);
//         returnBox.setBoxTextContent(posUnit, this.unite);


//         returnBox.setWidth(correctionBoxesWidth);
//         returnBox.setWidth("auto", pos10x);
//         returnBox.setInnerElementHTMLWidth("auto", posExp);
//         returnBox.setWidth(correctionBoxesWidth, posExp);
//         returnBox.setWidth("auto", posUnit);
//         returnBox.setWidth(correctionBoxesWidth+10, posExp); 
//         returnBox.setZIndex("3");
//         returnBox.setVisibility("hidden");
//         returnBox.setFontFamily(correctionFont);
//         returnBox.setFontSize('1.2em');
        
//         return returnBox;
//     }

//     toArrowDisplayBox(correctionBoxesPosX, correctionBoxesPosY) {
//     // renvoie une displaybox remplie avec des flèches  : décalage de virgule, etc...

//         var returnBox = new DisplayBox("zoneFLottanteTransition", correctionBoxesPosX, correctionBoxesPosY);// + correctionBoxesLigneHeight);
//         returnBox.id = "Arrows";
//         var nbString = this.base.toString();
//         if (this.base.partieDecimale == "") nbString += ",00";
//         var pos10x = nbString.length;
//         var posExp = nbString.length+1;
//         returnBox.content = nbString;
//         returnBox.length = nbString.length + 2;
//         returnBox.computeNode();
//         returnBox.emptyAllBoxes();
//         if (this.base.partieEntiere.length > 1)
//             for (var i = 1; i < this.getCommaPos(); i++) {
//                 returnBox.setBoxHTMLContent(i, imgArrowBackwardHtml);
//                 returnBox.setInnerElementHTMLWidth(correctionBoxesWidth, i);
//             }
//         else if (this.base.partieEntiere[0] == "0"){
//             var nombreArrows = this.base.partieDecimale.search(/[^0]/) + 1;
//             for (var i = 1; i <= nombreArrows; i++) {
//                 returnBox.setBoxHTMLContent(i+1, imgArrowForwardHtml);
//                 returnBox.setInnerElementHTMLWidth(correctionBoxesWidth, i+1);
//             }


//         }

//         returnBox.setBoxHTMLContent(posExp, imgArrowDownHtml);

//         returnBox.setWidth(correctionBoxesWidth);
//         returnBox.setWidth(correctionBoxesWidth * 2 + 3, pos10x);
//         returnBox.setZIndex("3");
//         returnBox.setVisibility("hidden");

//         return returnBox;

//     }

//     toExpCountDisplayBox(correctionBoxesPosX, correctionBoxesPosY) {
//     // renvoie une displayBox rempli par les comptes d'exposants : nombre de décalage de virgule, anciens exp, etc...

//         var returnBox = new DisplayBox("zoneFLottanteTransition", correctionBoxesPosX, correctionBoxesPosY); // + correctionBoxesLigneHeight * 2);
//         returnBox.id = "expCount";
//         var nbString = this.base.toString();
//         if (this.base.partieDecimale == "") nbString += ",00";
//         returnBox.content = nbString;
//         returnBox.length = nbString.length + 3;
//         returnBox.computeNode();
//         returnBox.emptyAllBoxes();
//         var circlePos = this.getCommaPos()-1;
//         var nbrToAdd = this.getCommaPos()-1;

//         var firstNumberExpSum = nbString.length;
//         var plusSignExpSum = nbString.length + 1;
//         var secondNumberExpSum = nbString.length + 2;

//         if (this.base.partieEntiere.length > 1)
//         for (var i = 1; i < this.getCommaPos(); i++) {
//             returnBox.setBoxTextContent(i, i.toString());
//             returnBox.setBoxTextSize(i, "0.8em");

//         }
       
//         else if (this.base.partieEntiere[0] == "0"){
//             var nombreArrows = this.base.partieDecimale.search(/[^0]/); // recherche du premier chiffre qui ne soit pas un 0 dans la partie décimale
//             circlePos = nombreArrows + 2;
//             nbrToAdd = (- circlePos + 1);
//             for (var i = 0; i <= nombreArrows+1; i++) {
//                 returnBox.setBoxTextContent(i+2, (-i-1).toString());
//                 returnBox.setBoxTextSize(i+2, "0.8em");
//             }
//         }

//         if (this.base.partieEntiere.length ==1 && this.base.partieEntiere[0] != "0") 
//         {
//             returnBox.setBoxTextContent(circlePos, "0");
//             returnBox.setBoxTextSize(circlePos, "0.8em");
//         }

//         returnBox.setBoxBorder(circlePos , "red");

//         returnBox.setBoxHTMLContent(circlePos+1, imgArrowRightHtml);
//         returnBox.setInnerElementHTMLWidth(correctionBoxesWidth * 2, circlePos+1);

//         returnBox.setBoxTextContent(firstNumberExpSum, nbrToAdd.toString());
//         returnBox.setBoxTextSize(firstNumberExpSum, "0.8em");
//         returnBox.setBoxBorder(firstNumberExpSum, "red");
//         returnBox.setBoxPadding(firstNumberExpSum, "1px");

//         returnBox.setBoxTextContent(plusSignExpSum, " + ");
//         returnBox.setBoxTextSize(plusSignExpSum, "0.8em");

//         returnBox.setBoxTextContent(secondNumberExpSum, this.exp.toString());
//         returnBox.setBoxTextSize(secondNumberExpSum, "0.8em");
//         returnBox.setBoxBorder(secondNumberExpSum, "green");
//         returnBox.setBoxPadding(secondNumberExpSum, "1px");


//         returnBox.setWidth(correctionBoxesWidth);

//         returnBox.setZIndex("3");
//         returnBox.setVisibility("hidden");
//         returnBox.setFontFamily(correctionFont);

//         return returnBox;

//     }

//     getCommaPos(){
//     // renvoie la position de la virgule
//         return this.base.partieEntiere.length;
//     }

