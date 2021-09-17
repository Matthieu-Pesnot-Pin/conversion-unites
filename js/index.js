$(function () {
    // $.get('php/./setroot.php');
        
    $('#enterButton').on('click', (e) => {
        $.get('js/SQL/login.php?id=' + $('#idConnexion').val(), (data) => {
            try {
                data = JSON.parse(data);
            } catch (err) {
                console.error("Erreur de connexion a la BDD : " + err.message + " || Retour BDD : " + data);
            }
            if (data.message != undefined) alert("Eleve introuvable !")

            else if (confirm('Merci de confirmer que vous êtes bien : ' + data.PRENOM_ELEVE + ' ' + data.NOM_ELEVE + ' en ' + data.CLASSE_ELEVE)) 
            {
                location.href = "./accueil.html";
            }
        })
    })

})