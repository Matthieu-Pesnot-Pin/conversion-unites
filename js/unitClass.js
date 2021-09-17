const FACTOR_ARG = 0;
const TYPE_ARG = 1;
const ANY_UNIT = "ANY";
const ANY_SIMPLE_UNIT = "ANY SIMPLE UNIT";
const ANY_COMPOUNED_UNIT = "ANY COMPOUNED UNIT";

const PARAGRAPHE_2B_CONVERSION_UNIT = "PRGPH 2B CONVERSION UNIT";
const PARAGRAPHE_3B_CONVERSION_UNIT = "PRGPH 3B CONVERSION UNIT";
const PARAGRAPHE_4_CONVERSION_UNIT = "PRGPH 4 CONVERSION UNIT";
const LEVEL_2_CONVERSION_UNIT = "LVL2 CONVERSION UNIT";

/*const DISTANCE_TYPE = "DISTANCE";
const VOLUME_TYPE = "VOLUME";
const WEIGHT_TYPE = "POIDS";
const TIME_TYPE = "DUREE";
const SURFACE_TYPE = "SURFACE";*/

/*const VITESSE_TYPE = "VITESSE";
const MASSE_SURFACIQUE_TYPE = "MASSE SURFACIQUE";
const MASSE_VOLUMIQUE_TYPE = "MASSE VOLUMIQUE";*/


var randomCount = 0;

// Unités simples

const DISTANCE_TYPE = 0;
const VOLUME_TYPE = 1;
const WEIGHT_TYPE = 2;
const TIME_TYPE = 3;
const SURFACE_TYPE = 4;


// Type d'unités composées
const VITESSE_TYPE = 5;
const MASSE_SURFACIQUE_TYPE = 6;
const MASSE_VOLUMIQUE_TYPE = 7;



const SIMPLE_UNITS_LIST = [
    DISTANCE_TYPE,
    VOLUME_TYPE,
    WEIGHT_TYPE,
    TIME_TYPE,
    SURFACE_TYPE
]


const COMPOUNED_UNITS_LIST = [
    VITESSE_TYPE,
    MASSE_SURFACIQUE_TYPE,
    MASSE_VOLUMIQUE_TYPE
]

const LEVEL_2_CONVERSION_UNIT_LIST = [
    DISTANCE_TYPE, 
    WEIGHT_TYPE
]

const OVERRIDE_TYPE_CONTROL = 1;

class unitClass {

    constructor (table) {
        this.ordresDeGrandeur = new Map(table); // Création d'un Map à partir d'un Array - voir structure plus bas
        this.forbiddenConv = [];//["h-ms", "ms-h"]; // Liste de conversions interdites

    }

    get(k) {
        return this.ordresDeGrandeur.get(k);
    }
    
    type(a){    // renvoie le type de a
        if (this.ordresDeGrandeur.has(a)) return this.ordresDeGrandeur.get(a)[TYPE_ARG];
        else return "type() : erreur - unite inconnue";
        
    }
    
    isSameCategory(a, b) { // renvoie true si les types de a et b sont les mêmes
        return this.type(a) == this.type(b);
    }

