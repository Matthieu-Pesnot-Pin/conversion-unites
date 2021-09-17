var boxCreationCount = 0;
var displayBoxList = [];



class DisplayBox {
    
    length = 0;
    posX = 0;
    posY = 0;
    caseWidth = 0;
    content = "";
    HTMLContent = "";
    classId = "";
    id = "";
    refElt = undefined;
    
    constructor (classId, posX, posY, length, content) {
        this.nodeElt = document.createElement("span");
        this.nodeElt.style.position = "absolute";
        this.nodeElt.className = classId;
        this.posX = posX == undefined ? this.posX = 0 : this.posX = posX;
        this.posY = posY == undefined ? this.posY = 0 : this.posY = posY;
        this.content = content == undefined ? this.content = "" : this.content=content;
        this.length = length == undefined ? this.length = 0 : this.length=length;
        this.classId = classId;
        this.id = "DisplayBox" + boxCreationCount;
        boxCreationCount++;
        document.body.appendChild(this.nodeElt);
        this.computeNode();
        this.nodeElt.style.fontSize = "1.4em";
    }

    
    setRefElt(refElt) {
        this.refElt = refElt;
    }

/*    
    setId(id){
        this.id = id;
    }
*/  

    setTextAlign(al) {
        var boxes = this.nodeElt.children;
        for (var box of boxes) box.style.textAlign = al;

    }

    setFontFamily(ft) {
        var boxes = this.nodeElt.children;
        for (var box of boxes) box.style.fontFamily = ft;

    }

    setWidth(w, b, e) {
        var beginPos = 0;
        var endPos = this.length;
        if (b!=undefined) beginPos = b;
        if (e!=undefined) endPos = e;

        if (b!=undefined&&e==undefined) endPos = b+1;

        var boxes = Array.from(this.nodeElt.children);
        
        for (var i = beginPos; i < endPos; i++) {
            var box = boxes[i];
            box.style.display = "inline-block";
            if (w == "auto") box.style.width = w;
            else box.style.width = w.toString() + "px";
        }

    }

    setInnerElementHTMLWidth(w,boxNb) {
        var innerElt = this.nodeElt.children[boxNb].firstChild;
        if (innerElt!=undefined) innerElt.style.width = w.toString() + "px";
//        if (w == "auto") innerElt.style.width = w;
  //          else innerElt.style.width = w.toString() + "px";
//        }
        else console.error("setInnerElementHTMLWidth : element inaccessible dans " + this.id + " - element n°" + boxNb.toString())
    }
    
    setZIndex(index){
        this.nodeElt.style.zIndex = index.toString();
    }
    
    setVisibility(visibility){
        this.nodeElt.style.visibility = visibility;
    }
    
    setBoxTextContent(boxNb, content)
    {
        var box = this.nodeElt.children[boxNb];
        if (box!=undefined) box.textContent = content; 
            else console.error("SetBoxTextContent : element inaccessible dans " + this.id + " - element n°" + boxNb.toString())
    }
    
    setBoxTextSize(boxNb, size)
    {
        var box = this.nodeElt.children[boxNb];
        if (box!=undefined) box.style.fontSize = size; 
            else console.error("SetBoxTextContent : element inaccessible dans " + this.id + " - element n°" + boxNb.toString())
    }

    setFontSize(sz){
        var boxes = this.nodeElt.children;
        for (var box of boxes) box.style.fontSize = sz; 

    }
    
    setBoxPadding(boxNb, padd)
    {
        var box = this.nodeElt.children[boxNb];
        if (box!=undefined) box.style.padding = padd; 
            else console.error("SetBoxTextContent : element inaccessible dans " + this.id + " - element n°" + boxNb.toString())
    }
    
    setBoxHTMLContent(boxNb, content)
    {
        var box = this.nodeElt.children[boxNb];
        if (box!=undefined) box.innerHTML = content; else console.error("SetBoxHTMLContent : element inaccessible dans " + this.id + " - element n°" + boxNb.toString())
    }

