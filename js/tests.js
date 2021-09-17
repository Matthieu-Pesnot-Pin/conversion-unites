function myAlert(err) {
    console.error("erreur : " + err);
}



function testEquality(a, b, successMessage, errorMessage)
{
    if (a == b) console.log(successMessage); else console.error(errorMessage);
}


distanceTestList = [
    ["m","km"],
    // ["m","hm"],
    // ["m","dam"],
    ["m","m"],
    ["m","dm"],
    ["m","cm"],
    ["m","mm"],
    ["m","µm"],
    ["m","nm"],
    // ["m","pm"]

]

vitesseTestList = [
    // ["km/h","km/mn"],
    ["km/h","km/s"],
    ["km/h","km/ms"],
    ["km/h","m/s"],
    ["km/ms","km/s"],
    // ["km/ms","km/mn"],
    ["km/ms","km/h"],
    // ["m/h","m/mn"],
    ["m/h","m/s"],
    // ["m/h","m/ms"]
]

timeTestList = [
    // ["ms","h"],
    // ["ms","mn"],
    // ["ms","s"],
    // ["ms","ms"]

]

testListList = [timeTestList, distanceTestList, vitesseTestList];


function convert_test() {
    console.log("convert_test")
    for (testList of testListList){
        console.log("------------------------------");
        for (conv of testList) {
            var test = new ChampExercice(new Base("1", ""), 0, conv[0]);
            console.log("1"  + conv [0] +" = " + test.convertUnitTo(conv[1]).toString() + " " + conv[1]);
        }
    }
}

//********************** Tests BASE ************************


function base_test() {
(new Base("1234", "5678")).testWith("1234,5678", "toString()");
(new Base("", "5678")).testWith("0,5678", "toString()");
(new Base("1234", "")).testWith("1234,0", "toString()");


// Test de multiplyBy
var factors = [0.11, 1.11, 0.001, 7, 65];
for (f of factors) (new Base("1234", "5678"))
                        .multiplyBy(f) 
                        .testWith((f*1234.5678).toString().replace(".", ","), "multiply " + f);

// Test de x10Exp
var exps = [-1, -11, 0, 1, 11];
for (f of exps) 
{
    var b = new Base("1234", "5678")  
    b.x10Exp(f).testWith((1234.5678 * Math.pow(10, f)).toString().replace(".", ","), "x10Exp(" + f + ")");
}
                    

// Test de fromString
(Base.fromString("1234,5678")).testWith("1234,5678", "fromString()");
(Base.fromString("0,5678")).testWith("0,5678", "fromString()");
(Base.fromString("1234")).testWith("1234,0", "fromString()");
(Base.fromString("1,234e-5")).testWith("0,00001234", "fromString()");

}


//***************************** Test unitClass  ****************************/


function unitclass_test() {

for (var i  =  0; i < 100 ; i++){
    var unit = conversionUnites.randomUnit(ANY_UNIT); 
    var unit2 = conversionUnites.randomUnit(ANY_UNIT);
    if (conversionUnites.type(unit) != conversionUnites.ordresDeGrandeur.get(unit)[TYPE_ARG]) alert("type("+unit+") renvoie le mauvais type");

    if (conversionUnites.isSameCategory(unit, unit2) != 
        (conversionUnites.ordresDeGrandeur.get(unit)[TYPE_ARG]==conversionUnites.ordresDeGrandeur.get(unit2)[TYPE_ARG])) 
            alert("isSameCategory error " + unit + " / " + unit2);
}

// convertFromTo compouned tests    

console.log("-------------------------convertFromTo------------------------------")

if (conversionUnites.convertFromTo("m/s", "m/h") != 3600) 
    myAlert("convertFromTo(m/s, m/h)" + conversionUnites.convertFromTo("m/s", "m/h"));


console.log("-------------------------randomUnit------------------------------")

for (var i = 0; i <1; i++) console.log("Test random DISTANCE_TYPE : " + conversionUnites.randomUnit(DISTANCE_TYPE));
for (var i = 0; i <1; i++) console.log("Test random TIME_TYPE : " + conversionUnites.randomUnit(TIME_TYPE));
for (var i = 0; i <1; i++) console.log("Test random SURFACE_TYPE : " + conversionUnites.randomUnit(SURFACE_TYPE));

for (var i = 0; i <10; i++) console.log("Test random km : " + conversionUnites.randomUnit("km"));
for (var i = 0; i <10; i++) console.log("Test random s : " + conversionUnites.randomUnit("s"));
for (var i = 0; i <10; i++) console.log("Test random m³ : " + conversionUnites.randomUnit("m³"));
        

console.log("Test reconnaissance composée")
console.log(conversionUnites.type("kg/m²"));


console.log("-------------------------randomCompounedUnit------------------------------")

for (var i = 0; i <10; i++) console.log("Test random VITESSE_TYPE : " + conversionUnites.randomUnit(VITESSE_TYPE));
for (var i = 0; i <10; i++) console.log("Test random MASSE_SURFACIQUE_TYPE : " + conversionUnites.randomUnit(MASSE_SURFACIQUE_TYPE));
for (var i = 0; i <10; i++) console.log("Test random MASSE_VOLUMIQUE_TYPE : " + conversionUnites.randomUnit(MASSE_VOLUMIQUE_TYPE));

console.log("--------------------------------------------------------------------------")

for (var i = 0; i <10; i++) console.log("Test random km/h : " + conversionUnites.randomUnit("km/h"));
for (var i = 0; i <10; i++) console.log("Test random g/m² : " + conversionUnites.randomUnit("g/m²"));

console.log("--------------------------------------------------------------------------")

//console.log("Test unité inconnue : ");
//conversionUnites.randomCompounedUnit("klkl");

for (var i = 0; i <10; i++) console.log("Test random : " + conversionUnites.randomUnit(ANY_UNIT));

}


