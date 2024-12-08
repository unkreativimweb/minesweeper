let j=0;
let padding=20
let numMarked=0;
let gridsize;
const minefield = document.getElementById('minefield')
var counter=0
// var anlieger=[];
const allFields = [];
var noInfinitLoopPls = false;
var devMode = false;



window.addEventListener('resize', resizeWindow);


function resizeWindow(){
    if(document.getElementById('minefield').style.width !== ''){
        document.getElementById('minefield').style.marginLeft = (((window.innerWidth) - document.getElementById('minefield').offsetWidth)/2) + 'px';
    }
}

function generate() {
    resetField();

    if(gridsize>30||gridsize<2){                    // disallow gridsize to be too big or small
        alert('grid not valid; from 0 to 30');
        return
    } 

    numFields=gridsize*gridsize; // actual gridsize => ACHTUNG  KANN FÜR FETTE PROBLEME SORGEN, WENN ER DAS DING GLOBAL ANNIMMT
    minefield.style.padding=padding+'px'; // change padding & margin of minefield div after generating mines
    minefield.style.height= 'auto';
    minefield.style.width= 'auto';


    if(numFields<j){
        for(i=j; i>numFields; i--){          // when gridsize<then what is actually there the overflow gets deleted here
            const element = document.getElementById("div"+(i-1));
            element.remove(); 
            j=numFields;
        }
        }else{                              // otherwise the difference between gridsize and the stuff thats actually there gets newly generated
        for(i=j; numFields>i; i++) {
            const mainDiv = document.getElementById('minefield')
            var newDiv = document.createElement("div");
            const newContent = document.createTextNode('‎'); 
            //const newContent = document.createTextNode(i);  //fill cells with ids for dev
            newDiv.appendChild(newContent);
            newDiv.setAttribute('id', 'div'+i);
            newDiv.setAttribute('class', 'mine');
            newDiv.setAttribute('onclick', 'handleLeftClick(this.id)');
            newDiv.addEventListener('contextmenu', markMine);
            mainDiv.appendChild(newDiv);
            allFields[i]=i;
            j++
        }
    }
    length();
    armMines();
}

function length(){
    if(gridsize==0){
        var length = 0
        minefield.style.padding=0;
        minefield.style.border=0;
    } else {
        var length = document.getElementById('div1').offsetWidth*gridsize+2*padding+10;
        minefield.style.padding=padding+'px';
        minefield.style.border='2px solid black';
    }
    minefield.style.width=length+'px';
    minefield.style.height=length+'px';
}

function markMine(event){
    event.preventDefault();         //prevent the context menu from opening
    var marked = event.target.id;
    var marked=document.getElementById(marked)
    if(marked.innerHTML=='🚩'){
        marked.innerHTML='‎'; //fill cell witth div number
        numMarked--;
        document.getElementById('numMarked').innerHTML='🚩: '+numMarked;
    }else{
        marked.innerHTML='🚩';
        numMarked++
        document.getElementById('numMarked').innerHTML='🚩: '+numMarked;
    }
    
}

function armMines() {    // i need number of all mines and then decide how many will be armed depending on level hardness.
    if(devMode==true){
        var mode = 'easy'
    } else {
        var mode = document.getElementById('mode').value
    }
    console.log(mode)
    // var gridsize=document.getElementById('gridsize').value;
    var takenSpots=[];
    // console.log('number of fields: ' + j + '; mode: ' + mode);
    if(mode=='easy'){
        var numMines = Math.floor((gridsize*gridsize)*0.1); //10%
    } else if(mode=='middle') {
        var numMines = Math.floor((gridsize*gridsize)*0.15); //15%
    } else if(mode=='hard') {
        var numMines = Math.floor((gridsize*gridsize)*0.20); // 20%
    } else if(mode=='veryHard') {
        var numMines = Math.floor((gridsize*gridsize)*0.25); // 25%
    } else{
        console.log('no mode selected'); 
        // alert('no mode selected'); //activate when not in dev
        resetField();
    }
    for (i=0; numMines>i; i++) {
        var selectedSpot=Math.floor(Math.random()*((gridsize*gridsize)));
        if(takenSpots.includes(selectedSpot) != 'true') {
            document.getElementById('div'+selectedSpot).setAttribute('class', 'armedMine');
            takenSpots[i]=selectedSpot;
            // console.log(takenSpots[i]);
        } else {
            console.log('neuer versuch');
            i--;
        }
    }
    // console.log('Fields: ' + (gridsize*gridsize) + ', davon Minen: ' + numMines + ', in Prozent also: ' + numMines/(gridsize*gridsize));
}

