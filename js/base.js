
const FROM_STRING_INPUT_TYPE_REGULAR_FLOAT = "regularFloat"

class Base {
    
    constructor (e, d) {    
        this.partieDecimale = d==""?"0":d;
        this.partieEntiere = e;
        this.clean();
    }

    clean(){
        while (this.partieDecimale[this.partieDecimale.length-1] == "0") this.partieDecimale = this.partieDecimale.substring(0, this.partieDecimale.length-1);
        if (this.partieDecimale == "") this.partieDecimale="0";
        if (this.partieEntiere == "") this.partieEntiere="0";

    }    

    compareTo(other) {
        return (other.partieEntiere == this.partieEntiere && other.partieDecimale == this.partieDecimale);
    }

    multiplyBy(factor, typeConcerned){
        const DEFAULT_TYPE = "DEFAULT";
        typeConcerned = typeConcerned == undefined?DEFAULT_TYPE:typeConcerned;

        const CONTROL_EXCLUSION_LIST = [
            TIME_TYPE, 
            VITESSE_TYPE//, 
            // DEFAULT_TYPE
        ]
        var output = Base.fromString((this.toFloat() * factor).toString().replace(".", ","));

        // Si le type des unités concernées par la conversion est non précisé ou fait partie des types à ne pas contrôler, 
        // On renvoie le nombre tel quel
        if (CONTROL_EXCLUSION_LIST.indexOf(typeConcerned) != -1) return output;

        // sinon on gère les problèmes d'arrondis 
        // si la nouvelle taille ne correspond pas à l'ancienne taille + decalage engendré par la multiplication
        // Alors on gère.
        var decalageVirgule = Math.round(Math.log10(factor));
        if (decalageVirgule < 0 || decalageVirgule > 0) {
            if (this.partieDecimale.length<1?1:this.partieDecimale.length + Math.abs(decalageVirgule) != output.partieDecimale.length) {
                //console.warn('Erreur d\'arrondi détecté dans multiplyBy : ' + output);
                
                var outputStr = output.toString();
                var newSize = this.partieDecimale.length + Math.abs(decalageVirgule) + 1;
                outputStr = output.toFloat().toFixed(newSize).toString().replace(".", ",");

                output = Base.fromString(outputStr);
                //console.warn('Corrected in : ' + output);
            }
        }   
        return output;
    }

    x10Exp(exp) {
        var partieDecimale = this.partieDecimale;
        var partieEntiere = this.partieEntiere;
        if (exp > 0){
            while (partieDecimale.length < exp) partieDecimale += "0";
            for (var i = 0; i < exp; i++){
                partieEntiere+=partieDecimale[i];
            }
            partieDecimale = partieDecimale.substring(Math.round(exp), partieDecimale.length);
        }

        if (exp < 0){
            while (partieEntiere.length < Math.abs(exp))  partieEntiere = ("0").concat([partieEntiere]);
            for (var i = 0; i < Math.abs(exp); i++){
                partieDecimale = partieEntiere[partieEntiere.length - i - 1].concat(partieDecimale);
            }
            partieEntiere = partieEntiere.substring(0, partieEntiere.length - Math.round(Math.abs(exp)));
        }

        while (partieDecimale[partieDecimale.length-1] == "0") partieDecimale = partieDecimale.substring(0, partieDecimale.length-1);
        if (partieEntiere == "") partieEntiere="0";
        return new Base(partieEntiere, partieDecimale);
    }

    toString(){
        var queue = (this.partieDecimale =="" || this.partieDecimale ==" ")?",0":","+this.partieDecimale;
        return this.partieEntiere + queue;
    }

    toFloat(){
        if (this.partieDecimale != "")
        return parseInt(this.partieEntiere) + parseInt(this.partieDecimale) / Math.pow(10, this.partieDecimale.length);
        else return parseInt(this.partieEntiere);
    }

    testWith(param, err){
        if (this.toString() != param) console.error("Erreur " + err + " : expected this base = " + this.toString() + " == " + param);
        
    }

    static randomCommaPos(n, commaPos) {
        var tmp = Base.randomInt(n).toString();
        var pos = (Base.randomInt(tmp.length) - commaPos);
        if (pos > 0) tmp = tmp.substring(0, pos) + "," + tmp.substring(pos, tmp.length);
        if (pos < 0) {
            while (pos < 0)  {
                tmp = "0" + tmp;
                pos++;
            }
            tmp = "0," + tmp;
        }
        return Base.fromString(tmp);
    }

