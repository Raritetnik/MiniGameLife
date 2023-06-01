const btn = document.getElementById('cycle');
const screen = document.getElementById('grid');
const timer = document.getElementById('timer');
const restart = document.getElementById('restart');
const cloneLife = document.getElementById('life').content.firstElementChild;


var gridWorld;
var actives_gridWorld = [];
var copy_actives_gridWorld = [];
var copy_gridWorld;


createGrid();
var reserve_gridWorld = cloneTable(gridWorld);
let progress = false;

function tickTimer() {
    if(progress) {
        lifeCycle();
        setTimeout(() => { tickTimer(); }, timer.value);
    }
}

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

/**
 * Select life points
 */
screen.addEventListener('mousedown', (e) => {
    if(!gridWorld[e.target.getAttribute('column')][e.target.getAttribute('row')]) {
        e.target.classList.add('active');
        gridWorld[e.target.getAttribute('column')][e.target.getAttribute('row')] = true;
        actives_gridWorld.push([Number(e.target.getAttribute('column')), Number(e.target.getAttribute('row'))]);
    } else {
        e.target.classList.remove('active');
        gridWorld[e.target.getAttribute('column')][e.target.getAttribute('row')] = false;
        actives_gridWorld.pop([Number(e.target.getAttribute('column')), Number(e.target.getAttribute('row'))]);
    }
})


/**
 * Un cycle de vie
 *
 * Les cases meurt et créants des nouveaux vies *
 */
function lifeCycle() {
    copy_gridWorld = cloneTable(gridWorld);
    this.newCycle();


    /*copy_gridWorld = cloneTable(gridWorld);
    virtual_gridWorld = this.createNewLife();
    copy_gridWorld = cloneTable(virtual_gridWorld);
    gridWorld = cloneTable(virtual_gridWorld);*/
    showGridWorld();
}



/**
 * Vérification de la condition:
 * Sur case vivante -> Point vivant doit avoir 2 case vivante à coté pour continuer de vivre
 * Sur case vivante -> Point vivant doit avoir moins de 2 ou plus de 3 point vivant pour mourir
 * Sur case morte -> Point mort doit avoir seulement 3 case vivante à coté pour naître
 */
// 9 -- 10

function newCycle() {
    copy_actives_gridWorld = [...actives_gridWorld];

    actives_gridWorld.forEach(([columnIndex, rowIndex]) => {
        // Verification to kill life point
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
            copy_actives_gridWorld.pop([columnIndex, rowIndex]);
        }

        for (let cIndex = -1; cIndex <= 1; cIndex++) {
            for (let rIndex = -1; rIndex <= 1; rIndex++) {

                let casesFoundAlive = 0;
                let newColIndex = columnIndex + cIndex;
                let newRowIndex = rowIndex + rIndex;
                for (let cIndex = -1; cIndex <= 1; cIndex++) {
                    for (let rIndex = -1; rIndex <= 1; rIndex++) {
                        try{
                            casesFoundAlive += (gridWorld[newColIndex+cIndex][newRowIndex+rIndex]) ? 1 : 0;
                        } catch (e) {}
                    }
                }
                if(casesFoundAlive === 3) {
                    //console.log('position ['+newColIndex+']['+newRowIndex+']');
                    copy_gridWorld[newColIndex][newRowIndex] = true;
                    copy_actives_gridWorld.push([newColIndex, newRowIndex]);
                }
            }
        }
    });
    actives_gridWorld = cloneTable(copy_actives_gridWorld);
    gridWorld = cloneTable(copy_gridWorld);
}

function showGridWorld() {
    let listeLifes = [];
    for(let columnIndex = 0; columnIndex < gridWorld.length; columnIndex++ ){
        for (let rowIndex = 0; rowIndex < gridWorld[0].length; rowIndex++ ) {
            var life = cloneLife.cloneNode(true);
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




/**
 * Born process
 * @returns

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

*/





/**
 * Killing process
 * @returns

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

*/


/**
 *
 *
 */


/**
 *
 * Affichage de la grilles des points vivantes : WORKING
 *
 */
/*function showGridWorld() {
    let listeLifes = [];
    for(let columnIndex = 0; columnIndex < gridWorld.length; columnIndex++ ){
        for (let rowIndex = 0; rowIndex < gridWorld[0].length; rowIndex++ ) {
            let life = cloneLife.cloneNode(true);

            life.addEventListener('click', (e) => {
                gridWorld[columnIndex][rowIndex] = e.target.getAttribute('alive') !== 'true';
                e.target.setAttribute('alive', gridWorld[columnIndex][rowIndex]);

                e.target.style = `grid-row: ${rowIndex+1}; grid-column: ${columnIndex+1}; ${(gridWorld[columnIndex][rowIndex]) ? `background-color: tomato; border: 1px solid whitesmoke;` : ""}`;
                if((gridWorld[columnIndex][rowIndex])) {
                    actives_gridWorld.push([columnIndex, rowIndex]);
                } else {
                    actives_gridWorld.pop([columnIndex, rowIndex]);
                }
                console.log(actives_gridWorld);
            });


            if(gridWorld[columnIndex][rowIndex]) {
                life.style = `grid-row: ${rowIndex+1}; grid-column: ${columnIndex+1}; background-color: tomato; border: 1px solid whitesmoke;`;
                life.setAttribute('alive', true);
                listeLifes.push(life);
                actives_gridWorld.push(Array(columnIndex, rowIndex));
            } else {
                life.style = `grid-row: ${rowIndex+1}; grid-column: ${columnIndex+1};`;
                life.setAttribute('alive', false);
                listeLifes.push(life);
            }
        }
    }
    screen.innerHTML = "";
    listeLifes.forEach((elem) => {
        screen.appendChild(elem);
    })
}*/





/**
 *
 *
 * Additionnal Functions
 *
 *
 */
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
    console.log('=============== RESTART =====================');
    progress = false;
    gridWorld = cloneTable(reserve_gridWorld);
    showGridWorld();
})
