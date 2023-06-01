const btn = document.getElementById('cycle');
const screen = document.getElementById('grid');
const lifeTempl = document.getElementById('life');
const timer = document.getElementById('timer');
const restart = document.getElementById('restart');
const cloneLife = lifeTempl.content.firstElementChild;

var gridWorld;
var virtual_gridWorld;
var copy_gridWorld;

createGrid();
var reserve_gridWorld = cloneTable(gridWorld);

let progress = false;
showGridWorld();

/**
 * Création par défaut de la grille
 *
 * Ajout des cases vivant débutants
 */
function createGrid() {
    gridWorld = Array(50).fill(false).map(() => Array(50))
    gridWorld.forEach(element => {
        element.fill(false);
    });

    copy_gridWorld = cloneTable(gridWorld);

    let listeLifes = [];
    for(let columnIndex = 0; columnIndex < gridWorld.length; columnIndex++ ){
        for (let rowIndex = 0; rowIndex < gridWorld[0].length; rowIndex++ ) {
            var life = cloneLife.cloneNode(true);
            life.style = `grid-row: ${rowIndex+1}; grid-column: ${columnIndex+1};`;
            life.setAttribute('column', columnIndex);
            life.setAttribute('row', rowIndex);
            listeLifes.push(life);
        }
    }
    screen.innerHTML = "";
    listeLifes.forEach((elem) => {
        screen.appendChild(elem);
    });
}

screen.addEventListener('mousedown', (e) => {
    if(!gridWorld[e.target.getAttribute('column')][e.target.getAttribute('row')]) {
        e.target.classList.add('active');
        gridWorld[e.target.getAttribute('column')][e.target.getAttribute('row')] = true;
    } else {
        e.target.classList.remove('active');
        gridWorld[e.target.getAttribute('column')][e.target.getAttribute('row')] = false;
    }
    e.target.style = `grid-row: ${rowIndex+1}; grid-column: ${columnIndex+1}; ${(gridWorld[columnIndex][rowIndex]) ? `background-color: tomato; border: 1px solid whitesmoke;` : ""}`;
})


/**
 * Un cycle de vie
 *
 * Les cases meurt et créants des nouveaux vies *
 */
function lifeCycle() {

    copy_gridWorld = cloneTable(gridWorld);


    virtual_gridWorld = this.createNewLife();
    virtual_gridWorld = this.killPopulation();
    copy_gridWorld = cloneTable(virtual_gridWorld);
    gridWorld = cloneTable(virtual_gridWorld);
    showGridWorld();
}



/**
 * Vérification de la condition:
 * Sur case vivante -> Point vivant doit avoir 2 case vivante à coté pour continuer de vivre
 * Sur case vivante -> Point vivant doit avoir moins de 2 ou plus de 3 point vivant pour mourir
 * Sur case morte -> Point mort doit avoir seulement 3 case vivante à coté pour naître
 */
// 9 -- 10

/**
 * Born process
 * @returns
 */
function createNewLife() {
    for(let columnIndex = 0; columnIndex < gridWorld.length; columnIndex++ ){
        for (let rowIndex = 0; rowIndex < gridWorld[0].length; rowIndex++ ) {
            // Vérification si la case est vivante
            if(!gridWorld[columnIndex][rowIndex]) {
                checkOnDeadCase(columnIndex, rowIndex);
            }
        }
    }
    return copy_gridWorld;
}
function checkOnDeadCase (columnIndex, rowIndex) {
    let casesAlive = 0;
    for (let cIndex = -1; cIndex <= 1; cIndex++) {
        for (let rIndex = -1; rIndex <= 1; rIndex++) {
            try{
                casesAlive += (gridWorld[columnIndex+cIndex][rowIndex+rIndex]) ? 1 : 0;
            } catch (e) {}
        }
    }
    if(casesAlive === 3) {
        copy_gridWorld[columnIndex][rowIndex] = true;
    }
}




/**
 * Killing process
 * @returns
 */
function killPopulation() {
    for(let columnIndex = 0; columnIndex < gridWorld.length; columnIndex++ ){
        for (let rowIndex = 0; rowIndex < gridWorld[0].length; rowIndex++ ) {
            // Vérification si la case est vivante
            if(gridWorld[columnIndex][rowIndex]) {
                checkOnLifeCase(columnIndex, rowIndex);
            }
        }
    }
    return copy_gridWorld;
}
function checkOnLifeCase (columnIndex, rowIndex) {
    let casesAlive = 0;
    for (let cIndex = -1; cIndex <= 1; cIndex++) {
        for (let rIndex = -1; rIndex <= 1; rIndex++) {
            try{
                casesAlive += (gridWorld[columnIndex+cIndex][rowIndex+rIndex]) ? 1 : 0;
            } catch (e) {}
        }
    }
    if(casesAlive !== 3 && casesAlive !== 4) {
        copy_gridWorld[columnIndex][rowIndex] = false;
    }
}

/**
 *
 * Affichage de la grilles des points vivantes
 *
 */
function showGridWorld() {
    let listeLifes = [];
    for(let columnIndex = 0; columnIndex < gridWorld.length; columnIndex++ ){
        for (let rowIndex = 0; rowIndex < gridWorld[0].length; rowIndex++ ) {
            let life = cloneLife.cloneNode(true);
            if(gridWorld[columnIndex][rowIndex]) {
                life.style = `grid-row: ${rowIndex+1}; grid-column: ${columnIndex+1}; background-color: tomato; border: 1px solid whitesmoke;`;
                life.setAttribute('column', columnIndex);
                life.setAttribute('row', rowIndex);
                listeLifes.push(life);
            } else {
                life.style = `grid-row: ${rowIndex+1}; grid-column: ${columnIndex+1};`;
                life.setAttribute('column', columnIndex);
                life.setAttribute('row', rowIndex);
                listeLifes.push(life);
            }
        }
    }
    screen.innerHTML = "";
    listeLifes.forEach((elem) => {
        screen.appendChild(elem);
    })
}




function cloneTable(table) {
    var clonedTable = [];

    // Iterate through the rows of the original table
    for (var i = 0; i < table.length; i++) {
      var row = table[i];
      var clonedRow = [];

      // Iterate through the columns of each row
      for (var j = 0; j < row.length; j++) {
        var cell = row[j];

        // Clone the cell value
        clonedRow.push(cell);
      }

      // Add the cloned row to the cloned table
      clonedTable.push(clonedRow);
    }

    return clonedTable;
}




btn.addEventListener('click', () => {
    reserve_gridWorld = cloneTable(gridWorld);
    progress = true;
    tickTimer();
});
const btnStop = document.getElementById('stop').addEventListener('click', (e) => {
    e.target.value = (progress) ? 'Resume' : 'Pause';
    progress = !progress;
    tickTimer();
});

restart.addEventListener('click', () => {
    console.log('====================================');
    console.log('RESTART');
    progress = false;
    gridWorld = cloneTable(reserve_gridWorld);
    showGridWorld();
})
function tickTimer() {
    if(progress) {
        lifeCycle();
        setTimeout(() => { tickTimer(); }, timer.value);
    }
}