    convertFromTo(a, b, overrideTypeControl){ //renvoie un facteur de conversion de a vers b si les types sont les mêmes, undefined sinon
        if (a.indexOf("/") != -1)  //gestion des unités composées
        {
            var a1 = a.split('/')[0];
            var a2 = a.split('/')[1];
            var b1 = b.split('/')[0];
            var b2 = b.split('/')[1];

            var factorA = this.convertFromTo(a1, a2, OVERRIDE_TYPE_CONTROL);
            var factorB = this.convertFromTo(b1, b2, OVERRIDE_TYPE_CONTROL);

            return factorA / factorB;
        }
        else
        if (this.isSameCategory(a, b)) {
            var output = this.ordresDeGrandeur.get(a)[FACTOR_ARG] / this.ordresDeGrandeur.get(b)[FACTOR_ARG];

           if (this.type(a) == VITESSE_TYPE || this.type(a)== TIME_TYPE) return output;
           

            /*************** Gestion des erreurs d'arrondis  **************/
            /* 
            Problemes identifiés : 
                - Facteur = 1000.0001 au lieu de 1000
                - Facteur = .00010001 au lieu de 0.0001
                - Facteur = .00099999998 au lieu de 0.001
                - Facteur = 1.00001e-6 au lieu de 1e-6
            */
           var toTest = output.toString();

            // ************ Cas ou il y a des 9
            if (toTest.indexOf(9)!=-1) { 
                if (output > 1) return Math.round(output);
                else {
                    var ePos = toTest.indexOf("e");
                    var expNeg = 0;
                    if (ePos != -1) {
                        if (toTest[0] == 9) expNeg = - (parseInt(toTest.slice(ePos+1)) + 1);
                        else expNeg = - parseInt(toTest.slice(ePos+1));
                    } else {
                        while (output < 1) { // recherche du nombre de 0 après la virgule
                            expNeg ++;
                            output *= 10;
                        }
                    }
                    // on part de "0." et on ajoute autant de 0 que nécessaire
                    // Effet de bord : 0.00099999998 donne expNeg = 4. Or l'objectif est 0.001 donc 2 "0" seulement
                    // La boucle doit donc aller de 0 à expNeg -2;
                    toTest = "0."
                    for (let i = 0; i < expNeg-1 ; i++) {
                        toTest += "0";
                    }
                    toTest += "1";
                    return toTest.valueOf();
                }
            } 
            // ************** Cas ou il y plus d'un seul 1 dans la chaîne
            else if (toTest.indexOf(1)!=toTest.lastIndexOf(1)) {

                // On vérifie qu'il n'y a pas de partie "e" et on supprime le 1 en bout de chaîne
                if (toTest.indexOf("e") == -1) return parseFloat(toTest.substr(0, toTest.length - 1));

                // S'il y a une partie "e", le 1 en plus peut en faire partie, par exemple "e-12"
                else {
                    // On sépare la partie base de la partie exposant
                    var floatArray = toTest.split('e');
                    var floatExp = 'e' + floatArray[1];
                    var floatBase = floatArray[0];

                    // S'il y a toujours plus d'un seul 1, on supprime le 1 en bout de chaîne
                    if (floatBase.indexOf("1") != floatBase.lastIndexOf("1")) floatBase = "1";
                    // On recolle le tout
                    return (floatBase + floatExp).valueOf();
                }
            }
            return output;//this.ordresDeGrandeur.get(a)[FACTOR_ARG] / this.ordresDeGrandeur.get(b)[FACTOR_ARG];
        }

        else if (overrideTypeControl == OVERRIDE_TYPE_CONTROL) // si les types sont différents mais que le type n'a pas d'importance
        {
            console.log(a);

            return this.ordresDeGrandeur.get(a)[FACTOR_ARG] / this.ordresDeGrandeur.get(b)[FACTOR_ARG];
        }

        else return undefined;
    }

    randomCompounedUnit(unit) { // Non utilisée, non testée, comportement non prévisible
        if (!isNaN(unit)) // Si unit est un nombre, il s'agit d'un type composée. On prend donc les deux types qui composent le type composé pour choisir les unités du numérateur et du dénominateur
            return conversionUnites.randomUnit(authorizedCompounedTypes[unit][0]) 
            + "/" 
            + conversionUnites.randomUnit(authorizedCompounedTypes[unit][1]) ;
        else // Si c'est une chaîne de caractère
        if (unit == ANY_UNIT) { 
            var compounedType = Base.randomInt(3); // N'importe quelle unité composée parmi les types autorisés
            return conversionUnites.randomUnit(authorizedCompounedTypes[compounedType][0]) 
                    + "/" 
                    + conversionUnites.randomUnit(authorizedCompounedTypes[compounedType][1]) ;
        } else { // Si aucune option, une unité complètement aléatoire en fonction de l'unité passée
            var unitD = unit.split('/')[0];
            var unitN = unit.split('/')[1];

            return conversionUnites.randomUnit(unitD) 
                    + "/" 
                    + conversionUnites.randomUnit(unitN);
        }
    }
    
