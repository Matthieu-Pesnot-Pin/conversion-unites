// ****************************************************************************************************************//
// ***********************************    FONCTIONS DE RENDU D'EXERCICE    ****************************************//
// ****************************************************************************************************************//


function renderExercise(numeroQuestion, nombreAConvertir, uniteDestination) {
    
    
    listeExercice.push(new Exercice(nombreAConvertir, uniteDestination));

    // var champCorrection = "<span class = \"correctionImg ex"  + numeroQuestion + "\" id = \"corr"  + numeroQuestion + "\"></span>";
    var champCorrection = "<span class = \"correctionImg\" \" id = \"corr"  + numeroQuestion + "\"></span>";

    var question = 
    "<span class=\"question\">" 
        + numeroQuestion.toString() + ") " 
            + nombreAConvertir.toHTML("class = \"ex" + numeroQuestion.toString()+"\"")
        + "  =  "
    + "</span>";

    
    var champReponse = 
        "<span class = \"reponse\">"
        //  + ChampExercice.inputHTML("class = \"ex" + numeroQuestion.toString()+" hoverReact\"", uniteDestination, nombreAConvertir.base)
          + ChampExercice.inputHTML("class = \"reponse" + numeroQuestion.toString()+"\"", uniteDestination, nombreAConvertir.base)
         + "</span>";

    
    return  "<p class = \"ligneComplete\">"
        + champCorrection 
        + "<span class = \"exercice\">" 
        + question 
        + champReponse
        + "</span></p>";

}



// function renderScientificExercise(numeroQuestion, nombreAConvertir) { // Ne sert plus 

//     var champCorrection = "<span class = \"ex"  + numeroQuestion + "\" id = \"corr"  + numeroQuestion + "\"></span>";
    
//     var question = 
//     "<span class=\"question\">"
//     + numeroQuestion.toString() + ") " 
//             + nombreAConvertir.toHTML("class = \"ex" + numeroQuestion.toString()+"\"")
//         + " = "
//     + "</span>";

//     var champReponse = 
//         "<span class = \"reponse\">"
//             + ChampExercice.inputHTML("class = \"ex" + numeroQuestion.toString()+" hoverReact\"")
//             + nombreAConvertir.unite
//         + "</span>";


//     return  "<p class = \"ligneComplete\">"
//                 + champCorrection 
//                 + "<span class = \"exercice\">" 
//                     + question 
//                     + champReponse
//                 + "</span>"
//             + "</p>";
// }

// function renderConversionExercise(numeroQuestion, nombreAConvertir) { // Ne sert plus
    
//     var champCorrection = "<span class = \"correctionImg ex"  + numeroQuestion + "\" id = \"corr"  + numeroQuestion + "\"></span>";

//     var question = 
//     "<span class=\"question\">" 
//         + numeroQuestion.toString() + ") " 
//             + nombreAConvertir.toHTML("class = \"ex" + numeroQuestion.toString()+"\"")
//         + "  =  "
//     + "</span>";

    
//     var champReponse = 
//         "<span class = \"reponse\">"
//          + ChampExercice.inputHTML("class = \"ex" + numeroQuestion.toString()+" hoverReact\"", conversionUnites.randomUnit(nombreAConvertir.unite))
//          + "</span>";

    
//     return  "<p class = \"ligneComplete\">"
//         + champCorrection 
//         + "<span class = \"exercice\">" 
//         + question 
//         + champReponse
//         + "</span></p>";

// }

// function renderConversionComplexeExercise(numeroQuestion, nombreAConvertir) { // Ne sert plus

//     var champCorrection = "<span class = \"ex"  + numeroQuestion + "\" id = \"corr"  + numeroQuestion + "\"></span>";
   
//     var question = 
//     "<span class=\"question\">"
//     + numeroQuestion.toString() + ") " 
//             + nombreAConvertir.toHTML("class = \"ex" + numeroQuestion.toString()+"\"")
//         + "  =  "
//     + "</span>";

    
//     var champReponse = 
//         "<span class = \"reponse\">"
//         + ChampExercice.inputHTML("class = \"ex" + numeroQuestion.toString()+" hoverReact\"", conversionUnites.randomUnit(nombreAConvertir.unite))
//         + "</span>";

   
// /*    return "<p class = \"exercice\">" 
//                 + question 
//                 + champReponse
//          + "</p>";*/
//     return  "<p class = \"ligneComplete\">"
//         + champCorrection 
//         + "<span class = \"exercice\">" 
//         + question 
//         + champReponse
//         + "</span></p>";

// }