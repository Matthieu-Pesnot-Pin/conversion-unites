function addStudent(nom, prenom, idConnexion, classe) {
    ajaxGet('../js/SQL/addname.php?nom=' + nom + '&classe=' + classe + '&prenom=' + prenom + '&id=' + idConnexion, function (r) {console.log(r)});
}

/*function randomFill(min) {
    var studentList = [
        "Laude",
        "Pin", 
        "Nouvelot",
        "PEROVA",
        "Churina",
        "Borozdina",
        "Shanti", 
        "Panico",
        "LaudeA",
        "Lall",
        "Antoine",
        "RobertJ",
        "Braque",
        "Bouju",
        "Petit",
        "Fanfouette"
    ]

    var data = {
        idConnexion : studentList[Base.randomInt(studentList.length)],
        typeTest : Base.randomInt(5),
        difficulteTest : Base.randomInt(3),
        nbQuestions : 10,
        nbCorrect : Base.randomInt(11 - min) + min
    };

     var fData = new FormData();

    for(name in data) {
        fData.append(name, data[name]);
    }

    ajaxPost('ajouts.php', fData, function (rep) { 
        console.log("Resultats du post : " + rep);
        rep.replace(/[^NID]/g, '') =='NID'?console.log('Eleve introuvable'):console.log('Resultats enregistrés' + rep)
    });


}*/

function randomFill() {

    $.get('php/getJsonList.php', (data) => {
        var liste = JSON.parse(data);
        var listeId = [];
        for (eleve of liste) listeId.push(eleve.idConnexion);

        
        for (eleve of listeId) {
            for (let i = 1; i < 5; i++) {
                for (let j = 0; j < 1; j++) {
                    var min = Base.randomInt(4);
                    var data = {
                        testDate: (i*3).toString(),
                        idConnexion : eleve,
                        typeTest : Base.randomInt(5),
                        difficulteTest : Base.randomInt(3),
                        nbQuestions : 10,
                        nbCorrect : Base.randomInt(11 - min) + min
                    };
                
                    var fData = new FormData();
                
                    for(name in data) {
                        fData.append(name, data[name]);
                    }

              
                    ajaxPost('ajouts.php', fData, function (rep) { 
                        rep.replace(/[^NID]/g, '') =='NID'?console.log('Eleve introuvable'):console.log('Resultats enregistrés' + rep)
                    });
                }
            }
        }
        console.log('Ajouts terminés !');
    })
}


function superRandomFill() {
    for (var i = 0 ; i < 100; i ++) {
        var min = Base.randomInt(4);
        for (let i = 0; i < 10; i++) {
            randomFill(min);
        }
    }
}

/*addStudent("Laude","Juliette","Laude", "5eC");
addStudent("Pesnot-Pin","Matthieu","Pin", "5eC");
addStudent("Nouvelot", "Rémi","Nouvelot", "3eE");
addStudent("Perova", "Yulia","PEROVA","3eD");
addStudent("Churina", "Maria","Churina","4eF");
addStudent("Borozdina", "Maria","Borozdina","4eG");
addStudent("Shanti", "Filou","Shanti","3eC");
addStudent("Panico", "Hugo","Panico","3eC");
addStudent("Lallemand", "Marco","Lall","6eA");
addStudent("Laude", "Ariane","LaudeA","3eB");
addStudent("Antoine", "Eric","Antoine","3eE");
addStudent("Robert", "Julie","RobertJ","6eA");
addStudent("Braque De La Perrière", "Ludovic","Braque","4eF");
addStudent("Bouju", "Yves","Bouju","4eG");
addStudent("Petit", "Corentin","Petit","3eD");
addStudent("Fanfouette", "Francine","Fanfouette","3eE");*/


$('#addRandom').click(() => {
    randomFill();
})

//addStudent("Eleve", "Test","Test1","1eT");
//$.get('php/../setroot.php');