function compareTo_Test() {
    
    function compareToTestEquality(n1, n2){
        if (!n1.compareTo(n2)) 
        console.error("compareTo_test erreur : " 
                        + n1.toString() + " " + n1.unite + " devrait égaler " + n2.toString() + " " + n2.unite
                        + "\nla conversion donne : " + n1.convertUnitTo(n2.unite).toScientific(PRECISION).toString()
                        + " au lieu de " + n2.toString() + " "

                        );
        else console.log("CompareTo " + n1.toString() + " " + n1.unite + ": Test passed");
    }


console.log("\n ----------- comparetTo tests --------------------\n\n");

    compareToTestEquality(
        new ChampExercice(new Base("0", "0000049939"), 6, "mg"),
        new ChampExercice(new Base("4", "9939"), -6, "kg")
    );

    compareToTestEquality(
        new ChampExercice(new Base("1", ""), 0, "nm"),
        new ChampExercice(new Base("1", ""), -9, "m")
    );

    compareToTestEquality(
        new ChampExercice(new Base("123", "456"), 6, "km/h"),
        new ChampExercice(new Base("3", "42933"), 7, "m/s")
    );

    compareToTestEquality(
        new ChampExercice(new Base("1", ""), 0, "m"),
        new ChampExercice(new Base("1", ""), 9, "nm")
    );

}

function test_toScientific() {
    console.log(' ');
    console.log('Scientific 7 : *********************************');
    var strBase = "80,0004567";
    var tChamp = new ChampExercice(Base.fromString(strBase), 0, "km").toScientific(7).toString();
    console.log(strBase + " = " + tChamp); 
    console.log(' ');
    console.log('Scientific 6 : *********************************');
    var strBase = "80,0004567";
    var tChamp = new ChampExercice(Base.fromString(strBase), 0, "km").toScientific(6).toString();
    console.log(strBase + " = " + tChamp); 
    console.log(' ');
    console.log('Scientific 5 : *********************************');
    var strBase = "80,0004567";
    var tChamp = new ChampExercice(Base.fromString(strBase), 0, "km").toScientific(5).toString();
    console.log(strBase + " = " + tChamp); 
    console.log(' ');
    console.log('Scientific 4 : *********************************');
    var strBase = "80,0004567";
    var tChamp = new ChampExercice(Base.fromString(strBase), 0, "km").toScientific(4).toString();
    console.log(strBase + " = " + tChamp); 
    console.log(' ');
    console.log('Scientific 3 : *********************************');
    var strBase = "80,0004567";
    var tChamp = new ChampExercice(Base.fromString(strBase), 0, "km").toScientific(3).toString();
    console.log(strBase + " = " + tChamp); 
}

