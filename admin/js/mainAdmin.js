$(function() {


// $.get('php/../setroot.php');

const noResultsImg = "<img src=\"..\\images\\wrong.ico\" heigth = 30 width = 30/>";

function displayInfosJSON(ensembleDesResultatsJSON) { 
    var resultats = JSON.parse(ensembleDesResultatsJSON);

    if (resultats.errorMessage != undefined) console.error('Erreur : ' + resultats.errorMessage);

    $('#nomEleve').html("<strong>" + resultats.nomEleve + " " + resultats.prenomEleve+  "</strong> " + resultats.classeEleve)

    $('.infos').css('background-color', 'rgb(104, 212, 85)');

    const catMoyenneId = [
        '#moyenneSC',
        '#moyenneCS',
        '#moyenneCV',
        '#moyenneMV',
        '#moyenneVIT'
    ];

    for (let i = 0; i < 5; i++) {
        if (resultats.categories[i].moyenneCategorie < 0.5) 
        $(catMoyenneId[i]).parent().css('background-color', 'rgb(212, 124, 105)');

    }

    $('#moyenneSC').html((resultats.categories[0].moyenneCategorie * 20).toFixed(1) + " /20");
    $('#moyenneCS').html((resultats.categories[1].moyenneCategorie * 20).toFixed(1) + " /20");
    $('#moyenneCV').html((resultats.categories[2].moyenneCategorie * 20).toFixed(1) + " /20");
    $('#moyenneMV').html((resultats.categories[3].moyenneCategorie * 20).toFixed(1) + " /20");
    $('#moyenneVIT').html((resultats.categories[4].moyenneCategorie * 20).toFixed(1) + " /20");

/*    var data = {
        'niveau': []
    }

    for (let typeEx = 0; typeEx < 5; typeEx++) {
        for (let niveauEx = 0; niveauEx <  resultats.categories[typeEx].niveaux.length; niveauEx++) {
            data.niveau.push([
                resultats.categories[typeEx].niveaux[niveauEx].noteUnitaire.toFixed(2), 
                resultats.categories[typeEx].niveaux[niveauEx].nombreQuestions
            ])
        }        
    }*/

    var data = {
        'id': ensembleDesResultatsJSON.idConnexion
    }

    var dateT = new Date();
    var tmp = dateT.getHours() * 3600 + dateT.getMinutes() * 60 + dateT.getSeconds() + dateT.getMilliseconds()/1000;

    $.get('php/drawHisto.php?id='+ resultats.idConnexion, (ret) => {       
        $("#graphDiv").html("<img id = 'histo' src = 'graph.png?"+ tmp +"'/>");
    })
}
    
    
function displayList(listeEleveJSON) {
//    console.log(listeEleveJSON);
    var listeEleve = JSON.parse(listeEleveJSON)

    // Affichage des titres
    $("#listeEleve").html('');
    if ($('#filterZone').html() == "")
    $('#filterZone')
        .append($("<div>", { 
                    class: 'titleListElement', 
                    text: 'Eleves' }
                )
                .append($('<div>') 
                    .append($('<span>', {text: "badges"}))
                )
        )
        .append($('<div>', {class: "filterOptions"})
            .append($('<div class="filtreClasseContainer">')
                .append($('<div>', {text: 'Classe'}))
                .append($('<select>', {id: 'filtreClasses', class: 'filters'})) // a remplir une fois que les infos auront été collectées
            )
            .append($('<div class="filtreBadgesContainer">')
                .append($('<select>', {id: 'filterBadge1', class: 'filters'})
                    .append($('<option value ="-">-</option>'))
                    .append($('<option value ="0">0</option>'))
                    .append($('<option value ="1">1</option>'))
                    .append($('<option value ="2">2</option>'))
                    .append($('<option value ="3">3</option>'))
                    .append($('<option value ="4">4</option>'))
                    .append($('<option value ="5">5</option>'))
                )
                .append($('<select>', {id: 'filterBadge2', class: 'filters'})
                    .append($('<option value ="-">-</option>'))
                    .append($('<option value ="0">0</option>'))
                    .append($('<option value ="1">1</option>'))
                    .append($('<option value ="2">2</option>'))
                    .append($('<option value ="3">3</option>'))
                    .append($('<option value ="4">4</option>'))
                    .append($('<option value ="5">5</option>'))
                )
            )
    );

    var listeDeClasses = [];

    for (infosEleve of listeEleve){

        // Ajout de la classe de l'élève à la liste
        if (listeDeClasses.indexOf(infosEleve.classeEleve) == -1)
            listeDeClasses.push(infosEleve.classeEleve);
        


        $('#listeEleve')
        
        .append($("<div>", { // Coordonnées Eleves
                    id : infosEleve.idConnexion, 
                    class: 'studentListElement', 
                    text: infosEleve.nomEleve + ' ' + infosEleve.prenomEleve + ' ' + infosEleve.classeEleve }
                )
                .append($('<div>', {class: "badges"}) // Affichage des badges
                    .append($('<div>', {html: infosEleve.studentBadgeContent1, class: 'badge ' + infosEleve.studentBadge1}))
                    .append($('<div>', {html: infosEleve.studentBadgeContent2, class: 'badge ' + infosEleve.studentBadge2}))
                )
        );


        $("#"+infosEleve.idConnexion).click(function(e) { // Rafraichissement des infos après click
            $('.studentListElement').removeClass('selected');
            $("#" + e.target.id).addClass('selected');

            // Appel du fichier php pour obtenir les infos sur l'éleve
            $.get('php/getStudentInfosJSON.php', 'id='+e.target.id, displayInfosJSON);
        })
    }

    // Remplissage des classes lors du permier appel à la fonction
    listeDeClasses.sort();
    if ($('#filtreClasses').html() == ""){
        $('#filtreClasses') 
        .append($('<option value ="-">-</option>'));
        for (classe of listeDeClasses)
                $('#filtreClasses').append($('<option value ="' + classe +'">' + classe + '</option>'));
            
        $('.filters').on('input', (e) => {
            var options = 
            'classe=' + $('#filtreClasses').val()
            + '&badge1=' + $('#filterBadge1').val()
            + '&badge2=' + $('#filterBadge2').val();
            $.get('php/getJsonList.php', options, displayList); // Affichage de la liste des élèves
        })
    }   

    // Délection et affichage des infos du premier élvève de la liste
    $("#" + listeEleve[0].idConnexion).addClass('selected');
    $.get('php/getStudentInfosJSON.php', 'id='+ listeEleve[0].idConnexion, displayInfosJSON);

}

function computePage(idConnexion) {

    // Appel du fichier php pour obtenir les infos sur l'éleve
    $.get('php/getStudentInfosJSON.php', 'id='+idConnexion, displayInfosJSON);

};



$.get('php/getJsonList.php', displayList); // Affichage de la liste des élèves

}) // fin $(function())