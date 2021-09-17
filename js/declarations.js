

// ****************************************************************************************************************//
// ******************************************    DECLARATION VARIABLES    *****************************************//
// ****************************************************************************************************************//



class Exercice  {
    // question;
    // correctAnswer;
    // givenAnswer;
    // transitionNumber;
    // conversionFactor;

    constructor (q, targetUnit) {
        if (targetUnit == undefined) targetUnit = q.unite;
        this.question = q;
        this.computeCorrectAnswer(targetUnit);
        this.computeTransitionNumber()
        this.givenAnswer = new ChampExercice(Base.fromString("1,0"), 0, targetUnit);
    }

    
    computeCorrectAnswer(unit) {
        if (conversionUnites.type(unit) == VITESSE_TYPE){
            this.correctAnswer = this.question.convertUnitTo(unit).toScientific(2);
        } else {
            this.correctAnswer = this.question.convertUnitTo(unit).toScientific(PRECISION);
        }
    }

    /** Le nombre de transition est à mi-chemin entre la question et la réponse :
     * exemple :
     * question = 123 x 10^5
     * transition = 1,23 x 10^2
     * reponse = 1,23 x 10^7
     * 
     * il permet l'affichage d'une étape intermédiaire pour la correction : 123 x 10^5 = 1,23 x 10^2 x 10^5 = 1,23 x 10^7 */

    computeTransitionNumber(){ 
        this.computeConversionFactor();
        this.transitionNumber = this.correctAnswer.realCopy();
        this.transitionNumber.exp -= this.question.exp + this.conversionFactor.exp;
    }
    
    computeConversionFactor(){
        var u1 = new ChampExercice(new Base("1", "0"), 0, this.question.unite);
        this.conversionFactor = u1.convertUnitTo(this.correctAnswer.unite).toScientific(PRECISION);
    }

    isCorrect() {
        this.computeCorrectAnswer(this.givenAnswer.unite);
        this.computeConversionFactor();
        return this.question.compareTo(this.givenAnswer);
    }
    
}


// class CorrectionDisplayElements {
//     questionBox;
//     answerBox;
//     arrowBox;
//     expCountBox;
//     constructor (q, arr, ans, exp) {
//         this.questionBox = q;
//         this.arrowBox = arr;
//         this.answerBox = ans;
//         this.expCountBox = exp;

//         this.questionBox.setTextAlign("center");
//         this.answerBox.setTextAlign("center");
//         this.arrowBox.setTextAlign("center");
//         this.expCountBox.setTextAlign("center");
//     }

//     updatePos() {
//         this.questionBox.updatePos();
//         this.answerBox.updatePos();
//         this.arrowBox.updatePos();
//         this.expCountBox.updatePos();
//     }
    
//     throwIntoDisplayList(dList) {
//         dList.push(this.questionBox);
//         dList.push(this.arrowBox);
//         dList.push(this.answerBox);
//         dList.push(this.expCountBox);
//     }
// }


// const ID_CHAMP_CORRECTION = 0;
// const ID_CHAMP_BASE_QUESTION = 1;
// const ID_CHAMP_EXP_QUESTION = 2;
// const ID_CHAMP_UNITE_QUESTION = 3;
// const ID_CHAMP_BASE_REPONSE = 4;
// const ID_CHAMP_EXP_REPONSE = 5;
// const ID_CHAMP_UNITE_REPONSE = 6;

const ID_CHAMP_BASE_REPONSE = 0;
const ID_CHAMP_EXP_REPONSE = 1;

const DIGITS_SPREAD_FACTOR = 18;

const ZONE_FLOTTANTE_PADDING_X = 5;
const ZONE_FLOTTANTE_PADDING_Y = 5;
const ZONE_FLOTTANTE_INTERLINE = 10;

const idOngletScientifique = 0;
const idOngletConversion = 1;
const idOngletUnselectable = 2;
const idOngletVolumes = 3;
const idOngletMassesVolumiques = 4;
const idOngletVitesses = 5;

const ongletsTypeExMap = [
    0,  // Onglet 0 = idOngletScientifique -> ex type 0
    1,  // Onglet 1 = idOngletConversion -> ex type 1
    -1,  // Onglet 2 = idOngletUnselectable -> pas d'ex
    2,  // Onglet 3 = idOngletVolumes -> ex type 2
    3,  // Onglet 4 = idOngletMassesVolumiques -> ex type 3
    4  // Onglet 5 = idOngletVitesses -> ex type 4
]

const descriptionGeneraleExercice = [
    "Ecriture scientifique", 
    "Conversion d'unités simples",
    "Onglet non selectionnable",
    "Conversions de volumes",
    "Conversions de masses volumiques",
    "Conversions de vitesses"
]