function handleLeftClick(mineID) {            // if theres a flag present delete flag, else reveal 
    devMode = document.getElementById('devMode').checked
    // console.log('in handleLeftClick: ' + String(mineID))
    if(document.getElementById(mineID).innerHTML=='🚩') {
        document.getElementById(mineID).innerHTML='‎';
        numMarked--;    //update counter
        document.getElementById('numMarked').innerHTML='🚩: '+numMarked;
    } else {
        if(document.getElementById(mineID).classList.contains('armedMine')){    //losing mechanic
            if(devMode == false){
                alert('you just lost')
                revealOnlyMines();    
            }
            console.log('Lost you piece of shit');
        } else {
            // console.log('revealing now...');
            revealField(mineID); 
        }
    }
}

function revealField(mineID) {
    let anlieger = fieldIndicator(mineID.split('div')[1]);
    // console.log(anlieger)
    let neighbouringCells = 0;
    // console.log(anlieger);
    for(i=0; i<anlieger.length; i++){
        console.log(anlieger[i]+': '+document.getElementById('div' + anlieger[i]).classList.contains('armedMine'))
        // console.log(document.getElementById('div' + anlieger[i]));
        if(document.getElementById('div' + anlieger[i]).classList.contains('armedMine') == true){
            // console.log('neighbouringCells++')
            neighbouringCells = neighbouringCells+1;
            // console.log('neighbouringCells: ' + neighbouringCells)
        }
    }
    if(neighbouringCells == 0){
        // console.log('auch nc = 0')
        document.getElementById(mineID).innerHTML='';
        if(!noInfinitLoopPls){
            noInfinitLoopPls = true;
            // document.getElementById(mineID).innerHTML='';
            fieldZero(mineID.split('div')[1]);          // i think not working actually ☝️🥸
        }
    } 
    // console.log(document.getElementById(mineID));
    console.log('neighbouringCells('+mineID+'):'+neighbouringCells);
    document.getElementById(mineID).innerHTML=neighbouringCells;
    // console.log(neighbouringCells);
    // return neighbouringCells;
}

function fieldZero(mineID) {
    let main = toDiv(mineID);
    let upper = toDiv(mineID - gridsize);
    // let upRight = toDiv(mineID - Number(gridsize) + 1); doppelt hä
    let lower = toDiv(Number(mineID) + Number(gridsize));
    let lowRight = toDiv(Number(mineID) + Number(gridsize) + 1);
    let left = toDiv(mineID - 1);
    let lowLeft = toDiv(Number(mineID) + (Number(gridsize) - 1));
    let right = toDiv(Number(mineID) + 1);
    let upRight = toDiv(Number(mineID) - (Number(gridsize) + 1));
    // let upLeft = toDiv(Number(mineID) - gridsize); nochmal doppelt wtf
    let upLeft = toDiv(Number(mineID) - (Number(gridsize) - 1));
    
    // console.log(fieldIndicator(main))
    handleLeftClick(main);
    // console.log('main went through');
    handleLeftClick(upper);
    // console.log('upper went through');
    handleLeftClick(upRight);
    // console.log('upRight went through');
    handleLeftClick(right);
    // console.log('right went through');
    handleLeftClick(lowRight);
    // console.log('lowRight went through');
    handleLeftClick(lower);
    // console.log('lower went through');
    handleLeftClick(lowLeft);
    // console.log('lowLeft went through');
    handleLeftClick(left);
    // console.log('left went through');
    handleLeftClick(upLeft);
    // console.log('upLeft went through');
    
    if(revealField(upper)==0){
        console.log('sent upper (' + upper + ') to handleLeftClick cause 0')     
        handleLeftClick(upper);        // could be the string 'div#' comes thru... that would be wrong tho (i think)
    }
    if(revealField(lower)==0){
        console.log('sent upper (' + lower + ') to handleLeftClick cause 0')     
        handleLeftClick(lower);        // could be the string 'div#' comes thru... that would be wrong tho (i think)
    }
    if(revealField(left)==0){
        console.log('sent upper (' + left + ') to handleLeftClick cause 0')     
        handleLeftClick(left);        // could be the string 'div#' comes thru... that would be wrong tho (i think)
    }
    if(revealField(right)==0){
        console.log('sent upper (' + right + ') to handleLeftClick cause 0')     
        handleLeftClick(right);        // could be the string 'div#' comes thru... that would be wrong tho (i think)
    }
    noInfinitLoopPls = false
}

