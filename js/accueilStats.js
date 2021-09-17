    function updateInfosStats() {
        $.get('js/SQL/getInfosStudentSession.php', (data) => {
            console.log('data', data)
            const badgeOK = "images/success.ico";
            const badgeBAD = "images/wrong.ico";

            let infosEleve = JSON.parse(data);

            for (var categorie of infosEleve.categories) {
                for (var i = 0; i < categorie.niveaux.length; i++) {
                    niveau = categorie.niveaux[i];
                    if (niveau.nombreQuestions == -1 || niveau.nombreQuestions / 5 < nombreExercicesAttendus) {
                        $('#infosBadge' + categorie.codeCategorie + (i+1).toString()).attr("src", "images/interrogation.png");
                    } else 
                    if ((niveau.noteUnitaire * 20).toFixed(1) < noteAttendue) {
                        $('#infosBadge' + categorie.codeCategorie + (i+1).toString()).attr("src", badgeBAD);
                    }
                    else {
                        $('#infosBadge' + categorie.codeCategorie + (i+1).toString()).attr("src", badgeOK);
                    }
                }
            }
        })
    }
