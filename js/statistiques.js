$(function () {
    
    var imgSuccessHtmlFixed = "<img src=\".\\images\\success.ico\"></img>";
    var imgWrongHtmlFixed = "<img src=\".\\images\\wrong.ico\"></img>";
    

    $.get('js/SQL/getInfosStudentSession.php', (data) => {
        let infosEleve = undefined;
        try {
            infosEleve = JSON.parse(data);
        } catch {
            window.location = 'index.html';
        }

        // Creation de la page ********************************************
        for (categorie of infosEleve.categories) {
        $('#blackboard')
            .append($('<div>', {class: "details details" + categorie.codeCategorie})
                .append($('<div>', {class: "detailsGauche"})
                    .append($('<div>', {class: "detailsNomExercice", text: categorie.nomCategorie}))
                    .append($('<div>', {class: "detailsGaucheBas"})
                        // .append($('<div>', {class: "detailsMoyenne", id: "detailsMoyenne" + categorie.codeCategorie}))
                    )
                )
                .append($('<div>', {class: "detailsDroite detailsDroite" + categorie.codeCategorie}))
            );

            for (var i = 0; i < categorie.niveaux.length; i ++) {
                $('.detailsDroite' + categorie.codeCategorie)
                    .append($('<div>', {class:"detailsLigneDetails"})
                        .append($('<div>', {class:"imgNiveauValide", id: 'imgNiveauValide' + categorie.codeCategorie + "N" + (i+1)}))
                        .append($('<div>', {class:"detailsNiveau", text: "niveau " + (i+1)}))
                        .append($('<div>', {class:"detailsNombreExercices", id:"detailsNombreExercices" + categorie.codeCategorie + "N" + (i+1)}))
                        .append($('<div>', {class:"detailsHisto detailsHistoN" + (i+1), id:"detailsHisto" + categorie.codeCategorie + "N" + (i+1)}))
                        .append($('<div>', {class:"detailsNote" + (i+1), id:"detailsNote" + categorie.codeCategorie + "N" + (i+1)}))
                    )
            }
        }
        $('#blackboard').append($('<button>', {id:'returnButton', text:'RETOUR'}));

        $('#returnButton').click((e)=>{
            window.location = 'accueil.html';
        });

        // Remplissage de la page ******************************************

        $('#nom').text(infosEleve.nomEleve + " " + infosEleve.prenomEleve);

        for (var categorie of infosEleve.categories) {

            $('#detailsMoyenne' + categorie.codeCategorie).text("Moyenne : " + (categorie.moyenneCategorie * 20).toFixed(1))
            
            for (var i=0; i < categorie.niveaux.length ; i++)
            if ((categorie.niveaux[i].noteUnitaire * 20).toFixed(1) < 10) {
                $('#imgBadge' + categorie.codeCategorie + (i+1)).attr("src", "images/wrong.ico");
                // $('#detailsBadge' + categorie.codeCategorie).attr("src", "images/wrong.ico");
            }
            else {
                $('#imgBadge' + categorie.codeCategorie + (i+1)).attr("src", "images/success.ico");
                // $('#detailsBadge' + categorie.codeCategorie).attr("src", "images/success.ico");
            }

            for (var i = 0; i < categorie.niveaux.length; i ++) {
                var niveau = categorie.niveaux[i];
                var stringEnd = categorie.codeCategorie + 'N' + (i+1);

                $('#detailsHisto' + stringEnd).css('width', niveau.noteUnitaire * 230);
                $('#detailsNote' + stringEnd).text ((niveau.noteUnitaire * 20).toFixed(1))

                var nbreExercices = Math.round(niveau.nombreQuestions / 5);
                var niveauValide = (niveau.noteUnitaire * 20).toFixed(1) >= noteAttendue && nbreExercices >= nombreExercicesAttendus;

                $('#detailsNombreExercices' + stringEnd).text('(nbre ex : ' + nbreExercices + ')');
                $('#imgNiveauValide' + stringEnd).html(niveauValide ? imgSuccessHtmlFixed : imgWrongHtmlFixed);

                if (niveau.noteUnitaire < 0.5) {
                    $('#detailsHisto' + stringEnd).addClass('detailsHistoBAD');
                } else
                if (niveau.noteUnitaire < 0.7) {
                    $('#detailsHisto' + stringEnd).addClass('detailsHistoTranche1');
               } else
                if (niveau.noteUnitaire < 0.9) {
                    $('#detailsHisto' + stringEnd).addClass('detailsHistoTranche2');
                } else {
                    $('#detailsHisto' + stringEnd).addClass('detailsHistoTranche3');
                } 

            }
        }

    })
})