const consignesExercices = [
    [ // Ecriture scientifique
    "Compléter l’écriture scientifique de toutes les valeurs proposées<br><br>Attention, pour séparer le chiffre des unités de la partie décimale, bien utiliser une virgule et pas un point", 
    "Compléter l’écriture scientifique de toutes les valeurs proposées<br><br>Attention, pour séparer le chiffre des unités de la partie décimale, bien utiliser une virgule et pas un point",
    "Compléter l’écriture scientifique de toutes les valeurs proposées<br><br>Attention, pour séparer le chiffre des unités de la partie décimale, bien utiliser une virgule et pas un point" 
    ],

    [ // Conversions d'unités simples
    "Niveau 1 : Convertir <u>par coeur</u> les valeurs proposées", 
    "Niveau 2 : À l’aide d’un tableau de conversion que vous tracerez sur une feuille, convertir les valeurs proposées puis donner le résultat sous forme d’écriture scientifique dans l’application",
    "Niveau 3 : En utilisant les puissances de 10 ainsi que les conversions apprises par coeur dans le niveau 1, convertir les valeurs proposées sur une feuille et donner le résultat sous forme d’écriture scientifique dans l’application" 
    ],
    
    ["Onglet non selectionnable"],

    [ // Volumes
        "Niveau 1 : Convertir <u>par coeur</u> les valeurs proposées", 
        "Niveau 2 : À l’aide d’un tableau de conversion que vous tracerez sur une feuille, convertir les valeurs proposées puis donner le résultat sous forme d’écriture scientifique dans l’application",
        "Niveau 3 : En utilisant les puissances de 10 ainsi que les conversions apprises par coeur dans le niveau 1, convertir les valeurs proposées sur une feuille et donner le résultat sous forme d’écriture scientifique dans l’application" 
    ],

    [ // Masses volumiques
    "En utilisant les puissances de 10 ainsi que les conversions de volumes et de masses apprises par coeur, convertir les valeurs proposées sur une feuille et donner le résultat sous forme d’écriture scientifique dans l’application.", 
    "En utilisant les puissances de 10 ainsi que les conversions de volumes et de masses apprises par coeur, convertir les valeurs proposées sur une feuille et donner le résultat sous forme d’écriture scientifique dans l’application.", 
    "En utilisant les puissances de 10 ainsi que les conversions de volumes et de masses apprises par coeur, convertir les valeurs proposées sur une feuille et donner le résultat sous forme d’écriture scientifique dans l’application."
    ],
    

    [ // Vitesses
    "Convertir les vitesses suivantes et donner le résultat sous forme d'écriture scientifique - avec une précision de 2 chiffres après la virgule"
    ],
    
    
]


var ongletsElt = document.getElementsByTagName("nav");
var zoneTravailElt = document.getElementById("zoneTravail");
var zoneExerciceElt = document.getElementById("zoneExercice");
var decorationBoxElts = document.getElementsByClassName("decorationBox");
var onglets = ongletsElt[0].children;


var boutonValiderElt = document.getElementById("boutonValider");
var boutonNouvelExerciceElt = document.getElementById("boutonNouvelExercice");


var barreDifficulteElt = document.getElementById("barreDifficulte");
var indicateurDifficulteElt = document.getElementById("indicateurDifficulte");

var hauteurOnglets = onglets[0].style.height;
var positionOnglets = onglets[0].style.top;
var selectedOnglet = idOngletScientifique;

var zoneValidationElt = document.getElementById("zoneValidation");

var zoneFLottanteElt = document.getElementById("zoneFLottante");
var idZoneFlottante = "#zoneFLottante";

var masqueGrisElt = document.getElementById("masqueGris");
var idMasqueGris = "#masqueGris";

var imgSuccessHtmlFixed = "<img src=\".\\images\\success.ico\"></img>";
var imgWrongHtmlFixed = "<img src=\".\\images\\wrong.ico\"></img>";
var imgArrowBackwardHtml = "<img src=\".\\images\\arrowBackward.png\"></img>";
var imgArrowForwardHtml = "<img src=\".\\images\\arrowForward.png\"></img>";
var imgArrowDownHtml = "<img src=\".\\images\\arrowDown.ico\"></img>";
var imgArrowRightHtml = "<img src=\".\\images\\arrowRight.png\"></img>";
var imgArrowPartialHtml = "<img class = \"arrow\" src=\".\\images\\reverseArrow.png\" ";


var imgSuccessHtml = '<lottie-player src=".\\images\\correct.json"  background="transparent"  speed="1"  style="width: 40px; height: 40px;" autoplay></lottie-player>';
var imgWrongHtml = '<lottie-player src=".\\images\\error.json"  background="transparent"  speed="1"  style="width: 40px; height: 40px;" autoplay></lottie-player>';

var chalkUnderlineImg = "url(./images/chalkUnderline.png)";
var noBackground = 'url()';

//var imgArrowForwardHtml = '<lottie-player src=".\\images\\arrowright.json"  background="transparent"  speed="1"  style="width: 40px; height: 40px;" autoplay loop></lottie-player>';

var zoneFLottanteWidth = 250;
var zoneFLottanteHeigth = 150;


var askBeforeUpdate = false;
var validationButtonPressed = false;

var listeExercice = [];


var nombreExercices = 5;
var niveauDifficulte;
var eleveLycee = false;
