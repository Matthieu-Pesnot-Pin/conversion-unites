function nbreDecimale(n) {
    var s = n.toString();
    return (s.length - Math.abs(s.indexOf('.')) - 1);
}

function conversionStringFloat(s){
    var separation = s.split(',');
    var partieEntiereStr = separation[0];
    var partieEntiere = parseInt(partieEntiereStr);
    var partieDecimale = 0.0;
    var puissanceDecimale = 1;

    if (separation.length >1) 
    {
        var partieDecimaleStr = separation[1];
        partieDecimale = parseInt(partieDecimaleStr);
        puissanceDecimale =  partieDecimaleStr.length;
    }
    
    return partieEntiere + partieDecimale / (Math.pow(10,puissanceDecimale));
}

function conversionFloatString(n){
    if (Math.round(n) != n){
        var partieEntiere = Math.floor(n);
        var partieDecimale = (n - Math.floor(n)).toFixed(nbreDecimale(n));
        return partieEntiere.toString() + "," + partieDecimale.toString().substring(2, partieDecimale.length);
    }
    return n.toString();
}