    randomUnit(option, refUnit){ 

        var unitType;
        var candidates = listeUnites;

        // Si l'argument est ANY_UNIT, on ne modifie pas la liste des unités candidates
        if (option == ANY_UNIT){
        }

        else if (option == ANY_SIMPLE_UNIT){
            candidates = listeUnites.filter(u=>(SIMPLE_UNITS_LIST.indexOf(this.type(u)) != -1));
        }

        else if (option == ANY_COMPOUNED_UNIT){
            candidates = listeUnites.filter(u=>(COMPOUNED_UNITS_LIST.indexOf(this.type(u)) != -1));
        }

        // Si on veut une unité du niveau 1 de l'exerice conversion
        // Soit il n'y a pas d'unité transmise, et on renvoie une unité prise dans la liste 
        // CONVERSION_PARAGRAPHE_2B_UNITS_LIST, soit on renvoie une des unités associées à l'unité transmise (pour la cohérence de la question)
        else if (option == PARAGRAPHE_2B_CONVERSION_UNIT){
            if (refUnit == undefined){
                candidates = listeUnites.filter(u=>(Array.from(CONVERSION_PARAGRAPHE_2B_UNITS_LIST.keys()).indexOf(u) != -1));
            }
            else {
                candidates = CONVERSION_PARAGRAPHE_2B_UNITS_LIST.get(refUnit);
            }
        }

        else if (option == PARAGRAPHE_3B_CONVERSION_UNIT){
            if (refUnit == undefined){
                candidates = listeUnites.filter(u=>(Array.from(CONVERSION_PARAGRAPHE_3B_UNITS_LIST.keys()).indexOf(u) != -1));
            }
            else {
                candidates = CONVERSION_PARAGRAPHE_3B_UNITS_LIST.get(refUnit);
            }
        }

        else if (option == LEVEL_2_CONVERSION_UNIT){
            candidates = listeUnites.filter(u=>(LEVEL_2_CONVERSION_UNIT_LIST.indexOf(this.type(u)) != -1 && distanceLevel2ForbiddenUnits.indexOf(u) == -1));
        }
        // Si l'argument n'est pas un des choix précédents et est un nombre
        // Alors il s'agit d'un type d'unité (distance, volume, etc...)
        // La fonction renvoie alors une unité choisie aléatoirement dans la liste d'unité
        // du type spécifié
        else if (!isNaN(option)) {  
            var listeDuBonType = listeUnites.filter(key => this.type(key) == option);
            return listeDuBonType[Math.floor(Math.random() * listeDuBonType.length)];
        }

        else if (!(this.ordresDeGrandeur.has(option))) 
        {
            myAlert("Erreur RandomUnit : unité de référence inconnue : " + option);
            return -1;
        }
        else {
            unitType = this.ordresDeGrandeur.get(option)[TYPE_ARG]
            candidates = listeUnites.filter(u=>(this.type(u) == unitType) && (u!=option));
        }

    return candidates[Base.randomInt(candidates.length)];
    }

    getUnitList (unit1, unit2){ // renvoie un tableau avec la listes des unités comprises entre unit1 et unit2
        if (!this.isSameCategory(unit1, unit2)) { console.error("getUnitList : les unités sont de type différents : " + unit1 + ' / ' + unit2); return -1}
        var direction = 1;
        if (this.convertFromTo(unit1, unit2) < 1)  {
            var tmp = unit1;
            unit1 = unit2;
            unit2 = tmp;
            direction = -1;
        }
        var unitList = [direction, unit1];
        var position = listeUnites.indexOf(unit1);
        while (listeUnites[position] != unit2 && position >=0 && position < listeUnites.length){
            position ++;
            if (this.convertFromTo(listeUnites[position], listeUnites[position-1]) != 1){
                var factor = 
                unitList.push(listeUnites[position]);
            }
        }
        unitList[unitList.length - 1] = unit2;
        return unitList;
    }

    conversionFactorExpToHtml(startUnit, destUnit) // renvoie 10^factor au format HTML
    {
        var exp = Math.round(Math.log10(this.convertFromTo(startUnit, destUnit)));
        return (exp != 0)?
        "<span>"
            + "10"
        + "</span>"
        + "<sup>"
            + exp
        + "</sup> ":"";
    }

    uniteFormatLycee(unit) {
        if (COMPOUNED_UNITS_LIST.indexOf(this.type(unit)) == -1) {
            return unit
        }
        else {
            var unitNum = unit.split('/')[0];
            var unitDen = unit.split('/')[1];

            if (unitDen.indexOf('²') != -1 || unitDen.indexOf('³') != -1) {
                unitDen = unitDen.replace('²', '<sup>-2</sup>').replace('³', '<sup>-3</sup>');
            } else unitDen += '<sup>-1</sup>'

            return unitNum + "." + unitDen;
        }
    }
}

// Table de facteur de conversion. 

const authorizedCompounedTypes = [
    [DISTANCE_TYPE, TIME_TYPE],
    [WEIGHT_TYPE, SURFACE_TYPE],
    [WEIGHT_TYPE, VOLUME_TYPE]

]

const distanceUnitPosInConvArray = ["km3", "km2", "km1", "km", "hm", "dam", "m", "dm", "cm", "mm", "mm1", "mm2", "µm", "µm1", "µm2", "nm", "nm1", "nm2"];
const distanceImportantUnit = ["km", "m","mm", "µm", "nm"];
const distanceLevel2ForbiddenUnits = ["km", "hm", "dam"];

const weightUnitPosInConvArray = ["kg3", "kg2", "kg1", "kg", "kg1", "kg2", "g", "g1", "g2", "mg", "mg1", "mg2"];
const weightImportantUnit = ["kg", "g", "mg"];