    setBoxBorder(boxNb, color, radius){
        var box = this.nodeElt.children[boxNb];
        var bRadius = "50";
        if (radius != undefined) bRadius = radius;
        if (box!=undefined)  {
            box.style.border = "1px solid " + color;
            box.style.borderRadius = bRadius + "%";
        } else console.error("SetBoxBorder : element inaccessible dans " + this.id + " - element n°" + boxNb.toString())
    }   

    setInnerHtmlBoxBorder(boxNb, color){
        var innerElt = this.nodeElt.children[boxNb].firstChild;
        if (innerElt!=undefined) {
            innerElt.style.border = "1px solid " + color;
            innerElt.style.padding = "2px";
            innerElt.style.borderRadius = "50%";
         } else console.error("SetInnerHtmlBoxBorder : element inaccessible dans " + this.id + " - element n°" + boxNb.toString())
    }

    totalWidth() {
        return Array.from(this.nodeElt.children).reduce((a, v) => a + parseInt(v.offsetWidth), 0);
    }
     


    emptyAllBoxes() {
        for (var i = 0; i < this.length ; i ++) 
        {
            this.setBoxHTMLContent(i, "");
            this.setBoxTextContent(i, "");
        }
    }

    computeNode(){
        this.nodeElt.style.left = this.posX.toString() + "px";
        this.nodeElt.style.top = this.posY.toString() + "px";
        this.nodeElt.innerHTML = "";

        if (this.length < this.content.length) console.warn("DisplayBox : longueur DisplayBox " + this.id + " inférieure à la taille de la chaîne - la chaîne sera tronquée");
        
        for (var i = 0 ; i < this.length ; i++){
            var cont = "";
            if (this.content != "" && i < this.content.length) cont = this.content[i];
            this.nodeElt.innerHTML += "<span class = \"" + this.classId + "\" id = \"" + this.classId + i.toString() +"\">" +  cont + "</span>";
        }
    }

    insertBox(index) {
        
    }

/*
    getNode() 
    {
        this.computeNode();
        return this.nodeElt;
    }
*/

    setPos(posX, posY) {
        var offsetX = 0;
        var offsetY = 0;

        if (this.refElt != undefined) {
            offsetX = parseInt(this.refElt.style.left);
            offsetY = parseInt(this.refElt.style.top);
        }
        
        this.posX = posX;
        this.posY = posY;

        this.nodeElt.style.left = (this.posX + offsetX).toString() + "px";
        this.nodeElt.style.top  = (this.posY + offsetY).toString() + "px";;
    }

    updatePos(){
        
        var offsetX = 0;
        var offsetY = 0;

        if (this.refElt != undefined) {
            offsetX = parseInt(this.refElt.style.left);
            offsetY = parseInt(this.refElt.style.top);
        }
        this.nodeElt.style.left = (this.posX + offsetX).toString() + "px";
        this.nodeElt.style.top  = (this.posY + offsetY).toString() + "px";;
    }

/*
    setStringContent(content) {
        this.content = content;
    }
*/

/*
    setLength(n) {
        this.length = n;
        this.computeNode();
    }

*/

/*
    setClassId(classId) {
        this.classId = classId;
    }
*/

    static copyDisplayBox(dBox) {

    }

    static emptyDisplayBoxList() {
        if (displayBoxList != [])
        for (var dBox of displayBoxList) 
            dBox.nodeElt.parentNode.removeChild(dBox.nodeElt);
        displayBoxList = [];

    }

   

/*    static addBox(dBox) {
        //displayBoxList.map(e => e.id == dBox.id ? dBox : e);
        var found = false;
        for (var i = 0 ; i < displayBoxList.length ; i ++ ){
                if (displayBoxList[i].id == dBox.id) displayBoxList[i] = dBox;
                found = true;
            }
        if (!found) displayBoxList.push(dBox);

    }*/
    
    static updateAllDisplayBoxesPos() {
        for (var box of displayBoxList) box.updatePos();

    }
}

