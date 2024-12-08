let j=0;
let padding=20
let numMarked=0;
let gridsize;
const minefield = document.getElementById('minefield')
var counter=0
const allFields = [];
var noInfiniteLoopPls = false;
var devMode = false;
var firstTurn = true;



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
    // armMines();  will now be donee after first handleLeftClick.
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
    var takenSpots=[];
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
        if(!devMode){
            alert('no mode selected');
        }         
        resetField();       //not sure ob das fr gebracuht wird
    }
    for (i=0; numMines>i; i++) {
        var selectedSpot=Math.floor(Math.random()*((gridsize*gridsize)));
        if(takenSpots.includes(selectedSpot) != 'true') {
            document.getElementById('div'+selectedSpot).setAttribute('class', 'armedMine');
            takenSpots[i]=selectedSpot;
        } else {
            console.log('neuer versuch');
            i--;
        }
    }
}

function handleLeftClick(mineID) {            // if theres a flag present delete flag, else reveal 
    if(firstTurn){
        armMines(mineID);       //mines erst armen wenn erster turn gemacht wird damit garantiert wird, das erster turn großes Feld offenlegt (unimplementiert stand 08.12.)
    }
    devMode = document.getElementById('devMode').checked
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
            revealField(mineID); 
        }
    }
    firstTurn = false;
}

function revealField(mineID) {
    let anlieger = fieldIndicator(mineID.split('div')[1]);
    let neighbouringCells = 0;
    for(i=0; i<anlieger.length; i++){
        if(document.getElementById('div' + anlieger[i]).classList.contains('armedMine') == true){
            neighbouringCells = neighbouringCells+1;
        }
    }
    if(neighbouringCells == 0){
        document.getElementById(mineID).innerHTML='';
        if(!noInfiniteLoopPls){
            noInfiniteLoopPls = true;
            fieldZero(mineID.split('div')[1]);          // i think not working actually ☝️🥸
        }
    } 
    if(neighbouringCells>0){
        document.getElementById(mineID).innerHTML=neighbouringCells;
    } else {
        document.getElementById(mineID).innerHTML=''; 
    }
    document.getElementById(mineID).style.backgroundColor='#8b8f8c'
    
    return neighbouringCells;
}

function fieldZero(mineID) {
    let main = toDiv(mineID);
    let upper = toDiv(mineID - gridsize);
    let lower = toDiv(Number(mineID) + Number(gridsize));
    let left = toDiv(mineID - 1);
    let right = toDiv(Number(mineID) + 1);
    let upRight = toDiv(Number(mineID) - (Number(gridsize) + 1));
    let upLeft = toDiv(Number(mineID) - (Number(gridsize) - 1));
    let lowRight = toDiv(Number(mineID) + Number(gridsize) + 1);
    let lowLeft = toDiv(Number(mineID) + (Number(gridsize) - 1));
    
    // Create an array of adjacent cells to process
    let cellsToProcess = [
        { offset: 0, name: 'main' },
        { offset: -gridsize, name: 'upper', rowCheck: 'above' },
        { offset: -gridsize+1, name: 'upRight', rowCheck: 'above', colCheck: 'rightEdge' },
        { offset: 1, name: 'right', colCheck: 'rightEdge' },
        { offset: gridsize+1, name: 'lowRight', rowCheck: 'below', colCheck: 'rightEdge' },
        { offset: gridsize, name: 'lower', rowCheck: 'below' },
        { offset: gridsize-1, name: 'lowLeft', rowCheck: 'below', colCheck: 'leftEdge' },
        { offset: -1, name: 'left', colCheck: 'leftEdge' },
        { offset: -gridsize-1, name: 'upLeft', rowCheck: 'above', colCheck: 'leftEdge' }
    ];

    noInfiniteLoopPls = true; //no infin hihi

    // PROBLEM: cells on the other side of the gamefield are getting called on SOLUTION (i think): same machanism as in fieldIndicator

    cellsToProcess.forEach(cell => {
        let targetID = Number(mineID) + cell.offset;
        let targetDiv = 'div' + targetID;

        // Row boundary checks
        if (cell.rowCheck === 'above' && targetID < 0) return;
        if (cell.rowCheck === 'below' && targetID >= gridsize * gridsize) return;

        // Column boundary checks
        if (cell.colCheck === 'rightEdge' && (targetID % gridsize) === 0) return;
        if (cell.colCheck === 'leftEdge' && ((targetID + 1) % gridsize) === 0) return;

        let targetElement = document.getElementById(targetDiv);
        
        // Only process if element exists and not already revealed
        if (targetElement && targetElement.innerHTML === '‎') {
            let neighbourCount = revealField(targetDiv);
            
            // If zero cell, recursively reveal
            if (neighbourCount === 0) {
                fieldZero(targetID);
            }
        }
    });

    noInfiniteLoopPls = false;
}

function fieldIndicator(c) { // check if adjacent fields are armedMines, the number of armed mines in adjacent fields equals number oof innerHTML
    var upper = allFields[c-gridsize];
    var lower = allFields[Number(c)+Number(gridsize)];
    var left = allFields[Number(c)-1];
    var right = allFields[Number(c)+Number(1)];

    var upRight = allFields[c-Number(gridsize)+1];
    var upLeft = allFields[c-(Number(gridsize)+1)];
    var lowRight = allFields[Number(c)+Number(gridsize)+1];
    var lowLeft = allFields[Number(c)+(Number(gridsize)-1)];

    anlieger = [upper, upRight, right, lowRight, lower, lowLeft, left, upLeft];

    for(i=0; i<anlieger.length; i++){
        if(isNaN(anlieger[i])){
            anlieger[i] = 'NaN'
            // console.log('is NaN but changed')
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

    anlieger = [upper, upRight, right, lowRight, lower, lowLeft, left, upLeft];
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
    console.log('field reset');
}

function toDiv(id){
    return('div'+id);
}

function toNum(id){
    return(Number(id.replace('div', '')));
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