const volumeUnitPosInConvArray = ["", "", "", "m³", "", "", "dm³", "", "", "cm³", "", "", "mm³", "", "", ""];
const volumeUnitPosInConvArrayL2 = ["", "", "", "m³", "", "", "L", "", "", "mL", "", "", "", "", "", ""];
const volumeImportantUnit = ["m³", "dm³", "cm³", "mm³"];
const volumeEquivalenceMap = new Map([
    ["m³", "m³"],
    ["dm³", "dm³"],
    ["L", "dm³"],
    ["cm³", "cm³"],
    ["mL", "cm³"],
    ["mm³", "mm³"]

])

const conversionParagraphe2BUnitsArray = [
    ["m", ["nm", "mm", "km"]],
    ["nm", ["m"]],
    ["mm", ["m"]],
    ["km", ["m"]],
]

const conversionParagraphe3BUnitsArray = [
    ["dm³", ["L", "m³", "cm³"]],
    ["L", ["dm³"]],
    ["cm³", ["mL", "dm³"]],
    ["mL", ["cm³"]],
    ["m³", ["dm³"]]
]

const conversionTable = [

    // ["km", [100000, DISTANCE_TYPE]],
    // // ["hm", [10000, DISTANCE_TYPE]],
    // // ["dam",[1000, DISTANCE_TYPE]],
    // ["m",  [100, DISTANCE_TYPE]],
    // ["dm", [10, DISTANCE_TYPE]],
    // ["cm", [1, DISTANCE_TYPE]],
    // ["mm", [0.1, DISTANCE_TYPE]],
    // ["µm", [0.0001, DISTANCE_TYPE]],
    // ["nm", [0.0000001, DISTANCE_TYPE]],

    ["km", [1000, DISTANCE_TYPE]],
    ["m",  [1, DISTANCE_TYPE]],
    ["dm", [0.1, DISTANCE_TYPE]],
    ["cm", [0.01, DISTANCE_TYPE]],
    ["mm", [0.001, DISTANCE_TYPE]],
    ["µm", [0.000001, DISTANCE_TYPE]],
    ["nm", [0.000000001, DISTANCE_TYPE]],

    ["g", [1,WEIGHT_TYPE]],
    ["kg",[1000,WEIGHT_TYPE]],
    ["mg",[0.001,WEIGHT_TYPE]],

    ["m³", [1000, VOLUME_TYPE]],
    ["dm³",[1, VOLUME_TYPE]],
    ["L",  [1, VOLUME_TYPE]],
    ["cm³",[0.001, VOLUME_TYPE]],
    ["mL", [0.001, VOLUME_TYPE]],
    // ["mm³",[0.000001, VOLUME_TYPE]],

    ["h",  [3600, TIME_TYPE]],
    ["min", [60, TIME_TYPE]],
    ["s",  [1, TIME_TYPE]],
    ["ms", [0.001, TIME_TYPE]],

    ["km²",  [100000000, SURFACE_TYPE]],
    ["hm²",  [1000000, SURFACE_TYPE]],
    ["dam²", [10000, SURFACE_TYPE]],
    ["m²",   [100, SURFACE_TYPE]],
    ["dm²",  [1, SURFACE_TYPE]],
    ["cm²",  [0.01, SURFACE_TYPE]],
    ["mm²",  [0.0001, SURFACE_TYPE]],
    ["µm²",  [0.0000000001, SURFACE_TYPE]],

    ["km/h", [1, VITESSE_TYPE]],
    ["m/s",  [1, VITESSE_TYPE]],

    ["kg/m²",  [1, MASSE_SURFACIQUE_TYPE]],
    ["kg/cm²", [1, MASSE_SURFACIQUE_TYPE]],
    ["g/m²",   [1, MASSE_SURFACIQUE_TYPE]],
    ["g/cm²",  [1, MASSE_SURFACIQUE_TYPE]],
    ["g/mm²",  [1, MASSE_SURFACIQUE_TYPE]],
    ["mg/mm²", [1, MASSE_SURFACIQUE_TYPE]],

    ["kg/m³", [1, MASSE_VOLUMIQUE_TYPE]],
    ["kg/L",  [1, MASSE_VOLUMIQUE_TYPE]],
    ["g/cm³",  [1, MASSE_VOLUMIQUE_TYPE]],
    ["mg/L",  [1, MASSE_VOLUMIQUE_TYPE]],
    ["g/mL",  [1, MASSE_VOLUMIQUE_TYPE]]
    
]


const conversionUnites = new unitClass(conversionTable);
const listeUnites = Array.from(conversionUnites.ordresDeGrandeur.keys());
const CONVERSION_PARAGRAPHE_2B_UNITS_LIST = new Map(conversionParagraphe2BUnitsArray);
const CONVERSION_PARAGRAPHE_3B_UNITS_LIST = new Map(conversionParagraphe3BUnitsArray);






