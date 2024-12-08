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
// var numRevealedCells = 0;
var revealedCells = []
var numMines;



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

function armMines(firstClicked) {    // i need number of all mines and then decide how many will be armed depending on level hardness.
    if(devMode==true){
        var mode = 'easy'
    } else {
        var mode = document.getElementById('mode').value
    }
    console.log('mode: ' + mode);
    var takenSpots=[];
    firstClicked = toNum(firstClicked);
    var beginnerArea = [
        firstClicked,                       // main
        firstClicked - gridsize,            // upper
        firstClicked - gridsize + 1,        // upRight
        firstClicked + 1,                   // right
        firstClicked + gridsize + 1,        // lowRight
        firstClicked + gridsize,            // lower
        firstClicked + gridsize - 1,        // lowLeft
        firstClicked - 1,                   // left
        firstClicked - gridsize - 1,        // upLeft

        firstClicked - 2 * gridsize,            // 2upper
        firstClicked - 2 * gridsize + 1,        // 2upper 1left
        firstClicked - 2 * gridsize + 2,        // 2upper 2right
        firstClicked - gridsize + 2,            // 1upper 2right
        firstClicked + 2,                       // 2right
        firstClicked + gridsize + 2,            // 1lower 2right
        firstClicked + 2 * gridsize + 2,        // 2lower 2right
        firstClicked + 2 * gridsize + 1,        // 2lower 1right
        firstClicked + 2 * gridsize,            // 2lower
        firstClicked + 2 * gridsize - 1,        // 2lower 1left
        firstClicked + 2 * gridsize - 2,        // 2lower 2left
        firstClicked + gridsize - 2,            // 1lower 2left
        firstClicked - 2,                       // 2left
        firstClicked - gridsize - 2,            // 1upper 2left
        firstClicked - 2 * gridsize - 2,        // 2upper 2left
        firstClicked - 2 * gridsize - 1         // 2upper 1left
    ];
    
    if(mode=='easy'){
        numMines = Math.floor((gridsize*gridsize)*0.1); //10%
    } else if(mode=='middle') {
        numMines = Math.floor((gridsize*gridsize)*0.15); //15%
    } else if(mode=='hard') {
        numMines = Math.floor((gridsize*gridsize)*0.20); // 20%
    } else if(mode=='veryHard') {
        numMines = Math.floor((gridsize*gridsize)*0.25); // 25%
    } else{
        console.log('no mode selected'); 
        if(!devMode){
            alert('no mode selected');
        }         
        resetField();       //not sure ob das fr gebracuht wird
    }
    for (i=0; numMines>i; i++) {
        var selectedSpot=Math.floor(Math.random()*((gridsize*gridsize)));
        if(takenSpots.includes(selectedSpot) != true && beginnerArea.includes(selectedSpot) == false ) {    //could happen that it blocks cells not adjacent to other because the array is not made with boundaries in mind
            document.getElementById('div'+selectedSpot).setAttribute('class', 'armedMine');
            takenSpots[i]=selectedSpot;
        } else {
            console.log('generating mine in other cell');
            i--;
        }
    }
    if(devMode==true){
        for(i=0; i<beginnerArea.length; i++){
            if(document.getElementById(toDiv(beginnerArea[i])) != null ){
                document.getElementById(toDiv(beginnerArea[i])).style.backgroundColor = 'brown';
            }
        }
    }
}

function handleLeftClick(mineID) {            // if theres a flag present delete flag, else reveal 
    if(firstTurn == true){
        armMines(mineID);       //mines erst armen wenn erster turn gemacht wird damit garantiert wird, das erster turn großes Feld offenlegt (unimplementiert stand 08.12.)
        console.log('first Turn');
    } else {console.log('not first turn')}
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
    if (revealedCells.includes(mineID) == true) { // if cell already revealed exit
        return;  
    }
    revealedCells[revealedCells.length] = mineID;         //keep track of all revealed cells (hopefully)
    let anlieger = fieldIndicator(mineID.split('div')[1]);
    let neighbouringCells = 0;
    for(i=0; i<anlieger.length; i++){
        if(document.getElementById('div' + anlieger[i]).classList.contains('armedMine') == true){
            neighbouringCells = neighbouringCells+1;
        }
    }
    // numRevealedCells++;
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
    console.log(revealedCells.length)
    bigW();
    return neighbouringCells;
}

function fieldZero(mineID) {
    let main = toDiv(mineID);           //old variables not deleted yet (dont ask why am scared)
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

    // PROBLEM: cells on the other side of the gamefield are getting called on SOLUTION (i think): same machanism as in fieldIndicator RESOLVED but other way (ig)

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
                // revealedCells++;
            }
        }
    });

    noInfiniteLoopPls = false;
}

function fieldIndicator(c) {    // check if adjacent fields are armedMines, the number of armed mines in adjacent fields equals number oof innerHTML
    const neighborOffsets = [
        -gridsize - 1,  // up-left
        -gridsize,      // up
        -gridsize + 1,  // up-right
        -1,             // left
        1,              // right
        gridsize - 1,   // down-left
        gridsize,       // down
        gridsize + 1    // down-right
    ];

    const currentRow = Math.floor(c / gridsize);
    const currentCol = c % gridsize;

    return neighborOffsets.filter(offset => {
        const neighborIndex = Number(c) + offset;
        const neighborRow = Math.floor(neighborIndex / gridsize);
        const neighborCol = neighborIndex % gridsize;

        // Check if the neighbor is within grid boundaries
        const withinRowBounds = 
            neighborIndex >= 0 && 
            neighborIndex < gridsize * gridsize;

        const withinColBounds = 
            Math.abs(neighborCol - currentCol) <= 1;

        return withinRowBounds && withinColBounds;
    }).map(offset => Number(c) + offset);
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
    firstTurn = true;
    revealedCells = [];
}

function toDiv(id){
    return('div'+id);
}

function toNum(id){
    return(Number(id.replace('div', '')));
}

function revealAllId() {
    for (let i = 0; i < gridsize * gridsize; i++) {
      setTimeout(() => {
        document.getElementById('div' + i).innerHTML = i;
      }, i * 10); // Delay increases for each iteration
    }
}

function bigW(overwriter) {
    if (revealedCells.length == (gridsize * gridsize) - numMines  || overwriter == 1) {
        console.log('You just won, congrats!');
        if (!devMode || overwriter == 1) {
            alert('You just won, congrats!');
            console.log('starting new game...');
            
            let time = 5;
            const countdownTimer = setInterval(function() {
                console.log(time);
                time--;
                if (time < 0) {
                    clearInterval(countdownTimer);
                    resetField();
                }
            }, 1000);
        }
    } else { 
        return false; 
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

function testButton(){
    console.log(revealedCells)
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