function testTaillePartieEntiere(a, b, c, d, z) {
    var total = 1000;
    var digitNumber = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < total; i++) {
        var t = Base.random(a, b, c, d, z);
        if (t.toString()[0] != '0')
            digitNumber[t.partieEntiere.length]++;
        else {
            digitNumber[0]++;
        }
    }
    for (let index = 0; index < digitNumber.length; index++) {
        console.log('Nombre à ' + (index) + ' chiffres avant la virgule : ' + (digitNumber[index] / total * 100).toFixed(1) + ' %');
    }
}


function testTaillePartieDecimale(a, b, c, d, z) {
    var total = 1000;
    var digitNumber = [0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < total; i++) {
        var t = Base.random(a, b, c, d, z);
        digitNumber[t.partieDecimale.length]++;
        if (t.partieDecimale.length == 2) console.log(t.toString());
    }
    for (let index = 0; index < digitNumber.length; index++) {
        console.log('Nombre à ' + (index) + ' chiffres après la virgule : ' + (digitNumber[index] / total * 100).toFixed(1) + ' %');
    }
}


function testNombreZerosApresVirgule(a, b, c, d, z) {
    var total = 1000;
    var zerosNumber = [0, 0, 0, 0, 0, 0, 0, 0];
    var nbreNull = 0;
    var nbreDecimalNonNul = 0;
    for (let i = 0; i < total; i++) {
        var t = Base.random(a, b, c, d, z);
        var zeros = 0;
        var j = 0;
        while (t.partieDecimale[j] == "0") {
            zeros ++;
            j++;
        }
        if (zeros > 0) 
            console.log(t.toString());
        zerosNumber[zeros]++; 
        if (t.toString() == "0") nbreNull++;
        if (t.partieEntiere != "0") nbreDecimalNonNul++;
        
    }

    for (let index = 0; index < zerosNumber.length; index++) {
        console.log('Nombre avec ' + (index) + ' 0 après la virgule : ' + (zerosNumber[index] / total * 100).toFixed(1) + ' %');
    }
    console.log('Nombre de nombre nuls : ' + (nbreNull / total * 100).toFixed(1) + ' %');
    console.log('Nombre de nombre partie décimale non nulle : ' + (nbreDecimalNonNul / total * 100).toFixed(1) + ' %');
}



function factorTest(a, b, expected) {
    var resultat = new Map ([[true, "OK"], [false, 'Erreur']]);
    var test = conversionUnites.convertFromTo(a, b) == expected;
    if (test) console.log("Conversion de " + a + " vers " + b + " : " + resultat.get(test));
    else {
        console.error("Conversion de " + a + " vers " + b + " : " + resultat.get(test));
        factorDisplay(a, b);
    }
}

function factorDisplay(a, b) {
    console.log("Conversion de " + a + " vers " + b + " : " + conversionUnites.convertFromTo(a, b));
}

var distanceConversionTest = [
    "km",
    "hm",
    "dam",
    "m",
    "dm",
    "cm",
    "mm",
    "µm",
    "nm"
]

var poidsConversionTest = [
    "kg",
    "g",
    "mg"
]

var volumeConversionTest = [
    "m³",
    "dm³",
    "L",
    "cm³",
    "mL",
    "mm³"
]

var masseVolumiqueConversionTest = [
    "kg/m³",
    "kg/L",
    "g/cm³",
    "g/mL"
]

var dureeConversionTest = [
    "h",
    "mn",
    "s",
    "ms"
]

var vitesseConversionTest = [
    "km/h",
    "m/s"
]


var conversionsList = [
    distanceConversionTest,
    poidsConversionTest,
    volumeConversionTest,
    masseVolumiqueConversionTest,
    dureeConversionTest,
    vitesseConversionTest
]


function displayConversionsFactors(conversionTest) {
    for (let i = 0; i < conversionTest.length; i++) {
        for (let j = 0; j < conversionTest.length; j++) {
            if (i != j) factorDisplay(conversionTest[i], conversionTest[j]);
        }
    }
}


var conversionAProbleme = [
    ["mm", "nm", 1000000],
    // ["µm", "dam", 0.0000001],
    ["µm", "nm", 1000],
    ["µm", "km", 0.000000001],
    // ["nm", "dam", 0.0000000001],
    ["nm", "µm", 0.001],
    ["nm", "m", 0.000000001],
    // ["cm³", "mm³", 1000],
    // ["mL", "mm³", 1000],
    // ["mm³", "mL", 0.001],
    // ["mm³", "m³", 0.000000001]
]
    