function fieldIndicator(c) { // check if adjacent fields are armedMines, the number of armed mines in adjacent fields equals number on innerHTML
    var upper = allFields[c-gridsize];
    var lower = allFields[Number(c)+Number(gridsize)];
    var left = allFields[Number(c)-1];
    var right = allFields[Number(c)+Number(1)];

    var upRight = allFields[c-Number(gridsize)+1];
    var upLeft = allFields[c-(Number(gridsize)+1)];
    var lowRight = allFields[Number(c)+Number(gridsize)+1];
    var lowLeft = allFields[Number(c)+(Number(gridsize)-1)];

    anlieger = [upper, upRight, right, lowRight, lower, lowLeft, left, upLeft];

    // console.log('indicating...' + c);

    for(i=0; i<anlieger.length; i++){
        if(isNaN(anlieger[i])){
            anlieger[i] = 'NaN'
            console.log('is NaN but changed')
        }
    }

    //check if fields are really adjacent, if not then that cell will be set 0
    if(allFields[upper]>0){
        upper = allFields[upper];
    } else {upper=0}
    if(allFields[right]%gridsize != 0 && isNaN(allFields[right]) == false){
        right = allFields[right];
    } else {right=0}
    if(allFields[lower]<gridsize*gridsize){
        lower = allFields[lower];
    } else {lower=0}
    if(allFields[c]%gridsize != 0){
        left = allFields[left];
    } else {left=0}
    if (allFields[upLeft] > 0 && allFields[upLeft] % gridsize != 0) {
        upLeft = allFields[upLeft];
    } else {upLeft = 0;}
    if (allFields[upRight] > 0 && allFields[upRight] % gridsize != 0) {
        upRight = allFields[upRight];
    } else {upRight = 0;}
    if (allFields[lowLeft] < gridsize * gridsize && allFields[lowLeft] % gridsize != 0) {
        lowLeft = allFields[lowLeft];
    } else {lowLeft = 0;}
    if (allFields[lowRight] < gridsize * gridsize && allFields[lowRight] % gridsize != 0) {
        lowRight = allFields[lowRight];
    } else {lowRight = 0;}

    // anlieger = [upper, upRight, right, lowRight, lower, lowLeft, left, upLeft];
    return anlieger;
}

function resetField() {
    var minefield = document.getElementById('minefield');
    minefield.style.height=0;
    minefield.style.width=0;
    minefield.style.padding=0;
    minefield.style.border=0;
    minefield.innerHTML = '';
    j=0;
    // console.log('field reset')
}

function toDiv(id){
    return('div'+id)
}

function toNum(id){
    return(Number(id.replace('div', '')))
}

function revealAll() {
    for (let i = 0; i < gridsize * gridsize; i++) {
      setTimeout(() => {
        document.getElementById('div' + i).innerHTML = i;
      }, i * 10); // Delay increases for each iteration
    }
}

function handleMainButton(){
    devMode = document.getElementById('devMode').checked;
    if(devMode==true){
        gridsize = 20;
        console.log('dev mode (autogen)')
    } else {
        gridsize=document.getElementById('gridsize').value;
    }
    generate();
    if(devMode==true){
        revealOnlyMines();
    }
}

function revealOnlyMines(){ //just for dev
    for(i=0; i<gridsize*gridsize; i++){
        if(document.getElementById('div' + i).classList.contains('armedMine')){
            document.getElementById('div' + i).innerHTML = '🧨';
        }
    }
}
/*
TODO
- Schwierigkeitsgrad in manuell (x Mienen) l
x und automatisch (einfach/mittel/schwer)
x quadratische anordnung der minen über die weite des minenfelds
x implementierung des mienen-scharfmachen
x implementierung indikator (nummer auf den zellen)
x implementierung des mienen-checks
- implementierung loss
x implementierung "aufdecken" benachbarter felder
- implementierung fieldZero()
- implementierung win
- send all fields to reveal after losing
- show how many mines
- show how many mines left (?)
*/