    static random(n, m, commaPosInf, commaPosSup, noZero) {
        var randomEntiere = "";
        var randomDecimal = "";
        while (randomEntiere.length + randomDecimal.length < 2) {
            randomEntiere = this.randomDigits(n).toString();
            if (noZero == true) while (randomEntiere.length < 2) {
                randomEntiere = this.randomDigits(n).toString();
            } else while (randomEntiere.length < 2 && randomEntiere != "0") {
                randomEntiere = this.randomDigits(n).toString();
            }
            randomDecimal = this.randomDigits(m).toString();
            if (randomEntiere == "0") 
                while (randomDecimal == "0") randomDecimal = this.randomDigits(m).toString();
        }

        var debutDecimal = randomEntiere.length;

        var completeString = randomEntiere.toString() + randomDecimal.toString();
        var commaPos = commaPosSup - commaPosInf + 1;
        var pos = Base.randomInt(commaPos) + commaPosInf;

        var zeros = "";
        for (var i = 0; i < commaPos ; i++) zeros += "0";
        completeString = zeros + completeString + zeros;

        completeString = completeString.substring(0,zeros.length + debutDecimal + pos) + "," + completeString.substring(zeros.length + debutDecimal + pos, completeString.length);
        completeString = completeString.replace(/0*$/, '');
        completeString = completeString.replace(/^0*/, '');

        var output = Base.fromString(completeString);
        if (output.partieDecimale.length > 6) output.partieDecimale = output.partieDecimale.substring(0, 5) + output.partieDecimale[output.partieDecimale.length-1];
        if (output.partieEntiere.length > 9) output.partieEntiere = output.partieEntiere.substring(0, 9);
        return output;
        
    }
    
    static randomInt(n){
        return Math.floor(Math.random()*n);
    }

    static randomDigits(maxDigitNumber) {
        if (maxDigitNumber == 0) return "0";
        var digitNumber = this.randomInt(maxDigitNumber)+1;
        var numberAsString = "";
        while (numberAsString.length < digitNumber)
            numberAsString += this.randomInt(10).toString();
        return parseInt(numberAsString);
    }

    static fromString(s, inputType){
        if (s == undefined) return undefined;
        var separation = s.split(',');
        var partieEntiere = separation[0];
        var partieDecimale = "0";
        if (separation.length > 1) 
        {        
            partieDecimale = separation[1];
            var positionExp = partieDecimale.indexOf("e");

            if  (positionExp != -1){
                var exp = parseInt(partieDecimale.substring(positionExp+1, partieDecimale.length));
                partieDecimale = partieDecimale.substring(0, positionExp);
                if (exp < 0){
                    partieDecimale = partieEntiere + partieDecimale;
                    partieEntiere = "0";
                    exp++;
                    while (exp < 0){
                        partieDecimale = "0" + partieDecimale;
                        exp++;
                    }
                }
                if (exp	> 0) {
                    while (exp > 0){
                        
                        if (partieDecimale != "") {
                            partieEntiere += partieDecimale[0];
                            partieDecimale = partieDecimale.substring(1, partieDecimale.length);
                        } else partieEntiere += "0";
                        exp--;
                    }
                }
            }
        } else
        {
            var positionExp = partieEntiere.indexOf("e");
            if  (positionExp != -1){
                var exp = parseInt(partieEntiere.substring(positionExp+1, partieEntiere.length));
                partieEntiere = partieEntiere.substring(0, positionExp);
                if (exp < 0){
                    partieDecimale = partieEntiere + partieDecimale;
                    partieEntiere = "0";
                    exp++;
                    while (exp < 0){
                        partieDecimale = "0" + partieDecimale;
                        exp++;
                    }
                }
                if (exp	> 0) {
                    while (exp > 0){
                        if (partieDecimale != "") {
                            partieEntiere += partieDecimale[0];
                            partieDecimale = partieDecimale.substring(1, partieDecimale.length);
                        } else partieEntiere += "0";
                        exp--;
                    }
                }

            }

        }

        return new Base(partieEntiere, partieDecimale);
    
    }
}


