// *************************************************************************************************************** //
// ***************************************      INITIALISATION STYLES      *************************************** //
// *************************************************************************************************************** //


$('#zoneValidation').css("display", "none");
//zoneTravailElt.style.display = "none";

//zoneValidationElt.style.display = "none";

zoneFLottanteElt.style.zIndex = "3";
zoneFLottanteElt.style.visibility = "hidden";
zoneFLottanteElt.style.top = "-500px";

// Affichage de la date (la forme element.valueAsDate = new Date() ne fonctionne pas sous safari)
var today = new Date();
var day = today.getDate().toString();
var month = (today.getMonth() + 1).toString();
if (day.length < 2) day = '0' + day;
if (month.length < 2) month = '0' + month;
var todayString = today.getFullYear() + '-' + month + '-' + day;
document.getElementById("date").value = todayString;


masqueGrisElt.width = document.body.width;
masqueGrisElt.height = document.body.height;



masqueGrisElt.style.zIndex = "1";

$("#onglet" + ongletsTypeExMap[selectedOnglet].toString()).addClass('selectedOnglet');


