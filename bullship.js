//html objects
var gameWindow = document.getElementById("gameWindow");
var reset = document.getElementById("reset");

//game state
var board;
var currentGameMode;
var shotsRemaining;
var hitsRemaining;

//start new game on classic mode 8*8
newGame(8, 0);

/**
 * 
 * @param {int} size - (8 <= n <= 24) sets the n*n the board size 
 * @param {int} gameMode (0 <= n <= 1) 0 = classic, 1 = bullship
 */
function newGame(size, gameMode){
    
    //bound size between 8 and 24
    size = Math.min(Math.max(8, size), 24);

    //default to classic if gamemode is invalid
    gameMode = (gameMode < 0 || gameMode > 1) ? 0 : gameMode;

    // reset gamewindow
    gameWindow.innerHTML = "";

    // reset ships and game progress
    board = [];
    shotsRemaining = 24; //hardcoded until basic game logic finished
    hitsRemaining = 9; // ^ ditto ^

    // calculate tile and gap size
    // hardcoded gap size does not scale well, use algebra to get this equation, where gap to tile width ratio is 1:10
    tileSize = 8000 / (11 * size + 1); // original equation: tileSize = (800 - ((size + 1) * gapSize)) / size;
    gapSize = tileSize / 10;
    
    // create the grid
    for(var rowVal = 0; rowVal < size; rowVal++){

        //calculate y offset
        dY = gapSize + (rowVal * (tileSize + gapSize));

        for(var colVal = 0; colVal < size; colVal++){

            //calculate x offset
            dX = gapSize + (colVal * (tileSize + gapSize));

            //add tile to DOM
            var tile = document.createElement("div");
            gameWindow.appendChild(tile);

            //initialize tile and place on game board
            tile.id = "tile-" + ((rowVal * size) + colVal);
            tile.className = "tile";
            tile.setAttribute("yPos", rowVal);
            tile.setAttribute("xPos", colVal);
            tile.style.top = Math.round(dY) + "px";
            tile.style.left = Math.round(dX) + "px";
            tile.style.width = Math.round(tileSize) + "px";
        }
    }

    if (gameMode == 0){ //if classic mode
        // TODO: place ships programmatically

        //right now, we are hardcoding 3 ships of sizes 2, 3, and 4 like the Windwaker battleship minigame
        // 0 = undetermined, 1 = water, 2 = ship, 3 = miss, 4 = hit
        board = [
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 2, 2, 2, 2, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 2, 1, 1, 1, 1, 1, 1],
            [1, 2, 1, 1, 1, 2, 1, 1],
            [1, 1, 1, 1, 1, 2, 1, 1],
            [1, 1, 1, 1, 1, 2, 1, 1]
        ];
    } else {
        // create an n*n 2d array of undetermined tiles (value 0)
        board = Array.from(Array(size), () => Array(size).fill(0));
    }

    currentGameMode = gameMode ?? 0;
}

// should only be possible in bullship mode
function determineTileType(xPos, yPos){
    alert(`determining tile type for tile (${xPos},${yPos})`);

    return 1;
}

reset.addEventListener("click", function(){
    newGame(8, 0)
})

// on tile click
gameWindow.addEventListener("click", function(e){

    //make sure it is a tile and not the game board itself
    if(e.target === e.currentTarget) return;

    if(shotsRemaining < 1){
        if(hitsRemaining > 0) alert("You lose! :(");

        return;
    }

    // get x and y positions from custom html attributes
    var xPos = e.target.getAttribute("xPos");
    var yPos = e.target.getAttribute("yPos");

    // get tile type (i.e. undetermined, water, ship, miss, or hit)
    // if undetermined (only possible in bullship mode), try to find a configuration that results in a miss
    var tileType = board[yPos][xPos];
    var tileType = (tileType == 0) ? determineTileType(xPos, yPos) : tileType;

    switch (tileType){
        case 1: // you hit water! make tile white and mark as a miss
            e.target.style.background = "white";
            board[yPos][xPos] = 3;
            break;
        case 2: // you hit a ship! make tile red, mark as a hit, and decrease hits remaining
            e.target.style.background = "red";
            board[yPos][xPos] = 4;
            hitsRemaining--;
            break;
        default: // you shot a tile that you have already shot! just act like it didnt happen
            return;
    }

    shotsRemaining--;
    console.log(`${shotsRemaining} shots remaining, ${hitsRemaining} hits needed to win`);

    if(hitsRemaining == 0) alert("You win! :)");
});