function testProblemConversion() {
    for (let i = 0; i < conversionAProbleme.length; i++) {
        const element = conversionAProbleme[i];
        factorTest(element[0], element[1], element[2]);
    }
}



function testZero() {
    var total = 0;
    var nbreTest = 100;
    for (let i = 0; i < 100; i++) {
        var cpt = 0;
        var b = Base.random(3, 2, -4, 6);
        while (b.toFloat() != 0 && cpt < nbreTest) {
            b = Base.random(3, 2, -4, 6);
            cpt ++;
        }
        if (cpt == nbreTest) total ++;
    }
    console.log("Frequence des 0 : " + ((100-total)) + "%");
}



//var test = new ChampExercice(Base.fromString("0,000999"),0, "mL");
//console.log(test.convertUnitTo("mm³").toString());

//for (let i = 0; i < conversionsList.length; i++) displayConversionsFactors(conversionsList[i]);
//displayConversionsFactors(dureeConversionTest);

//testTaillePartieEntiere(3, 0, 0, 0, false);

//testTaillePartieDecimale(5, 20, 0, 0, false);
//testNombreZerosApresVirgule(5, 10, -3, 0, false);


// testProblemConversion();

// convert_test();
// base_test();
// unitclass_test();

// compareTo_Test();
// test_toScientific();
// testZero();


/*
//Recherche problème conversion rare :

console.log(new Base("1", "0").multiplyBy(0.1, DISTANCE_TYPE).toString());    
console.log(new Base("1", "0").multiplyBy(0.01, DISTANCE_TYPE).toString());    
console.log(new Base("1", "0").multiplyBy(0.001, DISTANCE_TYPE).toString());    
console.log(new Base("1", "0").multiplyBy(0.0001, DISTANCE_TYPE).toString());    
console.log(new Base("1", "0").multiplyBy(0.00001, DISTANCE_TYPE).toString());    
console.log(new Base("1", "0").multiplyBy(0.000001, DISTANCE_TYPE).toString());    
console.log(new Base("1", "0").multiplyBy(0.0000001, DISTANCE_TYPE).toString());    
console.log(new Base("1", "0").multiplyBy(0.00000001, DISTANCE_TYPE).toString());    
console.log(new Base("1", "0").multiplyBy(0.000000001, DISTANCE_TYPE).toString());    
console.log(new Base("1", "0").multiplyBy(0.0000000001, DISTANCE_TYPE).toString());    
console.log(new Base("1", "0").multiplyBy(0.00000000001, DISTANCE_TYPE).toString());    
console.log(new Base("1", "0").multiplyBy(0.000000000001, DISTANCE_TYPE).toString());    
console.log(new Base("1", "0").multiplyBy(0.0000000000001, DISTANCE_TYPE).toString());    
console.log(new Base("1", "0").multiplyBy(0.00000000000001, DISTANCE_TYPE).toString());    
console.log(new Base("1", "0").multiplyBy(0.000000000000001, DISTANCE_TYPE).toString());    
console.log(new Base("1", "0").multiplyBy(0.0000000000000001, DISTANCE_TYPE).toString());    
console.log(new Base("1", "0").multiplyBy(0.00000000000000001, DISTANCE_TYPE).toString());    
console.log(new Base("1", "0").multiplyBy(0.000000000000000001, DISTANCE_TYPE).toString());    
console.log(new Base("1", "0").multiplyBy(0.0000000000000000001, DISTANCE_TYPE).toString());    
console.log(new Base("1", "0").multiplyBy(0.00000000000000000001, DISTANCE_TYPE).toString());    
console.log(new Base("1", "0").multiplyBy(0.000000000000000000001, DISTANCE_TYPE).toString());    
console.log(new Base("1", "0").multiplyBy(0.0000000000000000000001, DISTANCE_TYPE).toString());    
console.log(new Base("1", "0").multiplyBy(0.00000000000000000000001, DISTANCE_TYPE).toString());    
console.log(new Base("1", "0001").multiplyBy(0.000000000000000000000001, DISTANCE_TYPE).toString());    

*/

//console.log(new Base("140", "").multiplyBy(conversionUnites.convertFromTo("g", "kg"), DISTANCE_TYPE).toString());

