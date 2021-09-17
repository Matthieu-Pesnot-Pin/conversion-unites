$(function () {

var currentStudentModifId = 0;

// $.get('php/../setroot.php');

const noFilter = '-';

const loaderInline = '<lottie-player id="lottieRestoreLoader" src="..\\images\\loader-inline.json"  background="transparent"  speed="1"  style="width: 40px; height: 40px;" autoplay loop></lottie-player>';



var filtreClasse = noFilter;
var filtreExercice = noFilter;
var filtreNiveau = noFilter;
var filtreOperateur = noFilter;
var filtreNoteRef = "15";
var filtreOperateurNombreExercices = noFilter;
var filtreNombreExercicesRef = 3;
var getProgressionRestaurationHandler = undefined;
var ipCheckResult = undefined;

var listeCompleteEleve = [];

class ModifReturns {
    constructor() {
        this.state = {
            message: "erreur inconnue",    
            status: "danger"
        }
    }

    setMessage(m) {
        this.state.message = m;
    }
    setStatus(s) {
        this.state.status = s;
    }
}

var returnModif = new ModifReturns();

$('.nav-link').click((e) => {
    $('.nav-link').removeClass('active');
    $('#' + e.target.id).addClass('active');
})

function clearModifInputs() {
    $('#nomEleveInput').val(""),
    $('#prenomEleveInput').val(""),
    $('#classeEleveInput').val(""),
    $('#idConnexionEleveInput').val("")
    currentStudentModifId = "";
    $('.modifMessage').hide();

}

Vue.component('eleve', {
    template: '#eleve-template',
    props: { 
        eleve : Object,
        displayBadge: Boolean
    }
})

Vue.component('ligne-bulles',  {
    template:'#ligneBulles',
    props: ['liste_bulles'],
    methods: {
        moyenne (catNumber) {
            return (this.liste_bulles[catNumber].moyenneCategorie * 20).toFixed(1);
        },
        catSuccess(catNumber) {
            return this.liste_bulles[catNumber].moyenneCategorie >= 0.5 ?
                "moyenneOK" : "moyenneBAD";
        }
    }
})

Vue.component('liste-deroulante', {
    template: '#liste-template',
    props: ['list_label', 'list_options', 'type_filtre'],
    methods: {
        uniqId (index) {
            var expr = / /g;
            index = index.toString().replace(expr, '_');
        
            return this.list_label + "-" + index;
        }
    }
})

var infosresultat = {
    template: '#infos-resultat',
    data: () => {
        return {
            state: returnModif.state,
        }
    },
    computed: {
        classMessage() {
            return "modifMessage alert alert-" + this.state.status;
        }
    }
}

function classeTitle () {
    return filtreClasse == '-' ? "Classe": filtreClasse
}

function afficherBarreProgression(message) {
    modaleTemplate(`
    <div id='modaleInfosContainer' class = 'divTextCenter'>
        <h6>${message}</h6>
        <h6 id='affichagePourcentage'></h6>
        <div id='barreProgressionContainer'>
        <div id="barreProgression"></div>
        </div>
    </div>`);
    empecherQuitterModale();
    setModale(400, 200);
    initModale();

    centerModale();
    $('#barreProgression').css('width', '0px');
    $('#affichagePourcentage').text('0%');
    afficherModale();
    getProgressionRestaurationHandler = setInterval(function () { 
        $.get('php/_progressionRestauration.php', null, (progressionJSON)=>{
            progression = JSON.parse(progressionJSON);
            $('#barreProgression').css('width', Math.round(progression.pourcentage * 200).toString() + 'px');
            $('#affichagePourcentage').text(Math.round(progression.pourcentage * 100) + '%');
            if (progression.pourcentage == 1) {
                clearInterval(getProgressionRestaurationHandler);
                $('#loader-inline').css('display', 'none');
                masquerModale();
                modaleAlert('Restauration terminée !', false, ()=>{ router.push('/mainpage'); });
            } else if (progression.pourcentage == -1) {
                clearInterval(getProgressionRestaurationHandler);
                $('#loader-inline').css('display', 'none');
                masquerModale();
                modaleAlert('La restauration a échoué ! Il est néanmoins possible que la base aie été partiellement restaurée', false, ()=>{ router.push('/mainpage'); });
            }
        })
    }, 500);
}

const mainpage = Vue.component('main_page', {
    template: '#mainPage',
    props: ['liste', 'liste_de_categories', 'liste_de_classes', 'liste_de_badges'],
    mounted: function () {
        filtreExercice = noFilter;
        filtreNiveau = noFilter;
        filtreOperateur = noFilter;
        filtreOperateurNombreExercices = noFilter;
        getProgressionRestaurationHandler = undefined;

        $('#saisieNoteRef').val(filtreNoteRef);

        $('#loader').css('display', 'none');
        if (listeCompleteEleve != undefined) createPage(listeCompleteEleve);
        $('#Classe').text(classeTitle());
        setTimeout(() => {
            //$('body').trigger('readyToAffectMainPageEvents');    
            recompute();
            createMainPageEvents();
        }, 100);

    }
})

const modificationpage = Vue.component('modification_page', {
    template: '#modificationPage',
    props: ['liste', 'liste_de_categories', 'liste_de_classes', 'liste_de_badges'],
    data: () => {
        return {
            modificationMode: 'modification'
        }
    },
    components: {
        infosresultat
    },
    computed: {
        modifModeTitle() {
            if (this.modificationMode == 'modification') return "Modifier un élève"; 
            else if (this.modificationMode == 'add') return "Ajouter un élève"; 
        },
        modifModeButtonLabel() {
            if (this.modificationMode == 'modification') return "Mode ajout d'élève"; 
            else if (this.modificationMode == 'add') return "Mode modification"; 
        },
        modifButtonLabel() {
            if (this.modificationMode == 'modification') return "Valider changements"; 
            else if (this.modificationMode == 'add') return "Ajouter"; 
        }
    },
    methods: {
        setModifMode(mode) {
                this.modificationMode = mode;
        },
        modifyMode() {
            this.modificationMode = this.modificationMode == 'modification' ? 'add' : 'modification';
            clearModifInputs();
        },
        supressStudent() {
            var eleve = {
                nomEleve : $('#nomEleveInput').val(),
                prenomEleve : $('#prenomEleveInput').val(),
                classeEleve : $('#classeEleveInput').val(),
                idConnexion : currentStudentModifId
            }

            if (confirm(
                    "ATTENTION : vous êtes sur le point de supprimer l'élève avec l'identifiant " 
                    + currentStudentModifId
                    + ". Cette action supprimera également tous les exercices enregistrés associés à cet élève. Etes vous sûr de vouloir continuer ?"
                )) {
                    $.post('php/supprimeeleve.php', eleve, (data) => {
                        var modifResult = JSON.parse(data);
                        returnModif.setMessage(modifResult.message);
                        returnModif.setStatus(modifResult.status);
                        if (modifResult.success) recompute();
                    })
            } else {
                returnModif.setMessage("Eleve non supprimé");
                returnModif.setStatus("warning");
            }

            $('.modifMessage').show();
        },
        modifyStudent() {
            var eleve = {
                nomEleve : $('#nomEleveInput').val(),
                prenomEleve : $('#prenomEleveInput').val(),
                classeEleve : $('#classeEleveInput').val(),
                idConnexion : $('#idConnexionEleveInput').val()
            }
            var recapModifs = {
                typeModif: this.modificationMode,
                startId: currentStudentModifId,
                nouveauNom: eleve.nomEleve,
                nouveauPrenom: eleve.prenomEleve,
                nouvelleClasse: eleve.classeEleve,
                nouvelId: eleve.idConnexion
            }
            $.post('php/modifeleve.php', recapModifs, (data) => {
                var modifResult = JSON.parse(data);
                returnModif.setMessage(modifResult.message);
                returnModif.setStatus(modifResult.status);
                if (modifResult.success) {
                    recompute();
                }
                $('.modifMessage').show();
            })
        }
    },
    mounted: function () {
        filtreNiveau = noFilter;
        filtreOperateur = noFilter;
        filtreExercice = noFilter;
        filtreOperateurNombreExercices = noFilter;

        $('.modifMessage').hide();
        $('#Classe').text(classeTitle());
        $('#loader').css('display', 'none');
        //this.setModifMode('modification');
         $('body').bind('switchToModifMode', () => {
             this.setModifMode('modification');
         })
        setTimeout(() => {
            //$('body').trigger('readyToAffectModifEvents');    
            recompute();
            createModifPageEvents();
            clearModifInputs();
        }, 100);
    }
})

const importpage = Vue.component('import_page', {
    template: '#importPage',
    props: [],
    data: () => {
        return { saveIsChecked: true }
    },
    methods: {
        afficherFenetreProgression(event) {
            if ($('#boutonChoixListeImport').val() == '') {
                event.preventDefault();
                alert('Aucun fichier choisi !');
            } else {
                afficherBarreProgression('Import en cours (cette opération peut prendre quelques minutes - ne fermez pas la page)');
            }
        }
    },
    computed: {
        bgcolor() {
            if (this.saveIsChecked == false) return "alert alert-danger"//"bg-attention"
            else return "alert alert-success";//"bg-ok";
        }
    },
    mounted: function () {
        $('#loaderImport').css('display', 'none');
    }
})

const restorepage = Vue.component('restore_page', {
    template: '#restorePage',
    data: () => {
        return {
            databaseList: [], 
            DBSelected: false,
            DBFileSelected: "no-base", 
            disclaimerNotChecked: false
        }
    }, 
    methods: {
        uniqId(index) {
            return "DBFile" + index;
        },
        DBClicked(index) {
            this.DBSelected = true;
            this.DBFileSelected = $('#DBFile' + index).text();
        },
        displayLoader() {
            console.log( $('#DBFileName-userExported').val() == '');
            if ($('#understood').prop("checked") && $('#DBFileName-userExported').val() != '') { 
                // $('#loader-inline').html("Restauration en cours (cette opération peut prendre quelques minutes)<br>" + loaderInline);
                $('#loader-inline').css('display', 'block');
            }
        },
        restoreDB() {
            this.disclaimerNotChecked = !$('#understood').prop("checked");
            if ($('#understood').prop("checked")) { 
                afficherBarreProgression('Restauration en cours (cette opération peut prendre quelques minutes - ne fermez pas la page)');
                $.get('php/restoreauto.php?DBFile=exports/' + this.DBFileSelected, () => { verificationDesIP() });
                
            }
        }
    },
    mounted: function () {
        $.get('php/exporteddatabaselist.php', (data) => {
            this.databaseList = JSON.parse(data).databaseList;
        })
    }
})

const ipcheck = Vue.component('ip_check', {
    template: '#ipCheck',
    data: () => {
        return {
            ipCheckResult: [],
            listeSuspectsAAfficher: []
        }
    },
    computed: {
        aucunMefaits() {
            return (this.listeSuspectsAAfficher == undefined || this.listeSuspectsAAfficher.length == 0);
        }

    },
    mounted: function () {
        
        this.listeSuspectsAAfficher = ipCheckResult;
        $(document).off('ipCheckDone');
        $(document).on('ipCheckDone',() => {
            this.listeSuspectsAAfficher = ipCheckResult;
            console.log('this.listeSuspectsAAfficher ', this.listeSuspectsAAfficher )
            
            
        })
        //verificationDesIP();
    }
})

var router = new VueRouter ({
    routes: [
        {
            path:'/mainpage', 
            component: mainpage,
            name: 'mainpage',
            props: true
       },
        {
            path: '/import',
            component: importpage,
            name:'importpage'
       },
       {
            path: '/modification',
            component: modificationpage,
            name:'modificationpage'
       },
       {
            path: '/restore',
            component: restorepage,
            name:'restorepage'
       },
       {
            path: '/ipcheck',
            component: ipcheck,
            name:'ipcheck'
        },

       { 
           path: '/', redirect: '/mainpage' 
        }
   ],
})

var app = new Vue ({
    router: router,
    
    el: '#app',

    data: {
        messageModif: "test",
        modifStatusReturn: "success",
        liste: [],
        listeDeClasses: ['-'],
        listeDeBadges: ['-', 0, 1, 2, 3, 4, 5],
        listeDeCategories: []
    },

    methods: {
        computeClasseList: function () {
            for (eleve of this.liste) {
                if (this.listeDeClasses.indexOf(eleve.classeEleve) == -1) this.listeDeClasses.push(eleve.classeEleve);
            }

            this.listeDeClasses.sort((a, b) =>{
                if (a[0] != b[0]) return parseInt(b[0]) - parseInt(a[0]);
                else return (a.charCodeAt(a.length-1)) - (b.charCodeAt(a.length-1));
            });

            setTimeout(() => {
                $('body').trigger('readyToAffectItemsEvents');    
            }, 100);
                    
        },
        
    },

    mounted: function () {
        this.computeClasseList();
    }
})


function createPage(infosEleves) {
    $('.dropdown-item').unbind('click');
    $('.eleve').unbind('click');
    listeCompleteEleve = infosEleves;
    if (app != undefined) {
        app.liste = infosEleves;
        app.computeClasseList();
        if (app.liste.length > 0) displayStudentInfos(app.liste[0]);
    }
}


function displayStudentInfos (eleve) {
    $('#nomEleve').html(eleve.nomEleve + ' ' + eleve.prenomEleve + '&nbsp;' + '<strong>' + eleve.classeEleve + '</strong><br><small>(id connexion : ' + eleve.idConnexion + ')</small>');
    app.listeDeCategories = eleve.categories;
        $.post('php/drawHisto.php', eleve, (ret) => {   
            var dateT = new Date();
            var timestamp = dateT.getHours() * 3600 + dateT.getMinutes() * 60 + dateT.getSeconds() + dateT.getMilliseconds()/1000;
            $("#graphDiv").html("<img id = 'histo' src = 'graph.png?"+ timestamp +"'/>");
        })
}


function createMainPageEvents() {
    $('.eleve').unbind('click');
    $(".eleve").click((e) => {
        $(".eleve").removeClass('active');
        $('#' + e.currentTarget.id).addClass('active');
        eleve = app.liste.filter((eleve) => { return eleve.idConnexion == e.currentTarget.id})[0];
        displayStudentInfos(eleve);
        // $.get('php/getStudentInfosJSON.php?id=' + e.currentTarget.id, (data) => { displayStudentInfos(JSON.parse(data)) });
    })

    // ******* Evenements champs de saisie filtres (moyenne et nombre exercices)

    $('.dropdown-item').unbind('click');

    /********* Moyenne */
    $('#saisieNoteRef').unbind('focusout');
    $('#saisieNoteRef').unbind('keypress');

    $('#saisieNoteRef').focusout((e) => {
        filtreNoteRef = $('#saisieNoteRef').val();
        recompute();
    });

    $('#saisieNoteRef').on('keypress', (e) => {
        if(e.which == 13) {
            filtreNoteRef = $('#saisieNoteRef').val();
            recompute();
        }
    });

    /********* Moyenne Nbre exercices*/

    $('#saisieNombreExercices').unbind('focusout');
    $('#saisieNombreExercices').unbind('keypress');

    $('#saisieNombreExercices').focusout((e) => {
        filtreNombreExercicesRef = $('#saisieNombreExercices').val();
        recompute();
    });

    $('#saisieNombreExercices').on('keypress', (e) => {
        if(e.which == 13) {
            filtreNombreExercicesRef = $('#saisieNombreExercices').val();
            recompute();
        }
    });

    /********************** Gestion des filtres  ********************/

    $('.dropdown-item').click((e) => { 
        var filterParse = e.target.id.split('-')
        var filterType  = filterParse[0];
        var filterValue = filterParse[1];

        for (i = 2; i < filterParse.length; i++) filterValue += '-' + filterParse[i];

        filterValue = filterValue == ''?'-':filterValue;

        $('#' + filterParse[0]).text(filterValue == '-'?filterType:filterValue);

        if (filterType == 'plusOuMoins') {
            filtreOperateurNombreExercices = filterValue;
            filtreNombreExercicesRef = filterValue == 'plusOuMoins' ? '-' : parseInt($('#saisieNombreExercices').val());
        }

        if ($('#' + e.target.id).hasClass('filtreClasse')) {
            filtreClasse = filterValue;
        }
        else if ($('#' + e.target.id).hasClass('filtreNiveau')) {
            filtreNiveau = filterValue =='-'? '-' : (parseInt(filterValue) - 1);
        }
        else if ($('#' + e.target.id).hasClass('filtreExercice')) {
            filtreExercice = filterValue =='-'? '-' : (parseInt(filterValue) - 1);
            $('#' + filterParse[0]).text(filterParse[2] == '' ? filterType : filterParse[2]);
        }
        else if ($('#' + e.target.id).hasClass('filtreOperateur')) {
            filtreOperateur = filterValue;
        }
        recompute();
        
    })

    // $(".eleve").click((e) => {
    //     $(".eleve").removeClass('active');
    //     $('#' + e.currentTarget.id).addClass('active');
    //     $.get('php/getStudentInfosJSON.php?id=' + e.currentTarget.id, (data) => { displayStudentInfos(JSON.parse(data)) });
    // })
}


function createModifPageEvents() {

    $('.eleve').unbind('click');
    $('#validerModif').unbind('click');


    // Click sur un élève
    $(".eleve").click((e) => {
        $('body').trigger('switchToModifMode');
        $('.modifMessage').hide();
        $(".eleve").removeClass('active');
        $('#' + e.currentTarget.id).addClass('active');
        currentStudentModifId = e.currentTarget.id;
        $.get('php/getStudentInfosJSON.php?id=' + e.currentTarget.id, (data) => { 
            var eleve = app.liste.find(element => element.idConnexion == e.currentTarget.id);
            $('#nomEleveInput').val(eleve.nomEleve);
            $('#prenomEleveInput').val(eleve.prenomEleve);
            $('#classeEleveInput').val(eleve.classeEleve);
            $('#idConnexionEleveInput').val(eleve.idConnexion);
        });
    })

    // Choix d'une classe
    $('.dropdown-item').click((e) => {
        var filterParse = e.target.id.split('-')
        var filterType  = filterParse[0];
        var filterValue = filterParse[1];
    
        for (i = 2; i < filterParse.length; i++) filterValue += '-' + filterParse[i];
            filterValue = filterValue == ''?'-':filterValue;
        if (filterParse[0] == 'Classe') {
            filtreClasse = filterValue;
        }
       recompute();
       $('#' + filterParse[0]).text(filterValue);
    })

}

function resetFilters() {
    
}

function recompute (){
    options = 'classe=' + filtreClasse 
            + '&exercice=' + filtreExercice 
            + '&niveau=' + filtreNiveau 
            + '&operateur=' + filtreOperateur
            + '&noteRef=' + filtreNoteRef 
            + '&operateurNombreExercices=' + filtreOperateurNombreExercices
            + '&nombreExercicesRef=' + filtreNombreExercicesRef;

    expr = /_/g;

    app.liste = listeCompleteEleve.filter((eleve) =>{
        eleve.noteCiblee = -1;
        filtreClasseCorrige = '-';
        if (filtreClasse != '-') filtreClasseCorrige = filtreClasse.replace(expr, ' ');
        var eleveCorrespondAuxCriteres = true;
        if (filtreExercice != '-' && filtreNiveau != '-') {
            niveauEnCours = eleve.categories[filtreExercice].niveaux[filtreNiveau];
            eleve.noteCiblee = Math.round(niveauEnCours.noteUnitaire * 20, 1);
            eleve.nombreExercices = Math.round(niveauEnCours.nombreQuestions / 5);
            eleve.studentBadge1 = eleve.noteCiblee >= filtreNoteRef ? 'badge-success' : 'badge-danger';
            eleve.studentBadge2 = eleve.nombreExercices >= filtreNombreExercicesRef ? 'badge-success' : 'badge-danger';

            if (filtreOperateur != '-') 
                if (filtreOperateur == 'sup') eleveCorrespondAuxCriteres = eleveCorrespondAuxCriteres && eleve.noteCiblee >= filtreNoteRef;
                else eleveCorrespondAuxCriteres = eleveCorrespondAuxCriteres && eleve.noteCiblee < filtreNoteRef;
            if (filtreOperateurNombreExercices != '-') 
                if (filtreOperateurNombreExercices == 'plus') eleveCorrespondAuxCriteres = eleveCorrespondAuxCriteres && eleve.nombreExercices >= filtreNombreExercicesRef;
                else eleveCorrespondAuxCriteres = eleveCorrespondAuxCriteres && eleve.nombreExercices < filtreNombreExercicesRef;
            
        }
        eleveCorrespondAuxCriteres = eleveCorrespondAuxCriteres && (filtreClasseCorrige=='-' ? true : eleve.classeEleve == filtreClasseCorrige);
        return eleveCorrespondAuxCriteres;
    });

    if (app._route.path == '/mainpage') {
        setTimeout(() => {
            createMainPageEvents();
        }, 100);
    }
    if  (app._route.path == '/modification') {
        setTimeout(() => {
            createModifPageEvents();
        }, 100);
    }


    
}

function firstLoadInit() {
    $('#loader').css('display', 'inline-block');

    $.get('php/getJsonList.php', (data) => {
        var listJSON;
        try {
            listJSON = JSON.parse(data);
            if (listJSON.studentNotFound) 
            {
                listeCompleteEleve = [];
                
            } else {
                createPage(JSON.parse(data));
                recompute();
            }
        } catch (e) {
            console.log('firstLoadInit', data);
        }

        $('#saisieNombreExercices').val(filtreNombreExercicesRef);

        $('#loader').css('display', 'none');

    })
}


function verificationDesIP() { 
    $.get('php/ipCheck.php', (data)=>{
        $.get('php/dateDernierIpCheck.php', (dateJSON)=>{
            ipCheckResult = JSON.parse(data);
            dateDernierIpCheck = JSON.parse(dateJSON);
            dateDernierIpCheck = '1970-01-01';
                listeSuspectsAAfficher = [];
                
                listeSuspectsAAfficher = JSON.parse(JSON.stringify(ipCheckResult));

                for (let i = 0; i < listeSuspectsAAfficher.length; i++) {
                    let suspect = JSON.parse(JSON.stringify(listeSuspectsAAfficher[i]));

                    listeSuspectsAAfficher[i].listeMefaits = suspect.listeMefaits.filter((mefait) => {
                        return ((Date.parse(mefait.dateDernierAcces) - Date.parse(dateDernierIpCheck)) / 1000 / 3600 / 24 > 0 )
                    })
                };
                ipCheckResult = listeSuspectsAAfficher.filter((suspect) => { return suspect.listeMefaits.length > 0})


                
            if (ipCheckResult.length == 0 || ipCheckResult == undefined){
                $('.ipCheckMenu').css('background-color', '#95ff91');
            }
            else {
                $('.ipCheckMenu').css('background-color', '#ff8b8b');
            }
            $(document).trigger('ipCheckDone');
        })
    })
}


firstLoadInit();
recompute();
verificationDesIP();    
    

}) // Fin $(function)

























