const MODAL_DEFAULT_WIDTH = 800;
const MODAL_DEFAULT_HEIGHT = 430;
const MODAL_DEFAULT_TOP = 150;

const lottieLoader = '<lottie-player class="centered" src="https://assets7.lottiefiles.com/packages/lf20_VsPRP4.json"  background="transparent"  speed="1"  style="width: 30px; height: 30px;"  loop autoplay></lottie-player>';

MODALE_QUITTABLE = true;

var MODAL_WIDTH = MODAL_DEFAULT_WIDTH;
var MODAL_HEIGHT = MODAL_DEFAULT_HEIGHT;
var MODAL_LEFT = $(window).width() / 2 - MODAL_WIDTH / 2;
var MODAL_TOP = MODAL_DEFAULT_TOP;

function reInitModale() {
    var s = 
    $('#modaleInfos').css('width', (MODAL_DEFAULT_WIDTH).toString() + "px");
    $('#modaleInfos').css('height', (MODAL_DEFAULT_HEIGHT).toString() + "px");
    $('#modaleInfos').css('left', ($(window).width() / 2 - MODAL_DEFAULT_WIDTH / 2).toString() + "px");
    $('#modaleInfos').css('top', (MODAL_DEFAULT_TOP).toString() + "px");
}

function centerModale() {
    $('#modaleInfos').css('left', ($(window).width() / 2 - $('#modaleInfos').outerWidth() / 2).toString() + "px");
    $('#modaleInfos').css('top', ($(window).height() / 2 - $('#modaleInfos').outerHeight() / 2).toString() + "px");

}

function afficherModale() {
    $('#modaleInfos').css('display', 'block');
    $('#masqueGris').css('display', 'block');
}

function masquerModale() {
    $('#modaleInfos').css('display', 'none');
    $('#masqueGris').css('display', 'none');
    modaleTemplate("");
    reInitModale();
}

function setModale(w, h, l, t) {
    MODAL_WIDTH = w;
    MODAL_HEIGHT = h;
    if (l != undefined) MODAL_LEFT = l;
    if (t != undefined) MODAL_TOP = t;
}

function initModale() {
    $('#modaleInfos').css('width', (MODAL_WIDTH).toString() + "px");
    $('#modaleInfos').css('height', (MODAL_HEIGHT).toString() + "px");
    $('#modaleInfos').css('left', (MODAL_LEFT).toString() + "px");
    $('#modaleInfos').css('top', MODAL_TOP.toString() + "px");
}

function setModaleAuto() {
    $('#modaleInfos').css('width', "auto");
    $('#modaleInfos').css('height', "auto");
}

function modaleTemplate(template) {
    $('#modaleInfos').html(template);
}

function empecherQuitterModale() {
    MODALE_QUITTABLE = false;
}

function permettreQuitterModale() {
    MODALE_QUITTABLE = true;
}

function modaleAlertListe(liste, header, callBack) {
    if (header == undefined) header = '';
    $('#modaleInfos').off('click');
    var message = '<h5>' + header + '</h5>';
    
    if (Array.isArray(liste)){
        for (rapport of liste) {
            var baliseWarning ='>';
            if (!rapport.reqSuccess) baliseWarning =' class="alert alert-danger">';
            message += '<div' + baliseWarning + rapport.reqType + ' : ' + rapport.reqMessage + '</div>';
        }
        
    }
    else {
        if (liste.reqSuccess != undefined) {
            var baliseWarning ='>';
            if (!liste.reqSuccess) baliseWarning =' class="alert alert-danger">';
            message += '<div' +baliseWarning + liste.reqType + ' : ' + liste.reqMessage + '</div>';
        } else {
            message = liste;
        }
        
    }
    modaleAlert(message, false, callBack);
}

function modaleAlert(message, loader, callBack) {
    if (loader == undefined) loader = false;
    if (callBack == undefined) callBack = ()=>{};

    $('#modaleInfos').off('click');


    var modaleEnd = `
        <div id = 'modaleAlertBouton' class="dflex">
            <div id='modaleOk' class='btn btn-primary oneButtonModale'>Ok</div>
        </div>
    `;

    if (loader) modaleEnd = lottieLoader;
    
    modaleTemplate(`
        <div id="modaleOuiNonMessage" class = "divTextCenter" >
            <h6> ${message} </h6>
        </div>
        ${modaleEnd}` 
        
    )

        setModaleAuto();
        centerModale();

    $('#modaleOK').off('click');
    if (!loader)
        $('#modaleOk').on('click.evenementsModale', ()=>{
            permettreQuitterModale();
            masquerModale();
            callBack();
        });

    empecherQuitterModale();
    afficherModale();
}

function modaleOuiNon (message, callBackOui, callBackNon, btnOui, btnNon) {
    btnOui = btnOui == undefined ? 'Oui' : btnOui;
    btnNon = btnNon == undefined ? 'Non' : btnNon;
    callBackOui = callBackOui == undefined ? ()=>{} : callBackOui;
    callBackNon = callBackNon == undefined ? ()=>{} : callBackNon;
    $('#modaleInfos').off('click');

    modaleTemplate(`
        <div id="modaleOuiNonMessage" class = "divTextCenter" >`
            // <h6>` + message + `</h6>
            + message +
        `</div>
        <div id = 'modaleOuiNonBoutons' class="dflex centered space-around" style = "width: 200px">
            <div id='modaleOui' class='btn btn-primary '>`+ btnOui +`</div>
            <div id='modaleNon' class='btn btn-danger '>`+ btnNon +`</div>
        </div>
    `)

    setModaleAuto();
    centerModale();

    empecherQuitterModale();
    afficherModale();

    $('.evenementModale').off('click');

    $('#modaleOui').on('click.evenementModale', ()=>{
        masquerModale();
        permettreQuitterModale();
        callBackOui();

    });

    $('#modaleNon').on("click.evenementModale", ()=>{
        masquerModale();
        permettreQuitterModale();
        callBackNon();
    });
}