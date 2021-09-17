// ****************************************************************************************************************//
// ***************************************       OBSERVATEURS D'EVENEMENTS     ************************************//
// ****************************************************************************************************************//

$('#corpsDePage').hide();

$(window).on('load', () => {
    $('#corpsDePage').show();
})

// Evenements Menu gauche - choix des exercices

for (var i=0; i < onglets.length; i++){
    (function(arg1){   // Closure pour capturer i
         if (arg1 != idOngletUnselectable) {
            onglets[arg1].addEventListener("click", 
                    function (e) {
                        if (askBeforeUpdate) {
                            if (!confirm("Vous n'avez pas validé les réponses. Êtes-vous sûr de vouloir quitter la section ?")) return;
                        }
                
                        $('.enteteOnglets').removeClass('selectedOnglet');
                        $('#' + e.currentTarget.id).addClass('selectedOnglet');
                        updateOnglets(arg1);
                    }
            )
        }
    }) (i) 
};

// Evenements menu gauche - choix du niveau
for (let i = 0; i < 3; i++) {
        let niveau = i+1;
        $('#niveau' + niveau).on("click", 
            function (e) {
                if (askBeforeUpdate) {
                    if (!confirm("Vous n'avez pas validé les réponses. Êtes-vous sûr de vouloir quitter la section ?")) return;
                }
                var thisId = "#" + e.target.id;
                $('.niveauDeDifficulte').removeClass('niveauChoisi');
                $(thisId).addClass('niveauChoisi');
                niveauDifficulte = niveau.toString();
                updateOnglets(selectedOnglet);
            }
        )
}



function validerReponses(){
    // Test des champs réponses (ils doivent être tous remplis)
    for (var numeroQuestion = 0; numeroQuestion < nombreExercices ; numeroQuestion++){
        var reponseElt = document.getElementsByClassName("reponse" + (numeroQuestion+1).toString());
        if (reponseElt[ID_CHAMP_BASE_REPONSE].value == "" || reponseElt[ID_CHAMP_EXP_REPONSE].value == "") {
            alert("Il manque des réponses ! Merci de répondre à toutes les questions");
            return;
        }
    }

    $('#zoneValidation').css("display", "none");
    if (!validationButtonPressed) answersCheck();
    askBeforeUpdate = false;
    validationButtonPressed = true;

}


boutonValiderElt.addEventListener("click", function (e) {
    validerReponses();
})


boutonNouvelExerciceElt.addEventListener("click", function (e) {
    if (askBeforeUpdate)
    if (!confirm("Vous n'avez pas validé les réponses. Êtes-vous sûr de vouloir de nouveaux exercices ?")) return;
    
    $('#zoneExercice').css("background-image",'url("./images/grandtableau.jpg")');

    validationButtonPressed = false;
    askBeforeUpdate = false;
    computeExerciseZone();
});


zoneExerciceElt.addEventListener("keypress", (e) => {
    askBeforeUpdate = !validationButtonPressed;
    if (e.keyCode == 13) validerReponses();
})

$('#seeStatsButton').on('click', () => {
    location.href = 'statistiques.php';
})
